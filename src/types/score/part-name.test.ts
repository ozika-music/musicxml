import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { FontWeight } from '../enums';
import { PartName } from './part-name';

/** @see musicxml.xsd "part-name" — string + print-style + @print-object + @justify. */
describe('PartName', () => {
  it('round-trips value + print-style + print-object + justify', () => {
    const xml = '<part-name print-object="no" justify="left" font-weight="bold" default-x="3">Violin I</part-name>';
    const pn = PartName.fromXmlElement(parseElements(xml)[0]);
    expect(pn.value).toBe('Violin I');
    expect(pn.printObject).toBe('no');
    expect(pn.justify).toBe('left');
    expect(pn.fontWeight).toBe(FontWeight.Bold);
    expect(pn.defaultX).toBe(3);

    const round = PartName.fromXmlElement(parseElements(buildElements([PartName.toXmlElement(pn, 'part-name')]))[0]);
    expect(round).toMatchObject({ value: 'Violin I', printObject: 'no', justify: 'left', fontWeight: FontWeight.Bold, defaultX: 3 });
  });
});
