import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { OctaveShiftType, PedalType, WedgeType } from '../enums';
import { Direction } from './direction';

/** @see musicxml.xsd "direction". */
describe('Direction', () => {
  it('round-trips words + dynamics + wedge + metronome + pedal in a direction-type', () => {
    const xml =
      '<direction placement="below" directive="yes">' +
      '<direction-type><words font-style="italic">cresc.</words></direction-type>' +
      '<direction-type><dynamics><f/></dynamics></direction-type>' +
      '<direction-type><wedge type="crescendo" number="1" spread="15"/></direction-type>' +
      '<direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>120</per-minute></metronome></direction-type>' +
      '<direction-type><pedal type="start" line="yes"/></direction-type>' +
      '<direction-type><octave-shift type="down" size="8"/></direction-type>' +
      '<offset sound="yes">2</offset>' +
      '<voice>1</voice>' +
      '<staff>1</staff>' +
      '<sound tempo="120"/>' +
      '</direction>';
    const d = Direction.fromXmlElement(parseElements(xml)[0]);
    expect(d.placement).toBe('below');
    expect(d.directive).toBe('yes');
    expect(d.directionTypes[0].words?.[0]).toMatchObject({ value: 'cresc.', fontStyle: 'italic' });
    expect(d.directionTypes[1].dynamics?.[0].values.length).toBe(1);
    expect(d.directionTypes[2].wedge).toMatchObject({ type: WedgeType.Crescendo, number: 1, spread: 15 });
    expect(d.directionTypes[3].metronome).toMatchObject({ beatUnit: 'quarter' });
    expect(d.directionTypes[3].metronome?.perMinute?.value).toBe('120');
    expect(d.directionTypes[4].pedal).toMatchObject({ type: PedalType.Start, line: 'yes' });
    expect(d.directionTypes[5].octaveShift).toMatchObject({ type: OctaveShiftType.Down, size: 8 });
    expect(d.offset).toMatchObject({ value: 2, sound: 'yes' });
    expect(d.voice).toBe('1');
    expect(d.staff).toBe(1);
    expect(d.sound?.tempo).toBe(120);

    const round = Direction.fromXmlElement(parseElements(buildElements([Direction.toXmlElement(d)]))[0]);
    expect(round.directionTypes[0].words?.[0]).toMatchObject({ value: 'cresc.', fontStyle: 'italic' });
    expect(round.directionTypes[2].wedge).toMatchObject({ type: WedgeType.Crescendo, spread: 15 });
    expect(round.directionTypes[3].metronome?.perMinute?.value).toBe('120');
    expect(round.directionTypes[4].pedal?.type).toBe(PedalType.Start);
    expect(round.offset).toMatchObject({ value: 2, sound: 'yes' });
    expect(round.sound?.tempo).toBe(120);
    expect(round.placement).toBe('below');
  });
});
