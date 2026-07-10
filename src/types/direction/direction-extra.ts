/**
 * Less-common direction-type elements: harp-pedals, scordatura, image,
 * principal-voice, percussion.
 * @see musicxml.xsd "harp-pedals", "scordatura", "image", "principal-voice", "percussion"
 *
 * The percussion sub-element *values* (glass/metal/wood/… ) are kept as strings,
 * matching the model; the element structure + smufl/attrs round-trip.
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import { EnclosureShape, StartStop, TipDirection } from '../enums';
import type { Tenths } from '../common';
import type { LeftCenterRight, Step, YesNo } from '../enums';
import { asEnum, PositionAttrs, PrintStyleAlignAttrs } from '../common/attribute-groups';
import { PositionFieldBag, PrintStyleAlignFieldBag } from '../common/field-bags';
import type {
  Accord,
  HarpPedals as HarpPedalsShape,
  Image as ImageShape,
  PedalTuning,
  Percussion as PercussionShape,
  PrincipalVoice as PrincipalVoiceShape,
  Scordatura as ScordaturaShape,
} from '../direction';

function num(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

/**
 * The harp-pedals type is used to create harp pedal diagrams. The pedal-step and pedal-alter elements use the same values as the step and alter elements. For easiest reading, the pedal-tuning elements should follow standard harp pedal order, with pedal-step values of D, C, B, E, F, G, and A.
 * @see musicxml.xsd "harp-pedals".
 */
