/**
 * Note display leaf elements: dot, accidental, grace, notehead.
 * @see musicxml.xsd "empty-placement"(dot), "accidental", "grace", "notehead"
 */

import { attr, el, elementText, type XmlElement } from '../../xml/xml-element';
import { AccidentalValue, NoteheadValue, SymbolSize } from '../enums';
import type { AboveBelow, YesNo } from '../enums';
import type { Color, Divisions, Font, PrintStyle, SmuflGlyphName } from '../common';
import { asEnum, ColorAttrs, FontAttrs, PlacementAttrs, PrintStyleAttrs } from '../common/attribute-groups';
import type { Accidental as AccidentalShape, Dot as DotShape, Grace as GraceShape, Notehead as NoteheadShape } from '../note';

function numAttr(node: XmlElement, name: string): number | undefined {
  const v = attr(node, name);
  return v === undefined ? undefined : Number(v);
}

/**
 * The empty-placement type represents an empty element with print-style and placement attributes.
 * @see musicxml.xsd "empty-placement" — print-style + placement on `<dot/>`.
 */
export class Dot implements DotShape, PrintStyle {
  defaultX?: number;
  defaultY?: number;
  relativeX?: number;
  relativeY?: number;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  placement?: AboveBelow;
  constructor(init?: Partial<Dot>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Dot {
    return new Dot({ ...PrintStyleAttrs.read(node), ...PlacementAttrs.read(node) });
  }
  static toXmlElement(d: Dot): XmlElement {
    return el('dot', [], { ...PrintStyleAttrs.attrs(d), ...PlacementAttrs.attrs(d) });
  }
}

/**
 * The accidental type represents actual notated accidentals. Editorial and cautionary indications are indicated by attributes. Values for these attributes are "no" if not present. Specific graphic display such as parentheses, brackets, and size are controlled by the level-display attribute group.
 * @see musicxml.xsd "accidental".
 */
export class Accidental implements AccidentalShape {
  value: AccidentalValue = AccidentalValue.Natural;
  cautionary?: YesNo;
  editorial?: YesNo;
  bracket?: YesNo;
  parentheses?: YesNo;
  size?: SymbolSize;
  smufl?: SmuflGlyphName;
  id?: string;
  defaultX?: number;
  defaultY?: number;
  relativeX?: number;
  relativeY?: number;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  constructor(init?: Partial<Accidental>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Accidental {
    return new Accidental({
      value: asEnum(AccidentalValue, elementText(node)) ?? AccidentalValue.Natural,
      cautionary: attr(node, 'cautionary') as YesNo | undefined,
      editorial: attr(node, 'editorial') as YesNo | undefined,
      bracket: attr(node, 'bracket') as YesNo | undefined,
      parentheses: attr(node, 'parentheses') as YesNo | undefined,
      size: asEnum(SymbolSize, attr(node, 'size')),
      smufl: attr(node, 'smufl'),
      id: attr(node, 'id'),
      ...PrintStyleAttrs.read(node),
    });
  }
  static toXmlElement(a: Accidental): XmlElement {
    return el('accidental', [{ '#text': a.value }], {
      cautionary: a.cautionary,
      editorial: a.editorial,
      bracket: a.bracket,
      parentheses: a.parentheses,
      size: a.size,
      smufl: a.smufl,
      ...PrintStyleAttrs.attrs(a),
      id: a.id,
    });
  }
}

/**
 * The grace type indicates the presence of a grace note. The slash attribute for a grace note is yes for slashed grace notes. The steal-time-previous attribute indicates the percentage of time to steal from the previous note for the grace note. The steal-time-following attribute indicates the percentage of time to steal from the following note for the grace note, as for appoggiaturas. The make-time attribute indicates to make time, not steal time; the units are in real-time divisions for the grace note.
 * @see musicxml.xsd "grace".
 */
export class Grace implements GraceShape {
  stealTimePrevious?: number;
  stealTimeFollowing?: number;
  makeTime?: Divisions;
  slash?: YesNo;
  constructor(init?: Partial<Grace>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Grace {
    return new Grace({
      stealTimePrevious: numAttr(node, 'steal-time-previous'),
      stealTimeFollowing: numAttr(node, 'steal-time-following'),
      makeTime: numAttr(node, 'make-time'),
      slash: attr(node, 'slash') as YesNo | undefined,
    });
  }
  static toXmlElement(g: Grace): XmlElement {
    return el('grace', [], {
      'steal-time-previous': g.stealTimePrevious,
      'steal-time-following': g.stealTimeFollowing,
      'make-time': g.makeTime,
      slash: g.slash,
    });
  }
}

/**
 * The notehead type indicates shapes other than the open and closed ovals associated with note durations. The smufl attribute can be used to specify a particular notehead, allowing application interoperability without requiring every SMuFL glyph to have a MusicXML element equivalent. This attribute can be used either with the "other" value, or to refine a specific notehead value such as "cluster". Noteheads in the SMuFL Note name noteheads and Note name noteheads supplement ranges (U+E150–U+E1AF and U+EEE0–U+EEFF) should not use the smufl attribute or the "other" value, but instead use the notehead-text element. For the enclosed shapes, the default is to be hollow for half notes and longer, and filled otherwise. The filled attribute can be set to change this if needed. If the parentheses attribute is set to yes, the notehead is parenthesized. It is no by default.
 * @see musicxml.xsd "notehead".
 */
export class Notehead implements NoteheadShape {
  value: NoteheadValue = NoteheadValue.Normal;
  filled?: YesNo;
  parentheses?: YesNo;
  smufl?: SmuflGlyphName;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  constructor(init?: Partial<Notehead>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Notehead {
    return new Notehead({
      value: asEnum(NoteheadValue, elementText(node)) ?? NoteheadValue.Normal,
      filled: attr(node, 'filled') as YesNo | undefined,
      parentheses: attr(node, 'parentheses') as YesNo | undefined,
      smufl: attr(node, 'smufl'),
      ...FontAttrs.read(node),
      ...ColorAttrs.read(node),
    });
  }
  static toXmlElement(n: Notehead): XmlElement {
    return el('notehead', [{ '#text': n.value }], {
      filled: n.filled,
      parentheses: n.parentheses,
      smufl: n.smufl,
      ...FontAttrs.attrs(n),
      ...ColorAttrs.attrs(n),
    });
  }
}
