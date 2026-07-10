import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { AccidentalValue, AboveBelow, NoteheadValue, SymbolSize } from '../enums';
import { Accidental, Dot, Grace, Notehead } from './note-display';

/** @see musicxml.xsd "empty-placement"(dot)/"accidental"/"grace"/"notehead". */
describe('note display leaves', () => {
  it('Dot round-trips placement + print-style', () => {
    const d = Dot.fromXmlElement(parseElements('<dot placement="above" default-y="5"/>')[0]);
    expect(d).toMatchObject({ placement: AboveBelow.Above, defaultY: 5 });
    expect(buildElements([Dot.toXmlElement(d)])).toContain('placement="above"');
  });

  it('Accidental round-trips value + flags', () => {
    const a = Accidental.fromXmlElement(
      parseElements('<accidental cautionary="yes" parentheses="yes" size="cue">sharp</accidental>')[0],
    );
    expect(a).toMatchObject({ value: AccidentalValue.Sharp, cautionary: 'yes', parentheses: 'yes', size: SymbolSize.Cue });
    const round = Accidental.fromXmlElement(parseElements(buildElements([Accidental.toXmlElement(a)]))[0]);
    expect(round).toMatchObject({ value: AccidentalValue.Sharp, cautionary: 'yes', parentheses: 'yes', size: SymbolSize.Cue });
  });

  it('Grace round-trips slash + steal-time', () => {
    const g = Grace.fromXmlElement(parseElements('<grace slash="yes" steal-time-previous="20"/>')[0]);
    expect(g).toMatchObject({ slash: 'yes', stealTimePrevious: 20 });
    expect(buildElements([Grace.toXmlElement(g)])).toContain('slash="yes"');
  });

  it('Notehead round-trips value + filled/parentheses', () => {
    const n = Notehead.fromXmlElement(parseElements('<notehead filled="no" parentheses="yes">x</notehead>')[0]);
    expect(n).toMatchObject({ value: NoteheadValue.X, filled: 'no', parentheses: 'yes' });
    const round = Notehead.fromXmlElement(parseElements(buildElements([Notehead.toXmlElement(n)]))[0]);
    expect(round).toMatchObject({ value: NoteheadValue.X, filled: 'no', parentheses: 'yes' });
  });
});