export class HarpPedals extends PrintStyleAlignFieldBag implements HarpPedalsShape {
  pedalTunings: PedalTuning[] = [];
  id?: string;
  constructor(init?: Partial<HarpPedals>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(node: XmlElement): HarpPedals {
    return new HarpPedals({
      pedalTunings: childrenOf(node, 'pedal-tuning').map((pt): PedalTuning => ({
        pedalStep: (textOf(pt, 'pedal-step') ?? 'C') as Step,
        pedalAlter: num(pt, 'pedal-alter') ?? 0,
      })),
      ...PrintStyleAlignAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(h: HarpPedals): XmlElement {
    const c = h.pedalTunings.map((pt) =>
      el('pedal-tuning', [textEl('pedal-step', pt.pedalStep), textEl('pedal-alter', pt.pedalAlter)]),
    );
    return el('harp-pedals', c, { ...PrintStyleAlignAttrs.attrs(h), id: h.id });
  }
}

/**
 * Scordatura string tunings are represented by a series of accord elements, similar to the staff-tuning elements. Strings are numbered from high to low.
 * @see musicxml.xsd "scordatura".
 */
export class Scordatura implements ScordaturaShape {
  accords: Accord[] = [];
  id?: string;
  constructor(init?: Partial<Scordatura>) { if (init) Object.assign(this, init); }
  static fromXmlElement(node: XmlElement): Scordatura {
    return new Scordatura({
      accords: childrenOf(node, 'accord').map((a): Accord => ({
        string: attr(a, 'string') ? Number(attr(a, 'string')) : 0,
        tuningStep: (textOf(a, 'tuning-step') ?? 'C') as Step,
        tuningAlter: num(a, 'tuning-alter'),
        tuningOctave: num(a, 'tuning-octave') ?? 0,
      })),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(s: Scordatura): XmlElement {
    const c = s.accords.map((a) => {
      const ac: XmlElement[] = [textEl('tuning-step', a.tuningStep)];
      if (a.tuningAlter !== undefined) ac.push(textEl('tuning-alter', a.tuningAlter));
      ac.push(textEl('tuning-octave', a.tuningOctave));
      return el('accord', ac, { string: a.string });
    });
    return el('scordatura', c, { id: s.id });
  }
}

/**
 * The image type is used to include graphical images in a score.
 * @see musicxml.xsd "image".
 */
export class Image extends PositionFieldBag implements ImageShape {
  source = '';
  type = '';
  halign?: LeftCenterRight;
  valign?: 'top' | 'middle' | 'bottom';
  height?: Tenths;
  width?: Tenths;
  id?: string;
  constructor(init?: Partial<Image>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(node: XmlElement): Image {
    return new Image({
      source: attr(node, 'source') ?? '',
      type: attr(node, 'type') ?? '',
      halign: attr(node, 'halign') as LeftCenterRight | undefined,
      valign: attr(node, 'valign') as Image['valign'],
      height: attr(node, 'height') === undefined ? undefined : Number(attr(node, 'height')),
      width: attr(node, 'width') === undefined ? undefined : Number(attr(node, 'width')),
      ...PositionAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(i: Image): XmlElement {
    return el('image', [], {
      source: i.source,
      type: i.type,
      ...PositionAttrs.attrs(i),
      halign: i.halign,
      valign: i.valign,
      height: i.height,
      width: i.width,
      id: i.id,
    });
  }
}

/**
 * The principal-voice type represents principal and secondary voices in a score, either for analysis or for square bracket symbols that appear in a score. The element content is used for analysis and may be any text value. The symbol attribute indicates the type of symbol used. When used for analysis separate from any printed score markings, it should be set to none. Otherwise if the type is stop it should be set to plain.
 * @see musicxml.xsd "principal-voice".
 */
export class PrincipalVoice extends PrintStyleAlignFieldBag implements PrincipalVoiceShape {
  type: StartStop = StartStop.Start;
  symbol: 'Hauptstimme' | 'Nebenstimme' | 'plain' | 'none' = 'none';
  value?: string;
  id?: string;
  constructor(init?: Partial<PrincipalVoice>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(node: XmlElement): PrincipalVoice {
    return new PrincipalVoice({
      type: asEnum(StartStop, attr(node, 'type')) ?? StartStop.Start,
      symbol: (attr(node, 'symbol') as PrincipalVoice['symbol']) ?? 'none',
      value: elementText(node) || undefined,
      ...PrintStyleAlignAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(p: PrincipalVoice): XmlElement {
    return el('principal-voice', p.value ? [{ '#text': p.value }] : [], {
      type: p.type,
      symbol: p.symbol,
      ...PrintStyleAlignAttrs.attrs(p),
      id: p.id,
    });
  }
}

/** Percussion choice sub-elements, by tag. Each is `value` text + optional smufl. */
const PERCUSSION_VALUE_TAGS: ReadonlyArray<[keyof PercussionShape, string]> = [
  ['glass', 'glass'],
  ['metal', 'metal'],
  ['wood', 'wood'],
  ['pitched', 'pitched'],
  ['membrane', 'membrane'],
  ['effect', 'effect'],
  ['otherPercussion', 'other-percussion'],
];

/**
 * The percussion element is used to define percussion pictogram symbols. Definitions for these symbols can be found in Kurt Stone's "Music Notation in the Twentieth Century" on pages 206-212 and 223. Some values are added to these based on how usage has evolved in the 30 years since Stone's book was published.
 * @see musicxml.xsd "percussion".
 */
export class Percussion extends PrintStyleAlignFieldBag implements PercussionShape {
  enclosure?: EnclosureShape;
  glass?: { value: string; smufl?: string };
  metal?: { value: string; smufl?: string };
  wood?: { value: string; smufl?: string };
  pitched?: { value: string; smufl?: string };
  membrane?: { value: string; smufl?: string };
  effect?: { value: string; smufl?: string };
  timpani?: { smufl?: string };
  beater?: { value: string; tip?: TipDirection };
  stick?: { stickType: string; stickMaterial?: string; tip?: TipDirection; parentheses?: YesNo; dashedCircle?: YesNo };
  stickLocation?: { value: string };
  otherPercussion?: { value: string; smufl?: string };
  id?: string;
  constructor(init?: Partial<Percussion>) { super(); if (init) Object.assign(this, init); }

  static fromXmlElement(node: XmlElement): Percussion {
    const p = new Percussion({ enclosure: asEnum(EnclosureShape, attr(node, 'enclosure')), ...PrintStyleAlignAttrs.read(node), id: attr(node, 'id') });
    for (const [field, tag] of PERCUSSION_VALUE_TAGS) {
      const c = childrenOf(node, tag)[0];
      if (c) (p as Record<string, unknown>)[field] = { value: elementText(c) ?? '', smufl: attr(c, 'smufl') };
    }
    const timpani = childrenOf(node, 'timpani')[0];
    if (timpani) p.timpani = { smufl: attr(timpani, 'smufl') };
    const beater = childrenOf(node, 'beater')[0];
    if (beater) p.beater = { value: elementText(beater) ?? '', tip: asEnum(TipDirection, attr(beater, 'tip')) };
    const stick = childrenOf(node, 'stick')[0];
    if (stick) {
      p.stick = {
        stickType: textOf(stick, 'stick-type') ?? '',
        stickMaterial: textOf(stick, 'stick-material'),
        tip: asEnum(TipDirection, attr(stick, 'tip')),
        parentheses: attr(stick, 'parentheses') as YesNo | undefined,
        dashedCircle: attr(stick, 'dashed-circle') as YesNo | undefined,
      };
    }
    const stickLocation = childrenOf(node, 'stick-location')[0];
    if (stickLocation) p.stickLocation = { value: elementText(stickLocation) ?? '' };
    return p;
  }

  static toXmlElement(p: Percussion): XmlElement {
    const c: XmlElement[] = [];
    const valEl = (v: { value: string; smufl?: string } | undefined, tag: string) => {
      if (v) c.push(el(tag, v.value ? [{ '#text': v.value }] : [], { smufl: v.smufl }));
    };
    valEl(p.glass, 'glass');
    valEl(p.metal, 'metal');
    valEl(p.wood, 'wood');
    valEl(p.pitched, 'pitched');
    valEl(p.membrane, 'membrane');
    valEl(p.effect, 'effect');
    if (p.timpani) c.push(el('timpani', [], { smufl: p.timpani.smufl }));
    if (p.beater) c.push(el('beater', p.beater.value ? [{ '#text': p.beater.value }] : [], { tip: p.beater.tip }));
    if (p.stick) {
      const sc: XmlElement[] = [textEl('stick-type', p.stick.stickType)];
      if (p.stick.stickMaterial !== undefined) sc.push(textEl('stick-material', p.stick.stickMaterial));
      c.push(el('stick', sc, { tip: p.stick.tip, parentheses: p.stick.parentheses, 'dashed-circle': p.stick.dashedCircle }));
    }
    if (p.stickLocation) c.push(el('stick-location', p.stickLocation.value ? [{ '#text': p.stickLocation.value }] : []));
    if (p.otherPercussion) c.push(el('other-percussion', p.otherPercussion.value ? [{ '#text': p.otherPercussion.value }] : [], { smufl: p.otherPercussion.smufl }));
    return el('percussion', c, { enclosure: p.enclosure, ...PrintStyleAlignAttrs.attrs(p), id: p.id });
  }
}
