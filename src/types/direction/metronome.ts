/**
 * Metronome — both the standard beat-unit form and the complex
 * metronome-note / metronome-relation form.
 * @see musicxml.xsd "metronome"
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import { LeftCenterRight } from '../enums';
import type { Color, Font, Tenths } from '../common';
import type { StartStop, Valign, YesNo } from '../enums';
import { asEnum, FontAttrs, PrintStyleAlignAttrs } from '../common/attribute-groups';
import type {
  BeatUnitTied as BeatUnitTiedShape,
  Metronome as MetronomeShape,
  MetronomeNote,
  PerMinute as PerMinuteShape,
} from '../direction';

function numAttr(node: XmlElement, name: string): number | undefined {
  const v = attr(node, name);
  return v === undefined ? undefined : Number(v);
}

/** Parse a `<metronome-note>` into the model. */
function metronomeNoteFrom(n: XmlElement): MetronomeNote {
  const tied = childrenOf(n, 'metronome-tied')[0];
  const tuplet = childrenOf(n, 'metronome-tuplet')[0];
  return {
    metronomeType: textOf(n, 'metronome-type') ?? 'quarter',
    metronomeDots: childrenOf(n, 'metronome-dot').length || undefined,
    metronomeBeams: childrenOf(n, 'metronome-beam').length
      ? childrenOf(n, 'metronome-beam').map((b) => ({ number: numAttr(b, 'number'), value: elementText(b) ?? '' }))
      : undefined,
    metronomeTied: tied ? { type: (attr(tied, 'type') ?? 'start') as StartStop } : undefined,
    metronomeTuplet: tuplet
      ? {
          type: (attr(tuplet, 'type') ?? 'start') as StartStop,
          bracket: attr(tuplet, 'bracket') as YesNo | undefined,
          showNumber: attr(tuplet, 'show-number') as 'actual' | 'both' | 'none' | undefined,
          actualNotes: Number(textOf(tuplet, 'actual-notes') ?? 0),
          normalNotes: Number(textOf(tuplet, 'normal-notes') ?? 0),
          normalType: textOf(tuplet, 'normal-type'),
          normalDots: childrenOf(tuplet, 'normal-dot').length || undefined,
        }
      : undefined,
  };
}

/** Serialize a `<metronome-note>` model item. */
function metronomeNoteTo(mn: MetronomeNote): XmlElement {
  const c: XmlElement[] = [textEl('metronome-type', mn.metronomeType)];
  for (let i = 0; i < (mn.metronomeDots ?? 0); i++) c.push(el('metronome-dot', []));
  for (const b of mn.metronomeBeams ?? []) c.push(el('metronome-beam', b.value ? [{ '#text': b.value }] : [], { number: b.number }));
  if (mn.metronomeTied) c.push(el('metronome-tied', [], { type: mn.metronomeTied.type }));
  if (mn.metronomeTuplet) {
    const t = mn.metronomeTuplet;
    const tc: XmlElement[] = [textEl('actual-notes', t.actualNotes), textEl('normal-notes', t.normalNotes)];
    if (t.normalType !== undefined) tc.push(textEl('normal-type', t.normalType));
    for (let i = 0; i < (t.normalDots ?? 0); i++) tc.push(el('normal-dot', []));
    c.push(el('metronome-tuplet', tc, { type: t.type, bracket: t.bracket, 'show-number': t.showNumber }));
  }
  return el('metronome-note', c);
}

/**
 * The per-minute type can be a number, or a text description including numbers. If a font is specified, it overrides the font specified for the overall metronome element. This allows separate specification of a music font for the beat-unit and a text font for the numeric value, in cases where a single metronome font is not used.
 * @see musicxml.xsd "per-minute".
 */
export class PerMinute implements PerMinuteShape {
  value = '';
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  constructor(init?: Partial<PerMinute>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): PerMinute {
    return new PerMinute({ value: elementText(node) ?? '', ...FontAttrs.read(node) });
  }
  static toXmlElement(p: PerMinute): XmlElement {
    return el('per-minute', p.value ? [{ '#text': p.value }] : [], { ...FontAttrs.attrs(p) });
  }
}

function beatUnitTiedChildren(beatUnit: string, dots: number | undefined): XmlElement[] {
  const c: XmlElement[] = [textEl('beat-unit', beatUnit)];
  for (let i = 0; i < (dots ?? 0); i++) c.push(el('beat-unit-dot', []));
  return c;
}

