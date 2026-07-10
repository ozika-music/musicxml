/**
 * Barline + its leaves (bar-style, wavy-line, fermata, ending, repeat).
 * @see musicxml.xsd "barline", "bar-style", "ending", "repeat"
 * Editorial footnote/level are carried but not yet serialized.
 */

import { attr, childrenOf, el, elementText, type XmlElement } from '../../xml/xml-element';
import { BackwardForward, BarlineLocation, BarStyle, StartStopContinue, StartStopDiscontinue, UprightInverted, Winged } from '../enums';
import type { Editorial } from '../common';
import type { AboveBelow, FermataShape, NumberLevel, YesNo } from '../enums';
import type { Color, Divisions, Font, SmuflGlyphName, Tenths } from '../common';
import { asEnum, ColorAttrs, PlacementAttrs, PositionAttrs, PrintStyleAttrs } from '../common/attribute-groups';
import { Coda, Segno } from '../common/segno-coda';
import type {
  Barline as BarlineShape,
  BarStyleElement as BarStyleElementShape,
  Ending as EndingShape,
  FermataBarline as FermataBarlineShape,
  Repeat as RepeatShape,
  WavyLineBarline as WavyLineBarlineShape,
} from '../part';

function numAttr(node: XmlElement, name: string): number | undefined {
  const v = attr(node, name);
  return v === undefined ? undefined : Number(v);
}

/**
 * The bar-style-color type contains barline style and color information.
 * @see musicxml.xsd "bar-style-color".
 */
export class BarStyleElement implements BarStyleElementShape {
  value: BarStyle = BarStyle.Regular;
  color?: Color;
  constructor(init?: Partial<BarStyleElement>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): BarStyleElement {
    return new BarStyleElement({ value: asEnum(BarStyle, elementText(node)) ?? BarStyle.Regular, ...ColorAttrs.read(node) });
  }
  static toXmlElement(b: BarStyleElement): XmlElement {
    return el('bar-style', [{ '#text': b.value }], { ...ColorAttrs.attrs(b) });
  }
}

/**
 * Wavy lines are one way to indicate trills and vibrato. When used with a barline element, they should always have type="continue" set. The smufl attribute specifies a particular wavy line glyph from the SMuFL Multi-segment lines range.
 * @see musicxml.xsd "wavy-line" (barline context).
 */
