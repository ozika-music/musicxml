import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Note } from './note-element';

/** @see musicxml.xsd "note". */
describe('Note', () => {
  it('round-trips a pitched note with type, dots, stem, beam, notations, lyric', () => {
    const xml =
      '<note default-x="10" print-leger="yes" dynamics="80">' +
      '<pitch><step>C</step><octave>4</octave></pitch>' +
      '<duration>2</duration>' +
      '<tie type="start"/>' +
      '<instrument id="P1-I1"/>' +
      '<voice>1</voice>' +
      '<type>quarter</type>' +
      '<dot/>' +
      '<stem>up</stem>' +
      '<beam number="1">begin</beam>' +
      '<notations><slur type="start" number="1"/></notations>' +
      '<lyric number="1"><syllabic>single</syllabic><text>la</text></lyric>' +
      '</note>';
    const n = Note.fromXmlElement(parseElements(xml)[0]);
    expect(n.pitch).toMatchObject({ step: 'C', octave: 4 });
    expect(n.duration).toBe(2);
    expect(n.ties?.[0].type).toBe('start');
    expect(n.instruments?.[0].id).toBe('P1-I1');
    expect(n.voice).toBe('1');
    expect(n.type?.value).toBe('quarter');
    expect(n.dots?.length).toBe(1);
    expect(n.stem?.value).toBe('up');
    expect(n.beams?.[0]).toMatchObject({ value: 'begin', number: 1 });
    expect(n.notations?.[0].slurs?.[0].number).toBe(1);
    expect(n.lyrics?.[0].text?.value).toBe('la');
    expect(n.dynamics).toBe(80);
    expect(n.printLeger).toBe('yes');

    const round = Note.fromXmlElement(parseElements(buildElements([Note.toXmlElement(n)]))[0]);
    expect(round.pitch).toMatchObject({ step: 'C', octave: 4 });
    expect(round.instruments?.[0].id).toBe('P1-I1');
    expect(round.beams?.[0]).toMatchObject({ value: 'begin', number: 1 });
    expect(round.notations?.[0].slurs?.[0].number).toBe(1);
    expect(round.lyrics?.[0].text?.value).toBe('la');
    expect(round.dynamics).toBe(80);
  });

  it('round-trips note-level print-style/printout/id attrs + notehead-text + play + listen', () => {
    const xml =
      '<note default-x="12" print-object="yes" print-dot="no" id="n1" dynamics="80">' +
      '<pitch><step>D</step><octave>5</octave></pitch>' +
      '<duration>1</duration>' +
      '<notehead>normal</notehead>' +
      '<notehead-text><display-text>1</display-text><accidental-text smufl="x">sharp</accidental-text></notehead-text>' +
      '<lyric><text>a</text></lyric>' +
      '<play id="p1"><mute>palm</mute></play>' +
      '<listen><assess type="yes" player="P1"/></listen>' +
      '</note>';
    const n = Note.fromXmlElement(parseElements(xml)[0]);
    expect(n).toMatchObject({ defaultX: 12, printObject: 'yes', printDot: 'no', id: 'n1', dynamics: 80 });
    expect(n.noteheadText?.displayTexts?.[0].value).toBe('1');
    expect(n.noteheadText?.accidentalTexts?.[0]).toMatchObject({ value: 'sharp', smufl: 'x' });
    expect(n.play).toMatchObject({ id: 'p1', mute: 'palm' });
    expect(n.listen?.assess).toMatchObject({ type: 'yes', player: 'P1' });

    const round = Note.fromXmlElement(parseElements(buildElements([Note.toXmlElement(n)]))[0]);
    expect(round).toMatchObject({ defaultX: 12, printObject: 'yes', id: 'n1' });
    expect(round.noteheadText?.accidentalTexts?.[0].smufl).toBe('x');
    expect(round.play?.mute).toBe('palm');
    expect(round.listen?.assess?.player).toBe('P1');
  });

  it('round-trips a grace cue rest with chord', () => {
    const xml = '<note><grace slash="yes"/><cue/><chord/><rest/><type>eighth</type></note>';
    const n = Note.fromXmlElement(parseElements(xml)[0]);
    expect(n.grace?.slash).toBe('yes');
    expect(n.cue).toBe(true);
    expect(n.chord).toBe(true);
    expect(n.rest).toBeDefined();
    const round = Note.fromXmlElement(parseElements(buildElements([Note.toXmlElement(n)]))[0]);
    expect(round.grace?.slash).toBe('yes');
    expect(round.cue).toBe(true);
    expect(round.chord).toBe(true);
    expect(round.rest).toBeDefined();
  });
});
