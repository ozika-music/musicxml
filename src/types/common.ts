/**
 * MusicXML 4.0 Common Types
 * Shared attribute groups and formatting types
 */

import {
  AboveBelow,
  CssFontSize,
  EnclosureShape,
  FontStyle,
  FontWeight,
  LeftCenterRight,
  LineShape,
  LineType,
  NumberOfLines,
  TextDirection,
  Valign,
  YesNo,
} from './enums';

/**
 * Color represented as hex RGB or ARGB
 * Examples: "#800080" (purple), "#40800080" (transparent purple)
 */
export type Color = string;

/**
 * Tenths - a number representing tenths of interline staff space
 */
export type Tenths = number;

/**
 * Divisions - divisions per quarter note
 */
export type Divisions = number;

/**
 * Positive divisions
 */
export type PositiveDivisions = number;

/**
 * Percent (0-100)
 */
export type Percent = number;

/**
 * Rotation degrees (-180 to 180)
 */
export type RotationDegrees = number;

/**
 * MIDI values
 */
export type Midi16 = number; // 1-16
export type Midi128 = number; // 1-128
export type Midi16384 = number; // 1-16384

/**
 * Font size - can be numeric or CSS keyword
 */
export type FontSize = number | CssFontSize;

/**
 * Position attributes
 */
export interface Position {
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
}

/**
 * Placement attributes
 */
export interface PlacementAttributes {
  placement?: AboveBelow;
}

/**
 * Orientation attributes
 */
export interface OrientationAttributes {
  orientation?: 'over' | 'under';
}

/**
 * Font attributes
 */
export interface Font {
  fontFamily?: string;
  fontStyle?: FontStyle;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
}

/**
 * Color attribute
 */
export interface ColorAttribute {
  color?: Color;
}

/**
 * Print style attributes
 */
export interface PrintStyle extends Position, Font, ColorAttribute {}

/**
 * Print style alignment
 */
export interface PrintStyleAlign extends PrintStyle {
  halign?: LeftCenterRight;
  valign?: Valign;
}

/**
 * Text formatting attributes
 */
export interface TextFormatting extends PrintStyleAlign {
  justify?: LeftCenterRight;
  textDecoration?: {
    underline?: NumberOfLines;
    overline?: NumberOfLines;
    lineThrough?: NumberOfLines;
  };
  textRotation?: RotationDegrees;
  letterSpacing?: number | 'normal';
  lineHeight?: number | 'normal';
  lang?: string;
  space?: 'default' | 'preserve';
  dir?: TextDirection;
  enclosure?: EnclosureShape;
}

/**
 * Symbol formatting attributes
 */
export interface SymbolFormatting extends PrintStyleAlign {
  justify?: LeftCenterRight;
  textDecoration?: {
    underline?: NumberOfLines;
    overline?: NumberOfLines;
    lineThrough?: NumberOfLines;
  };
  textRotation?: RotationDegrees;
  letterSpacing?: number | 'normal';
  lineHeight?: number | 'normal';
  dir?: TextDirection;
  enclosure?: EnclosureShape;
}

/**
 * Level display attributes
 */
export interface LevelDisplay {
  bracket?: YesNo;
  size?: 'full' | 'cue' | 'grace-cue' | 'large';
  parentheses?: YesNo;
}

/**
 * Line type attributes
 */
export interface LineTypeAttributes {
  lineType?: LineType;
}

/**
 * Line shape attributes
 */
export interface LineShapeAttributes {
  lineShape?: LineShape;
}

/**
 * Dashed formatting attributes
 */
export interface DashedFormatting {
  dashLength?: Tenths;
  spaceLength?: Tenths;
}

/**
 * Print object attribute
 */
export interface PrintObject {
  printObject?: YesNo;
}

/**
 * Print spacing attribute
 */
export interface PrintSpacing {
  printSpacing?: YesNo;
}

/**
 * Printout attributes
 */
export interface Printout extends PrintObject {
  printDot?: YesNo;
  printLyric?: YesNo;
}

/**
 * Optional unique ID
 */
export interface OptionalUniqueId {
  id?: string;
}

