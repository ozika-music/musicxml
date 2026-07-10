import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { NameDisplay } from './name-display';

/**
 * @see musicxml.xsd complexType "name-display" — spec items: display-text*,
 * accidental-text*, @print-object. One assertion per spec item, via a
 * fromXmlElement → toXmlElement → build → reparse round-trip.
 */
describe('NameDisplay', () => {
  const XML =
    '<part-name-display print-object="yes">' +
    '<display-text>Flute 1</display-text>' +
    '<accidental-text>sharp</accidental-text>' +
    '<display-text>in B</display-text>' +
    '</part-name-display>';

  const roundTrip = (nd: NameDisplay) =>
    NameDisplay.fromXmlElement(parseElements(buildElements([NameDisplay.toXmlElement(nd, 'part-name-display')]))[0]);

  it('parses each spec item from the element', () => {
    const nd = NameDisplay.fromXmlElement(parseElements(XML)[0]);
    expect(nd).toBeInstanceOf(NameDisplay);
    expect(nd.printObject).toBe('yes'); // @print-object
    expect(nd.displayText?.map((d) => d.value)).toEqual(['Flute 1', 'in B']); // display-text*
    expect(nd.accidentalText?.map((a) => a.value)).toEqual(['sharp']); // accidental-text*
  });

  it('round-trips every spec item through toXmlElement', () => {
    const nd = roundTrip(NameDisplay.fromXmlElement(parseElements(XML)[0]));
    expect(nd.printObject).toBe('yes');
    expect(nd.displayText?.map((d) => d.value)).toEqual(['Flute 1', 'in B']);
    expect(nd.accidentalText?.map((a) => a.value)).toEqual(['sharp']);
  });

  it('omits print-object and empty child lists when absent', () => {
    const nd = new NameDisplay({ displayText: [{ value: 'Vln' }] });
    const xml = buildElements([NameDisplay.toXmlElement(nd, 'group-name-display')]);
    expect(xml).toContain('<display-text>Vln</display-text>');
    expect(xml).not.toContain('print-object');
    expect(xml).not.toContain('accidental-text');
  });
});
