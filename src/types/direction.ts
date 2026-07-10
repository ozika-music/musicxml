/**
 * MusicXML 4.0 Direction Types
 * Direction, harmony, and related elements
 */

import {
  Coda,
  ColorAttribute,
  DashedFormatting,
  Divisions,
  Editorial,
  EditorialVoice,
  EmptyPrintStyleAlignId,
  Font,
  LineTypeAttributes,
  OptionalUniqueId,
  PlacementAttributes,
  Position,
  PrintObject,
  PrintStyle,
  PrintStyleAlign,
  Segno,
  SmuflGlyphName,
  SymbolFormatting,
  Tenths,
  TextFormatting,
} from './common';
import {
  DegreeSymbolValue,
  DegreeTypeValue,
  EnclosureShape,
  HarmonyArrangement,
  HarmonyType,
  KindValue,
  LeftCenterRight,
  NumberLevel,
  OctaveShiftType,
  PedalType,
  StartStop,
  StartStopContinue,
  Step,
  TipDirection,
  WedgeType,
  YesNo,
} from './enums';
import { Dynamics } from './note';

// Direction-tier classes; see ./direction/*.
import {
  AccordionRegistration,
  Bracket,
  Dashes,
  OctaveShift,
  OtherDirection,
  Pedal,
  Rehearsal,
  StaffDivide,
  StringMute,
  Symbol,
  Wedge,
  Words,
} from './direction/direction-leaves';
import { Metronome, PerMinute } from './direction/metronome';
import { Direction, DirectionType } from './direction/direction';
export {
  AccordionRegistration,
  Bracket,
  Dashes,
  OctaveShift,
  OtherDirection,
  Pedal,
  Rehearsal,
  StaffDivide,
  StringMute,
  Symbol,
  Wedge,
  Words,
};
export { Metronome, PerMinute };
export { Direction, DirectionType };
import {
  Barre, Bass, BassAlter, BassStep, Degree, DegreeAlter, DegreeType, DegreeValue,
  FirstFret, Frame, FrameNote, FretElement, HarmonyFunction, Harmony, Inversion, Kind,
  Numeral, NumeralAlter, NumeralKey, NumeralRoot, Root, RootAlter, RootStep, StringElement,
} from './direction/harmony';
export {
  Barre, Bass, BassAlter, BassStep, Degree, DegreeAlter, DegreeType, DegreeValue,
  FirstFret, Frame, FrameNote, FretElement, HarmonyFunction, Harmony, Inversion, Kind,
  Numeral, NumeralAlter, NumeralKey, NumeralRoot, Root, RootAlter, RootStep, StringElement,
};
import { Figure, FiguredBass, FigureExtend, StyleText } from './direction/figured-bass';
export { Figure, FiguredBass, FigureExtend, StyleText };
import { HarpPedals, Image, Percussion, PrincipalVoice, Scordatura } from './direction/direction-extra';
export { HarpPedals, Image, Percussion, PrincipalVoice, Scordatura };

/**
 * Direction element
 */
export interface DirectionShape extends EditorialVoice, PlacementAttributes, OptionalUniqueId {
  directionTypes: DirectionType[];
  offset?: DirectionOffset;
  staff?: number;
  sound?: DirectionSound;
  listening?: DirectionListening;
  directive?: YesNo;
  system?: 'only-top' | 'only-bottom' | 'also-top' | 'also-bottom';
}

/**
 * Direction type container
 */
export interface DirectionTypeShape extends OptionalUniqueId {
  rehearsals?: Rehearsal[];
  segnos?: Segno[];
  codas?: Coda[];
  words?: Words[];
  symbols?: Symbol[];
  wedge?: Wedge;
  dynamics?: Dynamics[];
  dashes?: Dashes;
  bracket?: Bracket;
  pedal?: Pedal;
  metronome?: Metronome;
  octaveShift?: OctaveShift;
  harpPedals?: HarpPedals;
  damp?: EmptyPrintStyleAlignId;
  dampAll?: EmptyPrintStyleAlignId;
  eyeglasses?: EmptyPrintStyleAlignId;
  stringMute?: StringMute;
  scordatura?: Scordatura;
  image?: Image;
  principalVoice?: PrincipalVoice;
  percussions?: Percussion[];
  accordionRegistration?: AccordionRegistration;
  staffDivide?: StaffDivide;
  otherDirection?: OtherDirection;
}

