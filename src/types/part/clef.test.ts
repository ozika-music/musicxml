import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { ClefSign, SymbolSize } from '../enums';
import { Clef } from './clef';

/** @see musicxml.xsd "clef" — sign, line?, clef-octave-change?, @number/@size/print-style. */
describe('Clef', () => {
  it('round-trips sign, line, octave-change + attributes', () => {
    const xml = '<clef number="2" size="cue" color="#111"><sign>F</sign><line>4</line><clef-octave-change>-1</clef-octave-change></clef>';
    const clef = Clef.fromXmlElement(parseElements(xml)[0]);
    expect(clef.sign).toBe(ClefSign.F);
    expect(clef.line).toBe(4);
    expect(clef.clefOctaveChange).toBe(-1);
    expect(clef.number).toBe(2);
    expect(clef.size).toBe(SymbolSize.Cue);
    expect(clef.color).toBe('#111');

    const round = Clef.fromXmlElement(parseElements(buildElements([Clef.toXmlElement(clef)]))[0]);
    expect(round).toMatchObject({ sign: ClefSign.F, line: 4, clefOctaveChange: -1, number: 2, size: SymbolSize.Cue });
  });
});
