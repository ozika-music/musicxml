/**
 * Ornaments container + its leaves.
 * @see musicxml.xsd "ornaments", "trill-mark", "turn", "vertical-turn",
 *      "empty-trill-sound", "wavy-line", "mordent", "tremolo", "other-ornament"
 */

import { attr, childrenOf, el, elementText, type XmlElement } from '../../xml/xml-element';
import { AboveBelow, StartStopContinue, TremoloType } from '../enums';
import type { NumberLevel, YesNo } from '../enums';
import type { Color, Font, SmuflGlyphName, Tenths, TrillSound } from '../common';
import { asEnum, ColorAttrs, PlacementAttrs, PositionAttrs, PrintStyleAttrs, TrillSoundAttrs } from '../common/attribute-groups';
import { AccidentalMark } from './accidental-mark';
import { EmptyPlacement } from './notations-empty';
import type {
  EmptyTrillSound as EmptyTrillSoundShape,
  Mordent as MordentShape,
  Ornaments as OrnamentsShape,
  OtherOrnament as OtherOrnamentShape,
  Tremolo as TremoloShape,
  TrillMark as TrillMarkShape,
  Turn as TurnShape,
  VerticalTurn as VerticalTurnShape,
  WavyLine as WavyLineShape,
} from '../note';

type PrintStylePlacementTrill = {
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
} & TrillSound;

function readPspTrill(node: XmlElement) {
  return { ...PrintStyleAttrs.read(node), ...PlacementAttrs.read(node), ...TrillSoundAttrs.read(node), id: attr(node, 'id') };
}
function pspTrillAttrs(o: PrintStylePlacementTrill) {
  return { ...PrintStyleAttrs.attrs(o), ...PlacementAttrs.attrs(o), ...TrillSoundAttrs.attrs(o), id: o.id };
}

/** Mixin-style field block: print-style + placement + trill-sound. */
class TrillBase {
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
  startNote?: TrillSound['startNote'];
  trillStep?: TrillSound['trillStep'];
  twoNoteTurn?: TrillSound['twoNoteTurn'];
  accelerate?: YesNo;
  beats?: number;
  secondBeat?: number;
  lastBeat?: number;
}

/**
 * The empty-trill-sound type represents an empty element with print-style, placement, and trill-sound attributes.
 * @see musicxml.xsd "empty-trill-sound" (trill-mark, vertical-turn, shake, haydn).
 */
export class TrillMark extends TrillBase implements TrillMarkShape {
  constructor(init?: Partial<TrillMark>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): TrillMark {
    return new TrillMark(readPspTrill(node));
  }
  static toXmlElement(o: TrillMark, tag = 'trill-mark'): XmlElement {
    return el(tag, [], pspTrillAttrs(o));
  }
}

/**
 * The empty-trill-sound type represents an empty element with print-style, placement, and trill-sound attributes.
 * @see musicxml.xsd "empty-trill-sound" — alias class for shake/haydn/vertical-turn.
 */
export class EmptyTrillSound extends TrillBase implements EmptyTrillSoundShape {
  constructor(init?: Partial<EmptyTrillSound>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): EmptyTrillSound {
    return new EmptyTrillSound(readPspTrill(node));
  }
  static toXmlElement(o: EmptyTrillSound, tag: string): XmlElement {
    return el(tag, [], pspTrillAttrs(o));
  }
}

/** @see musicxml.xsd "vertical-turn". */
export class VerticalTurn extends TrillBase implements VerticalTurnShape {
  constructor(init?: Partial<VerticalTurn>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): VerticalTurn {
    return new VerticalTurn(readPspTrill(node));
  }
  static toXmlElement(o: VerticalTurn, tag = 'vertical-turn'): XmlElement {
    return el(tag, [], pspTrillAttrs(o));
  }
}

/**
 * The horizontal-turn type represents turn elements that are horizontal rather than vertical. These are empty elements with print-style, placement, trill-sound, and slash attributes. If the slash attribute is yes, then a vertical line is used to slash the turn. It is no if not specified.
 * @see musicxml.xsd "horizontal-turn" (turn, inverted-turn, delayed-turn, …).
 */
