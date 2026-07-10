import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { PartSymbol } from './part-symbol';
import { Transpose } from './transpose';

/** @see musicxml.xsd "transpose" — diatonic?, chromatic, octave-change?, double?. */
describe('Transpose', () => {
  it('round-trips diatonic/chromatic/octave-change/double + @number', () => {
    const xml = '<transpose number="1"><diatonic>-1</diatonic><chromatic>-2</chromatic><octave-change>-1</octave-change><double/></transpose>';
    const t = Transpose.fromXmlElement(parseElements(xml)[0]);
    expect(t).toMatchObject({ number: 1, diatonic: -1, chromatic: -2, octaveChange: -1, double: true });
    const round = Transpose.fromXmlElement(parseElements(buildElements([Transpose.toXmlElement(t)]))[0]);
    expect(round).toMatchObject({ number: 1, diatonic: -1, chromatic: -2, octaveChange: -1, double: true });
  });
});

/** @see musicxml.xsd "part-symbol" — value + @top-staff/@bottom-staff + position/color. */
describe('PartSymbol', () => {
  it('round-trips value + staff bounds + position', () => {
    const xml = '<part-symbol top-staff="1" bottom-staff="2" default-x="-10">brace</part-symbol>';
    const ps = PartSymbol.fromXmlElement(parseElements(xml)[0]);
    expect(ps).toMatchObject({ value: 'brace', topStaff: 1, bottomStaff: 2, defaultX: -10 });
    const round = PartSymbol.fromXmlElement(parseElements(buildElements([PartSymbol.toXmlElement(ps)]))[0]);
    expect(round).toMatchObject({ value: 'brace', topStaff: 1, bottomStaff: 2, defaultX: -10 });
  });
});
