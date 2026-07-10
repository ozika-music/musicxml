import { describe, expect, it } from 'vitest';
import { buildElements } from '../../xml/xml-element';
import { MusicXml } from '../../musicxml';
import { PartGroupType, type ScorePart, type ScorePartwise } from '../../types';
import { PartList } from './part-list';

const parseMusicXml = (xml: string) => ({ score: MusicXml.parseFromMusicXml(xml) });
const serializeScorePartwise = (score: ScorePartwise): string =>
  new TextDecoder().decode(MusicXml.serializeToMusicXml(score));

/** @see musicxml.xsd "part-list" / "score-part". */
describe('PartList.toXmlElement', () => {
  it('serializes score-parts with name into a <part-list>', () => {
    const scorePart = { id: 'P1', partName: { value: 'Violin' } } as unknown as ScorePart;
    const pl = new PartList([{ kind: 'score-part', scorePart }]);
    const xml = buildElements([PartList.toXmlElement(pl)]);
    expect(xml).toContain('<part-list>');
    expect(xml).toContain('id="P1"');
    expect(xml).toContain('<part-name>Violin</part-name>');
  });

  it('serializes an empty part-list', () => {
    expect(buildElements([PartList.toXmlElement(new PartList([]))])).toContain('part-list');
  });
});

/**
 * Nested group structure: [Strings  P1 P2 [Low Strings  P3 ] ]  P4
 * @see musicxml.xsd complexType "part-list" (part-group / score-part sequence)
 */
const SCORE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <part-list>
    <part-group type="start" number="1"><group-name>Strings</group-name></part-group>
    <score-part id="P1"><part-name>Violin I</part-name></score-part>
    <score-part id="P2"><part-name>Violin II</part-name></score-part>
    <part-group type="start" number="2"><group-name>Low Strings</group-name></part-group>
    <score-part id="P3"><part-name>Cello</part-name></score-part>
    <part-group type="stop" number="2"/>
    <part-group type="stop" number="1"/>
    <score-part id="P4"><part-name>Piano</part-name></score-part>
  </part-list>
  <part id="P1"><measure number="1"><note><rest measure="yes"/><duration>4</duration></note></measure></part>
  <part id="P2"><measure number="1"><note><rest measure="yes"/><duration>4</duration></note></measure></part>
  <part id="P3"><measure number="1"><note><rest measure="yes"/><duration>4</duration></note></measure></part>
  <part id="P4"><measure number="1"><note><rest measure="yes"/><duration>4</duration></note></measure></part>
