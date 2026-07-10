/**
 * Reusable field-bag base classes — declare the attribute-group property sets
 * once so element classes can `extends` them instead of re-declaring ~20 fields
 * and to satisfy TS weak-type checks when spreading attribute-group `.attrs()`.
 *
 * These declare data fields only (no methods); element classes compose the
 * matching attribute-group `read`/`attrs` helpers.
 */

import type { EnclosureShape, LeftCenterRight, NumberOfLines, TextDirection, Valign } from '../enums';
import type { Color, Font, RotationDegrees, Tenths } from '../common';

/** @see musicxml.xsd attributeGroup "position". */
export class PositionFieldBag {
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
}

/** @see musicxml.xsd attributeGroup "print-style" (position + font + color). */
export class PrintStyleFieldBag extends PositionFieldBag {
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
}

/** @see musicxml.xsd attributeGroup "print-style-align". */
export class PrintStyleAlignFieldBag extends PrintStyleFieldBag {
  halign?: LeftCenterRight;
  valign?: Valign;
}

/** @see musicxml.xsd attributeGroup "text-formatting". */
export class TextFormattingFieldBag extends PrintStyleAlignFieldBag {
  justify?: LeftCenterRight;
  textDecoration?: {
    underline?: NumberOfLines;
    overline?: NumberOfLines;
    lineThrough?: NumberOfLines;
  };
  textRotation?: RotationDegrees;
  letterSpacing?: number | 'normal';
  lineHeight?: number | 'normal';
  lang?: string;
  space?: 'default' | 'preserve';
  dir?: TextDirection;
  enclosure?: EnclosureShape;
}
