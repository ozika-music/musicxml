/**
 * MusicXML 4.0 Score Types
 * Top-level score elements and identification
 */

import {
  ColorAttribute,
  DocumentAttributes,
  Editorial,
  Font,
  FormattedTextId,
  ImageSource,
  LinkAttributes,
  NameDisplay,
  OptionalUniqueId,
  Position,
  PrintObject,
  PrintStyleAlign,
  SymbolFormatting,
  Tenths,
} from './common';
import { GroupBarlineValue, GroupSymbolValue, LeftCenterRight, PartGroupType, YesNo } from './enums';
import { Part } from './part';

/**
 * Score Partwise - the main document type for part-oriented scores
 */
export interface ScorePartwiseShape extends DocumentAttributes {
  work?: Work;
  movementNumber?: string;
  movementTitle?: string;
  identification?: Identification;
  defaults?: Defaults;
  credits?: Credit[];
  partList: PartList;
  parts: Part[];
}

/**
 * Score Timewise - the main document type for time-oriented scores
 */
export interface ScoreTimewise extends DocumentAttributes {
  work?: Work;
  movementNumber?: string;
  movementTitle?: string;
  identification?: Identification;
  defaults?: Defaults;
  credits?: Credit[];
  partList: PartList;
  measures: TimewiseMeasure[];
}

/**
 * Timewise measure containing parts
 */
export interface TimewiseMeasure {
  number: string;
  implicit?: YesNo;
  nonControlling?: YesNo;
  width?: Tenths;
  id?: string;
  text?: string;
  parts: TimewisePart[];
}

/**
 * Part within a timewise measure
 */
export interface TimewisePart {
  id: string;
  // Contains the same content as a Measure
}

/**
 * Work element - identifies the work
 */
// work is modeled as a class; see ./score/work.
import { Work } from './score/work';
export { Work };

/**
 * Opus - link to opus document
 */
export interface Opus extends LinkAttributes {}

// identification (+ encoding/supports/miscellaneous) modeled as classes; see ./score/identification.
import { Identification, Encoding, Supports, Miscellaneous, MiscellaneousField } from './score/identification';
export { Identification, Encoding, Supports, Miscellaneous, MiscellaneousField };

/**
 * Defaults element
 */
export interface DefaultsShape {
  scaling?: Scaling;
  concertScore?: boolean;
  pageLayout?: PageLayout;
  systemLayout?: SystemLayout;
  staffLayout?: StaffLayout[];
  appearance?: Appearance;
  musicFont?: Font;
  wordFont?: Font;
  lyricFonts?: LyricFont[];
  lyricLanguages?: LyricLanguage[];
}

// defaults is modeled as a class; see ./score/defaults.
import { Defaults } from './score/defaults';
export { Defaults };
import { Print } from './score/print';
export { Print };
import { ScorePartwise } from './score/score-partwise';
export { ScorePartwise };
import { MeasureLayout, MeasureNumbering, PageLayout, StaffLayout, SystemLayout } from './score/layout';
export { MeasureLayout, MeasureNumbering, PageLayout, StaffLayout, SystemLayout };

/**
 * Scaling - millimeters per tenths
 */
export interface Scaling {
  millimeters: number;
  tenths: number;
}

/**
 * Page layout
 */
export interface PageLayoutShape {
  pageHeight?: Tenths;
  pageWidth?: Tenths;
  pageMargins?: PageMargins[];
}

/**
 * Page margins
 */
export interface PageMargins {
  type?: 'odd' | 'even' | 'both';
  leftMargin: Tenths;
  rightMargin: Tenths;
  topMargin: Tenths;
  bottomMargin: Tenths;
}

/**
 * System layout
 */
export interface SystemLayoutShape {
  systemMargins?: SystemMargins;
  systemDistance?: Tenths;
  topSystemDistance?: Tenths;
  systemDividers?: SystemDividers;
}

/**
 * System margins
 */
export interface SystemMargins {
  leftMargin: Tenths;
  rightMargin: Tenths;
}

/**
 * System dividers
 */
export interface SystemDividers {
  leftDivider?: EmptyPrintObjectStyleAlign;
  rightDivider?: EmptyPrintObjectStyleAlign;
}

/**
 * Empty print object style align
 */
export interface EmptyPrintObjectStyleAlign extends PrintStyleAlign, PrintObject {}

/**
 * Staff layout
 */
export interface StaffLayoutShape {
  number?: number;
  staffDistance?: Tenths;
}

/**
 * Appearance settings
 */
export interface Appearance {
  lineWidths?: LineWidth[];
  noteSizes?: NoteSize[];
  distances?: Distance[];
  glyphs?: Glyph[];
  otherAppearances?: OtherAppearance[];
}

/**
 * Line width
 */
export interface LineWidth {
  type: string;
  value: Tenths;
}

/**
 * Note size
 */
