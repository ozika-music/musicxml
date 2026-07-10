/**
 * Direction-type leaf elements (common subset).
 * @see musicxml.xsd "words", "symbol", "rehearsal", "wedge", "dashes",
 *      "bracket", "pedal", "octave-shift", "string-mute", "staff-divide",
 *      "other-direction", "accordion-registration", "empty-print-style-align-id"
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import { OctaveShiftType, PedalType, StartStopContinue, WedgeType } from '../enums';
import type { LineType, NumberLevel, YesNo } from '../enums';
import type { Color, SmuflGlyphName, Tenths } from '../common';
import {
  asEnum,
  ColorAttrs,
  DashedFormattingAttrs,
  LineTypeAttrs,
  PositionAttrs,
  PrintStyleAlignAttrs,
  PrintStyleAttrs,
  TextFormattingAttrs,
} from '../common/attribute-groups';
import { PositionFieldBag, PrintStyleAlignFieldBag, PrintStyleFieldBag, TextFormattingFieldBag } from '../common/field-bags';
import type { EmptyPrintStyleAlignId } from '../common';
import type {
  AccordionRegistration as AccordionRegistrationShape,
  Bracket as BracketShape,
  Dashes as DashesShape,
  OctaveShift as OctaveShiftShape,
  OtherDirection as OtherDirectionShape,
  Pedal as PedalShape,
  Rehearsal as RehearsalShape,
  StaffDivide as StaffDivideShape,
  StringMute as StringMuteShape,
  Symbol as SymbolShape,
  Wedge as WedgeShape,
  Words as WordsShape,
} from '../direction';

function numAttr(node: XmlElement, name: string): number | undefined {
  const v = attr(node, name);
  return v === undefined ? undefined : Number(v);
}

/**
 * The formatted-text type represents a text element with text-formatting attributes.
 * @see musicxml.xsd "formatted-text" (words).
 */
