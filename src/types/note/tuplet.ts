/**
 * Tuplet notation: tuplet + tuplet-actual/normal portions.
 * @see musicxml.xsd "tuplet", "tuplet-portion", "tuplet-number", "tuplet-type", "tuplet-dot"
 */

import { attr, childrenOf, el, elementText, type XmlElement } from '../../xml/xml-element';
import { NoteTypeValue, ShowTuplet, StartStop } from '../enums';
import type { AboveBelow, LineShape, NumberLevel, YesNo } from '../enums';
import type { Color, Font, Tenths } from '../common';
import { asEnum, ColorAttrs, FontAttrs, LineShapeAttrs, PlacementAttrs, PositionAttrs } from '../common/attribute-groups';
import type {
  Tuplet as TupletShape,
  TupletDot as TupletDotShape,
  TupletNumber as TupletNumberShape,
  TupletPortion as TupletPortionShape,
  TupletType as TupletTypeShape,
} from '../note';

type FontColor = {
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
};

/**
 * The tuplet-number type indicates the number of notes for this portion of the tuplet.
 * @see musicxml.xsd "tuplet-number".
 */
export class TupletNumber implements TupletNumberShape, FontColor {
  value = 0;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  constructor(init?: Partial<TupletNumber>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): TupletNumber {
    return new TupletNumber({ value: Number(elementText(node) ?? 0), ...FontAttrs.read(node), ...ColorAttrs.read(node) });
  }
  static toXmlElement(t: TupletNumber): XmlElement {
    return el('tuplet-number', [{ '#text': String(t.value) }], { ...FontAttrs.attrs(t), ...ColorAttrs.attrs(t) });
  }
}

/**
 * The tuplet-type type indicates the graphical note type of the notes for this portion of the tuplet.
 * @see musicxml.xsd "tuplet-type".
 */
export class TupletType implements TupletTypeShape, FontColor {
  value: NoteTypeValue = NoteTypeValue.Quarter;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  constructor(init?: Partial<TupletType>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): TupletType {
    return new TupletType({ value: asEnum(NoteTypeValue, elementText(node)) ?? NoteTypeValue.Quarter, ...FontAttrs.read(node), ...ColorAttrs.read(node) });
  }
  static toXmlElement(t: TupletType): XmlElement {
    return el('tuplet-type', [{ '#text': t.value }], { ...FontAttrs.attrs(t), ...ColorAttrs.attrs(t) });
  }
}

/**
 * The tuplet-dot type is used to specify dotted tuplet types.
 * @see musicxml.xsd "tuplet-dot".
 */
export class TupletDot implements TupletDotShape, FontColor {
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  constructor(init?: Partial<TupletDot>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): TupletDot {
    return new TupletDot({ ...FontAttrs.read(node), ...ColorAttrs.read(node) });
  }
  static toXmlElement(t: TupletDot): XmlElement {
    return el('tuplet-dot', [], { ...FontAttrs.attrs(t), ...ColorAttrs.attrs(t) });
  }
}

/**
 * The tuplet-portion type provides optional full control over tuplet specifications. It allows the number and note type (including dots) to be set for the actual and normal portions of a single tuplet. If any of these elements are absent, their values are based on the time-modification element.
 * @see musicxml.xsd "tuplet-portion" (tuplet-actual / tuplet-normal).
 */
export class TupletPortion implements TupletPortionShape {
  tupletNumber?: TupletNumber;
  tupletType?: TupletType;
  tupletDots?: TupletDot[];
  constructor(init?: Partial<TupletPortion>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): TupletPortion {
    const numEl = childrenOf(node, 'tuplet-number')[0];
    const typeEl = childrenOf(node, 'tuplet-type')[0];
    const dots = childrenOf(node, 'tuplet-dot').map((d) => TupletDot.fromXmlElement(d));
    return new TupletPortion({
      tupletNumber: numEl ? TupletNumber.fromXmlElement(numEl) : undefined,
      tupletType: typeEl ? TupletType.fromXmlElement(typeEl) : undefined,
      tupletDots: dots.length ? dots : undefined,
    });
  }
  static toXmlElement(p: TupletPortion, tag: string): XmlElement {
    const c: XmlElement[] = [];
    if (p.tupletNumber) c.push(TupletNumber.toXmlElement(p.tupletNumber));
    if (p.tupletType) c.push(TupletType.toXmlElement(p.tupletType));
    for (const d of p.tupletDots ?? []) c.push(TupletDot.toXmlElement(d));
    return el(tag, c);
  }
}

/**
 * A tuplet element is present when a tuplet is to be displayed graphically, in addition to the sound data provided by the time-modification elements. The number attribute is used to distinguish nested tuplets. The bracket attribute is used to indicate the presence of a bracket. If unspecified, the results are implementation-dependent. The line-shape attribute is used to specify whether the bracket is straight or in the older curved or slurred style. It is straight by default. Whereas a time-modification element shows how the cumulative, sounding effect of tuplets and double-note tremolos compare to the written note type, the tuplet element describes how this is displayed. The tuplet element also provides more detailed representation information than the time-modification element, and is needed to represent nested tuplets and other complex tuplets accurately. The show-number attribute is used to display either the number of actual notes, the number of both actual and normal notes, or neither. It is actual by default. The show-type attribute is used to display either the actual type, both the actual and normal types, or neither. It is none by default.
 * @see musicxml.xsd "tuplet".
 */
export class Tuplet implements TupletShape {
  type: StartStop = StartStop.Start;
  number?: NumberLevel;
  bracket?: YesNo;
  showNumber?: ShowTuplet;
  showType?: ShowTuplet;
  tupletActual?: TupletPortion;
  tupletNormal?: TupletPortion;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  placement?: AboveBelow;
  lineShape?: LineShape;
  id?: string;
  constructor(init?: Partial<Tuplet>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Tuplet {
    const num = attr(node, 'number');
    const actual = childrenOf(node, 'tuplet-actual')[0];
    const normal = childrenOf(node, 'tuplet-normal')[0];
    return new Tuplet({
      type: asEnum(StartStop, attr(node, 'type')) ?? StartStop.Start,
      number: num === undefined ? undefined : (Number(num) as NumberLevel),
      bracket: attr(node, 'bracket') as YesNo | undefined,
      showNumber: asEnum(ShowTuplet, attr(node, 'show-number')),
      showType: asEnum(ShowTuplet, attr(node, 'show-type')),
      tupletActual: actual ? TupletPortion.fromXmlElement(actual) : undefined,
      tupletNormal: normal ? TupletPortion.fromXmlElement(normal) : undefined,
      id: attr(node, 'id'),
      ...PositionAttrs.read(node),
      ...PlacementAttrs.read(node),
      ...LineShapeAttrs.read(node),
    });
  }
  static toXmlElement(t: Tuplet): XmlElement {
    const c: XmlElement[] = [];
    if (t.tupletActual) c.push(TupletPortion.toXmlElement(t.tupletActual, 'tuplet-actual'));
    if (t.tupletNormal) c.push(TupletPortion.toXmlElement(t.tupletNormal, 'tuplet-normal'));
    return el('tuplet', c, {
      type: t.type,
      number: t.number,
      bracket: t.bracket,
      'show-number': t.showNumber,
      'show-type': t.showType,
      ...PositionAttrs.attrs(t),
      ...PlacementAttrs.attrs(t),
      ...LineShapeAttrs.attrs(t),
      id: t.id,
    });
  }
}
