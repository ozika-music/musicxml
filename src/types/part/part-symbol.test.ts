import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { PartSymbol } from './part-symbol';

/** @see musicxml.xsd "part-symbol". */
describe('PartSymbol', () => {
  it('round-trips value + top/bottom staff + position', () => {
    const ps = PartSymbol.fromXmlElement(parseElements('<part-symbol top-staff="1" bottom-staff="2" default-x="3">brace</part-symbol>')[0]);
    expect(ps).toMatchObject({ value: 'brace', topStaff: 1, bottomStaff: 2, defaultX: 3 });
    const round = PartSymbol.fromXmlElement(parseElements(buildElements([PartSymbol.toXmlElement(ps)]))[0]);
    expect(round).toMatchObject({ value: 'brace', topStaff: 1, bottomStaff: 2 });
  });
});
