/**
 * Common note leaf elements: stem, beam, type, tie, time-modification.
 * @see musicxml.xsd "stem", "beam", "note-type", "tie", "time-modification"
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import {
  Fan,
  NoteTypeValue,
  StartStop,
  StemValue,
  SymbolSize,
  type BeamLevel,
  type BeamValue,
  type YesNo,
} from '../enums';
import type { TimeOnly } from '../common';
import { asEnum, ColorAttrs, PositionAttrs } from '../common/attribute-groups';
import type { Beam as BeamShape, NoteType as NoteTypeShape, Stem as StemShape, Tie as TieShape, TimeModification as TimeModificationShape } from '../note';

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

/** Stems can be down, up, none, or double. For down and up stems, the position attributes can be used to specify stem length. The relative values specify the end of the stem relative to the program default. Default values specify an absolute end stem position. Negative values of relative-y that would flip a stem instead of shortening it are ignored. A stem element associated with a rest refers to a stemlet. */
export class Stem implements StemShape {
  value: StemValue = StemValue.Up;
  defaultX?: number;
  defaultY?: number;
  relativeX?: number;
  relativeY?: number;
  color?: string;

  constructor(init?: Partial<Stem>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Stem {
    return new Stem({
      value: asEnum(StemValue, elementText(node)) ?? StemValue.Up,
      ...PositionAttrs.read(node),
      ...ColorAttrs.read(node),
    });
  }

  static toXmlElement(s: Stem): XmlElement {
    return el('stem', [{ '#text': s.value }], { ...PositionAttrs.attrs(s), ...ColorAttrs.attrs(s) });
  }
}

/** Beam values include begin, continue, end, forward hook, and backward hook. Up to eight concurrent beams are available to cover up to 1024th notes. Each beam in a note is represented with a separate beam element, starting with the eighth note beam using a number attribute of 1. Note that the beam number does not distinguish sets of beams that overlap, as it does for slur and other elements. Beaming groups are distinguished by being in different voices and/or the presence or absence of grace and cue elements. Beams that have a begin value can also have a fan attribute to indicate accelerandos and ritardandos using fanned beams. The fan attribute may also be used with a continue value if the fanning direction changes on that note. The value is "none" if not specified. The repeater attribute has been deprecated in MusicXML 3.0. Formerly used for tremolos, it needs to be specified with a "yes" value for each beam using it. */
export class Beam implements BeamShape {
  value: BeamValue = 'begin' as BeamValue;
  number?: BeamLevel;
  repeater?: YesNo;
  fan?: Fan;
  color?: string;

  constructor(init?: Partial<Beam>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Beam {
    const num = attr(node, 'number');
    return new Beam({
      value: (elementText(node) ?? 'begin') as BeamValue,
      number: num === undefined ? undefined : (Number(num) as BeamLevel),
      repeater: attr(node, 'repeater') as YesNo | undefined,
      fan: asEnum(Fan, attr(node, 'fan')),
      ...ColorAttrs.read(node),
    });
  }

  static toXmlElement(b: Beam): XmlElement {
    return el('beam', [{ '#text': b.value }], { number: b.number, repeater: b.repeater, fan: b.fan, ...ColorAttrs.attrs(b) });
  }
}

/** The note-type type indicates the graphic note type. Values range from 1024th to maxima. The size attribute indicates full, cue, grace-cue, or large size. The default is full for regular notes, grace-cue for notes that contain both grace and cue elements, and cue for notes that contain either a cue or a grace element, but not both. */
export class NoteType implements NoteTypeShape {
  value: NoteTypeValue = NoteTypeValue.Quarter;
  size?: SymbolSize;

  constructor(init?: Partial<NoteType>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): NoteType {
    return new NoteType({
      value: asEnum(NoteTypeValue, elementText(node)) ?? NoteTypeValue.Quarter,
      size: asEnum(SymbolSize, attr(node, 'size')),
    });
  }

  static toXmlElement(t: NoteType): XmlElement {
    return el('type', [{ '#text': t.value }], { size: t.size });
  }
}

/** The tie element indicates that a tie begins or ends with this note. If the tie element applies only particular times through a repeat, the time-only attribute indicates which times to apply it. The tie element indicates sound; the tied element indicates notation. */
export class Tie implements TieShape {
  type: StartStop = StartStop.Start;
  timeOnly?: TimeOnly;

  constructor(init?: Partial<Tie>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Tie {
    return new Tie({
      type: asEnum(StartStop, attr(node, 'type')) ?? StartStop.Start,
      timeOnly: attr(node, 'time-only'),
    });
  }

  static toXmlElement(t: Tie): XmlElement {
    return el('tie', [], { type: t.type, 'time-only': t.timeOnly });
  }
}

/** Time modification indicates tuplets, double-note tremolos, and other durational changes. A time-modification element shows how the cumulative, sounding effect of tuplets and double-note tremolos compare to the written note type represented by the type and dot elements. Nested tuplets and other notations that use more detailed information need both the time-modification and tuplet elements to be represented accurately. */
export class TimeModification implements TimeModificationShape {
  actualNotes = 0;
  normalNotes = 0;
  normalType?: NoteTypeValue;
  normalDots?: number;

  constructor(init?: Partial<TimeModification>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): TimeModification {
    return new TimeModification({
      actualNotes: numText(node, 'actual-notes') ?? 0,
      normalNotes: numText(node, 'normal-notes') ?? 0,
      normalType: asEnum(NoteTypeValue, textOf(node, 'normal-type')),
      normalDots: childrenOf(node, 'normal-dot').length || undefined,
    });
  }

  static toXmlElement(tm: TimeModification): XmlElement {
    const c: XmlElement[] = [textEl('actual-notes', tm.actualNotes), textEl('normal-notes', tm.normalNotes)];
    if (tm.normalType !== undefined) c.push(textEl('normal-type', tm.normalType));
    for (let i = 0; i < (tm.normalDots ?? 0); i++) c.push(el('normal-dot', []));
    return el('time-modification', c);
  }
}
