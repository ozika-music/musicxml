/**
 * MusicXML 4.0 Part and Measure Types
 * Part, measure, and attributes elements
 */

import {
  Bookmark,
  Coda,
  ColorAttribute,
  Divisions,
  Editorial,
  EditorialVoice,
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
  Tenths,
} from './common';
import {
  BarlineLocation,
  BarStyle,
  BackwardForward,
  CancelLocation,
  ClefSign,
  FermataShape,
  Mode,
  NumberLevel,
  ShowFrets,
  StaffType,
  StartStop,
  StartStopContinue,
  StartStopDiscontinue,
  SymbolSize,
  TimeSeparator,
  TimeSymbol,
  UprightInverted,
  Winged,
  YesNo,
} from './enums';
import { Note } from './note';
import { Print } from './score';
import { Direction, Harmony, FiguredBass } from './direction';

/**
 * Part element (containing measures)
 */
export interface PartShape {
  id: string;
  measures: Measure[];
}

/**
 * Measure element
 */
export interface MeasureShape extends OptionalUniqueId {
  number: string;
  implicit?: YesNo;
  nonControlling?: YesNo;
  width?: Tenths;
  text?: string;
  content: MeasureContent[];
}

/**
 * Measure content - union of all possible elements in a measure
 */
export type MeasureContent =
  | { type: 'note'; data: Note }
  | { type: 'backup'; data: Backup }
  | { type: 'forward'; data: Forward }
  | { type: 'direction'; data: Direction }
  | { type: 'attributes'; data: Attributes }
  | { type: 'harmony'; data: Harmony }
  | { type: 'figured-bass'; data: FiguredBass }
  | { type: 'print'; data: Print }
  | { type: 'sound'; data: Sound }
  | { type: 'listening'; data: Listening }
  | { type: 'barline'; data: Barline }
  | { type: 'grouping'; data: Grouping }
  | { type: 'link'; data: Link }
  | { type: 'bookmark'; data: Bookmark };

/**
 * Backup element - move backwards in time
 */
export interface BackupShape {
  duration: Divisions;
  editorial?: Editorial;
}

/**
 * Forward element - move forward in time without notes
 */
export interface ForwardShape extends EditorialVoice {
  duration: Divisions;
  staff?: number;
}

/**
 * Attributes element
 */
export interface AttributesShape extends Editorial, OptionalUniqueId {
  divisions?: Divisions;
  keys?: Key[];
  times?: Time[];
  staves?: number;
  partSymbol?: PartSymbol;
  instruments?: number;
  clefs?: Clef[];
  staffDetails?: StaffDetails[];
  transposes?: Transpose[];
  forParts?: ForPart[];
  directives?: Directive[];
  measureStyles?: MeasureStyle[];
}

// attributes is modeled as a class; see ./part/attributes.
import { Attributes } from './part/attributes';
export { Attributes };
import { Backup, Forward } from './part/backup-forward';
export { Backup, Forward };
import { Barline, BarStyleElement, Ending, FermataBarline, Repeat, WavyLineBarline } from './part/barline';
export { Barline, BarStyleElement, Ending, FermataBarline, Repeat, WavyLineBarline };
import { MidiDeviceSound, MidiInstrumentSound, Offset, PlaySound, Sound, Swing } from './part/sound';
export { MidiDeviceSound, MidiInstrumentSound, Offset, PlaySound, Sound, Swing };
import { Feature, Grouping, Link, Listening, OtherListening, Sync } from './part/measure-misc';
export { Feature, Grouping, Link, Listening, OtherListening, Sync };
import { Measure, Part } from './part/measure';
export { Measure, Part };

/**
 * Key signature
 */
export interface KeyShape extends PrintStyle, PrintObject, OptionalUniqueId {
  number?: number;
  // Traditional key
  cancel?: Cancel;
  fifths?: number;
  mode?: Mode;
  // Non-traditional key
  keySteps?: KeyStep[];
  keyOctaves?: KeyOctave[];
}

// key is modeled as a class; see ./part/key.
import { Key } from './part/key';
export { Key };

/**
 * Cancel element for key changes
 */
export interface Cancel {
  value: number;
  location?: CancelLocation;
}

