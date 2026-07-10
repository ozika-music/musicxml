import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { OctaveShiftType, PedalType, WedgeType } from '../enums';
import { Bracket, OctaveShift, OtherDirection, Pedal, Rehearsal, StaffDivide, StringMute, Wedge, Words } from './direction-leaves';

/** @see musicxml.xsd "words"/"wedge"/"bracket"/"pedal"/"octave-shift"/… */
describe('direction-type leaves', () => {
  it('Words round-trips text + font-style', () => {
    const w = Words.fromXmlElement(parseElements('<words font-style="italic" justify="center">cresc.</words>')[0]);
    expect(w).toMatchObject({ value: 'cresc.', fontStyle: 'italic', justify: 'center' });
    const round = Words.fromXmlElement(parseElements(buildElements([Words.toXmlElement(w)]))[0]);
    expect(round).toMatchObject({ value: 'cresc.', fontStyle: 'italic' });
  });
  it('Wedge round-trips type + spread + niente', () => {
    const w = Wedge.fromXmlElement(parseElements('<wedge type="crescendo" number="1" spread="15" niente="yes"/>')[0]);
    expect(w).toMatchObject({ type: WedgeType.Crescendo, number: 1, spread: 15, niente: 'yes' });
    expect(buildElements([Wedge.toXmlElement(w)])).toContain('type="crescendo"');
  });
  it('Bracket round-trips type + line-end + end-length', () => {
    const b = Bracket.fromXmlElement(parseElements('<bracket type="start" number="1" line-end="down" end-length="10"/>')[0]);
    expect(b).toMatchObject({ lineEnd: 'down', endLength: 10 });
    const round = Bracket.fromXmlElement(parseElements(buildElements([Bracket.toXmlElement(b)]))[0]);
    expect(round.lineEnd).toBe('down');
  });
  it('Pedal + OctaveShift round-trip type', () => {
    const p = Pedal.fromXmlElement(parseElements('<pedal type="start" line="yes" sign="no"/>')[0]);
    expect(p).toMatchObject({ type: PedalType.Start, line: 'yes', sign: 'no' });
    const o = OctaveShift.fromXmlElement(parseElements('<octave-shift type="down" size="8"/>')[0]);
    expect(o).toMatchObject({ type: OctaveShiftType.Down, size: 8 });
    expect(buildElements([Pedal.toXmlElement(p)])).toContain('type="start"');
    expect(buildElements([OctaveShift.toXmlElement(o)])).toContain('size="8"');
  });
  it('Rehearsal/StringMute/StaffDivide/OtherDirection round-trip', () => {
    expect(Rehearsal.fromXmlElement(parseElements('<rehearsal>A</rehearsal>')[0]).value).toBe('A');
    expect(StringMute.fromXmlElement(parseElements('<string-mute type="on"/>')[0]).type).toBe('on');
    expect(StaffDivide.fromXmlElement(parseElements('<staff-divide type="up"/>')[0]).type).toBe('up');
    expect(OtherDirection.fromXmlElement(parseElements('<other-direction smufl="x">y</other-direction>')[0]).value).toBe('y');
  });
});
