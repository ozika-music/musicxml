/**
 * Technical container + its leaves.
 * @see musicxml.xsd "technical" and its member element types.
 */

import { attr, childrenOf, el, elementText, textOf, type XmlElement } from '../../xml/xml-element';
import { StartStop } from '../enums';
import type { AboveBelow, NumberLevel, YesNo } from '../enums';
import type { Color, Font, SmuflGlyphName, Tenths } from '../common';
import { asEnum, BendSoundAttrs, ColorAttrs, FontAttrs, PlacementAttrs, PrintStyleAttrs } from '../common/attribute-groups';
import { EmptyPlacement, EmptyPlacementSmufl } from './notations-empty';
import type {
  Arrow as ArrowShape,
  Bend as BendShape,
  Fingering as FingeringShape,
  Fret as FretShape,
  HammerOnPullOff as HammerOnPullOffShape,
  Handbell as HandbellShape,
  HarmonClosed as HarmonClosedShape,
  HarmonMute as HarmonMuteShape,
  Harmonic as HarmonicShape,
  HeelToe as HeelToeShape,
  Hole as HoleShape,
  HoleClosed as HoleClosedShape,
  OtherTechnical as OtherTechnicalShape,
  PlacementText as PlacementTextShape,
  StringNumber as StringNumberShape,
  Tap as TapShape,
  Technical as TechnicalShape,
} from '../note';

// --- shared print-style + placement field block ---------------------------------
type Psp = {
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
};
class PspBase {
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
}
function readPsp(node: XmlElement): Psp {
  return { ...PrintStyleAttrs.read(node), ...PlacementAttrs.read(node), id: attr(node, 'id') };
}
function pspAttrs(o: Psp) {
  return { ...PrintStyleAttrs.attrs(o), ...PlacementAttrs.attrs(o), id: o.id };
}

/**
 * Fingering is typically indicated 1,2,3,4,5. Multiple fingerings may be given, typically to substitute fingerings in the middle of a note. The substitution and alternate values are "no" if the attribute is not present. For guitar and other fretted instruments, the fingering element represents the fretting finger; the pluck element represents the plucking finger.
 * @see musicxml.xsd "fingering".
 */
