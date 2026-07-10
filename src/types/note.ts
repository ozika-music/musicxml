/**
 * MusicXML 4.0 Note Types
 * Note elements and related types
 */

import {
  Bezier,
  BendSound,
  ColorAttribute,
  DashedFormatting,
  Divisions,
  Editorial,
  EditorialVoice,
  Font,
  FormattedText,
  LineShapeAttributes,
  LineTypeAttributes,
  OptionalUniqueId,
  PlacementAttributes,
  Position,
  PrintObject,
  PrintStyle,
  PrintStyleAlign,
  Printout,
  SmuflGlyphName,
  TimeOnly,
  TrillSound,
} from './common';
import {
  AboveBelow,
  AccidentalValue,
  BeamLevel,
  BeamValue,
  BreathMarkValue,
  CaesuraValue,
  DynamicsValue,
  Fan,
  FermataShape,
  LineLength,
  NoteheadValue,
  NoteTypeValue,
  NumberLevel,
  ShowTuplet,
  StartStop,
  StartStopContinue,
  StemValue,
  Step,
  Syllabic,
  SymbolSize,
  TiedType,
  TremoloType,
  UprightInverted,
  YesNo,
} from './enums';

/**
 * Note - the main note element
 */
export interface NoteShape extends PrintStyle, Printout, OptionalUniqueId {
  // Note characteristics
  grace?: Grace;
  cue?: boolean;
  chord?: boolean;
  
  // Pitch information (one of these)
  pitch?: Pitch;
  unpitched?: Unpitched;
  rest?: Rest;
  
  // Duration
  duration?: Divisions;
  ties?: Tie[];
  
  // Notation appearance
  instruments?: Instrument[];
  editorial?: EditorialVoice;
  voice?: string;
  type?: NoteType;
  dots?: Dot[];
  accidental?: Accidental;
  timeModification?: TimeModification;
  stem?: Stem;
  notehead?: Notehead;
  noteheadText?: NoteheadText;
  staff?: number;
  beams?: Beam[];
  notations?: Notations[];
  lyrics?: Lyric[];
  play?: Play;
  listen?: Listen;
  
  // Attributes
  printLeger?: YesNo;
  dynamics?: number;
  endDynamics?: number;
  attack?: Divisions;
  release?: Divisions;
  timeOnly?: TimeOnly;
  pizzicato?: YesNo;
}

/**
 * Pitch element
 */
export interface PitchShape {
  step: Step;
  alter?: number;
  octave: number;
}

/**
 * Unpitched element (for percussion, etc.)
 */
export interface UnpitchedShape {
  displayStep?: Step;
  displayOctave?: number;
}

/**
 * Rest element
 */
export interface RestShape {
  displayStep?: Step;
  displayOctave?: number;
  measure?: YesNo;
}

// note leaf elements modeled as classes; see ./note/pitch and ./note/note-parts.
import { Pitch, Unpitched, Rest } from './note/pitch';
import { Stem, Beam, NoteType, Tie, TimeModification } from './note/note-parts';
import { Accidental, Dot, Grace, Notehead } from './note/note-display';
import { Slur, Tied } from './note/notations-curves';
import { Tuplet, TupletDot, TupletNumber, TupletPortion, TupletType } from './note/tuplet';
import { Glissando, Slide } from './note/notations-lines';
import { EmptyLine, EmptyPlacement, EmptyPlacementSmufl } from './note/notations-empty';
import { Articulations, BreathMark, Caesura, OtherArticulation, StrongAccent } from './note/articulations';
import { AccidentalMark } from './note/accidental-mark';
import { EmptyTrillSound, Mordent, Ornaments, OtherOrnament, Tremolo, TrillMark, Turn, VerticalTurn, WavyLine } from './note/ornaments';
import { Arrow, Bend, Fingering, Fret, HammerOnPullOff, Handbell, HarmonClosed, HarmonMute, Harmonic, HeelToe, Hole, HoleClosed, OtherTechnical, PlacementText, StringNumber, Tap, Technical } from './note/technical';
import { Arpeggiate, Dynamics, Fermata, NonArpeggiate, OtherDynamics, OtherNotation } from './note/notations-misc';
import { Notations } from './note/notations';
import { Elision, Extend, Lyric, TextElementData } from './note/lyric';
import { Note } from './note/note-element';
import { Listen, NoteheadText, Play } from './note/note-extras';
export { Listen, NoteheadText, Play };
export { Pitch, Unpitched, Rest, Stem, Beam, NoteType, Tie, TimeModification };
export { Accidental, Dot, Grace, Notehead };
export { Slur, Tied };
export { Tuplet, TupletDot, TupletNumber, TupletPortion, TupletType };
export { Glissando, Slide };
export { EmptyLine, EmptyPlacement, EmptyPlacementSmufl };
export { Articulations, BreathMark, Caesura, OtherArticulation, StrongAccent };
export { AccidentalMark };
export { EmptyTrillSound, Mordent, Ornaments, OtherOrnament, Tremolo, TrillMark, Turn, VerticalTurn, WavyLine };
export { Arrow, Bend, Fingering, Fret, HammerOnPullOff, Handbell, HarmonClosed, HarmonMute, Harmonic, HeelToe, Hole, HoleClosed, OtherTechnical, PlacementText, StringNumber, Tap, Technical };
export { Arpeggiate, Fermata, NonArpeggiate, OtherNotation };
export { Dynamics, OtherDynamics };
export { Notations };
export { Elision, Extend, Lyric, TextElementData };
export { Note };
export type { GetMidiNoteOptions } from './note/note-element';

