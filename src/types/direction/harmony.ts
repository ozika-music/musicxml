/**
 * Harmony + its leaves (root/function/numeral/kind/inversion/bass/degree/frame).
 * @see musicxml.xsd "harmony"
 * Editorial footnote/level are carried but not yet serialized.
 */

import { attr, childrenOf, el, elementText, type XmlElement } from '../../xml/xml-element';
import { DegreeSymbolValue, DegreeTypeValue, HarmonyArrangement, HarmonyType, KindValue } from '../enums';
import type { Color, Editorial, Font, Tenths } from '../common';
import type { AboveBelow, LeftCenterRight, StartStop, Step, YesNo } from '../enums';
import { asEnum, ColorAttrs, FontAttrs, PlacementAttrs, PositionAttrs, PrintStyleAlignAttrs, PrintStyleAttrs } from '../common/attribute-groups';
import { PositionFieldBag, PrintStyleAlignFieldBag, PrintStyleFieldBag } from '../common/field-bags';
import { Fingering } from '../note';
import type {
  Bass as BassShape,
  BassAlter as BassAlterShape,
  BassStep as BassStepShape,
  Barre as BarreShape,
  Degree as DegreeShape,
  DegreeAlter as DegreeAlterShape,
  DegreeType as DegreeTypeElShape,
  DegreeValue as DegreeValueShape,
  FirstFret as FirstFretShape,
  Frame as FrameShape,
  FrameNote as FrameNoteShape,
  FretElement as FretElementShape,
  Function as HarmonyFunctionShape,
  Harmony as HarmonyShape,
  Inversion as InversionShape,
  Kind as KindShape,
  Numeral as NumeralShape,
  NumeralAlter as NumeralAlterShape,
  NumeralKey as NumeralKeyShape,
  NumeralRoot as NumeralRootShape,
  Root as RootShape,
  RootAlter as RootAlterShape,
  RootStep as RootStepShape,
  StringElement as StringElementShape,
} from '../direction';

const numText = (node: XmlElement | undefined): number => Number((node && elementText(node)) ?? 0);
const ynAttr = (node: XmlElement, name: string) => attr(node, name) as YesNo | undefined;

// --- root --------------------------------------------------------------------
/**
 * The root-step type represents the pitch step of the root of the current chord within the harmony element. The text attribute indicates how the root should appear in a score if not using the element contents.
 * @see musicxml.xsd "root-step".
 */