export class Fingering extends PspBase implements FingeringShape {
  value = '';
  substitution?: YesNo;
  alternate?: YesNo;
  constructor(init?: Partial<Fingering>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Fingering {
    return new Fingering({
      value: elementText(node) ?? '',
      substitution: attr(node, 'substitution') as YesNo | undefined,
      alternate: attr(node, 'alternate') as YesNo | undefined,
      ...readPsp(node),
    });
  }
  static toXmlElement(o: Fingering, tag = 'fingering'): XmlElement {
    return el(tag, o.value ? [{ '#text': o.value }] : [], { substitution: o.substitution, alternate: o.alternate, ...pspAttrs(o) });
  }
}

/**
 * The placement-text type represents a text element with print-style and placement attribute groups.
 * @see musicxml.xsd "placement-text" (pluck).
 */
export class PlacementText extends PspBase implements PlacementTextShape {
  value = '';
  constructor(init?: Partial<PlacementText>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): PlacementText {
    return new PlacementText({ value: elementText(node) ?? '', ...readPsp(node) });
  }
  static toXmlElement(o: PlacementText, tag: string): XmlElement {
    return el(tag, o.value ? [{ '#text': o.value }] : [], pspAttrs(o));
  }
}

/**
 * The fret element is used with tablature notation and chord diagrams. Fret numbers start with 0 for an open string and 1 for the first fret.
 * @see musicxml.xsd "fret".
 */
export class Fret implements FretShape {
  value = 0;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  constructor(init?: Partial<Fret>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Fret {
    return new Fret({ value: Number(elementText(node) ?? 0), ...FontAttrs.read(node), ...ColorAttrs.read(node) });
  }
  static toXmlElement(o: Fret): XmlElement {
    return el('fret', [{ '#text': String(o.value) }], { ...FontAttrs.attrs(o), ...ColorAttrs.attrs(o) });
  }
}

/**
 * The string type is used with tablature notation, regular notation (where it is often circled), and chord diagrams. String numbers start with 1 for the highest pitched full-length string.
 * @see musicxml.xsd "string".
 */
export class StringNumber extends PspBase implements StringNumberShape {
  value = 0;
  constructor(init?: Partial<StringNumber>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): StringNumber {
    return new StringNumber({ value: Number(elementText(node) ?? 0), ...readPsp(node) });
  }
  static toXmlElement(o: StringNumber): XmlElement {
    return el('string', [{ '#text': String(o.value) }], pspAttrs(o));
  }
}

/**
 * The hammer-on and pull-off elements are used in guitar and fretted instrument notation. Since a single slur can be marked over many notes, the hammer-on and pull-off elements are separate so the individual pair of notes can be specified. The element content can be used to specify how the hammer-on or pull-off should be notated. An empty element leaves this choice up to the application.
 * @see musicxml.xsd "hammer-on-pull-off".
 */
export class HammerOnPullOff extends PspBase implements HammerOnPullOffShape {
  type: StartStop = StartStop.Start;
  number?: NumberLevel;
  value?: string;
  constructor(init?: Partial<HammerOnPullOff>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): HammerOnPullOff {
    const num = attr(node, 'number');
    return new HammerOnPullOff({
      type: asEnum(StartStop, attr(node, 'type')) ?? StartStop.Start,
      number: num === undefined ? undefined : (Number(num) as NumberLevel),
      value: elementText(node) || undefined,
      ...readPsp(node),
    });
  }
  static toXmlElement(o: HammerOnPullOff, tag: string): XmlElement {
    return el(tag, o.value ? [{ '#text': o.value }] : [], { type: o.type, number: o.number, ...pspAttrs(o) });
  }
}

/**
 * The bend type is used in guitar notation and tablature. A single note with a bend and release will contain two bend elements: the first to represent the bend and the second to represent the release. The shape attribute distinguishes between the angled bend symbols commonly used in standard notation and the curved bend symbols commonly used in both tablature and standard notation.
 * @see musicxml.xsd "bend".
 */
export class Bend implements BendShape {
  bendAlter = 0;
  preBend?: boolean;
  release?: boolean;
  withBar?: PlacementText;
  shape?: 'angled' | 'curved';
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
  constructor(init?: Partial<Bend>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Bend {
    const withBar = childrenOf(node, 'with-bar')[0];
    return new Bend({
      bendAlter: Number(textOf(node, 'bend-alter') ?? 0),
      preBend: childrenOf(node, 'pre-bend').length > 0 || undefined,
      release: childrenOf(node, 'release').length > 0 || undefined,
      withBar: withBar ? PlacementText.fromXmlElement(withBar) : undefined,
      shape: attr(node, 'shape') as 'angled' | 'curved' | undefined,
      ...BendSoundAttrs.read(node),
      ...PrintStyleAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(o: Bend): XmlElement {
    const c: XmlElement[] = [el('bend-alter', [{ '#text': String(o.bendAlter) }])];
    if (o.preBend) c.push(el('pre-bend', []));
    if (o.release) c.push(el('release', []));
    if (o.withBar) c.push(PlacementText.toXmlElement(o.withBar, 'with-bar'));
    return el('bend', c, { shape: o.shape, ...BendSoundAttrs.attrs(o), ...PrintStyleAttrs.attrs(o), id: o.id });
  }
}

/**
 * The tap type indicates a tap on the fretboard. The text content allows specification of the notation; + and T are common choices. If the element is empty, the hand attribute is used to specify the symbol to use. The hand attribute is ignored if the tap glyph is already specified by the text content. If neither text content nor the hand attribute are present, the display is application-specific.
 * @see musicxml.xsd "tap".
 */
export class Tap extends PspBase implements TapShape {
  value = '';
  hand?: 'left' | 'right';
  constructor(init?: Partial<Tap>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Tap {
    return new Tap({ value: elementText(node) ?? '', hand: attr(node, 'hand') as 'left' | 'right' | undefined, ...readPsp(node) });
  }
  static toXmlElement(o: Tap): XmlElement {
    return el('tap', o.value ? [{ '#text': o.value }] : [], { hand: o.hand, ...pspAttrs(o) });
  }
}

/**
 * The heel and toe elements are used with organ pedals. The substitution value is "no" if the attribute is not present.
 * @see musicxml.xsd "heel-toe" (heel, toe).
 */
export class HeelToe extends PspBase implements HeelToeShape {
  substitution?: YesNo;
  constructor(init?: Partial<HeelToe>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): HeelToe {
    return new HeelToe({ substitution: attr(node, 'substitution') as YesNo | undefined, ...readPsp(node) });
  }
  static toXmlElement(o: HeelToe, tag: string): XmlElement {
    return el(tag, [], { substitution: o.substitution, ...pspAttrs(o) });
  }
}

/**
 * The hole-closed type represents whether the hole is closed, open, or half-open. The optional location attribute indicates which portion of the hole is filled in when the element value is half.
 * @see musicxml.xsd "hole-closed".
 */
export class HoleClosed implements HoleClosedShape {
  value: 'yes' | 'no' | 'half' = 'yes';
  location?: 'right' | 'bottom' | 'left' | 'top';
  constructor(init?: Partial<HoleClosed>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): HoleClosed {
    return new HoleClosed({
      value: (elementText(node) ?? 'yes') as 'yes' | 'no' | 'half',
      location: attr(node, 'location') as HoleClosed['location'],
    });
  }
  static toXmlElement(o: HoleClosed): XmlElement {
    return el('hole-closed', [{ '#text': o.value }], { location: o.location });
  }
}

/**
 * The hole type represents the symbols used for woodwind and brass fingerings as well as other notations.
 * @see musicxml.xsd "hole".
 */
export class Hole extends PspBase implements HoleShape {
  holeType?: string;
  holeClosed: HoleClosed = new HoleClosed();
  holeShape?: string;
  constructor(init?: Partial<Hole>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Hole {
    const closed = childrenOf(node, 'hole-closed')[0];
    return new Hole({
      holeType: textOf(node, 'hole-type'),
      holeClosed: closed ? HoleClosed.fromXmlElement(closed) : new HoleClosed(),
      holeShape: textOf(node, 'hole-shape'),
      ...readPsp(node),
    });
  }
  static toXmlElement(o: Hole): XmlElement {
    const c: XmlElement[] = [];
    if (o.holeType !== undefined) c.push(el('hole-type', [{ '#text': o.holeType }]));
    c.push(HoleClosed.toXmlElement(o.holeClosed));
    if (o.holeShape !== undefined) c.push(el('hole-shape', [{ '#text': o.holeShape }]));
    return el('hole', c, pspAttrs(o));
  }
}

/**
 * The arrow element represents an arrow used for a musical technical indication. It can represent both Unicode and SMuFL arrows. The presence of an arrowhead element indicates that only the arrowhead is displayed, not the arrow stem. The smufl attribute distinguishes different SMuFL glyphs that have an arrow appearance such as arrowBlackUp, guitarStrumUp, or handbellsSwingUp. The specified glyph should match the descriptive representation.
 * @see musicxml.xsd "arrow".
 */
export class Arrow extends PspBase implements ArrowShape {
  arrowDirection?: string;
  arrowStyle?: string;
  circularArrow?: 'clockwise' | 'anticlockwise';
  smufl?: SmuflGlyphName;
  constructor(init?: Partial<Arrow>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Arrow {
    return new Arrow({
      arrowDirection: textOf(node, 'arrow-direction'),
      arrowStyle: textOf(node, 'arrow-style'),
      circularArrow: textOf(node, 'circular-arrow') as Arrow['circularArrow'],
      smufl: attr(node, 'smufl'),
      ...readPsp(node),
    });
  }
  static toXmlElement(o: Arrow): XmlElement {
    const c: XmlElement[] = [];
    if (o.arrowDirection !== undefined) c.push(el('arrow-direction', [{ '#text': o.arrowDirection }]));
    if (o.arrowStyle !== undefined) c.push(el('arrow-style', [{ '#text': o.arrowStyle }]));
    if (o.circularArrow !== undefined) c.push(el('circular-arrow', [{ '#text': o.circularArrow }]));
    return el('arrow', c, { smufl: o.smufl, ...pspAttrs(o) });
  }
}

/**
 * The handbell element represents notation for various techniques used in handbell and handchime music.
 * @see musicxml.xsd "handbell".
 */
export class Handbell extends PspBase implements HandbellShape {
  value = '';
  constructor(init?: Partial<Handbell>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Handbell {
    return new Handbell({ value: elementText(node) ?? '', ...readPsp(node) });
  }
  static toXmlElement(o: Handbell): XmlElement {
    return el('handbell', o.value ? [{ '#text': o.value }] : [], pspAttrs(o));
  }
}

/**
 * The harmon-closed type represents whether the harmon mute is closed, open, or half-open. The optional location attribute indicates which portion of the symbol is filled in when the element value is half.
 * @see musicxml.xsd "harmon-closed".
 */
export class HarmonClosed implements HarmonClosedShape {
  value: 'yes' | 'no' | 'half' = 'yes';
  location?: 'right' | 'bottom' | 'left' | 'top';
  constructor(init?: Partial<HarmonClosed>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): HarmonClosed {
    return new HarmonClosed({
      value: (elementText(node) ?? 'yes') as 'yes' | 'no' | 'half',
      location: attr(node, 'location') as HarmonClosed['location'],
    });
  }
  static toXmlElement(o: HarmonClosed): XmlElement {
    return el('harmon-closed', [{ '#text': o.value }], { location: o.location });
  }
}

/**
 * The harmon-mute type represents the symbols used for harmon mutes in brass notation.
 * @see musicxml.xsd "harmon-mute".
 */
export class HarmonMute extends PspBase implements HarmonMuteShape {
  harmonClosed: HarmonClosed = new HarmonClosed();
  constructor(init?: Partial<HarmonMute>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): HarmonMute {
    const closed = childrenOf(node, 'harmon-closed')[0];
    return new HarmonMute({ harmonClosed: closed ? HarmonClosed.fromXmlElement(closed) : new HarmonClosed(), ...readPsp(node) });
  }
  static toXmlElement(o: HarmonMute): XmlElement {
    return el('harmon-mute', [HarmonClosed.toXmlElement(o.harmonClosed)], pspAttrs(o));
  }
}

/**
 * The harmonic type indicates natural and artificial harmonics. Allowing the type of pitch to be specified, combined with controls for appearance/playback differences, allows both the notation and the sound to be represented. Artificial harmonics can add a notated touching pitch; artificial pinch harmonics will usually not notate a touching pitch. The attributes for the harmonic element refer to the use of the circular harmonic symbol, typically but not always used with natural harmonics.
 * @see musicxml.xsd "harmonic".
 */
export class Harmonic extends PspBase implements HarmonicShape {
  natural?: boolean;
  artificial?: boolean;
  basePitch?: boolean;
  touchingPitch?: boolean;
  soundingPitch?: boolean;
  constructor(init?: Partial<Harmonic>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Harmonic {
    return new Harmonic({
      natural: childrenOf(node, 'natural').length > 0 || undefined,
      artificial: childrenOf(node, 'artificial').length > 0 || undefined,
      basePitch: childrenOf(node, 'base-pitch').length > 0 || undefined,
      touchingPitch: childrenOf(node, 'touching-pitch').length > 0 || undefined,
      soundingPitch: childrenOf(node, 'sounding-pitch').length > 0 || undefined,
      ...readPsp(node),
    });
  }
  static toXmlElement(o: Harmonic): XmlElement {
    const c: XmlElement[] = [];
    if (o.natural) c.push(el('natural', []));
    if (o.artificial) c.push(el('artificial', []));
    if (o.basePitch) c.push(el('base-pitch', []));
    if (o.touchingPitch) c.push(el('touching-pitch', []));
    if (o.soundingPitch) c.push(el('sounding-pitch', []));
    return el('harmonic', c, pspAttrs(o));
  }
}

/**
 * The other-placement-text type represents a text element with print-style, placement, and smufl attribute groups. This type is used by MusicXML notation extension elements to allow specification of specific SMuFL glyphs without needed to add every glyph as a MusicXML element.
 * @see musicxml.xsd "other-placement-text" (other-technical).
 */
export class OtherTechnical extends PspBase implements OtherTechnicalShape {
  value = '';
  smufl?: SmuflGlyphName;
  constructor(init?: Partial<OtherTechnical>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): OtherTechnical {
    return new OtherTechnical({ value: elementText(node) ?? '', smufl: attr(node, 'smufl'), ...readPsp(node) });
  }
  static toXmlElement(o: OtherTechnical): XmlElement {
    return el('other-technical', o.value ? [{ '#text': o.value }] : [], { smufl: o.smufl, ...pspAttrs(o) });
  }
}

/** EmptyPlacement-typed technical fields, in XSD order. */
const EMPTY_FIELDS: ReadonlyArray<[keyof TechnicalShape, string]> = [
  ['upBow', 'up-bow'],
  ['downBow', 'down-bow'],
  ['openString', 'open-string'],
  ['thumbPosition', 'thumb-position'],
  ['doubleTongue', 'double-tongue'],
  ['tripleTongue', 'triple-tongue'],
  ['stopped', 'stopped'],
  ['snapPizzicato', 'snap-pizzicato'],
  ['fingernails', 'fingernails'],
  ['brassBend', 'brass-bend'],
  ['flip', 'flip'],
  ['smear', 'smear'],
  ['golpe', 'golpe'],
];

/**
 * Technical indications give performance information for individual instruments.
 * @see musicxml.xsd "technical".
 */
export class Technical implements TechnicalShape {
  upBow?: EmptyPlacement;
  downBow?: EmptyPlacement;
  harmonic?: Harmonic;
  openString?: EmptyPlacement;
  thumbPosition?: EmptyPlacement;
  fingering?: Fingering;
  pluck?: PlacementText;
  doubleTongue?: EmptyPlacement;
  tripleTongue?: EmptyPlacement;
  stopped?: EmptyPlacement;
  snapPizzicato?: EmptyPlacement;
  fret?: Fret;
  string?: StringNumber;
  hammerOn?: HammerOnPullOff;
  pullOff?: HammerOnPullOff;
  bends?: Bend[];
  tap?: Tap;
  heel?: HeelToe;
  toe?: HeelToe;
  fingernails?: EmptyPlacement;
  hole?: Hole;
  arrow?: Arrow;
  handbell?: Handbell;
  brassBend?: EmptyPlacement;
  flip?: EmptyPlacement;
  smear?: EmptyPlacement;
  open?: EmptyPlacementSmufl;
  halfMuted?: EmptyPlacementSmufl;
  harmonMute?: HarmonMute;
  golpe?: EmptyPlacement;
  otherTechnical?: OtherTechnical;
  id?: string;
  constructor(init?: Partial<Technical>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Technical {
    const t = new Technical({ id: attr(node, 'id') });
    const first = (tag: string) => childrenOf(node, tag)[0];
    for (const [field, tag] of EMPTY_FIELDS) {
      const c = first(tag);
      if (c) (t as Record<string, unknown>)[field] = EmptyPlacement.fromXmlElement(c);
    }
    if (first('harmonic')) t.harmonic = Harmonic.fromXmlElement(first('harmonic'));
    if (first('fingering')) t.fingering = Fingering.fromXmlElement(first('fingering'));
    if (first('pluck')) t.pluck = PlacementText.fromXmlElement(first('pluck'));
    if (first('fret')) t.fret = Fret.fromXmlElement(first('fret'));
    if (first('string')) t.string = StringNumber.fromXmlElement(first('string'));
    if (first('hammer-on')) t.hammerOn = HammerOnPullOff.fromXmlElement(first('hammer-on'));
    if (first('pull-off')) t.pullOff = HammerOnPullOff.fromXmlElement(first('pull-off'));
    const bends = childrenOf(node, 'bend').map((b) => Bend.fromXmlElement(b));
    if (bends.length) t.bends = bends;
    if (first('tap')) t.tap = Tap.fromXmlElement(first('tap'));
    if (first('heel')) t.heel = HeelToe.fromXmlElement(first('heel'));
    if (first('toe')) t.toe = HeelToe.fromXmlElement(first('toe'));
    if (first('hole')) t.hole = Hole.fromXmlElement(first('hole'));
    if (first('arrow')) t.arrow = Arrow.fromXmlElement(first('arrow'));
    if (first('handbell')) t.handbell = Handbell.fromXmlElement(first('handbell'));
    if (first('open')) t.open = EmptyPlacementSmufl.fromXmlElement(first('open'));
    if (first('half-muted')) t.halfMuted = EmptyPlacementSmufl.fromXmlElement(first('half-muted'));
    if (first('harmon-mute')) t.harmonMute = HarmonMute.fromXmlElement(first('harmon-mute'));
    if (first('other-technical')) t.otherTechnical = OtherTechnical.fromXmlElement(first('other-technical'));
    return t;
  }

  static toXmlElement(t: Technical): XmlElement {
    const c: XmlElement[] = [];
    const ep = (v: EmptyPlacement | undefined, tag: string) => {
      if (v) c.push(EmptyPlacement.toXmlElement(v, tag));
    };
    // XSD sequence order.
    ep(t.upBow, 'up-bow');
    ep(t.downBow, 'down-bow');
    if (t.harmonic) c.push(Harmonic.toXmlElement(t.harmonic));
    ep(t.openString, 'open-string');
    ep(t.thumbPosition, 'thumb-position');
    if (t.fingering) c.push(Fingering.toXmlElement(t.fingering));
    if (t.pluck) c.push(PlacementText.toXmlElement(t.pluck, 'pluck'));
    ep(t.doubleTongue, 'double-tongue');
    ep(t.tripleTongue, 'triple-tongue');
    ep(t.stopped, 'stopped');
    ep(t.snapPizzicato, 'snap-pizzicato');
    if (t.fret) c.push(Fret.toXmlElement(t.fret));
    if (t.string) c.push(StringNumber.toXmlElement(t.string));
    if (t.hammerOn) c.push(HammerOnPullOff.toXmlElement(t.hammerOn, 'hammer-on'));
    if (t.pullOff) c.push(HammerOnPullOff.toXmlElement(t.pullOff, 'pull-off'));
    for (const b of t.bends ?? []) c.push(Bend.toXmlElement(b));
    if (t.tap) c.push(Tap.toXmlElement(t.tap));
    if (t.heel) c.push(HeelToe.toXmlElement(t.heel, 'heel'));
    if (t.toe) c.push(HeelToe.toXmlElement(t.toe, 'toe'));
    ep(t.fingernails, 'fingernails');
    if (t.hole) c.push(Hole.toXmlElement(t.hole));
    if (t.arrow) c.push(Arrow.toXmlElement(t.arrow));
    if (t.handbell) c.push(Handbell.toXmlElement(t.handbell));
    ep(t.brassBend, 'brass-bend');
    ep(t.flip, 'flip');
    ep(t.smear, 'smear');
    if (t.open) c.push(EmptyPlacementSmufl.toXmlElement(t.open, 'open'));
    if (t.halfMuted) c.push(EmptyPlacementSmufl.toXmlElement(t.halfMuted, 'half-muted'));
    if (t.harmonMute) c.push(HarmonMute.toXmlElement(t.harmonMute));
    ep(t.golpe, 'golpe');
    if (t.otherTechnical) c.push(OtherTechnical.toXmlElement(t.otherTechnical));
    return el('technical', c, { id: t.id });
  }
}