/**
 * Grace note element
 */
export interface GraceShape {
  stealTimePrevious?: number;
  stealTimeFollowing?: number;
  makeTime?: Divisions;
  slash?: YesNo;
}

/**
 * Tie element (for sound)
 */
export interface TieShape {
  type: StartStop;
  timeOnly?: TimeOnly;
}

/**
 * Instrument reference
 */
export interface Instrument {
  id: string;
}

/**
 * Note type (graphical)
 */
export interface NoteTypeShape {
  value: NoteTypeValue;
  size?: SymbolSize;
}

/**
 * Dot element
 */
export interface DotShape extends PrintStyle, PlacementAttributes {}

/**
 * Accidental element
 */
export interface AccidentalShape extends PrintStyle, OptionalUniqueId {
  value: AccidentalValue;
  cautionary?: YesNo;
  editorial?: YesNo;
  bracket?: YesNo;
  parentheses?: YesNo;
  size?: SymbolSize;
  smufl?: SmuflGlyphName;
}

/**
 * Time modification (for tuplets)
 */
export interface TimeModificationShape {
  actualNotes: number;
  normalNotes: number;
  normalType?: NoteTypeValue;
  normalDots?: number;
}

/**
 * Stem element
 */
export interface StemShape extends Position, ColorAttribute {
  value: StemValue;
}

/**
 * Notehead element
 */
export interface NoteheadShape extends Font, ColorAttribute {
  value: NoteheadValue;
  filled?: YesNo;
  parentheses?: YesNo;
  smufl?: SmuflGlyphName;
}

/**
 * Notehead text
 */
export interface NoteheadTextShape {
  displayTexts?: { value: string }[];
  accidentalTexts?: { value: string; smufl?: string }[];
}

/**
 * Display text or accidental text union
 */
export type DisplayTextOrAccidentalText = FormattedText | AccidentalTextElement;

/**
 * Accidental text element
 */
export interface AccidentalTextElement extends PrintStyle {
  value: AccidentalValue;
  smufl?: SmuflGlyphName;
}

/**
 * Beam element
 */
export interface BeamShape extends ColorAttribute, OptionalUniqueId {
  value: BeamValue;
  number?: BeamLevel;
  repeater?: YesNo;
  fan?: Fan;
}

/**
 * Notations container
 */
export interface NotationsShape extends Editorial, PrintObject, OptionalUniqueId {
  tieds?: Tied[];
  slurs?: Slur[];
  tuplets?: Tuplet[];
  glissandos?: Glissando[];
  slides?: Slide[];
  ornaments?: Ornaments[];
  technicals?: Technical[];
  articulations?: Articulations[];
  dynamics?: Dynamics[];
  fermatas?: Fermata[];
  arpeggiate?: Arpeggiate;
  nonArpeggiate?: NonArpeggiate;
  accidentalMarks?: AccidentalMark[];
  otherNotations?: OtherNotation[];
}

/**
 * Tied element (for notation)
 */
export interface TiedShape extends Position, PlacementAttributes, LineTypeAttributes, DashedFormatting, Bezier, ColorAttribute, OptionalUniqueId {
  type: TiedType;
  number?: NumberLevel;
  orientation?: 'over' | 'under';
}

/**
 * Slur element
 */
export interface SlurShape extends Position, PlacementAttributes, LineTypeAttributes, DashedFormatting, Bezier, ColorAttribute, OptionalUniqueId {
  type: StartStopContinue;
  number?: NumberLevel;
  orientation?: 'over' | 'under';
}

/**
 * Tuplet element
 */
export interface TupletShape extends Position, PlacementAttributes, LineShapeAttributes, OptionalUniqueId {
  type: StartStop;
  number?: NumberLevel;
  bracket?: YesNo;
  showNumber?: ShowTuplet;
  showType?: ShowTuplet;
  tupletActual?: TupletPortion;
  tupletNormal?: TupletPortion;
}

/**
 * Tuplet portion (actual or normal)
 */
