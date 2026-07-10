/**
 * Segno / Coda — empty print-style-align symbols shared by barline & direction.
 * @see musicxml.xsd "segno", "coda"
 */

import { attr, el, type XmlElement } from '../../xml/xml-element';
import type { LeftCenterRight, Valign } from '../enums';
import type { Color, Font, SmuflGlyphName, Tenths } from '../common';
import { PrintStyleAlignAttrs } from './attribute-groups';
import type { Coda as CodaShape, Segno as SegnoShape } from '../common';

type PrintStyleAlignFields = {
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  halign?: LeftCenterRight;
  valign?: Valign;
};

/**
 * The segno type is the visual indicator of a segno sign. The exact glyph can be specified with the smufl attribute. A sound element is also needed to guide playback applications reliably.
 * @see musicxml.xsd "segno".
 */
export class Segno implements SegnoShape, PrintStyleAlignFields {
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
  halign?: LeftCenterRight;
  valign?: Valign;
  id?: string;
  constructor(init?: Partial<Segno>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Segno {
    return new Segno({ smufl: attr(node, 'smufl'), ...PrintStyleAlignAttrs.read(node), id: attr(node, 'id') });
  }
  static toXmlElement(s: Segno, tag = 'segno'): XmlElement {
    return el(tag, [], { smufl: s.smufl, ...PrintStyleAlignAttrs.attrs(s), id: s.id });
  }
}

/**
 * The coda type is the visual indicator of a coda sign. The exact glyph can be specified with the smufl attribute. A sound element is also needed to guide playback applications reliably.
 * @see musicxml.xsd "coda".
 */
export class Coda implements CodaShape, PrintStyleAlignFields {
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
  halign?: LeftCenterRight;
  valign?: Valign;
  id?: string;
  constructor(init?: Partial<Coda>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Coda {
    return new Coda({ smufl: attr(node, 'smufl'), ...PrintStyleAlignAttrs.read(node), id: attr(node, 'id') });
  }
  static toXmlElement(c: Coda, tag = 'coda'): XmlElement {
    return el(tag, [], { smufl: c.smufl, ...PrintStyleAlignAttrs.attrs(c), id: c.id });
  }
}