export class Words extends TextFormattingFieldBag implements WordsShape {
  value = '';
  id?: string;
  constructor(init?: Partial<Words>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Words {
    return new Words({ value: elementText(node) ?? '', ...TextFormattingAttrs.read(node), id: attr(node, 'id') });
  }
  static toXmlElement(w: Words): XmlElement {
    return el('words', w.value ? [{ '#text': w.value }] : [], { ...TextFormattingAttrs.attrs(w), id: w.id });
  }
}

/**
 * The formatted-text type represents a text element with text-formatting attributes.
 * @see musicxml.xsd "formatted-text" (rehearsal).
 */
export class Rehearsal extends TextFormattingFieldBag implements RehearsalShape {
  value = '';
  id?: string;
  constructor(init?: Partial<Rehearsal>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Rehearsal {
    return new Rehearsal({ value: elementText(node) ?? '', ...TextFormattingAttrs.read(node), id: attr(node, 'id') });
  }
  static toXmlElement(r: Rehearsal): XmlElement {
    return el('rehearsal', r.value ? [{ '#text': r.value }] : [], { ...TextFormattingAttrs.attrs(r), id: r.id });
  }
}

/**
 * The formatted-symbol type represents a SMuFL musical symbol element with formatting attributes.
 * @see musicxml.xsd "formatted-symbol" (symbol).
 */
export class Symbol extends TextFormattingFieldBag implements SymbolShape {
  value = '';
  id?: string;
  constructor(init?: Partial<Symbol>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Symbol {
    return new Symbol({ value: elementText(node) ?? '', ...TextFormattingAttrs.read(node), id: attr(node, 'id') });
  }
  static toXmlElement(s: Symbol): XmlElement {
    return el('symbol', s.value ? [{ '#text': s.value }] : [], { ...TextFormattingAttrs.attrs(s), id: s.id });
  }
}

/**
 * The wedge type represents crescendo and diminuendo wedge symbols. The type attribute is crescendo for the start of a wedge that is closed at the left side, and diminuendo for the start of a wedge that is closed on the right side. Spread values are measured in tenths; those at the start of a crescendo wedge or end of a diminuendo wedge are ignored. The niente attribute is yes if a circle appears at the point of the wedge, indicating a crescendo from nothing or diminuendo to nothing. It is no by default, and used only when the type is crescendo, or the type is stop for a wedge that began with a diminuendo type. The line-type is solid if not specified.
 * @see musicxml.xsd "wedge".
 */
export class Wedge extends PositionFieldBag implements WedgeShape {
  type: WedgeType = WedgeType.Crescendo;
  number?: NumberLevel;
  spread?: Tenths;
  niente?: YesNo;
  lineType?: LineType;
  dashLength?: Tenths;
  spaceLength?: Tenths;
  color?: Color;
  id?: string;
  constructor(init?: Partial<Wedge>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Wedge {
    return new Wedge({
      type: asEnum(WedgeType, attr(node, 'type')) ?? WedgeType.Crescendo,
      number: numAttr(node, 'number') as NumberLevel | undefined,
      spread: numAttr(node, 'spread'),
      niente: attr(node, 'niente') as YesNo | undefined,
      ...PositionAttrs.read(node),
      ...ColorAttrs.read(node),
      ...LineTypeAttrs.read(node),
      ...DashedFormattingAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(w: Wedge): XmlElement {
    return el('wedge', [], {
      type: w.type,
      number: w.number,
      spread: w.spread,
      niente: w.niente,
      ...PositionAttrs.attrs(w),
      ...ColorAttrs.attrs(w),
      ...LineTypeAttrs.attrs(w),
      ...DashedFormattingAttrs.attrs(w),
      id: w.id,
    });
  }
}

/**
 * The dashes type represents dashes, used for instance with cresc. and dim. marks.
 * @see musicxml.xsd "dashes".
 */
export class Dashes extends PositionFieldBag implements DashesShape {
  type: StartStopContinue = StartStopContinue.Start;
  number?: NumberLevel;
  dashLength?: Tenths;
  spaceLength?: Tenths;
  color?: Color;
  id?: string;
  constructor(init?: Partial<Dashes>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Dashes {
    return new Dashes({
      type: asEnum(StartStopContinue, attr(node, 'type')) ?? StartStopContinue.Start,
      number: numAttr(node, 'number') as NumberLevel | undefined,
      ...PositionAttrs.read(node),
      ...ColorAttrs.read(node),
      ...DashedFormattingAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(d: Dashes): XmlElement {
    return el('dashes', [], {
      type: d.type,
      number: d.number,
      ...PositionAttrs.attrs(d),
      ...ColorAttrs.attrs(d),
      ...DashedFormattingAttrs.attrs(d),
      id: d.id,
    });
  }
}

/**
 * Brackets are combined with words in a variety of modern directions. The line-end attribute specifies if there is a jog up or down (or both), an arrow, or nothing at the start or end of the bracket. If the line-end is up or down, the length of the jog can be specified using the end-length attribute. The line-type is solid if not specified.
 * @see musicxml.xsd "bracket".
 */
export class Bracket extends PositionFieldBag implements BracketShape {
  type: StartStopContinue = StartStopContinue.Start;
  number?: NumberLevel;
  lineEnd: 'up' | 'down' | 'both' | 'arrow' | 'none' = 'none';
  endLength?: Tenths;
  lineType?: LineType;
  dashLength?: Tenths;
  spaceLength?: Tenths;
  color?: Color;
  id?: string;
  constructor(init?: Partial<Bracket>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Bracket {
    return new Bracket({
      type: asEnum(StartStopContinue, attr(node, 'type')) ?? StartStopContinue.Start,
      number: numAttr(node, 'number') as NumberLevel | undefined,
      lineEnd: (attr(node, 'line-end') as Bracket['lineEnd']) ?? 'none',
      endLength: numAttr(node, 'end-length'),
      ...PositionAttrs.read(node),
      ...ColorAttrs.read(node),
      ...LineTypeAttrs.read(node),
      ...DashedFormattingAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(b: Bracket): XmlElement {
    return el('bracket', [], {
      type: b.type,
      number: b.number,
      'line-end': b.lineEnd,
      'end-length': b.endLength,
      ...PositionAttrs.attrs(b),
      ...ColorAttrs.attrs(b),
      ...LineTypeAttrs.attrs(b),
      ...DashedFormattingAttrs.attrs(b),
      id: b.id,
    });
  }
}

/**
 * The pedal type represents piano pedal marks, including damper and sostenuto pedal marks. The line attribute is yes if pedal lines are used. The sign attribute is yes if Ped, Sost, and * signs are used. For compatibility with older versions, the sign attribute is yes by default if the line attribute is no, and is no by default if the line attribute is yes. If the sign attribute is set to yes and the type is start or sostenuto, the abbreviated attribute is yes if the short P and S signs are used, and no if the full Ped and Sost signs are used. It is no by default. Otherwise the abbreviated attribute is ignored. The alignment attributes are ignored if the sign attribute is no.
 * @see musicxml.xsd "pedal".
 */
export class Pedal extends PrintStyleAlignFieldBag implements PedalShape {
  type: PedalType = PedalType.Start;
  number?: NumberLevel;
  line?: YesNo;
  sign?: YesNo;
  abbreviated?: YesNo;
  id?: string;
  constructor(init?: Partial<Pedal>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Pedal {
    return new Pedal({
      type: asEnum(PedalType, attr(node, 'type')) ?? PedalType.Start,
      number: numAttr(node, 'number') as NumberLevel | undefined,
      line: attr(node, 'line') as YesNo | undefined,
      sign: attr(node, 'sign') as YesNo | undefined,
      abbreviated: attr(node, 'abbreviated') as YesNo | undefined,
      ...PrintStyleAlignAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(p: Pedal): XmlElement {
    return el('pedal', [], {
      type: p.type,
      number: p.number,
      line: p.line,
      sign: p.sign,
      abbreviated: p.abbreviated,
      ...PrintStyleAlignAttrs.attrs(p),
      id: p.id,
    });
  }
}

/**
 * The octave shift type indicates where notes are shifted up or down from their true pitched values because of printing difficulty. Thus a treble clef line noted with 8va will be indicated with an octave-shift down from the pitch data indicated in the notes. A size of 8 indicates one octave; a size of 15 indicates two octaves.
 * @see musicxml.xsd "octave-shift".
 */
export class OctaveShift extends PrintStyleFieldBag implements OctaveShiftShape {
  type: OctaveShiftType = OctaveShiftType.Up;
  number?: NumberLevel;
  size?: number;
  dashLength?: Tenths;
  spaceLength?: Tenths;
  id?: string;
  constructor(init?: Partial<OctaveShift>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): OctaveShift {
    return new OctaveShift({
      type: asEnum(OctaveShiftType, attr(node, 'type')) ?? OctaveShiftType.Up,
      number: numAttr(node, 'number') as NumberLevel | undefined,
      size: numAttr(node, 'size'),
      ...PrintStyleAttrs.read(node),
      ...DashedFormattingAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(o: OctaveShift): XmlElement {
    return el('octave-shift', [], {
      type: o.type,
      number: o.number,
      size: o.size,
      ...PrintStyleAttrs.attrs(o),
      ...DashedFormattingAttrs.attrs(o),
      id: o.id,
    });
  }
}

/**
 * The string-mute type represents string mute on and mute off symbols.
 * @see musicxml.xsd "string-mute".
 */
export class StringMute extends PrintStyleAlignFieldBag implements StringMuteShape {
  type: 'on' | 'off' = 'on';
  id?: string;
  constructor(init?: Partial<StringMute>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): StringMute {
    return new StringMute({ type: (attr(node, 'type') as 'on' | 'off') ?? 'on', ...PrintStyleAlignAttrs.read(node), id: attr(node, 'id') });
  }
  static toXmlElement(s: StringMute): XmlElement {
    return el('string-mute', [], { type: s.type, ...PrintStyleAlignAttrs.attrs(s), id: s.id });
  }
}

/**
 * The staff-divide element represents the staff division arrow symbols found at SMuFL code points U+E00B, U+E00C, and U+E00D.
 * @see musicxml.xsd "staff-divide".
 */
export class StaffDivide extends PrintStyleAlignFieldBag implements StaffDivideShape {
  type: 'down' | 'up' | 'up-down' = 'down';
  id?: string;
  constructor(init?: Partial<StaffDivide>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): StaffDivide {
    return new StaffDivide({ type: (attr(node, 'type') as StaffDivide['type']) ?? 'down', ...PrintStyleAlignAttrs.read(node), id: attr(node, 'id') });
  }
  static toXmlElement(s: StaffDivide): XmlElement {
    return el('staff-divide', [], { type: s.type, ...PrintStyleAlignAttrs.attrs(s), id: s.id });
  }
}

/**
 * The other-direction type is used to define any direction symbols not yet in the MusicXML format. The smufl attribute can be used to specify a particular direction symbol, allowing application interoperability without requiring every SMuFL glyph to have a MusicXML element equivalent. Using the other-direction type without the smufl attribute allows for extended representation, though without application interoperability.
 * @see musicxml.xsd "other-direction".
 */
export class OtherDirection extends PrintStyleAlignFieldBag implements OtherDirectionShape {
  value = '';
  smufl?: SmuflGlyphName;
  id?: string;
  constructor(init?: Partial<OtherDirection>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): OtherDirection {
    return new OtherDirection({ value: elementText(node) ?? '', smufl: attr(node, 'smufl'), ...PrintStyleAlignAttrs.read(node), id: attr(node, 'id') });
  }
  static toXmlElement(o: OtherDirection): XmlElement {
    return el('other-direction', o.value ? [{ '#text': o.value }] : [], { smufl: o.smufl, ...PrintStyleAlignAttrs.attrs(o), id: o.id });
  }
}

/**
 * The accordion-registration type is used for accordion registration symbols. These are circular symbols divided horizontally into high, middle, and low sections that correspond to 4', 8', and 16' pipes. Each accordion-high, accordion-middle, and accordion-low element represents the presence of one or more dots in the registration diagram. An accordion-registration element needs to have at least one of the child elements present.
 * @see musicxml.xsd "accordion-registration".
 */
export class AccordionRegistration extends PrintStyleAlignFieldBag implements AccordionRegistrationShape {
  accordionHigh?: boolean;
  accordionMiddle?: number;
  accordionLow?: boolean;
  id?: string;
  constructor(init?: Partial<AccordionRegistration>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): AccordionRegistration {
    const mid = textOf(node, 'accordion-middle');
    return new AccordionRegistration({
      accordionHigh: childrenOf(node, 'accordion-high').length > 0 || undefined,
      accordionMiddle: mid === undefined ? undefined : Number(mid),
      accordionLow: childrenOf(node, 'accordion-low').length > 0 || undefined,
      ...PrintStyleAlignAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(a: AccordionRegistration): XmlElement {
    const c: XmlElement[] = [];
    if (a.accordionHigh) c.push(el('accordion-high', []));
    if (a.accordionMiddle !== undefined) c.push(textEl('accordion-middle', a.accordionMiddle));
    if (a.accordionLow) c.push(el('accordion-low', []));
    return el('accordion-registration', c, { ...PrintStyleAlignAttrs.attrs(a), id: a.id });
  }
}

/**
 * The empty-print-style-align-id type represents an empty element with print-style-align and optional-unique-id attribute groups.
 * @see musicxml.xsd "empty-print-style-align-id" (damp / damp-all / eyeglasses).
 */
export class EmptyPrintStyleAlign extends PrintStyleAlignFieldBag implements EmptyPrintStyleAlignId {
  id?: string;
  constructor(init?: Partial<EmptyPrintStyleAlign>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): EmptyPrintStyleAlign {
    return new EmptyPrintStyleAlign({ ...PrintStyleAlignAttrs.read(node), id: attr(node, 'id') });
  }
  static toXmlElement(e: EmptyPrintStyleAlign, tag: string): XmlElement {
    return el(tag, [], { ...PrintStyleAlignAttrs.attrs(e), id: e.id });
  }
}
