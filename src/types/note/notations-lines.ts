/**
 * Notation line elements: glissando, slide.
 * @see musicxml.xsd "glissando", "slide"
 */

import { attr, el, elementText, type XmlElement } from '../../xml/xml-element';
import { StartStop } from '../enums';
import type { LineType, NumberLevel, YesNo } from '../enums';
import type { Color, Font, Tenths } from '../common';
import {
  asEnum,
  BendSoundAttrs,
  DashedFormattingAttrs,
  LineTypeAttrs,
  PrintStyleAttrs,
} from '../common/attribute-groups';
import type { Glissando as GlissandoShape, Slide as SlideShape } from '../note';

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
 * Glissando and slide types both indicate rapidly moving from one pitch to the other so that individual notes are not discerned. A glissando sounds the distinct notes in between the two pitches and defaults to a wavy line. The optional text is printed alongside the line.
 * @see musicxml.xsd "glissando".
 */
export class Glissando implements GlissandoShape, PrintStyleFields {
  type: StartStop = StartStop.Start;
  number?: NumberLevel;
  value?: string;
  lineType?: LineType;
  dashLength?: Tenths;
  spaceLength?: Tenths;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  id?: string;
  constructor(init?: Partial<Glissando>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Glissando {
    const num = attr(node, 'number');
    return new Glissando({
      type: asEnum(StartStop, attr(node, 'type')) ?? StartStop.Start,
      number: num === undefined ? undefined : (Number(num) as NumberLevel),
      value: elementText(node) || undefined,
      id: attr(node, 'id'),
      ...LineTypeAttrs.read(node),
      ...DashedFormattingAttrs.read(node),
      ...PrintStyleAttrs.read(node),
    });
  }
  static toXmlElement(g: Glissando): XmlElement {
    return el('glissando', g.value ? [{ '#text': g.value }] : [], {
      type: g.type,
      number: g.number,
      ...LineTypeAttrs.attrs(g),
      ...DashedFormattingAttrs.attrs(g),
      ...PrintStyleAttrs.attrs(g),
      id: g.id,
    });
  }
}

/**
 * Glissando and slide types both indicate rapidly moving from one pitch to the other so that individual notes are not discerned. A slide is continuous between the two pitches and defaults to a solid line. The optional text for a is printed alongside the line.
 * @see musicxml.xsd "slide".
 */
export class Slide implements SlideShape, PrintStyleFields {
  type: StartStop = StartStop.Start;
  number?: NumberLevel;
  value?: string;
  lineType?: LineType;
  dashLength?: Tenths;
  spaceLength?: Tenths;
  accelerate?: YesNo;
  beats?: number;
  firstBeat?: number;
  lastBeat?: number;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  id?: string;
  constructor(init?: Partial<Slide>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Slide {
    const num = attr(node, 'number');
    return new Slide({
      type: asEnum(StartStop, attr(node, 'type')) ?? StartStop.Start,
      number: num === undefined ? undefined : (Number(num) as NumberLevel),
      value: elementText(node) || undefined,
      id: attr(node, 'id'),
      ...LineTypeAttrs.read(node),
      ...DashedFormattingAttrs.read(node),
      ...BendSoundAttrs.read(node),
      ...PrintStyleAttrs.read(node),
    });
  }
  static toXmlElement(s: Slide): XmlElement {
    return el('slide', s.value ? [{ '#text': s.value }] : [], {
      type: s.type,
      number: s.number,
      ...LineTypeAttrs.attrs(s),
      ...DashedFormattingAttrs.attrs(s),
      ...BendSoundAttrs.attrs(s),
      ...PrintStyleAttrs.attrs(s),
      id: s.id,
    });
  }
}