export interface NoteSize {
  type: 'cue' | 'grace' | 'grace-cue' | 'large';
  value: number;
}

/**
 * Distance
 */
export interface Distance {
  type: string;
  value: Tenths;
}

/**
 * Glyph
 */
export interface Glyph {
  type: string;
  value: string;
}

/**
 * Other appearance
 */
export interface OtherAppearance {
  type: string;
  value: string;
}

/**
 * Lyric font
 */
export interface LyricFont extends Font {
  number?: string;
  name?: string;
}

/**
 * Lyric language
 */
export interface LyricLanguage {
  number?: string;
  name?: string;
  lang: string;
}

// credit is modeled as a class; see ./score/credit.
import { Credit } from './score/credit';
export { Credit };

/**
 * Credit image
 */
export interface CreditImage extends ImageSource, Position {
  halign?: LeftCenterRight;
  valign?: 'top' | 'middle' | 'bottom';
  height?: Tenths;
  width?: Tenths;
  id?: string;
}

/**
 * Credit words
 */
export interface CreditWords extends FormattedTextId {}

/**
 * Credit symbol
 */
export interface CreditSymbol extends SymbolFormatting, OptionalUniqueId {
  value: string;
}

// Note: Bookmark is imported from common.ts

/**
 * One ordered entry of a part-list: a score-part, or a part-group boundary
 * (`type: 'start' | 'stop'`). Preserves the document order that the flat
 * `scoreParts` / `partGroups` arrays cannot represent.
 */
export type PartListItem =
  | { kind: 'score-part'; scorePart: ScorePart }
  | { kind: 'part-group'; partGroup: PartGroup };

// score-part is modeled as a class (data + behavior); see ./score/score-part.
import { ScorePart } from './score/score-part';
export { ScorePart };
export type { ExtractedScoreMetadata } from './score/score-partwise';

// The part-list is modeled as a class (data + editing API); see ./score/part-list.
import { PartList } from './score/part-list';
export { PartList };
export type { PartListGroupSpan, PartListDeletion, AddScorePartOptions } from './score/part-list';

/**
 * Part group
 */
export interface PartGroup extends Editorial, OptionalUniqueId {
  type: PartGroupType;
  number?: string;
  groupName?: GroupName;
  groupNameDisplay?: NameDisplay;
  groupAbbreviation?: GroupName;
  groupAbbreviationDisplay?: NameDisplay;
  groupSymbol?: GroupSymbol;
  groupBarline?: GroupBarline;
  groupTime?: boolean;
}

// group-name is modeled as a class (data + element conversion); see ./common/group-name.
import { GroupName } from './common/group-name';
export { GroupName };

/**
 * Group symbol
 */
export interface GroupSymbol extends Position, ColorAttribute {
  value: GroupSymbolValue;
}

/**
 * Group barline
 */
export interface GroupBarline extends ColorAttribute {
  value: GroupBarlineValue;
}

/**
 * Score part — data shape; the class lives in ./score/score-part.
 */
export interface ScorePartShape {
  id: string;
  identification?: Identification;
  partLinks?: PartLink[];
  partName: PartName;
  partNameDisplay?: NameDisplay;
  partAbbreviation?: PartName;
  partAbbreviationDisplay?: NameDisplay;
  groups?: string[];
  scoreInstruments?: ScoreInstrument[];
  players?: Player[];
  midiDevices?: MidiDevice[];
  midiInstruments?: MidiInstrument[];
}

// score-header element types are modeled as classes; see ./score/*.
import { ScoreInstrument, VirtualInstrument } from './score/score-instrument';
import { MidiDevice, MidiInstrument } from './score/midi';
import { Player } from './score/player';
import { PartLink, InstrumentLink } from './score/part-link';
import { PartName } from './score/part-name';
export { ScoreInstrument, VirtualInstrument, MidiDevice, MidiInstrument, Player, PartLink, InstrumentLink, PartName };

/**
 * Print element for layout control
 */
export interface PrintShape extends OptionalUniqueId {
  staffSpacing?: Tenths;
  newSystem?: YesNo;
  newPage?: YesNo;
  blankPage?: number;
  pageNumber?: string;
  pageLayout?: PageLayout;
  systemLayout?: SystemLayout;
  staffLayouts?: StaffLayout[];
  measureLayout?: MeasureLayout;
  measureNumbering?: MeasureNumbering;
  partNameDisplay?: NameDisplay;
  partAbbreviationDisplay?: NameDisplay;
}

/**
 * Measure layout
 */
export interface MeasureLayoutShape {
  measureDistance?: Tenths;
}

/**
 * Measure numbering
 */
export interface MeasureNumberingShape extends PrintStyleAlign {
  value: 'none' | 'measure' | 'system';
  system?: 'only-top' | 'only-bottom' | 'also-top' | 'also-bottom';
  staff?: number;
  multipleRestAlways?: YesNo;
  multipleRestRange?: YesNo;
}