export class Turn extends TrillBase implements TurnShape {
  slash?: YesNo;
  constructor(init?: Partial<Turn>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Turn {
    return new Turn({ slash: attr(node, 'slash') as YesNo | undefined, ...readPspTrill(node) });
  }
  static toXmlElement(o: Turn, tag = 'turn'): XmlElement {
    return el(tag, [], { slash: o.slash, ...pspTrillAttrs(o) });
  }
}

/**
 * The mordent type is used for both represents the mordent sign with the vertical line and the inverted-mordent sign without the line. The long attribute is "no" by default. The approach and departure attributes are used for compound ornaments, indicating how the beginning and ending of the ornament look relative to the main part of the mordent.
 * @see musicxml.xsd "mordent" (mordent, inverted-mordent).
 */
export class Mordent extends TrillBase implements MordentShape {
  long?: YesNo;
  approach?: AboveBelow;
  departure?: AboveBelow;
  constructor(init?: Partial<Mordent>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Mordent {
    return new Mordent({
      long: attr(node, 'long') as YesNo | undefined,
      approach: asEnum(AboveBelow, attr(node, 'approach')),
      departure: asEnum(AboveBelow, attr(node, 'departure')),
      ...readPspTrill(node),
    });
  }
  static toXmlElement(o: Mordent, tag = 'mordent'): XmlElement {
    return el(tag, [], { long: o.long, approach: o.approach, departure: o.departure, ...pspTrillAttrs(o) });
  }
}

/**
 * Wavy lines are one way to indicate trills and vibrato. When used with a barline element, they should always have type="continue" set. The smufl attribute specifies a particular wavy line glyph from the SMuFL Multi-segment lines range.
 * @see musicxml.xsd "wavy-line".
 */
export class WavyLine extends TrillBase implements WavyLineShape {
  type: StartStopContinue = StartStopContinue.Start;
  number?: NumberLevel;
  smufl?: SmuflGlyphName;
  constructor(init?: Partial<WavyLine>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): WavyLine {
    const num = attr(node, 'number');
    return new WavyLine({
      type: asEnum(StartStopContinue, attr(node, 'type')) ?? StartStopContinue.Start,
      number: num === undefined ? undefined : (Number(num) as NumberLevel),
      smufl: attr(node, 'smufl'),
      ...PositionAttrs.read(node),
      ...PlacementAttrs.read(node),
      ...TrillSoundAttrs.read(node),
      ...ColorAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(o: WavyLine): XmlElement {
    return el('wavy-line', [], {
      type: o.type,
      number: o.number,
      smufl: o.smufl,
      ...PositionAttrs.attrs(o),
      ...PlacementAttrs.attrs(o),
      ...TrillSoundAttrs.attrs(o),
      ...ColorAttrs.attrs(o),
      id: o.id,
    });
  }
}

/**
 * The tremolo ornament can be used to indicate single-note, double-note, or unmeasured tremolos. Single-note tremolos use the single type, double-note tremolos use the start and stop types, and unmeasured tremolos use the unmeasured type. The default is "single" for compatibility with Version 1.1. The text of the element indicates the number of tremolo marks and is an integer from 0 to 8. Note that the number of attached beams is not included in this value, but is represented separately using the beam element. The value should be 0 for unmeasured tremolos. When using double-note tremolos, the duration of each note in the tremolo should correspond to half of the notated type value. A time-modification element should also be added with an actual-notes value of 2 and a normal-notes value of 1. If used within a tuplet, this 2/1 ratio should be multiplied by the existing tuplet ratio. The smufl attribute specifies the glyph to use from the SMuFL Tremolos range for an unmeasured tremolo. It is ignored for other tremolo types. The SMuFL buzzRoll glyph is used by default if the attribute is missing. Using repeater beams for indicating tremolos is deprecated as of MusicXML 3.0.
 * @see musicxml.xsd "tremolo".
 */
export class Tremolo implements TremoloShape {
  value = 0;
  type?: TremoloType;
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
  constructor(init?: Partial<Tremolo>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Tremolo {
    return new Tremolo({
      value: Number(elementText(node) ?? 0),
      type: asEnum(TremoloType, attr(node, 'type')),
      smufl: attr(node, 'smufl'),
      ...PrintStyleAttrs.read(node),
      ...PlacementAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(o: Tremolo): XmlElement {
    return el('tremolo', [{ '#text': String(o.value) }], {
      type: o.type,
      smufl: o.smufl,
      ...PrintStyleAttrs.attrs(o),
      ...PlacementAttrs.attrs(o),
      id: o.id,
    });
  }
}

/**
 * The other-placement-text type represents a text element with print-style, placement, and smufl attribute groups. This type is used by MusicXML notation extension elements to allow specification of specific SMuFL glyphs without needed to add every glyph as a MusicXML element.
 * @see musicxml.xsd "other-placement-text" (other-ornament).
 */
export class OtherOrnament implements OtherOrnamentShape {
  value = '';
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
  constructor(init?: Partial<OtherOrnament>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): OtherOrnament {
    return new OtherOrnament({
      value: elementText(node) ?? '',
      smufl: attr(node, 'smufl'),
      ...PrintStyleAttrs.read(node),
      ...PlacementAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(o: OtherOrnament): XmlElement {
    return el('other-ornament', o.value ? [{ '#text': o.value }] : [], {
      smufl: o.smufl,
      ...PrintStyleAttrs.attrs(o),
      ...PlacementAttrs.attrs(o),
      id: o.id,
    });
  }
}

/**
 * Ornaments can be any of several types, followed optionally by accidentals. The accidental-mark element's content is represented the same as an accidental element, but with a different name to reflect the different musical meaning.
 * @see musicxml.xsd "ornaments".
 */
export class Ornaments implements OrnamentsShape {
  trillMark?: TrillMark;
  turn?: Turn;
  delayedTurn?: Turn;
  invertedTurn?: Turn;
  delayedInvertedTurn?: Turn;
  verticalTurn?: VerticalTurn;
  invertedVerticalTurn?: VerticalTurn;
  shake?: EmptyTrillSound;
  wavyLines?: WavyLine[];
  mordent?: Mordent;
  invertedMordent?: Mordent;
  schleifer?: EmptyPlacement;
  tremolo?: Tremolo;
  haydn?: EmptyTrillSound;
  otherOrnament?: OtherOrnament;
  accidentalMarks?: AccidentalMark[];
  id?: string;
  constructor(init?: Partial<Ornaments>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Ornaments {
    const first = (tag: string) => childrenOf(node, tag)[0];
    const o = new Ornaments({ id: attr(node, 'id') });
    if (first('trill-mark')) o.trillMark = TrillMark.fromXmlElement(first('trill-mark'));
    if (first('turn')) o.turn = Turn.fromXmlElement(first('turn'));
    if (first('delayed-turn')) o.delayedTurn = Turn.fromXmlElement(first('delayed-turn'));
    if (first('inverted-turn')) o.invertedTurn = Turn.fromXmlElement(first('inverted-turn'));
    if (first('delayed-inverted-turn')) o.delayedInvertedTurn = Turn.fromXmlElement(first('delayed-inverted-turn'));
    if (first('vertical-turn')) o.verticalTurn = VerticalTurn.fromXmlElement(first('vertical-turn'));
    if (first('inverted-vertical-turn')) o.invertedVerticalTurn = VerticalTurn.fromXmlElement(first('inverted-vertical-turn'));
    if (first('shake')) o.shake = EmptyTrillSound.fromXmlElement(first('shake'));
    const wavy = childrenOf(node, 'wavy-line').map((w) => WavyLine.fromXmlElement(w));
    if (wavy.length) o.wavyLines = wavy;
    if (first('mordent')) o.mordent = Mordent.fromXmlElement(first('mordent'));
    if (first('inverted-mordent')) o.invertedMordent = Mordent.fromXmlElement(first('inverted-mordent'));
    if (first('schleifer')) o.schleifer = EmptyPlacement.fromXmlElement(first('schleifer'));
    if (first('tremolo')) o.tremolo = Tremolo.fromXmlElement(first('tremolo'));
    if (first('haydn')) o.haydn = EmptyTrillSound.fromXmlElement(first('haydn'));
    if (first('other-ornament')) o.otherOrnament = OtherOrnament.fromXmlElement(first('other-ornament'));
    const marks = childrenOf(node, 'accidental-mark').map((m) => AccidentalMark.fromXmlElement(m));
    if (marks.length) o.accidentalMarks = marks;
    return o;
  }

  static toXmlElement(o: Ornaments): XmlElement {
    const c: XmlElement[] = [];
    if (o.trillMark) c.push(TrillMark.toXmlElement(o.trillMark));
    if (o.turn) c.push(Turn.toXmlElement(o.turn, 'turn'));
    if (o.delayedTurn) c.push(Turn.toXmlElement(o.delayedTurn, 'delayed-turn'));
    if (o.invertedTurn) c.push(Turn.toXmlElement(o.invertedTurn, 'inverted-turn'));
    if (o.delayedInvertedTurn) c.push(Turn.toXmlElement(o.delayedInvertedTurn, 'delayed-inverted-turn'));
    if (o.verticalTurn) c.push(VerticalTurn.toXmlElement(o.verticalTurn, 'vertical-turn'));
    if (o.invertedVerticalTurn) c.push(VerticalTurn.toXmlElement(o.invertedVerticalTurn, 'inverted-vertical-turn'));
    if (o.shake) c.push(EmptyTrillSound.toXmlElement(o.shake, 'shake'));
    for (const w of o.wavyLines ?? []) c.push(WavyLine.toXmlElement(w));
    if (o.mordent) c.push(Mordent.toXmlElement(o.mordent, 'mordent'));
    if (o.invertedMordent) c.push(Mordent.toXmlElement(o.invertedMordent, 'inverted-mordent'));
    if (o.schleifer) c.push(EmptyPlacement.toXmlElement(o.schleifer, 'schleifer'));
    if (o.tremolo) c.push(Tremolo.toXmlElement(o.tremolo));
    if (o.haydn) c.push(EmptyTrillSound.toXmlElement(o.haydn, 'haydn'));
    if (o.otherOrnament) c.push(OtherOrnament.toXmlElement(o.otherOrnament));
    for (const m of o.accidentalMarks ?? []) c.push(AccidentalMark.toXmlElement(m));
    return el('ornaments', c, { id: o.id });
  }
}
