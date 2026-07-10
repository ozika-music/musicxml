import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { AccidentalValue, SymbolSize } from '../enums';
import { AccidentalMark } from './accidental-mark';

/** @see musicxml.xsd "accidental-mark". */
describe('AccidentalMark', () => {
  it('round-trips value + bracket + size + placement', () => {
    const a = AccidentalMark.fromXmlElement(parseElements('<accidental-mark bracket="yes" size="cue" placement="above">sharp</accidental-mark>')[0]);
    expect(a).toMatchObject({ value: AccidentalValue.Sharp, bracket: 'yes', size: SymbolSize.Cue, placement: 'above' });
    const round = AccidentalMark.fromXmlElement(parseElements(buildElements([AccidentalMark.toXmlElement(a)]))[0]);
    expect(round).toMatchObject({ value: AccidentalValue.Sharp, bracket: 'yes', placement: 'above' });
  });
});