/** @see musicxml.xsd "beat-unit-tied" — a tied beat-unit (beat-unit + beat-unit-dot*). */
function beatUnitTiedFrom(n: XmlElement): BeatUnitTiedShape {
  return { beatUnit: textOf(n, 'beat-unit') ?? 'quarter', beatUnitDots: childrenOf(n, 'beat-unit-dot').length || undefined };
}
function beatUnitTiedTo(t: BeatUnitTiedShape): XmlElement {
  return el('beat-unit-tied', beatUnitTiedChildren(t.beatUnit, t.beatUnitDots));
}

/**
 * The metronome type represents metronome marks and other metric relationships. The beat-unit group and per-minute element specify regular metronome marks. The metronome-note and metronome-relation elements allow for the specification of metric modulations and other metric relationships, such as swing tempo marks where two eighths are equated to a quarter note / eighth note triplet. Tied notes can be represented in both types of metronome marks by using the beat-unit-tied and metronome-tied elements. The parentheses attribute indicates whether or not to put the metronome mark in parentheses; its value is no if not specified. The print-object attribute is set to no in cases where the metronome element represents a relationship or range that is not displayed in the music notation.
 * @see musicxml.xsd "metronome".
 */
export class Metronome implements MetronomeShape {
  parentheses?: YesNo;
  justify?: LeftCenterRight;
  beatUnit?: string;
  beatUnitDots?: number;
  beatUnitTied?: BeatUnitTiedShape[];
  perMinute?: PerMinute;
  beatUnit2?: string;
  beatUnit2Dots?: number;
  beatUnit2Tied?: BeatUnitTiedShape[];
  // Complex (metronome-note) form.
  metronomeArrows?: boolean;
  metronomeNotes?: MetronomeNote[];
  metronomeRelation?: string;
  printObject?: YesNo;
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
  constructor(init?: Partial<Metronome>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Metronome {
    const beatUnits = childrenOf(node, 'beat-unit');
    const perMinute = childrenOf(node, 'per-minute')[0];
    const dots = childrenOf(node, 'beat-unit-dot').length || undefined;
    return new Metronome({
      parentheses: attr(node, 'parentheses') as YesNo | undefined,
      justify: asEnum(LeftCenterRight, attr(node, 'justify')),
      beatUnit: beatUnits[0] ? elementText(beatUnits[0]) : undefined,
      beatUnitDots: beatUnits[0] ? dots : undefined,
      beatUnitTied: childrenOf(node, 'beat-unit-tied').length ? childrenOf(node, 'beat-unit-tied').map(beatUnitTiedFrom) : undefined,
      perMinute: perMinute ? PerMinute.fromXmlElement(perMinute) : undefined,
      beatUnit2: beatUnits[1] ? elementText(beatUnits[1]) : undefined,
      metronomeArrows: childrenOf(node, 'metronome-arrows').length ? true : undefined,
      metronomeNotes: childrenOf(node, 'metronome-note').length ? childrenOf(node, 'metronome-note').map(metronomeNoteFrom) : undefined,
      metronomeRelation: textOf(node, 'metronome-relation'),
      printObject: attr(node, 'print-object') as YesNo | undefined,
      ...PrintStyleAlignAttrs.read(node),
      id: attr(node, 'id'),
    });
  }

  static toXmlElement(m: Metronome): XmlElement {
    const c: XmlElement[] = [];
    if (m.metronomeNotes && m.metronomeNotes.length) {
      // Complex form: metronome-arrows?, metronome-note+, (metronome-relation, metronome-note+)?
      if (m.metronomeArrows) c.push(el('metronome-arrows', []));
      for (const mn of m.metronomeNotes) c.push(metronomeNoteTo(mn));
      if (m.metronomeRelation !== undefined) c.push(textEl('metronome-relation', m.metronomeRelation));
    } else {
      if (m.beatUnit !== undefined) c.push(...beatUnitTiedChildren(m.beatUnit, m.beatUnitDots));
      for (const t of m.beatUnitTied ?? []) c.push(beatUnitTiedTo(t));
      if (m.perMinute) c.push(PerMinute.toXmlElement(m.perMinute));
      else if (m.beatUnit2 !== undefined) c.push(...beatUnitTiedChildren(m.beatUnit2, m.beatUnit2Dots));
    }
    return el('metronome', c, {
      parentheses: m.parentheses,
      justify: m.justify,
      'print-object': m.printObject,
      ...PrintStyleAlignAttrs.attrs(m),
      id: m.id,
    });
  }
}