</score-partwise>`;

function model(): ScorePartwise {
  return parseMusicXml(SCORE_XML).score;
}

const ids = (pl: PartList) => pl.scoreParts.map((sp) => sp.id);
const groupNames = (pl: PartList) =>
  pl.items.flatMap((i) =>
    i.kind === 'part-group' && i.partGroup.type === PartGroupType.Start ? [i.partGroup.groupName?.value ?? ''] : [],
  );

describe('parser builds the PartList class', () => {
  it('parses a class instance with ordered items + derived flat views', () => {
    const pl = model().partList;
    expect(pl).toBeInstanceOf(PartList);
    expect(ids(pl)).toEqual(['P1', 'P2', 'P3', 'P4']);
    expect(pl.items.map((i) => i.kind)).toEqual([
      'part-group', 'score-part', 'score-part', 'part-group', 'score-part', 'part-group', 'part-group', 'score-part',
    ]);
  });
});

describe('PartList.groupSpans', () => {
  it('pairs nested start/stop boundaries with stable ids', () => {
    expect(PartList.groupSpans(model().partList).map((s) => s.groupId).sort()).toEqual(['g1', 'g2']);
  });
});

describe('PartList editing (immutable)', () => {
  it('addEmptyGroup appends a numbered empty group without mutating the source', () => {
    const pl = model().partList;
    const edited = PartList.addEmptyGroup(pl, 'Brass');
    expect(groupNames(edited)).toEqual(['Strings', 'Low Strings', 'Brass']);
    expect(edited.items.at(-2)).toMatchObject({ partGroup: { type: PartGroupType.Start, number: '3' } });
    expect(edited.items.at(-1)).toMatchObject({ partGroup: { type: PartGroupType.Stop, number: '3' } });
    expect(groupNames(pl)).toEqual(['Strings', 'Low Strings']); // source untouched
  });

  it('renameScorePart / renameGroup update names', () => {
    expect(PartList.renameScorePart(model().partList, 'P3', 'Violoncello').scoreParts.find((s) => s.id === 'P3')?.partName.value)
      .toBe('Violoncello');
    expect(groupNames(PartList.renameGroup(model().partList, 'g1', 'Bowed'))).toEqual(['Bowed', 'Low Strings']);
  });

  it('addScorePart appends an entry; reconcileBodies gives it an empty body', () => {
    const score = model();
    const pl = PartList.addScorePart(score.partList, { id: 'P9', name: 'Trumpet' });
    expect(ids(pl)).toEqual(['P1', 'P2', 'P3', 'P4', 'P9']);
    const parts = PartList.reconcileBodies(score.parts, pl);
    expect(parts.map((p) => p.id)).toEqual(['P1', 'P2', 'P3', 'P4', 'P9']);
    expect(parts.find((p) => p.id === 'P9')?.measures).toHaveLength(1);
  });

  it('delete removes a nested group with its parts; reconcileBodies drops their bodies', () => {
    const score = model();
    const pl = PartList.delete(score.partList, { groupIds: ['g2'] }); // Low Strings + Cello
    expect(ids(pl)).toEqual(['P1', 'P2', 'P4']);
    expect(groupNames(pl)).toEqual(['Strings']);
    expect(PartList.reconcileBodies(score.parts, pl).map((p) => p.id)).toEqual(['P1', 'P2', 'P4']);
  });

  it('delete of an outer group removes all descendants', () => {
    const pl = PartList.delete(model().partList, { groupIds: ['g1'] });
    expect(ids(pl)).toEqual(['P4']);
    expect(groupNames(pl)).toEqual([]);
  });

  it('delete is a no-op (same instance) for unknown ids', () => {
    const pl = model().partList;
    expect(PartList.delete(pl, { partIds: ['ZZ'], groupIds: ['g9'] })).toBe(pl);
  });

  it('updateScorePart replaces fields through the updater, immutably', () => {
    const pl = model().partList;
    const edited = PartList.updateScorePart(pl, 'P2', (sp) => ({
      ...sp,
      partAbbreviation: { value: 'Vln. II' },
      midiInstruments: [{ id: 'P2-I1', midiChannel: 2, midiProgram: 41 }],
    }));
    const sp = edited.scoreParts.find((s) => s.id === 'P2')!;
    expect(sp.partAbbreviation?.value).toBe('Vln. II');
    expect(sp.midiInstruments?.[0]).toMatchObject({ midiChannel: 2, midiProgram: 41 });
    expect(sp.partName.value).toBe('Violin II'); // untouched fields kept
    expect(pl.scoreParts.find((s) => s.id === 'P2')?.partAbbreviation).toBeUndefined(); // source untouched
    expect(PartList.updateScorePart(pl, 'ZZ', (sp) => sp)).toBe(pl); // unknown id → same instance
  });
});

/**
 * Structure under test: [Strings  P1 P2 [Low Strings  P3 ] ]  P4
 * In `items` order: start(g1) P1 P2 start(g2) P3 stop(g2) stop(g1) P4
 */
describe('PartList.movePart', () => {
  const itemsShape = (pl: PartList) =>
    pl.items.map((i) => (i.kind === 'score-part' ? i.scorePart.id : `${i.partGroup.type}:${i.partGroup.number}`));

  it('swaps two sibling parts', () => {
    const pl = PartList.movePart(model().partList, 'P2', 'up');
    expect(ids(pl)).toEqual(['P2', 'P1', 'P3', 'P4']);
  });

  it('moving up over a group stop enters the group at its end', () => {
    const pl = PartList.movePart(model().partList, 'P4', 'up'); // P4 hops over stop(g1)
    expect(itemsShape(pl)).toEqual(['start:1', 'P1', 'P2', 'start:2', 'P3', 'stop:2', 'P4', 'stop:1']);
  });

  it('moving up over a group start leaves the group', () => {
    const pl = PartList.movePart(model().partList, 'P1', 'up'); // P1 hops over start(g1)
    expect(itemsShape(pl)).toEqual(['P1', 'start:1', 'P2', 'start:2', 'P3', 'stop:2', 'stop:1', 'P4']);
  });

  it('moving down over a group stop leaves the group', () => {
    const pl = PartList.movePart(model().partList, 'P3', 'down'); // P3 hops over stop(g2)
    expect(itemsShape(pl)).toEqual(['start:1', 'P1', 'P2', 'start:2', 'stop:2', 'P3', 'stop:1', 'P4']);
  });

  it('is a no-op (same instance) at the edges and for unknown ids', () => {
    const pl = model().partList;
    expect(PartList.movePart(pl, 'P4', 'down')).toBe(pl);
    expect(PartList.movePart(pl, 'ZZ', 'up')).toBe(pl);
    // P1 up is NOT a no-op (it exits the group) — only true list edges are.
    const top = PartList.movePart(PartList.movePart(pl, 'P1', 'up'), 'P1', 'up');
    expect(PartList.movePart(top, 'P1', 'up')).toBe(top);
  });

  it('reconcileBodies realigns part bodies to the moved order', () => {
    const score = model();
    const pl = PartList.movePart(score.partList, 'P2', 'up');
    expect(PartList.reconcileBodies(score.parts, pl).map((p) => p.id)).toEqual(['P2', 'P1', 'P3', 'P4']);
  });
});

describe('PartList.moveGroup', () => {
  const itemsShape = (pl: PartList) =>
    pl.items.map((i) => (i.kind === 'score-part' ? i.scorePart.id : `${i.partGroup.type}:${i.partGroup.number}`));

  it('moving up hops the preceding part over the whole span', () => {
    const pl = PartList.moveGroup(model().partList, 'g2', 'up'); // g2 over P2
    expect(itemsShape(pl)).toEqual(['start:1', 'P1', 'start:2', 'P3', 'stop:2', 'P2', 'stop:1', 'P4']);
  });

  it('moving down over an enclosing stop leaves that group', () => {
    const pl = PartList.moveGroup(model().partList, 'g2', 'down'); // g2 over stop(g1)
    expect(itemsShape(pl)).toEqual(['start:1', 'P1', 'P2', 'stop:1', 'start:2', 'P3', 'stop:2', 'P4']);
    // Still parses as two valid sibling spans.
    expect(PartList.groupSpans(pl)).toHaveLength(2);
  });

  it('keeps the span intact (children move with the group)', () => {
    const pl = PartList.moveGroup(PartList.moveGroup(model().partList, 'g2', 'down'), 'g2', 'down'); // then over P4
    expect(itemsShape(pl)).toEqual(['start:1', 'P1', 'P2', 'stop:1', 'P4', 'start:2', 'P3', 'stop:2']);
    expect(ids(pl)).toEqual(['P1', 'P2', 'P4', 'P3']);
  });

  it('is a no-op (same instance) at the edges and for unknown ids', () => {
    const pl = model().partList;
    expect(PartList.moveGroup(pl, 'g9', 'up')).toBe(pl);
    const g1AtTop = pl; // g1 starts at index 0
    expect(PartList.moveGroup(g1AtTop, 'g1', 'up')).toBe(g1AtTop);
    const last = PartList.moveGroup(PartList.moveGroup(pl, 'g1', 'down'), 'g1', 'down');
    expect(PartList.moveGroup(last, 'g1', 'down')).toBe(last);
  });
});

/**
 * Full-fidelity round-trip. A score-part and part-group carrying the bulk of
 * their XSD child elements must survive parse → serialize → parse unchanged.
 * @see musicxml.xsd complexTypes "score-part", "part-group", "score-instrument",
 *      "midi-instrument", "name-display", "group-symbol", "group-barline"
 */
describe('lossless round-trip of the full part-list content model', () => {
  const RICH = `<?xml version="1.0"?>
