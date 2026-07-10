/**
 * clef.
 * @see musicxml.xsd complexType "clef"
 *   sign, line?, clef-octave-change?; @number, @additional, @size, @after-barline,
 *   print-style, print-object
 */

import { attr, el, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import { ClefSign, SymbolSize, type CssFontSize, type FontStyle, type FontWeight, type YesNo } from '../enums';
import { asEnum, PrintStyleAttrs } from '../common/attribute-groups';
import type { ClefShape } from '../part';

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

/** Clefs are represented by a combination of sign, line, and clef-octave-change elements. The optional number attribute refers to staff numbers within the part. A value of 1 is assumed if not present. Sometimes clefs are added to the staff in non-standard line positions, either to indicate cue passages, or when there are multiple clefs present simultaneously on one staff. In this situation, the additional attribute is set to "yes" and the line value is ignored. The size attribute is used for clefs where the additional attribute is "yes". It is typically used to indicate cue clefs. Sometimes clefs at the start of a measure need to appear after the barline rather than before, as for cues or for use after a repeated section. The after-barline attribute is set to "yes" in this situation. The attribute is ignored for mid-measure clefs. Clefs appear at the start of each system unless the print-object attribute has been set to "no" or the additional attribute has been set to "yes". */
export class Clef implements ClefShape {
  sign: ClefSign = ClefSign.G;
  line?: number;
  clefOctaveChange?: number;
  number?: number;
  additional?: YesNo;
  size?: SymbolSize;
  afterBarline?: YesNo;
  printObject?: YesNo;
  // print-style
  defaultX?: number;
  defaultY?: number;
  relativeX?: number;
  relativeY?: number;
  fontFamily?: string;
  fontStyle?: FontStyle;
  fontSize?: number | CssFontSize;
  fontWeight?: FontWeight;
  color?: string;

  constructor(init?: Partial<Clef>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Clef {
    const num = attr(node, 'number');
    return new Clef({
      sign: asEnum(ClefSign, textOf(node, 'sign')) ?? ClefSign.G,
      line: numText(node, 'line'),
      clefOctaveChange: numText(node, 'clef-octave-change'),
      number: num === undefined ? undefined : Number(num),
      additional: attr(node, 'additional') as YesNo | undefined,
      size: asEnum(SymbolSize, attr(node, 'size')),
      afterBarline: attr(node, 'after-barline') as YesNo | undefined,
      printObject: attr(node, 'print-object') as YesNo | undefined,
      ...PrintStyleAttrs.read(node),
    });
  }

  static toXmlElement(clef: Clef): XmlElement {
    const c: XmlElement[] = [textEl('sign', clef.sign)];
    if (clef.line !== undefined) c.push(textEl('line', clef.line));
    if (clef.clefOctaveChange !== undefined) c.push(textEl('clef-octave-change', clef.clefOctaveChange));
    return el('clef', c, {
      ...PrintStyleAttrs.attrs(clef),
      number: clef.number,
      additional: clef.additional,
      size: clef.size,
      'after-barline': clef.afterBarline,
      'print-object': clef.printObject,
    });
  }
}