/**
 * Rehearsal mark
 */
export interface RehearsalShape extends TextFormatting, OptionalUniqueId {
  value: string;
}

// Note: Segno and Coda are defined in part.ts to avoid duplicate exports

/**
 * Words element
 */
export interface WordsShape extends TextFormatting, OptionalUniqueId {
  value: string;
}

/**
 * Symbol element
 */
export interface SymbolShape extends SymbolFormatting, OptionalUniqueId {
  value: string;
}

/**
 * Wedge (crescendo/diminuendo)
 */
export interface WedgeShape extends Position, ColorAttribute, LineTypeAttributes, DashedFormatting, OptionalUniqueId {
  type: WedgeType;
  number?: NumberLevel;
  spread?: Tenths;
  niente?: YesNo;
}

// Note: Dynamics and OtherDynamics are imported from note.ts (via index.ts) to avoid duplicates

/**
 * Dashes element
 */
export interface DashesShape extends Position, ColorAttribute, DashedFormatting, OptionalUniqueId {
  type: StartStopContinue;
  number?: NumberLevel;
}

/**
 * Bracket element
 */
export interface BracketShape extends Position, ColorAttribute, LineTypeAttributes, DashedFormatting, OptionalUniqueId {
  type: StartStopContinue;
  number?: NumberLevel;
  lineEnd: 'up' | 'down' | 'both' | 'arrow' | 'none';
  endLength?: Tenths;
}

/**
 * Pedal element
 */
export interface PedalShape extends PrintStyleAlign, OptionalUniqueId {
  type: PedalType;
  number?: NumberLevel;
  line?: YesNo;
  sign?: YesNo;
  abbreviated?: YesNo;
}

/**
 * Metronome element
 */
export interface MetronomeShape extends PrintStyleAlign, PrintObject, OptionalUniqueId {
  parentheses?: YesNo;
  justify?: LeftCenterRight;
  // Standard metronome
  beatUnit?: string;
  beatUnitDots?: number;
  beatUnitTied?: BeatUnitTied[];
  perMinute?: PerMinute;
  // Second beat unit (for tempo changes)
  beatUnit2?: string;
  beatUnit2Dots?: number;
  beatUnit2Tied?: BeatUnitTied[];
  // Complex metronome
  metronomeArrows?: boolean;
  metronomeNotes?: MetronomeNote[];
  metronomeRelation?: string;
}

/**
 * Beat unit tied
 */
export interface BeatUnitTied {
  beatUnit: string;
  beatUnitDots?: number;
}

/**
 * Per minute element
 */
export interface PerMinuteShape extends Font {
  value: string;
}

/**
 * Metronome note
 */
export interface MetronomeNote {
  metronomeType: string;
  metronomeDots?: number;
  metronomeBeams?: MetronomeBeam[];
  metronomeTied?: MetronomeTied;
  metronomeTuplet?: MetronomeTuplet;
}

/**
 * Metronome beam
 */
export interface MetronomeBeam {
  number?: number;
  value: string;
}

/**
 * Metronome tied
 */
export interface MetronomeTied {
  type: StartStop;
}

/**
 * Metronome tuplet
 */
export interface MetronomeTuplet {
  type: StartStop;
  bracket?: YesNo;
  showNumber?: 'actual' | 'both' | 'none';
  actualNotes: number;
  normalNotes: number;
  normalType?: string;
  normalDots?: number;
}

/**
 * Octave shift element
 */
export interface OctaveShiftShape extends PrintStyle, DashedFormatting, OptionalUniqueId {
  type: OctaveShiftType;
  number?: NumberLevel;
  size?: number;
}

/**
 * Harp pedals element
 */
export interface HarpPedalsShape extends PrintStyleAlign, OptionalUniqueId {
  pedalTunings: PedalTuning[];
}

/**
 * Pedal tuning
 */
export interface PedalTuning {
  pedalStep: Step;
  pedalAlter: number;
}

// Note: EmptyPrintStyleAlignId is defined in common.ts to avoid duplicate exports

/**
 * String mute element
 */
export interface StringMuteShape extends PrintStyleAlign, OptionalUniqueId {
  type: 'on' | 'off';
}

/**
 * Scordatura element
 */
export interface ScordaturaShape extends OptionalUniqueId {
  accords: Accord[];
}

/**
 * Accord element
 */
export interface Accord {
  string: number;
  tuningStep: Step;
  tuningAlter?: number;
  tuningOctave: number;
}

