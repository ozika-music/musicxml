/**
 * Accidental mark — used by notations and ornaments.
 * @see musicxml.xsd "accidental-mark"
 */

import { attr, el, elementText, type XmlElement } from '../../xml/xml-element';
import { AccidentalValue, SymbolSize } from '../enums';
import type { AboveBelow, YesNo } from '../enums';
import type { Color, Font, SmuflGlyphName, Tenths } from '../common';
import { asEnum, PlacementAttrs, PrintStyleAttrs } from '../common/attribute-groups';
import type { AccidentalMark as AccidentalMarkShape } from '../note';

/**
 * An accidental-mark can be used as a separate notation or as part of an ornament. When used in an ornament, position and placement are relative to the ornament, not relative to the note.
 * @see musicxml.xsd "accidental-mark".
 */
export class AccidentalMark implements AccidentalMarkShape {
  value: AccidentalValue = AccidentalValue.Natural;
  bracket?: YesNo;
  parentheses?: YesNo;
  size?: SymbolSize;
  smufl?: SmuflGlyphName;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  placement?: AboveBelow;
  id?: string;
  constructor(init?: Partial<AccidentalMark>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): AccidentalMark {
    return new AccidentalMark({
      value: asEnum(AccidentalValue, elementText(node)) ?? AccidentalValue.Natural,
      bracket: attr(node, 'bracket') as YesNo | undefined,
      parentheses: attr(node, 'parentheses') as YesNo | undefined,
      size: asEnum(SymbolSize, attr(node, 'size')),
      smufl: attr(node, 'smufl'),
      ...PrintStyleAttrs.read(node),
      ...PlacementAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(a: AccidentalMark): XmlElement {
    return el('accidental-mark', [{ '#text': a.value }], {
      bracket: a.bracket,
      parentheses: a.parentheses,
      size: a.size,
      smufl: a.smufl,
      ...PrintStyleAttrs.attrs(a),
      ...PlacementAttrs.attrs(a),
      id: a.id,
    });
  }
}
