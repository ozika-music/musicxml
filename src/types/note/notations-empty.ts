/**
 * Reusable empty/placement notation leaves shared by articulations,
 * technical and ornaments.
 * @see musicxml.xsd "empty-placement", "empty-placement-smufl", "empty-line"
 */

import { attr, el, type XmlElement } from '../../xml/xml-element';
import { LineLength } from '../enums';
import type { AboveBelow, LineShape, LineType } from '../enums';
import type { Color, Font, SmuflGlyphName, Tenths } from '../common';
import {
  asEnum,
  ColorAttrs,
  DashedFormattingAttrs,
  LineShapeAttrs,
  LineTypeAttrs,
  PlacementAttrs,
  PositionAttrs,
  PrintStyleAttrs,
} from '../common/attribute-groups';
import type { EmptyPlacement as EmptyPlacementShape, EmptyPlacementSmufl as EmptyPlacementSmuflShape, EmptyLine as EmptyLineShape } from '../note';

/** print-style + position + font + color fields (declared so attr-group spreads typecheck). */
type PrintStyleFields = {
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
};

/**
 * The empty-placement type represents an empty element with print-style and placement attributes.
 * @see musicxml.xsd "empty-placement" — print-style + placement, empty element.
 */
export class EmptyPlacement implements EmptyPlacementShape, PrintStyleFields {
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
  constructor(init?: Partial<EmptyPlacement>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): EmptyPlacement {
    return new EmptyPlacement({ ...PrintStyleAttrs.read(node), ...PlacementAttrs.read(node), id: attr(node, 'id') });
  }
  static toXmlElement(e: EmptyPlacement, tag: string): XmlElement {
    return el(tag, [], { ...PrintStyleAttrs.attrs(e), ...PlacementAttrs.attrs(e), id: e.id });
  }
}

/**
 * The empty-placement-smufl type represents an empty element with print-style, placement, and smufl attributes.
 * @see musicxml.xsd "empty-placement-smufl" — print-style + placement + smufl.
 */
export class EmptyPlacementSmufl implements EmptyPlacementSmuflShape, PrintStyleFields {
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
  constructor(init?: Partial<EmptyPlacementSmufl>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): EmptyPlacementSmufl {
    return new EmptyPlacementSmufl({
      smufl: attr(node, 'smufl'),
      ...PrintStyleAttrs.read(node),
      ...PlacementAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(e: EmptyPlacementSmufl, tag: string): XmlElement {
    return el(tag, [], { smufl: e.smufl, ...PrintStyleAttrs.attrs(e), ...PlacementAttrs.attrs(e), id: e.id });
  }
}

/**
 * The empty-line type represents an empty element with line-shape, line-type, line-length, dashed-formatting, print-style and placement attributes.
 * @see musicxml.xsd "empty-line" — position + line attrs + dashed + color + line-length.
 */
export class EmptyLine implements EmptyLineShape {
  lineLength?: LineLength;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  placement?: AboveBelow;
  lineShape?: LineShape;
  lineType?: LineType;
  dashLength?: Tenths;
  spaceLength?: Tenths;
  color?: Color;
  id?: string;
  constructor(init?: Partial<EmptyLine>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): EmptyLine {
    return new EmptyLine({
      lineLength: asEnum(LineLength, attr(node, 'line-length')),
      ...PositionAttrs.read(node),
      ...PlacementAttrs.read(node),
      ...LineShapeAttrs.read(node),
      ...LineTypeAttrs.read(node),
      ...DashedFormattingAttrs.read(node),
      ...ColorAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(e: EmptyLine, tag: string): XmlElement {
    return el(tag, [], {
      'line-length': e.lineLength,
      ...PositionAttrs.attrs(e),
      ...PlacementAttrs.attrs(e),
      ...LineShapeAttrs.attrs(e),
      ...LineTypeAttrs.attrs(e),
      ...DashedFormattingAttrs.attrs(e),
      ...ColorAttrs.attrs(e),
      id: e.id,
    });
  }
}
