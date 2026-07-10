import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { FontStyle, FontWeight, LeftCenterRight } from '../enums';
import { GroupName } from './group-name';

/**
 * @see musicxml.xsd complexType "group-name" — string + print-style (position +
 * font + color) + @justify. One assertion per spec item, via a
 * fromXmlElement → toXmlElement → build → reparse round-trip.
 */
describe('GroupName', () => {
  const XML =
    '<group-name default-x="5" relative-y="-2" font-family="Times" font-style="italic" ' +
    'font-size="10" font-weight="bold" color="#FF0000" justify="center">Strings</group-name>';

  const roundTrip = (gn: GroupName) =>
    GroupName.fromXmlElement(parseElements(buildElements([GroupName.toXmlElement(gn, 'group-name')]))[0]);

  it('parses value + every print-style attribute + justify', () => {
    const gn = GroupName.fromXmlElement(parseElements(XML)[0]);
    expect(gn).toBeInstanceOf(GroupName);
    expect(gn.value).toBe('Strings');
    expect(gn.defaultX).toBe(5); // position
    expect(gn.relativeY).toBe(-2);
    expect(gn.fontFamily).toBe('Times'); // font
    expect(gn.fontStyle).toBe(FontStyle.Italic);
    expect(gn.fontSize).toBe(10);
    expect(gn.fontWeight).toBe(FontWeight.Bold);
    expect(gn.color).toBe('#FF0000'); // color
    expect(gn.justify).toBe(LeftCenterRight.Center);
  });

  it('round-trips every spec item losslessly', () => {
    const gn = roundTrip(GroupName.fromXmlElement(parseElements(XML)[0]));
    expect(gn.value).toBe('Strings');
    expect(gn.defaultX).toBe(5);
    expect(gn.relativeY).toBe(-2);
    expect(gn.fontFamily).toBe('Times');
    expect(gn.fontStyle).toBe(FontStyle.Italic);
    expect(gn.fontSize).toBe(10);
    expect(gn.fontWeight).toBe(FontWeight.Bold);
    expect(gn.color).toBe('#FF0000');
    expect(gn.justify).toBe(LeftCenterRight.Center);
  });

  it('omits absent attributes', () => {
    const xml = buildElements([GroupName.toXmlElement(new GroupName({ value: 'Brass' }), 'group-name')]);
    expect(xml).toContain('>Brass<');
    expect(xml).not.toContain('default-x');
    expect(xml).not.toContain('justify');
  });
});