/**
 * Non-traditional key step
 */
export interface KeyStep {
  step: string;
  alter: number;
  accidental?: KeyAccidental;
}

/**
 * Key accidental
 */
export interface KeyAccidental extends PrintStyle {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Key octave
 */
export interface KeyOctave {
  number: number;
  value: number;
  cancel?: YesNo;
}

/**
 * Time signature
 */
export interface TimeShape extends PrintStyleAlign, PrintObject, OptionalUniqueId {
  number?: number;
  symbol?: TimeSymbol;
  separator?: TimeSeparator;
  // Standard time signature
  beats?: string[];
  beatTypes?: string[];
  interchangeable?: Interchangeable;
  // No time signature
  senzaMisura?: string;
}

// time is modeled as a class; see ./part/time.
import { Time } from './part/time';
export { Time };
export type { TimeSignature } from './part/time';

/**
 * Interchangeable time signature
 */
export interface Interchangeable {
  symbol?: TimeSymbol;
  separator?: TimeSeparator;
  timeRelation?: string;
  beats: string[];
  beatTypes: string[];
}

/**
 * Part symbol
 */
export interface PartSymbolShape extends Position, ColorAttribute {
  value: 'none' | 'brace' | 'line' | 'bracket' | 'square';
  topStaff?: number;
  bottomStaff?: number;
}

// part-symbol is modeled as a class; see ./part/part-symbol.
import { PartSymbol } from './part/part-symbol';
export { PartSymbol };

/**
 * Clef element
 */
export interface ClefShape extends PrintStyle, PrintObject, OptionalUniqueId {
  number?: number;
  additional?: YesNo;
  size?: SymbolSize;
  afterBarline?: YesNo;
  sign: ClefSign;
  line?: number;
  clefOctaveChange?: number;
}

// clef is modeled as a class; see ./part/clef.
import { Clef } from './part/clef';
export { Clef };

/**
 * Staff details
 */
export interface StaffDetailsShape extends PrintObject {
  number?: number;
  showFrets?: ShowFrets;
  printSpacing?: YesNo;
  staffType?: StaffType;
  staffLines?: number;
  lineDetails?: LineDetail[];
  staffTunings?: StaffTuning[];
  capo?: number;
  staffSize?: number;
}

// staff-details is modeled as a class; see ./part/staff-details.
import { StaffDetails } from './part/staff-details';
export { StaffDetails };

/**
 * Line detail
 */
export interface LineDetail extends ColorAttribute, LineTypeAttributes, PrintObject {
  line: number;
  width?: Tenths;
}

/**
 * Staff tuning
 */
export interface StaffTuning {
  line: number;
  tuningStep: string;
  tuningAlter?: number;
  tuningOctave: number;
}

/**
 * Transpose element
 */
export interface TransposeShape extends OptionalUniqueId {
  number?: number;
  diatonic?: number;
  chromatic: number;
  octaveChange?: number;
  double?: boolean;
}

// transpose is modeled as a class; see ./part/transpose.
import { Transpose } from './part/transpose';
export { Transpose };

/**
 * For-part element
 */
export interface ForPart extends OptionalUniqueId {
  number?: number;
  partClef?: PartClef;
  partTranspose?: PartTranspose;
}

/**
 * Part clef
 */
export interface PartClef {
  sign: ClefSign;
  line?: number;
  clefOctaveChange?: number;
}

/**
 * Part transpose
 */
export interface PartTranspose {
  diatonic?: number;
  chromatic: number;
  octaveChange?: number;
  double?: boolean;
}

/**
 * Directive element
 */
export interface Directive extends PrintStyle {
  value: string;
  lang?: string;
}

/**
 * Measure style
 */
export interface MeasureStyle extends Font, ColorAttribute, OptionalUniqueId {
  number?: number;
  multipleRest?: MultipleRest;
  measureRepeat?: MeasureRepeat;
  beatRepeat?: BeatRepeat;
  slash?: Slash;
}

/**
 * Multiple rest
 */
export interface MultipleRest {
  value: number;
  useSymbols?: YesNo;
}

/**
 * Measure repeat
 */
export interface MeasureRepeat {
  type: StartStop;
  slashes?: number;
  value?: number;
}

/**
 * Beat repeat
 */
export interface BeatRepeat {
  type: StartStop;
  slashes?: number;
  useDots?: YesNo;
  slashType?: string;
  slashDots?: number;
  exceptVoice?: string;
}

/**
 * Slash element
 */
export interface Slash {
  type: StartStop;
  useDots?: YesNo;
  useStems?: YesNo;
  slashType?: string;
  slashDots?: number;
  exceptVoice?: string;
}

/**
 * Barline element
 */
export interface BarlineShape extends Editorial, OptionalUniqueId {
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
}

/**
 * Bar style element
 */
export interface BarStyleElementShape extends ColorAttribute {
  value: BarStyle;
}

/**
 * Wavy line in barline
 */
export interface WavyLineBarlineShape extends Position, PlacementAttributes, ColorAttribute, OptionalUniqueId {
  type: StartStopContinue;
  number?: NumberLevel;
  smufl?: SmuflGlyphName;
}

// Note: Segno and Coda are imported from common.ts

/**
 * Fermata in barline
 */
export interface FermataBarlineShape extends PrintStyle, OptionalUniqueId {
  value: FermataShape;
  type?: UprightInverted;
}

/**
 * Ending element
 */
export interface EndingShape extends PrintStyle, PrintObject, OptionalUniqueId {
  number: string;
  type: StartStopDiscontinue;
  system?: 'only-top' | 'only-bottom' | 'also-top' | 'also-bottom';
  endLength?: Tenths;
  textX?: Tenths;
  textY?: Tenths;
  value?: string;
}

/**
 * Repeat element
 */
export interface RepeatShape {
  direction: BackwardForward;
  times?: number;
  afterJump?: YesNo;
  winged?: Winged;
}

/**
 * Sound element
 */
export interface SoundShape extends OptionalUniqueId {
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
  offset?: Offset;
  midiDevices?: MidiDeviceSound[];
  midiInstruments?: MidiInstrumentSound[];
  plays?: PlaySound[];
  swing?: Swing;
}

/**
 * Offset element
 */
export interface OffsetShape {
  value: Divisions;
  sound?: YesNo;
}

/**
 * MIDI device in sound
 */
export interface MidiDeviceSoundShape {
  id?: string;
  port?: number;
  value?: string;
}

/**
 * MIDI instrument in sound
 */
export interface MidiInstrumentSoundShape {
  id: string;
  midiChannel?: number;
  midiName?: string;
  midiBank?: number;
  midiProgram?: number;
  midiUnpitched?: number;
  volume?: number;
  pan?: number;
  elevation?: number;
}

/**
 * Play in sound
 */
export interface PlaySoundShape {
  id?: string;
  ipa?: string;
  mute?: string;
  semiPitched?: string;
  otherPlay?: { type: string; value: string };
}

/**
 * Swing element
 */
export interface SwingShape {
  straight?: boolean;
  first?: number;
  second?: number;
  swingType?: string;
  swingStyle?: string;
}

/**
 * Listening element
 */
export interface ListeningShape {
  sync?: Sync;
  otherListening?: OtherListening;
  offset?: Offset;
}

/**
 * Sync element
 */
export interface SyncShape {
  type: StartStop;
  latency?: number;
  player?: string;
  timeOnly?: string;
}

/**
 * Other listening
 */
export interface OtherListeningShape {
  type: string;
  player?: string;
  timeOnly?: string;
  value: string;
}

/**
 * Grouping element
 */
export interface GroupingShape extends OptionalUniqueId {
  type: 'start' | 'stop' | 'single';
  number?: string;
  memberOf?: string;
  features?: Feature[];
}

/**
 * Feature element
 */
export interface FeatureShape {
  type?: string;
  value: string;
}

/**
 * Link element
 */
export interface LinkShape extends Position, OptionalUniqueId {
  href: string;
  type?: 'simple';
  role?: string;
  title?: string;
  show?: 'new' | 'replace' | 'embed' | 'other' | 'none';
  actuate?: 'onRequest' | 'onLoad' | 'other' | 'none';
  name?: string;
  element?: string;
  position?: number;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
}

// Note: Bookmark is defined in score.ts to avoid duplicate exports