export interface TupletPortionShape {
  tupletNumber?: TupletNumber;
  tupletType?: TupletType;
  tupletDots?: TupletDot[];
}

/**
 * Tuplet number
 */
export interface TupletNumberShape extends Font, ColorAttribute {
  value: number;
}

/**
 * Tuplet type
 */
export interface TupletTypeShape extends Font, ColorAttribute {
  value: NoteTypeValue;
}

/**
 * Tuplet dot
 */
export interface TupletDotShape extends Font, ColorAttribute {}

/**
 * Glissando element
 */
export interface GlissandoShape extends PrintStyle, LineTypeAttributes, DashedFormatting, OptionalUniqueId {
  type: StartStop;
  number?: NumberLevel;
  value?: string;
}

/**
 * Slide element
 */
export interface SlideShape extends PrintStyle, LineTypeAttributes, DashedFormatting, BendSound, OptionalUniqueId {
  type: StartStop;
  number?: NumberLevel;
  value?: string;
}

/**
 * Ornaments container
 */
export interface OrnamentsShape extends OptionalUniqueId {
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
}

/**
 * Trill mark
 */
export interface TrillMarkShape extends PrintStyle, PlacementAttributes, TrillSound, OptionalUniqueId {}

/**
 * Turn element
 */
export interface TurnShape extends PrintStyle, PlacementAttributes, TrillSound, OptionalUniqueId {
  slash?: YesNo;
}

/**
 * Vertical turn
 */
export interface VerticalTurnShape extends PrintStyle, PlacementAttributes, TrillSound, OptionalUniqueId {}

/**
 * Empty trill sound
 */
export interface EmptyTrillSoundShape extends PrintStyle, PlacementAttributes, TrillSound, OptionalUniqueId {}

/**
 * Wavy line
 */
export interface WavyLineShape extends Position, PlacementAttributes, TrillSound, ColorAttribute, OptionalUniqueId {
  type: StartStopContinue;
  number?: NumberLevel;
  smufl?: SmuflGlyphName;
}

/**
 * Mordent element
 */
export interface MordentShape extends PrintStyle, PlacementAttributes, TrillSound, OptionalUniqueId {
  long?: YesNo;
  approach?: AboveBelow;
  departure?: AboveBelow;
}

/**
 * Empty placement
 */
export interface EmptyPlacementShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {}

/**
 * Tremolo element
 */
export interface TremoloShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: number;
  type?: TremoloType;
  smufl?: SmuflGlyphName;
}

/**
 * Other ornament
 */
export interface OtherOrnamentShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Technical container
 */
export interface TechnicalShape extends OptionalUniqueId {
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
}

/**
 * Harmonic element
 */
export interface HarmonicShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  natural?: boolean;
  artificial?: boolean;
  basePitch?: boolean;
  touchingPitch?: boolean;
  soundingPitch?: boolean;
}

/**
 * Fingering element
 */
export interface FingeringShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: string;
  substitution?: YesNo;
  alternate?: YesNo;
}

/**
 * Placement text
 */
export interface PlacementTextShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: string;
}

/**
 * Fret element
 */
export interface FretShape extends Font, ColorAttribute {
  value: number;
}

/**
 * String number element
 */
export interface StringNumberShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: number;
}

/**
 * Hammer-on or pull-off
 */
export interface HammerOnPullOffShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  type: StartStop;
  number?: NumberLevel;
  value?: string;
}

/**
 * Bend element
 */
export interface BendShape extends PrintStyle, BendSound, OptionalUniqueId {
  bendAlter: number;
  preBend?: boolean;
  release?: boolean;
  withBar?: PlacementText;
  /** Angled bend (standard notation) or curved bend (tablature). Default is angled. */
  shape?: 'angled' | 'curved';
}

/**
 * Tap element
 */
export interface TapShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: string;
  hand?: 'left' | 'right';
}

/**
 * Heel or toe
 */
export interface HeelToeShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  substitution?: YesNo;
}

/**
 * Hole element
 */
export interface HoleShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  holeType?: string;
  holeClosed: HoleClosed;
  holeShape?: string;
}

/**
 * Hole closed
 */
export interface HoleClosedShape {
  value: 'yes' | 'no' | 'half';
  location?: 'right' | 'bottom' | 'left' | 'top';
}

/**
 * Arrow element
 */
export interface ArrowShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  arrowDirection?: string;
  arrowStyle?: string;
  circularArrow?: 'clockwise' | 'anticlockwise';
  smufl?: SmuflGlyphName;
}

/**
 * Handbell element
 */
export interface HandbellShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: string;
}

/**
 * Empty placement with SMuFL
 */
export interface EmptyPlacementSmuflShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  smufl?: SmuflGlyphName;
}

/**
 * Harmon mute
 */
export interface HarmonMuteShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  harmonClosed: HarmonClosed;
}