export class WavyLineBarline implements WavyLineBarlineShape {
  type: StartStopContinue = StartStopContinue.Start;
  number?: NumberLevel;
  smufl?: SmuflGlyphName;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  placement?: AboveBelow;
  color?: Color;
  id?: string;
  constructor(init?: Partial<WavyLineBarline>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): WavyLineBarline {
    return new WavyLineBarline({
      type: asEnum(StartStopContinue, attr(node, 'type')) ?? StartStopContinue.Start,
      number: numAttr(node, 'number') as NumberLevel | undefined,
      smufl: attr(node, 'smufl'),
      ...PositionAttrs.read(node),
      ...PlacementAttrs.read(node),
      ...ColorAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(w: WavyLineBarline): XmlElement {
    return el('wavy-line', [], {
      type: w.type,
      number: w.number,
      smufl: w.smufl,
      ...PositionAttrs.attrs(w),
      ...PlacementAttrs.attrs(w),
      ...ColorAttrs.attrs(w),
      id: w.id,
    });
  }
}

/**
 * The fermata text content represents the shape of the fermata sign. An empty fermata element represents a normal fermata. The fermata type is upright if not specified.
 * @see musicxml.xsd "fermata" (barline context).
 */
export class FermataBarline implements FermataBarlineShape {
  value: FermataShape = 'normal';
  type?: UprightInverted;
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
  constructor(init?: Partial<FermataBarline>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): FermataBarline {
    return new FermataBarline({
      value: (elementText(node) ?? 'normal') as FermataShape,
      type: asEnum(UprightInverted, attr(node, 'type')),
      ...PrintStyleAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(f: FermataBarline): XmlElement {
    return el('fermata', f.value ? [{ '#text': f.value }] : [], { type: f.type, ...PrintStyleAttrs.attrs(f), id: f.id });
  }
}

/**
 * The ending type represents multiple (e.g. first and second) endings. Typically, the start type is associated with the left barline of the first measure in an ending. The stop and discontinue types are associated with the right barline of the last measure in an ending. Stop is used when the ending mark concludes with a downward jog, as is typical for first endings. Discontinue is used when there is no downward jog, as is typical for second endings that do not conclude a piece. The length of the jog can be specified using the end-length attribute. The text-x and text-y attributes are offsets that specify where the baseline of the start of the ending text appears, relative to the start of the ending line. The number attribute indicates which times the ending is played, similar to the time-only attribute used by other elements. While this often represents the numeric values for what is under the ending line, it can also indicate whether an ending is played during a larger dal segno or da capo repeat. Single endings such as "1" or comma-separated multiple endings such as "1,2" may be used. The ending element text is used when the text displayed in the ending is different than what appears in the number attribute. The print-object attribute is used to indicate when an ending is present but not printed, as is often the case for many parts in a full score.
 * @see musicxml.xsd "ending".
 */
export class Ending implements EndingShape {
  number = '';
  type: StartStopDiscontinue = StartStopDiscontinue.Start;
  system?: 'only-top' | 'only-bottom' | 'also-top' | 'also-bottom';
  endLength?: Tenths;
  textX?: Tenths;
  textY?: Tenths;
  value?: string;
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
  id?: string;
  constructor(init?: Partial<Ending>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Ending {
    return new Ending({
      number: attr(node, 'number') ?? '',
      type: asEnum(StartStopDiscontinue, attr(node, 'type')) ?? StartStopDiscontinue.Start,
      system: attr(node, 'system') as Ending['system'],
      endLength: numAttr(node, 'end-length'),
      textX: numAttr(node, 'text-x'),
      textY: numAttr(node, 'text-y'),
      value: elementText(node) || undefined,
      printObject: attr(node, 'print-object') as YesNo | undefined,
      ...PrintStyleAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(e: Ending): XmlElement {
    return el('ending', e.value ? [{ '#text': e.value }] : [], {
      number: e.number,
      type: e.type,
      system: e.system,
      'end-length': e.endLength,
      'text-x': e.textX,
      'text-y': e.textY,
      'print-object': e.printObject,
      ...PrintStyleAttrs.attrs(e),
      id: e.id,
    });
  }
}

/**
 * The repeat type represents repeat marks. The start of the repeat has a forward direction while the end of the repeat has a backward direction. The times and after-jump attributes are only used with backward repeats that are not part of an ending. The times attribute indicates the number of times the repeated section is played. The after-jump attribute indicates if the repeats are played after a jump due to a da capo or dal segno.
 * @see musicxml.xsd "repeat".
 */
export class Repeat implements RepeatShape {
  direction: BackwardForward = BackwardForward.Backward;
  times?: number;
  afterJump?: YesNo;
  winged?: Winged;
  constructor(init?: Partial<Repeat>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Repeat {
    return new Repeat({
      direction: asEnum(BackwardForward, attr(node, 'direction')) ?? BackwardForward.Backward,
      times: numAttr(node, 'times'),
      afterJump: attr(node, 'after-jump') as YesNo | undefined,
      winged: asEnum(Winged, attr(node, 'winged')),
    });
  }
  static toXmlElement(r: Repeat): XmlElement {
    return el('repeat', [], { direction: r.direction, times: r.times, winged: r.winged, 'after-jump': r.afterJump });
  }
}

/**
 * If a barline is other than a normal single barline, it should be represented by a barline type that describes it. This includes information about repeats and multiple endings, as well as line style. Barline data is on the same level as the other musical data in a score - a child of a measure in a partwise score, or a part in a timewise score. This allows for barlines within measures, as in dotted barlines that subdivide measures in complex meters. The two fermata elements allow for fermatas on both sides of the barline (the lower one inverted). Barlines have a location attribute to make it easier to process barlines independently of the other musical data in a score. It is often easier to set up measures separately from entering notes. The location attribute must match where the barline element occurs within the rest of the musical data in the score. If location is left, it should be the first element in the measure, aside from the print, bookmark, and link elements. If location is right, it should be the last element, again with the possible exception of the print, bookmark, and link elements. If no location is specified, the right barline is the default. The segno, coda, and divisions attributes work the same way as in the sound element. They are used for playback when barline elements contain segno or coda child elements.
 * @see musicxml.xsd "barline".
 */
export class Barline implements BarlineShape {
  location?: BarlineLocation;
  segno?: string;
  coda?: string;
  divisions?: Divisions;
  barStyle?: BarStyleElement;
  wavyLine?: WavyLineBarline;
  segnoElement?: Segno;
  codaElement?: Coda;
  fermatas?: FermataBarline[];
  ending?: Ending;
  repeat?: Repeat;
  footnote?: Editorial['footnote'];
  level?: Editorial['level'];
  id?: string;
  constructor(init?: Partial<Barline>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Barline {
    const one = <T>(tag: string, f: (n: XmlElement) => T): T | undefined => {
      const c = childrenOf(node, tag)[0];
      return c ? f(c) : undefined;
    };
    const fermatas = childrenOf(node, 'fermata').map((n) => FermataBarline.fromXmlElement(n));
    return new Barline({
      location: asEnum(BarlineLocation, attr(node, 'location')),
      segno: attr(node, 'segno'),
      coda: attr(node, 'coda'),
      divisions: numAttr(node, 'divisions'),
      barStyle: one('bar-style', BarStyleElement.fromXmlElement),
      wavyLine: one('wavy-line', WavyLineBarline.fromXmlElement),
      segnoElement: one('segno', Segno.fromXmlElement),
      codaElement: one('coda', Coda.fromXmlElement),
      fermatas: fermatas.length ? fermatas : undefined,
      ending: one('ending', Ending.fromXmlElement),
      repeat: one('repeat', Repeat.fromXmlElement),
      id: attr(node, 'id'),
    });
  }

  static toXmlElement(b: Barline): XmlElement {
    const c: XmlElement[] = [];
    if (b.barStyle) c.push(BarStyleElement.toXmlElement(b.barStyle));
    if (b.wavyLine) c.push(WavyLineBarline.toXmlElement(b.wavyLine));
    if (b.segnoElement) c.push(Segno.toXmlElement(b.segnoElement));
    if (b.codaElement) c.push(Coda.toXmlElement(b.codaElement));
    for (const f of b.fermatas ?? []) c.push(FermataBarline.toXmlElement(f));
    if (b.ending) c.push(Ending.toXmlElement(b.ending));
    if (b.repeat) c.push(Repeat.toXmlElement(b.repeat));
    return el('barline', c, {
      location: b.location,
      segno: b.segno,
      coda: b.coda,
      divisions: b.divisions,
      id: b.id,
    });
  }
}
