/**
 * part-name / part-abbreviation — a score-part name with print-style,
 * print-object and justify.
 *
 * @see musicxml.xsd complexType "part-name"
 *   simpleContent: xs:string + attributeGroup "part-name-text"
 *     (print-style [position + font + color] + @print-object + @justify)
 */

import { attr, el, elementText, type XmlElement } from '../../xml/xml-element';
import { CssFontSize, FontStyle, FontWeight, LeftCenterRight, type YesNo } from '../enums';
import type { Color, PrintStyle, Tenths } from '../common';
import { asEnum, PrintStyleAttrs } from '../common/attribute-groups';

/** The part-name type describes the name or abbreviation of a score-part element. Formatting attributes for the part-name element are deprecated in Version 2.0 in favor of the new part-name-display and part-abbreviation-display elements. */
export class PartName implements PrintStyle {
  value = '';
  printObject?: YesNo;
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

  constructor(init?: Partial<PartName>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): PartName {
    return new PartName({
      value: elementText(node) ?? '',
      printObject: attr(node, 'print-object') as YesNo | undefined,
      justify: asEnum(LeftCenterRight, attr(node, 'justify')),
      ...PrintStyleAttrs.read(node),
    });
  }

  /** Serialize under `tag` (e.g. 'part-name', 'part-abbreviation'). */
  static toXmlElement(pn: PartName, tag: string): XmlElement {
    return el(tag, [{ '#text': pn.value }], {
      ...PrintStyleAttrs.attrs(pn),
      'print-object': pn.printObject,
      justify: pn.justify,
    });
  }
}