/**
 * Image element
 */
export interface ImageShape extends Position, OptionalUniqueId {
  source: string;
  type: string;
  halign?: LeftCenterRight;
  valign?: 'top' | 'middle' | 'bottom';
  height?: Tenths;
  width?: Tenths;
}

/**
 * Principal voice element
 */
export interface PrincipalVoiceShape extends PrintStyleAlign, OptionalUniqueId {
  type: StartStop;
  symbol: 'Hauptstimme' | 'Nebenstimme' | 'plain' | 'none';
  value?: string;
}

/**
 * Percussion element
 */
export interface PercussionShape extends PrintStyleAlign, OptionalUniqueId {
  enclosure?: EnclosureShape;
  // One of these:
  glass?: Glass;
  metal?: Metal;
  wood?: Wood;
  pitched?: Pitched;
  membrane?: Membrane;
  effect?: Effect;
  timpani?: Timpani;
  beater?: Beater;
  stick?: Stick;
  stickLocation?: StickLocation;
  otherPercussion?: OtherPercussion;
}

/**
 * Glass percussion
 */
export interface Glass {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Metal percussion
 */
export interface Metal {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Wood percussion
 */
export interface Wood {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Pitched percussion
 */
export interface Pitched {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Membrane percussion
 */
export interface Membrane {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Effect percussion
 */
export interface Effect {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Timpani element
 */
export interface Timpani {
  smufl?: SmuflGlyphName;
}

/**
 * Beater element
 */
export interface Beater {
  value: string;
  tip?: TipDirection;
}

/**
 * Stick element
 */
export interface Stick {
  stickType: string;
  stickMaterial?: string;
  tip?: TipDirection;
  parentheses?: YesNo;
  dashedCircle?: YesNo;
}

/**
 * Stick location
 */
export interface StickLocation {
  value: string;
}

/**
 * Other percussion
 */
export interface OtherPercussion {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Accordion registration
 */
export interface AccordionRegistrationShape extends PrintStyleAlign, OptionalUniqueId {
  accordionHigh?: boolean;
  accordionMiddle?: number;
  accordionLow?: boolean;
}

/**
 * Staff divide element
 */
export interface StaffDivideShape extends PrintStyleAlign, OptionalUniqueId {
  type: 'down' | 'up' | 'up-down';
}

/**
 * Other direction
 */
export interface OtherDirectionShape extends PrintStyleAlign, OptionalUniqueId {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Direction offset
 */
export interface DirectionOffset {
  value: Divisions;
  sound?: YesNo;
}

/**
 * Direction sound
 */
export interface DirectionSound extends OptionalUniqueId {
  tempo?: number;
  dynamics?: number;
  dacapo?: YesNo;
  segno?: string;
  dalsegno?: string;
  coda?: string;
  tocoda?: string;
  divisions?: Divisions;
  forwardRepeat?: YesNo;
  fine?: string;
  timeOnly?: string;
  pizzicato?: YesNo;
  pan?: number;
  elevation?: number;
  damperPedal?: YesNo | number;
  softPedal?: YesNo | number;
  sostenutoPedal?: YesNo | number;
}

/**
 * Direction listening
 */
export interface DirectionListening {
  sync?: { type: StartStop; latency?: number; player?: string; timeOnly?: string };
  otherListening?: { type: string; player?: string; timeOnly?: string; value: string };
}

/**
 * Harmony element
 */
export interface HarmonyShape extends PrintObject, PrintStyleAlign, PlacementAttributes, OptionalUniqueId {
  type?: HarmonyType;
  printFrame?: YesNo;
  arrangement?: HarmonyArrangement;
  roots?: Root[];
  functions?: Function[];
  numerals?: Numeral[];
  kind?: Kind;
  inversion?: Inversion;
  bass?: Bass;
  degrees?: Degree[];
  frame?: Frame;
  offset?: HarmonyOffset;
  editorial?: Editorial;
  staff?: number;
}

/**
 * Root element
 */
export interface RootShape {
  rootStep: RootStep;
  rootAlter?: RootAlter;
}

/**
 * Root step
 */
export interface RootStepShape extends PrintStyle {
  value: Step;
  text?: string;
}

/**
 * Root alter
 */
export interface RootAlterShape extends PrintStyle {
  value: number;
  printObject?: YesNo;
  location?: 'left' | 'right';
}

/**
 * Function element
 */
export interface Function extends PrintStyle {
  value: string;
}

/**
 * Numeral element
 */
export interface NumeralShape {
  numeralRoot: NumeralRoot;
  numeralAlter?: NumeralAlter;
  numeralKey?: NumeralKey;
}

/**
 * Numeral root
 */
export interface NumeralRootShape extends PrintStyle {
  value: number;
  text?: string;
}

/**
 * Numeral alter
 */
export interface NumeralAlterShape extends PrintStyle {
  value: number;
  printObject?: YesNo;
  location?: 'left' | 'right';
}

/**
 * Numeral key
 */
export interface NumeralKeyShape {
  numeralFifths: number;
  numeralMode: 'major' | 'minor';
}

/**
 * Kind element (chord type)
 */
export interface KindShape extends PrintStyleAlign {
  value: KindValue;
  useSymbols?: YesNo;
  text?: string;
  stackDegrees?: YesNo;
  parenthesesDegrees?: YesNo;
  bracketDegrees?: YesNo;
}

/**
 * Inversion element
 */
export interface InversionShape extends PrintStyle {
  value: number;
  text?: string;
}

/**
 * Bass element
 */
export interface BassShape {
  bassStep: BassStep;
  bassAlter?: BassAlter;
  arrangement?: HarmonyArrangement;
}

/**
 * Bass step
 */
export interface BassStepShape extends PrintStyle {
  value: Step;
  text?: string;
}

/**
 * Bass alter
 */
export interface BassAlterShape extends PrintStyle {
  value: number;
  printObject?: YesNo;
  location?: 'left' | 'right';
}

/**
 * Degree element
 */
export interface DegreeShape extends PrintObject {
  degreeValue: DegreeValue;
  degreeAlter: DegreeAlter;
  degreeType: DegreeType;
}

/**
 * Degree value
 */
export interface DegreeValueShape extends PrintStyle {
  value: number;
  symbol?: DegreeSymbolValue;
  text?: string;
}

/**
 * Degree alter
 */
export interface DegreeAlterShape extends PrintStyle {
  value: number;
  plusMinus?: YesNo;
}

/**
 * Degree type
 */
export interface DegreeTypeShape extends PrintStyle {
  value: DegreeTypeValue;
  text?: string;
}

/**
 * Frame element (chord diagram)
 */
export interface FrameShape extends Position, ColorAttribute, OptionalUniqueId {
  halign?: LeftCenterRight;
  valign?: 'top' | 'middle' | 'bottom';
  height?: Tenths;
  width?: Tenths;
  unplayed?: string;
  frameStrings: number;
  frameFrets: number;
  firstFret?: FirstFret;
  frameNotes: FrameNote[];
}

/**
 * First fret
 */
export interface FirstFretShape {
  value: number;
  text?: string;
  location?: 'left' | 'right';
}

/**
 * Frame note
 */
export interface FrameNoteShape {
  string: StringElement;
  fret: FretElement;
  fingering?: Fingering;
  barre?: Barre;
}

/**
 * String element in frame
 */
export interface StringElementShape extends PrintStyle, PlacementAttributes {
  value: number;
}

/**
 * Fret element in frame
 */
export interface FretElementShape extends Font, ColorAttribute {
  value: number;
}

/**
 * Fingering element
 */
export interface Fingering extends PrintStyle, PlacementAttributes {
  value: string;
  substitution?: YesNo;
  alternate?: YesNo;
}

/**
 * Barre element
 */
export interface BarreShape extends ColorAttribute {
  type: StartStop;
}

/**
 * Harmony offset
 */
export interface HarmonyOffset {
  value: Divisions;
  sound?: YesNo;
}

/**
 * Figured bass element
 */
export interface FiguredBassShape extends PrintStyleAlign, PrintObject, PlacementAttributes, OptionalUniqueId {
  figures: Figure[];
  duration?: Divisions;
  editorial?: Editorial;
  parentheses?: YesNo;
}

/**
 * Figure element
 */
export interface FigureShape extends OptionalUniqueId {
  prefix?: StyleText;
  figureNumber?: StyleText;
  suffix?: StyleText;
  extend?: FigureExtend;
  editorial?: Editorial;
}

/**
 * Style text
 */
export interface StyleTextShape extends PrintStyle {
  value: string;
}

/**
 * Figure extend
 */
export interface FigureExtendShape extends PrintStyle {
  type?: StartStopContinue;
}