/**
 * Bezier attributes for curved lines
 */
export interface Bezier {
  bezierX?: Tenths;
  bezierY?: Tenths;
  bezierX2?: Tenths;
  bezierY2?: Tenths;
  bezierOffset?: Divisions;
  bezierOffset2?: Divisions;
}

/**
 * Trill sound attributes
 */
export interface TrillSound {
  startNote?: 'upper' | 'main' | 'below';
  trillStep?: 'whole' | 'half' | 'unison';
  twoNoteTurn?: 'whole' | 'half' | 'none';
  accelerate?: YesNo;
  beats?: number;
  secondBeat?: Percent;
  lastBeat?: Percent;
}

/**
 * Bend sound attributes
 */
export interface BendSound {
  accelerate?: YesNo;
  beats?: number;
  firstBeat?: Percent;
  lastBeat?: Percent;
}

/**
 * Image source attributes
 */
export interface ImageSource {
  source: string;
  type: string;
}

/**
 * Link attributes (XLink)
 */
export interface LinkAttributes {
  href: string;
  type?: 'simple';
  role?: string;
  title?: string;
  show?: 'new' | 'replace' | 'embed' | 'other' | 'none';
  actuate?: 'onRequest' | 'onLoad' | 'other' | 'none';
}

/**
 * Document attributes
 */
export interface DocumentAttributes {
  version?: string;
}

/**
 * Time only attribute - comma-separated list of repeat pass numbers
 */
export type TimeOnly = string;

/**
 * SMuFL glyph name
 */
export type SmuflGlyphName = string;

/**
 * Ending number - comma-separated list or spaces
 */
export type EndingNumber = string;

/**
 * Editorial and voice elements
 */
export interface Editorial {
  footnote?: FormattedText;
  level?: Level;
}

/** The editorial-voice group supports the common combination of editorial and voice information for a musical element. */
export interface EditorialVoice extends Editorial {
  voice?: string;
}

/**
 * Formatted text
 */
export interface FormattedText extends TextFormatting {
  value: string;
}

/**
 * Formatted text with ID
 */
export interface FormattedTextId extends FormattedText, OptionalUniqueId {}

/**
 * Level element
 */
export interface Level extends LevelDisplay {
  value: string;
  reference?: YesNo;
}

/**
 * Empty element with position
 */
export interface EmptyPosition extends Position {}

/**
 * Empty element with print style
 */
export interface EmptyPrintStyle extends PrintStyle {}

/**
 * Empty element with print style and placement
 */
export interface EmptyPrintStylePlacement extends PrintStyle, PlacementAttributes {}

/**
 * Empty element with print style align
 */
export interface EmptyPrintStyleAlign extends PrintStyleAlign {}

/**
 * Empty element with print style align and ID
 */
export interface EmptyPrintStyleAlignId extends PrintStyleAlign, OptionalUniqueId {}

/**
 * Empty line element
 */
export interface EmptyLine extends Position, ColorAttribute, PlacementAttributes, LineTypeAttributes, DashedFormatting {}

// name-display is modeled as a class (data + element conversion); see ./common/name-display.
export { NameDisplay } from './common/name-display';
export { Segno, Coda } from './common/segno-coda';
export { Bookmark } from './common/bookmark';

/**
 * Display text
 */
export interface DisplayText extends TextFormatting {
  value: string;
}

/**
 * Accidental text
 */
export interface AccidentalText extends PrintStyle {
  value: string;
  smufl?: SmuflGlyphName;
}

/**
 * Typed text with optional attributes
 */
export interface TypedText extends PrintStyle {
  value: string;
  type?: string;
}
/**
 * Segno element
 */
export interface SegnoShape extends PrintStyleAlign, OptionalUniqueId {
  smufl?: SmuflGlyphName;
}

/**
 * Coda element
 */
export interface CodaShape extends PrintStyleAlign, OptionalUniqueId {
  smufl?: SmuflGlyphName;
}

/**
 * Bookmark element
 */
export interface BookmarkShape {
  id: string;
  name?: string;
  element?: string;
  position?: number;
}