/**
 * Harmon closed
 */
export interface HarmonClosedShape {
  value: 'yes' | 'no' | 'half';
  location?: 'right' | 'bottom' | 'left' | 'top';
}

/**
 * Other technical
 */
export interface OtherTechnicalShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Articulations container
 */
export interface ArticulationsShape extends OptionalUniqueId {
  accent?: EmptyPlacement;
  strongAccent?: StrongAccent;
  staccato?: EmptyPlacement;
  tenuto?: EmptyPlacement;
  detachedLegato?: EmptyPlacement;
  staccatissimo?: EmptyPlacement;
  spiccato?: EmptyPlacement;
  scoop?: EmptyLine;
  plop?: EmptyLine;
  doit?: EmptyLine;
  falloff?: EmptyLine;
  breathMark?: BreathMark;
  caesura?: Caesura;
  stress?: EmptyPlacement;
  unstress?: EmptyPlacement;
  softAccent?: EmptyPlacement;
  otherArticulation?: OtherArticulation;
}

/**
 * Strong accent
 */
export interface StrongAccentShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  type?: 'up' | 'down';
}

/**
 * Empty line for articulations
 */
export interface EmptyLineShape extends Position, PlacementAttributes, LineShapeAttributes, LineTypeAttributes, DashedFormatting, ColorAttribute, OptionalUniqueId {
  lineLength?: LineLength;
}

/**
 * Breath mark
 */
export interface BreathMarkShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: BreathMarkValue;
}

/**
 * Caesura
 */
export interface CaesuraShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: CaesuraValue;
}

/**
 * Other articulation
 */
export interface OtherArticulationShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Dynamics element
 */
export interface DynamicsShape extends PrintStyleAlign, PlacementAttributes, OptionalUniqueId {
  values: (DynamicsValue | OtherDynamics)[];
}

/**
 * Other dynamics
 */
export interface OtherDynamicsShape {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Fermata element
 */
export interface FermataElementShape extends PrintStyle, OptionalUniqueId {
  value: FermataShape;
  type?: UprightInverted;
}

/**
 * Arpeggiate element
 */
export interface ArpeggiateShape extends Position, PlacementAttributes, ColorAttribute, OptionalUniqueId {
  number?: NumberLevel;
  direction?: 'up' | 'down';
  unbroken?: YesNo;
}

/**
 * Non-arpeggiate element
 */
export interface NonArpeggiateShape extends Position, PlacementAttributes, ColorAttribute, OptionalUniqueId {
  type: 'top' | 'bottom';
  number?: NumberLevel;
}

/**
 * Accidental mark
 */
export interface AccidentalMarkShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  value: AccidentalValue;
  bracket?: YesNo;
  parentheses?: YesNo;
  size?: SymbolSize;
  smufl?: SmuflGlyphName;
}

/**
 * Other notation
 */
export interface OtherNotationShape extends PrintStyle, PlacementAttributes, OptionalUniqueId {
  type: StartStopContinue;
  number?: NumberLevel;
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Lyric element
 */
export interface LyricShape extends PrintObject, Position, PlacementAttributes, ColorAttribute, OptionalUniqueId {
  number?: string;
  name?: string;
  justify?: 'left' | 'center' | 'right';
  syllabic?: Syllabic;
  text?: TextElementData;
  elision?: Elision;
  extend?: Extend;
  laughing?: boolean;
  humming?: boolean;
  endLine?: boolean;
  endParagraph?: boolean;
  editorial?: Editorial;
  timeOnly?: TimeOnly;
}

/**
 * Text element data
 */
export interface TextElementDataShape extends PrintStyle {
  value: string;
  lang?: string;
  dir?: 'ltr' | 'rtl' | 'lro' | 'rlo';
}

/**
 * Elision element
 */
export interface ElisionShape extends Font, ColorAttribute {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Extend element
 */
export interface ExtendShape extends PrintStyle {
  type?: StartStopContinue;
}

/**
 * Play element
 */
export interface PlayShape extends OptionalUniqueId {
  ipa?: string;
  mute?: string;
  semiPitched?: string;
  otherPlay?: OtherPlay;
}

/**
 * Other play
 */
export interface OtherPlay {
  type: string;
  value: string;
}

/**
 * Listen element
 */
export interface ListenShape {
  assess?: Assess;
  wait?: Wait;
  otherListen?: OtherListen;
}

/**
 * Assess element
 */
export interface Assess {
  type: YesNo;
  player?: string;
  timeOnly?: TimeOnly;
}

/**
 * Wait element
 */
export interface Wait {
  player?: string;
  timeOnly?: TimeOnly;
}

/**
 * Other listen
 */
export interface OtherListen {
  type: string;
  player?: string;
  timeOnly?: TimeOnly;
  value: string;
}
