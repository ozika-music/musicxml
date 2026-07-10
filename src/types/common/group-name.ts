/**
 * group-name / group-abbreviation — a part-group name with print-style + justify.
 *
 * @see musicxml.xsd complexType "group-name"
 *   simpleContent: xs:string + attributeGroup "group-name-text"
 *     (print-style [position + font + color] + @justify)
 *
 * Demonstrates the attribute-group convention: print-style attributes round-trip
 * fully via `PrintStyleAttrs`.
 */

import { attr, el, elementText, type XmlElement } from '../../xml/xml-element';
import { CssFontSize, FontStyle, FontWeight, LeftCenterRight } from '../enums';
import type { Color, PrintStyle, Tenths } from '../common';
import { asEnum, PrintStyleAttrs } from './attribute-groups';

/** The group-name type describes the name or abbreviation of a part-group element. Formatting attributes in the group-name type are deprecated in Version 2.0 in favor of the new group-name-display and group-abbreviation-display elements. */
export class GroupName implements PrintStyle {
  value = '';
  justify?: LeftCenterRight;
  // print-style (position + font + color)
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: string;
  fontStyle?: FontStyle;
  fontSize?: number | CssFontSize;
  fontWeight?: FontWeight;
  color?: Color;

  constructor(init?: Partial<GroupName>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): GroupName {
    return new GroupName({
      value: elementText(node) ?? '',
      justify: asEnum(LeftCenterRight, attr(node, 'justify')),
      ...PrintStyleAttrs.read(node),
    });
  }

  /**
   * Serialize under `tag` (e.g. 'group-name', 'group-abbreviation').
   * Static so serialization tolerates plain-object data, not just instances.
   */
  static toXmlElement(gn: GroupName, tag: string): XmlElement {
    return el(tag, [{ '#text': gn.value }], { ...PrintStyleAttrs.attrs(gn), justify: gn.justify });
  }
}