<score-partwise version="4.0">
  <part-list>
    <part-group type="start" number="1">
      <group-name>Woodwinds</group-name>
      <group-abbreviation>WW</group-abbreviation>
      <group-symbol>bracket</group-symbol>
      <group-barline>yes</group-barline>
    </part-group>
    <score-part id="P1">
      <part-name>Flute</part-name>
      <part-name-display><display-text>Flute 1</display-text></part-name-display>
      <part-abbreviation>Fl.</part-abbreviation>
      <group>score</group>
      <score-instrument id="P1-I1">
        <instrument-name>Flute</instrument-name>
        <instrument-sound>wind.flutes.flute</instrument-sound>
        <virtual-instrument><virtual-library>VSL</virtual-library><virtual-name>Flute 1</virtual-name></virtual-instrument>
      </score-instrument>
      <player id="P1-P1"><player-name>Player 1</player-name></player>
      <midi-device id="P1-I1" port="1"></midi-device>
      <midi-instrument id="P1-I1"><midi-channel>1</midi-channel><midi-program>74</midi-program><volume>80</volume><pan>0</pan></midi-instrument>
    </score-part>
    <part-group type="stop" number="1"/>
  </part-list>
  <part id="P1"><measure number="1"><note><rest measure="yes"/><duration>4</duration></note></measure></part>
</score-partwise>`;

  it('preserves every parsed part-group + score-part field across serialize/parse', () => {
    const first = parseMusicXml(RICH).score;
    const round = parseMusicXml(serializeScorePartwise(first)).score;

    // part-group fidelity
    const grp = round.partList.partGroups.find((g) => g.type === PartGroupType.Start)!;
    expect(grp.groupName?.value).toBe('Woodwinds');
    expect(grp.groupAbbreviation?.value).toBe('WW');
    expect(grp.groupSymbol?.value).toBe('bracket');
    expect(grp.groupBarline?.value).toBe('yes');

    // score-part fidelity
    const sp = round.partList.scoreParts[0];
    expect(sp.partName.value).toBe('Flute');
    expect(sp.partNameDisplay?.displayText?.[0].value).toBe('Flute 1');
    expect(sp.partAbbreviation?.value).toBe('Fl.');
    expect(sp.groups).toEqual(['score']);
    expect(sp.scoreInstruments?.[0]).toMatchObject({
      id: 'P1-I1',
      instrumentName: 'Flute',
      instrumentSound: 'wind.flutes.flute',
      virtualInstrument: { virtualLibrary: 'VSL', virtualName: 'Flute 1' },
    });
    expect(sp.players?.[0]).toMatchObject({ id: 'P1-P1', playerName: 'Player 1' });
    expect(sp.midiInstruments?.[0]).toMatchObject({ id: 'P1-I1', midiChannel: 1, midiProgram: 74, volume: 80, pan: 0 });
  });
});