export class RootStep extends PrintStyleFieldBag implements RootStepShape {
  value: Step = 'C' as Step;
  text?: string;
  constructor(init?: Partial<RootStep>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): RootStep {
    return new RootStep({ value: (elementText(n) ?? 'C') as Step, text: attr(n, 'text'), ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: RootStep): XmlElement {
    return el('root-step', [{ '#text': o.value }], { text: o.text, ...PrintStyleAttrs.attrs(o) });
  }
}

/**
 * The harmony-alter type represents the chromatic alteration of the root, numeral, or bass of the current harmony-chord group within the harmony element. In some chord styles, the text of the preceding element may include alteration information. In that case, the print-object attribute of this type can be set to no. The location attribute indicates whether the alteration should appear to the left or the right of the preceding element. Its default value varies by element.
 * @see musicxml.xsd "harmony-alter" (root-alter).
 */
export class RootAlter extends PrintStyleFieldBag implements RootAlterShape {
  value = 0;
  printObject?: YesNo;
  location?: 'left' | 'right';
  constructor(init?: Partial<RootAlter>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): RootAlter {
    return new RootAlter({ value: numText(n), printObject: ynAttr(n, 'print-object'), location: attr(n, 'location') as RootAlter['location'], ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: RootAlter): XmlElement {
    return el('root-alter', [{ '#text': String(o.value) }], { 'print-object': o.printObject, location: o.location, ...PrintStyleAttrs.attrs(o) });
  }
}

/**
 * The root type indicates a pitch like C, D, E vs. a scale degree like 1, 2, 3. It is used with chord symbols in popular music. The root element has a root-step and optional root-alter element similar to the step and alter elements, but renamed to distinguish the different musical meanings.
 * @see musicxml.xsd "root".
 */
export class Root implements RootShape {
  rootStep: RootStep = new RootStep();
  rootAlter?: RootAlter;
  constructor(init?: Partial<Root>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Root {
    const step = childrenOf(n, 'root-step')[0];
    const alter = childrenOf(n, 'root-alter')[0];
    return new Root({ rootStep: step ? RootStep.fromXmlElement(step) : new RootStep(), rootAlter: alter ? RootAlter.fromXmlElement(alter) : undefined });
  }
  static toXmlElement(o: Root): XmlElement {
    const c: XmlElement[] = [RootStep.toXmlElement(o.rootStep)];
    if (o.rootAlter) c.push(RootAlter.toXmlElement(o.rootAlter));
    return el('root', c);
  }
}

/**
 * The style-text type represents a text element with a print-style attribute group.
 * @see musicxml.xsd "style-text" (function).
 */
export class HarmonyFunction extends PrintStyleFieldBag implements HarmonyFunctionShape {
  value = '';
  constructor(init?: Partial<HarmonyFunction>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): HarmonyFunction {
    return new HarmonyFunction({ value: elementText(n) ?? '', ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: HarmonyFunction): XmlElement {
    return el('function', o.value ? [{ '#text': o.value }] : [], { ...PrintStyleAttrs.attrs(o) });
  }
}

// --- numeral -----------------------------------------------------------------
/**
 * The numeral-root type represents the Roman numeral or Nashville number as a positive integer from 1 to 7. The text attribute indicates how the numeral should appear in the score. A numeral-root value of 5 with a kind of major would have a text attribute of "V" if displayed as a Roman numeral, and "5" if displayed as a Nashville number. If the text attribute is not specified, the display is application-dependent.
 * @see musicxml.xsd "numeral-root".
 */
export class NumeralRoot extends PrintStyleFieldBag implements NumeralRootShape {
  value = 0;
  text?: string;
  constructor(init?: Partial<NumeralRoot>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): NumeralRoot {
    return new NumeralRoot({ value: numText(n), text: attr(n, 'text'), ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: NumeralRoot): XmlElement {
    return el('numeral-root', [{ '#text': String(o.value) }], { text: o.text, ...PrintStyleAttrs.attrs(o) });
  }
}

/**
 * The harmony-alter type represents the chromatic alteration of the root, numeral, or bass of the current harmony-chord group within the harmony element. In some chord styles, the text of the preceding element may include alteration information. In that case, the print-object attribute of this type can be set to no. The location attribute indicates whether the alteration should appear to the left or the right of the preceding element. Its default value varies by element.
 * @see musicxml.xsd "harmony-alter" (numeral-alter).
 */
export class NumeralAlter extends PrintStyleFieldBag implements NumeralAlterShape {
  value = 0;
  printObject?: YesNo;
  location?: 'left' | 'right';
  constructor(init?: Partial<NumeralAlter>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): NumeralAlter {
    return new NumeralAlter({ value: numText(n), printObject: ynAttr(n, 'print-object'), location: attr(n, 'location') as NumeralAlter['location'], ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: NumeralAlter): XmlElement {
    return el('numeral-alter', [{ '#text': String(o.value) }], { 'print-object': o.printObject, location: o.location, ...PrintStyleAttrs.attrs(o) });
  }
}

/**
 * The numeral-key type is used when the key for the numeral is different than the key specified by the key signature. The numeral-fifths element specifies the key in the same way as the fifths element. The numeral-mode element specifies the mode similar to the mode element, but with a restricted set of values
 * @see musicxml.xsd "numeral-key".
 */
export class NumeralKey implements NumeralKeyShape {
  numeralFifths = 0;
  numeralMode: 'major' | 'minor' = 'major';
  constructor(init?: Partial<NumeralKey>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): NumeralKey {
    return new NumeralKey({ numeralFifths: numText(childrenOf(n, 'numeral-fifths')[0]), numeralMode: (elementText(childrenOf(n, 'numeral-mode')[0]) ?? 'major') as 'major' | 'minor' });
  }
  static toXmlElement(o: NumeralKey): XmlElement {
    return el('numeral-key', [el('numeral-fifths', [{ '#text': String(o.numeralFifths) }]), el('numeral-mode', [{ '#text': o.numeralMode }])]);
  }
}

/**
 * The numeral type represents the Roman numeral or Nashville number part of a harmony. It requires that the key be specified in the encoding, either with a key or numeral-key element.
 * @see musicxml.xsd "numeral".
 */
export class Numeral implements NumeralShape {
  numeralRoot: NumeralRoot = new NumeralRoot();
  numeralAlter?: NumeralAlter;
  numeralKey?: NumeralKey;
  constructor(init?: Partial<Numeral>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Numeral {
    const r = childrenOf(n, 'numeral-root')[0];
    const a = childrenOf(n, 'numeral-alter')[0];
    const k = childrenOf(n, 'numeral-key')[0];
    return new Numeral({ numeralRoot: r ? NumeralRoot.fromXmlElement(r) : new NumeralRoot(), numeralAlter: a ? NumeralAlter.fromXmlElement(a) : undefined, numeralKey: k ? NumeralKey.fromXmlElement(k) : undefined });
  }
  static toXmlElement(o: Numeral): XmlElement {
    const c: XmlElement[] = [NumeralRoot.toXmlElement(o.numeralRoot)];
    if (o.numeralAlter) c.push(NumeralAlter.toXmlElement(o.numeralAlter));
    if (o.numeralKey) c.push(NumeralKey.toXmlElement(o.numeralKey));
    return el('numeral', c);
  }
}

// --- kind / inversion --------------------------------------------------------
/**
 * Kind indicates the type of chord. Degree elements can then add, subtract, or alter from these starting points The attributes are used to indicate the formatting of the symbol. Since the kind element is the constant in all the harmony-chord groups that can make up a polychord, many formatting attributes are here. The use-symbols attribute is yes if the kind should be represented when possible with harmony symbols rather than letters and numbers. These symbols include: major: a triangle, like Unicode 25B3 minor: -, like Unicode 002D augmented: +, like Unicode 002B diminished: °, like Unicode 00B0 half-diminished: ø, like Unicode 00F8 For the major-minor kind, only the minor symbol is used when use-symbols is yes. The major symbol is set using the symbol attribute in the degree-value element. The corresponding degree-alter value will usually be 0 in this case. The text attribute describes how the kind should be spelled in a score. If use-symbols is yes, the value of the text attribute follows the symbol. The stack-degrees attribute is yes if the degree elements should be stacked above each other. The parentheses-degrees attribute is yes if all the degrees should be in parentheses. The bracket-degrees attribute is yes if all the degrees should be in a bracket. If not specified, these values are implementation-specific. The alignment attributes are for the entire harmony-chord group of which this kind element is a part. The text attribute may use strings such as "13sus" that refer to both the kind and one or more degree elements. In this case, the corresponding degree elements should have the print-object attribute set to "no" to keep redundant alterations from being displayed.
 * @see musicxml.xsd "kind".
 */
export class Kind extends PrintStyleAlignFieldBag implements KindShape {
  value: KindValue = KindValue.Major;
  useSymbols?: YesNo;
  text?: string;
  stackDegrees?: YesNo;
  parenthesesDegrees?: YesNo;
  bracketDegrees?: YesNo;
  constructor(init?: Partial<Kind>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Kind {
    return new Kind({
      value: asEnum(KindValue, elementText(n)) ?? KindValue.Major,
      useSymbols: ynAttr(n, 'use-symbols'),
      text: attr(n, 'text'),
      stackDegrees: ynAttr(n, 'stack-degrees'),
      parenthesesDegrees: ynAttr(n, 'parentheses-degrees'),
      bracketDegrees: ynAttr(n, 'bracket-degrees'),
      ...PrintStyleAlignAttrs.read(n),
    });
  }
  static toXmlElement(o: Kind): XmlElement {
    return el('kind', [{ '#text': o.value }], {
      'use-symbols': o.useSymbols,
      text: o.text,
      'stack-degrees': o.stackDegrees,
      'parentheses-degrees': o.parenthesesDegrees,
      'bracket-degrees': o.bracketDegrees,
      ...PrintStyleAlignAttrs.attrs(o),
    });
  }
}

/**
 * The inversion type represents harmony inversions. The value is a number indicating which inversion is used: 0 for root position, 1 for first inversion, etc. The text attribute indicates how the inversion should be displayed in a score.
 * @see musicxml.xsd "inversion".
 */
export class Inversion extends PrintStyleFieldBag implements InversionShape {
  value = 0;
  text?: string;
  constructor(init?: Partial<Inversion>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Inversion {
    return new Inversion({ value: numText(n), text: attr(n, 'text'), ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: Inversion): XmlElement {
    return el('inversion', [{ '#text': String(o.value) }], { text: o.text, ...PrintStyleAttrs.attrs(o) });
  }
}

// --- bass --------------------------------------------------------------------
/**
 * The bass-step type represents the pitch step of the bass of the current chord within the harmony element. The text attribute indicates how the bass should appear in a score if not using the element contents.
 * @see musicxml.xsd "bass-step".
 */
export class BassStep extends PrintStyleFieldBag implements BassStepShape {
  value: Step = 'C' as Step;
  text?: string;
  constructor(init?: Partial<BassStep>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): BassStep {
    return new BassStep({ value: (elementText(n) ?? 'C') as Step, text: attr(n, 'text'), ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: BassStep): XmlElement {
    return el('bass-step', [{ '#text': o.value }], { text: o.text, ...PrintStyleAttrs.attrs(o) });
  }
}

/**
 * The harmony-alter type represents the chromatic alteration of the root, numeral, or bass of the current harmony-chord group within the harmony element. In some chord styles, the text of the preceding element may include alteration information. In that case, the print-object attribute of this type can be set to no. The location attribute indicates whether the alteration should appear to the left or the right of the preceding element. Its default value varies by element.
 * @see musicxml.xsd "harmony-alter" (bass-alter).
 */
export class BassAlter extends PrintStyleFieldBag implements BassAlterShape {
  value = 0;
  printObject?: YesNo;
  location?: 'left' | 'right';
  constructor(init?: Partial<BassAlter>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): BassAlter {
    return new BassAlter({ value: numText(n), printObject: ynAttr(n, 'print-object'), location: attr(n, 'location') as BassAlter['location'], ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: BassAlter): XmlElement {
    return el('bass-alter', [{ '#text': String(o.value) }], { 'print-object': o.printObject, location: o.location, ...PrintStyleAttrs.attrs(o) });
  }
}

/**
 * The bass type is used to indicate a bass note in popular music chord symbols, e.g. G/C. It is generally not used in functional harmony, as inversion is generally not used in pop chord symbols. As with root, it is divided into step and alter elements, similar to pitches. The arrangement attribute specifies where the bass is displayed relative to what precedes it.
 * @see musicxml.xsd "bass".
 */
export class Bass implements BassShape {
  bassStep: BassStep = new BassStep();
  bassAlter?: BassAlter;
  arrangement?: HarmonyArrangement;
  constructor(init?: Partial<Bass>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Bass {
    const step = childrenOf(n, 'bass-step')[0];
    const alter = childrenOf(n, 'bass-alter')[0];
    return new Bass({ bassStep: step ? BassStep.fromXmlElement(step) : new BassStep(), bassAlter: alter ? BassAlter.fromXmlElement(alter) : undefined, arrangement: asEnum(HarmonyArrangement, attr(n, 'arrangement')) });
  }
  static toXmlElement(o: Bass): XmlElement {
    const c: XmlElement[] = [BassStep.toXmlElement(o.bassStep)];
    if (o.bassAlter) c.push(BassAlter.toXmlElement(o.bassAlter));
    return el('bass', c, { arrangement: o.arrangement });
  }
}

// --- degree ------------------------------------------------------------------
/**
 * The content of the degree-value type is a number indicating the degree of the chord (1 for the root, 3 for third, etc). The text attribute specifies how the value of the degree should be displayed. The symbol attribute indicates that a symbol should be used in specifying the degree. If the symbol attribute is present, the value of the text attribute follows the symbol.
 * @see musicxml.xsd "degree-value".
 */
export class DegreeValue extends PrintStyleFieldBag implements DegreeValueShape {
  value = 0;
  symbol?: DegreeSymbolValue;
  text?: string;
  constructor(init?: Partial<DegreeValue>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): DegreeValue {
    return new DegreeValue({ value: numText(n), symbol: asEnum(DegreeSymbolValue, attr(n, 'symbol')), text: attr(n, 'text'), ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: DegreeValue): XmlElement {
    return el('degree-value', [{ '#text': String(o.value) }], { symbol: o.symbol, text: o.text, ...PrintStyleAttrs.attrs(o) });
  }
}

/**
 * The degree-alter type represents the chromatic alteration for the current degree. If the degree-type value is alter or subtract, the degree-alter value is relative to the degree already in the chord based on its kind element. If the degree-type value is add, the degree-alter is relative to a dominant chord (major and perfect intervals except for a minor seventh). The plus-minus attribute is used to indicate if plus and minus symbols should be used instead of sharp and flat symbols to display the degree alteration. It is no if not specified.
 * @see musicxml.xsd "degree-alter".
 */
export class DegreeAlter extends PrintStyleFieldBag implements DegreeAlterShape {
  value = 0;
  plusMinus?: YesNo;
  constructor(init?: Partial<DegreeAlter>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): DegreeAlter {
    return new DegreeAlter({ value: numText(n), plusMinus: ynAttr(n, 'plus-minus'), ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: DegreeAlter): XmlElement {
    return el('degree-alter', [{ '#text': String(o.value) }], { 'plus-minus': o.plusMinus, ...PrintStyleAttrs.attrs(o) });
  }
}

/**
 * The degree-type type indicates if this degree is an addition, alteration, or subtraction relative to the kind of the current chord. The value of the degree-type element affects the interpretation of the value of the degree-alter element. The text attribute specifies how the type of the degree should be displayed.
 * @see musicxml.xsd "degree-type".
 */
export class DegreeType extends PrintStyleFieldBag implements DegreeTypeElShape {
  value: DegreeTypeValue = DegreeTypeValue.Add;
  text?: string;
  constructor(init?: Partial<DegreeType>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): DegreeType {
    return new DegreeType({ value: asEnum(DegreeTypeValue, elementText(n)) ?? DegreeTypeValue.Add, text: attr(n, 'text'), ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: DegreeType): XmlElement {
    return el('degree-type', [{ '#text': o.value }], { text: o.text, ...PrintStyleAttrs.attrs(o) });
  }
}

/**
 * The degree type is used to add, alter, or subtract individual notes in the chord. The print-object attribute can be used to keep the degree from printing separately when it has already taken into account in the text attribute of the kind element. The degree-value and degree-type text attributes specify how the value and type of the degree should be displayed. A harmony of kind "other" can be spelled explicitly by using a series of degree elements together with a root.
 * @see musicxml.xsd "degree".
 */
export class Degree implements DegreeShape {
  degreeValue: DegreeValue = new DegreeValue();
  degreeAlter: DegreeAlter = new DegreeAlter();
  degreeType: DegreeType = new DegreeType();
  printObject?: YesNo;
  constructor(init?: Partial<Degree>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Degree {
    return new Degree({
      degreeValue: DegreeValue.fromXmlElement(childrenOf(n, 'degree-value')[0]),
      degreeAlter: DegreeAlter.fromXmlElement(childrenOf(n, 'degree-alter')[0]),
      degreeType: DegreeType.fromXmlElement(childrenOf(n, 'degree-type')[0]),
      printObject: ynAttr(n, 'print-object'),
    });
  }
  static toXmlElement(o: Degree): XmlElement {
    return el('degree', [DegreeValue.toXmlElement(o.degreeValue), DegreeAlter.toXmlElement(o.degreeAlter), DegreeType.toXmlElement(o.degreeType)], { 'print-object': o.printObject });
  }
}

// --- frame -------------------------------------------------------------------
/**
 * The first-fret type indicates which fret is shown in the top space of the frame; it is fret 1 if the element is not present. The optional text attribute indicates how this is represented in the fret diagram, while the location attribute indicates whether the text appears to the left or right of the frame.
 * @see musicxml.xsd "first-fret".
 */
export class FirstFret implements FirstFretShape {
  value = 1;
  text?: string;
  location?: 'left' | 'right';
  constructor(init?: Partial<FirstFret>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): FirstFret {
    return new FirstFret({ value: numText(n), text: attr(n, 'text'), location: attr(n, 'location') as FirstFret['location'] });
  }
  static toXmlElement(o: FirstFret): XmlElement {
    return el('first-fret', [{ '#text': String(o.value) }], { text: o.text, location: o.location });
  }
}

/**
 * The string type is used with tablature notation, regular notation (where it is often circled), and chord diagrams. String numbers start with 1 for the highest pitched full-length string.
 * @see musicxml.xsd "string" (frame context).
 */
export class StringElement extends PrintStyleFieldBag implements StringElementShape {
  value = 1;
  placement?: AboveBelow;
  constructor(init?: Partial<StringElement>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): StringElement {
    return new StringElement({ value: numText(n), ...PrintStyleAttrs.read(n), ...PlacementAttrs.read(n) });
  }
  static toXmlElement(o: StringElement): XmlElement {
    return el('string', [{ '#text': String(o.value) }], { ...PrintStyleAttrs.attrs(o), ...PlacementAttrs.attrs(o) });
  }
}

/**
 * The fret element is used with tablature notation and chord diagrams. Fret numbers start with 0 for an open string and 1 for the first fret.
 * @see musicxml.xsd "fret" (frame context).
 */
export class FretElement implements FretElementShape {
  value = 0;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  constructor(init?: Partial<FretElement>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): FretElement {
    return new FretElement({ value: numText(n), ...FontAttrs.read(n), ...ColorAttrs.read(n) });
  }
  static toXmlElement(o: FretElement): XmlElement {
    return el('fret', [{ '#text': String(o.value) }], { ...FontAttrs.attrs(o), ...ColorAttrs.attrs(o) });
  }
}

/**
 * The barre element indicates placing a finger over multiple strings on a single fret. The type is "start" for the lowest pitched string (e.g., the string with the highest MusicXML number) and is "stop" for the highest pitched string.
 * @see musicxml.xsd "barre".
 */
export class Barre implements BarreShape {
  type: StartStop = 'start' as StartStop;
  color?: Color;
  constructor(init?: Partial<Barre>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Barre {
    return new Barre({ type: (attr(n, 'type') ?? 'start') as StartStop, ...ColorAttrs.read(n) });
  }
  static toXmlElement(o: Barre): XmlElement {
    return el('barre', [], { type: o.type, ...ColorAttrs.attrs(o) });
  }
}

/**
 * The frame-note type represents each note included in the frame. An open string will have a fret value of 0, while a muted string will not be associated with a frame-note element.
 * @see musicxml.xsd "frame-note".
 */
export class FrameNote implements FrameNoteShape {
  string: StringElement = new StringElement();
  fret: FretElement = new FretElement();
  fingering?: Fingering;
  barre?: Barre;
  constructor(init?: Partial<FrameNote>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): FrameNote {
    const fg = childrenOf(n, 'fingering')[0];
    const br = childrenOf(n, 'barre')[0];
    return new FrameNote({
      string: StringElement.fromXmlElement(childrenOf(n, 'string')[0]),
      fret: FretElement.fromXmlElement(childrenOf(n, 'fret')[0]),
      fingering: fg ? Fingering.fromXmlElement(fg) : undefined,
      barre: br ? Barre.fromXmlElement(br) : undefined,
    });
  }
  static toXmlElement(o: FrameNote): XmlElement {
    const c: XmlElement[] = [StringElement.toXmlElement(o.string), FretElement.toXmlElement(o.fret)];
    if (o.fingering) c.push(Fingering.toXmlElement(o.fingering));
    if (o.barre) c.push(Barre.toXmlElement(o.barre));
    return el('frame-note', c);
  }
}

/**
 * The frame type represents a frame or fretboard diagram used together with a chord symbol. The representation is based on the NIFF guitar grid with additional information. The frame type's unplayed attribute indicates what to display above a string that has no associated frame-note element. Typical values are x and the empty string. If the attribute is not present, the display of the unplayed string is application-defined.
 * @see musicxml.xsd "frame".
 */
export class Frame extends PositionFieldBag implements FrameShape {
  halign?: LeftCenterRight;
  valign?: 'top' | 'middle' | 'bottom';
  height?: Tenths;
  width?: Tenths;
  unplayed?: string;
  frameStrings = 6;
  frameFrets = 4;
  firstFret?: FirstFret;
  frameNotes: FrameNote[] = [];
  color?: Color;
  id?: string;
  constructor(init?: Partial<Frame>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Frame {
    const ff = childrenOf(n, 'first-fret')[0];
    return new Frame({
      halign: attr(n, 'halign') as LeftCenterRight | undefined,
      valign: attr(n, 'valign') as Frame['valign'],
      height: attr(n, 'height') === undefined ? undefined : Number(attr(n, 'height')),
      width: attr(n, 'width') === undefined ? undefined : Number(attr(n, 'width')),
      unplayed: attr(n, 'unplayed'),
      frameStrings: numText(childrenOf(n, 'frame-strings')[0]),
      frameFrets: numText(childrenOf(n, 'frame-frets')[0]),
      firstFret: ff ? FirstFret.fromXmlElement(ff) : undefined,
      frameNotes: childrenOf(n, 'frame-note').map(FrameNote.fromXmlElement),
      ...PositionAttrs.read(n),
      ...ColorAttrs.read(n),
      id: attr(n, 'id'),
    });
  }
  static toXmlElement(o: Frame): XmlElement {
    const c: XmlElement[] = [
      el('frame-strings', [{ '#text': String(o.frameStrings) }]),
      el('frame-frets', [{ '#text': String(o.frameFrets) }]),
    ];
    if (o.firstFret) c.push(FirstFret.toXmlElement(o.firstFret));
    for (const fn of o.frameNotes) c.push(FrameNote.toXmlElement(fn));
    return el('frame', c, {
      ...PositionAttrs.attrs(o),
      ...ColorAttrs.attrs(o),
      halign: o.halign,
      valign: o.valign,
      height: o.height,
      width: o.width,
      unplayed: o.unplayed,
      id: o.id,
    });
  }
}

// --- harmony aggregate -------------------------------------------------------
/**
 * The harmony type represents harmony analysis, including chord symbols in popular music as well as functional harmony analysis in classical music. If there are alternate harmonies possible, this can be specified using multiple harmony elements differentiated by type. Explicit harmonies have all note present in the music; implied have some notes missing but implied; alternate represents alternate analyses. The print-object attribute controls whether or not anything is printed due to the harmony element. The print-frame attribute controls printing of a frame or fretboard diagram. The print-style attribute group sets the default for the harmony, but individual elements can override this with their own print-style values. The arrangement attribute specifies how multiple harmony-chord groups are arranged relative to each other. Harmony-chords with vertical arrangement are separated by horizontal lines. Harmony-chords with diagonal or horizontal arrangement are separated by diagonal lines or slashes.
 * @see musicxml.xsd "harmony".
 */
export class Harmony extends PrintStyleAlignFieldBag implements HarmonyShape {
  type?: HarmonyType;
  printFrame?: YesNo;
  arrangement?: HarmonyArrangement;
  roots?: Root[];
  functions?: HarmonyFunction[];
  numerals?: Numeral[];
  kind?: Kind;
  inversion?: Inversion;
  bass?: Bass;
  degrees?: Degree[];
  frame?: Frame;
  offset?: { value: number; sound?: YesNo };
  staff?: number;
  footnote?: Editorial['footnote'];
  level?: Editorial['level'];
  printObject?: YesNo;
  placement?: AboveBelow;
  id?: string;
  constructor(init?: Partial<Harmony>) { super(); if (init) Object.assign(this, init); }

  static fromXmlElement(n: XmlElement): Harmony {
    const many = <T>(tag: string, f: (x: XmlElement) => T): T[] | undefined => {
      const a = childrenOf(n, tag).map(f);
      return a.length ? a : undefined;
    };
    const one = <T>(tag: string, f: (x: XmlElement) => T): T | undefined => {
      const c = childrenOf(n, tag)[0];
      return c ? f(c) : undefined;
    };
    const offsetEl = childrenOf(n, 'offset')[0];
    const staffEl = childrenOf(n, 'staff')[0];
    return new Harmony({
      type: asEnum(HarmonyType, attr(n, 'type')),
      printFrame: ynAttr(n, 'print-frame'),
      arrangement: asEnum(HarmonyArrangement, attr(n, 'arrangement')),
      printObject: ynAttr(n, 'print-object'),
      roots: many('root', Root.fromXmlElement),
      functions: many('function', HarmonyFunction.fromXmlElement),
      numerals: many('numeral', Numeral.fromXmlElement),
      kind: one('kind', Kind.fromXmlElement),
      inversion: one('inversion', Inversion.fromXmlElement),
      bass: one('bass', Bass.fromXmlElement),
      degrees: many('degree', Degree.fromXmlElement),
      frame: one('frame', Frame.fromXmlElement),
      offset: offsetEl ? { value: numText(offsetEl), sound: ynAttr(offsetEl, 'sound') } : undefined,
      staff: staffEl ? numText(staffEl) : undefined,
      ...PrintStyleAlignAttrs.read(n),
      ...PlacementAttrs.read(n),
      id: attr(n, 'id'),
    });
  }

  static toXmlElement(h: Harmony): XmlElement {
    const c: XmlElement[] = [];
    for (const r of h.roots ?? []) c.push(Root.toXmlElement(r));
    for (const f of h.functions ?? []) c.push(HarmonyFunction.toXmlElement(f));
    for (const nm of h.numerals ?? []) c.push(Numeral.toXmlElement(nm));
    if (h.kind) c.push(Kind.toXmlElement(h.kind));
    if (h.inversion) c.push(Inversion.toXmlElement(h.inversion));
    if (h.bass) c.push(Bass.toXmlElement(h.bass));
    for (const d of h.degrees ?? []) c.push(Degree.toXmlElement(d));
    if (h.frame) c.push(Frame.toXmlElement(h.frame));
    if (h.offset) c.push(el('offset', [{ '#text': String(h.offset.value) }], { sound: h.offset.sound }));
    if (h.staff !== undefined) c.push(el('staff', [{ '#text': String(h.staff) }]));
    return el('harmony', c, {
      type: h.type,
      'print-frame': h.printFrame,
      arrangement: h.arrangement,
      'print-object': h.printObject,
      ...PrintStyleAlignAttrs.attrs(h),
      ...PlacementAttrs.attrs(h),
      id: h.id,
    });
  }
}
