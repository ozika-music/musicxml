/**
 * MusicXML 4.0 Enum Types
 * Based on official MusicXML 4.0 specification
 */

// Basic directional enums
/** The above-below type is used to indicate whether one element appears above or below another element. */
export enum AboveBelow { Above = 'above', Below = 'below' }
/** The up-down type is used for the direction of arrows and other pointed symbols like vertical accents, indicating which way the tip is pointing. */
export enum UpDown { Up = 'up', Down = 'down' }
/** The top-bottom type is used to indicate the top or bottom part of a vertical shape like non-arpeggiate. */
export enum TopBottom { Top = 'top', Bottom = 'bottom' }
/** The left-right type is used to indicate whether one element appears to the left or the right of another element. */
export enum LeftRight { Left = 'left', Right = 'right' }
/** The left-center-right type is used to define horizontal alignment and text justification. */
export enum LeftCenterRight { Left = 'left', Center = 'center', Right = 'right' }
/** The over-under type is used to indicate whether the tips of curved lines such as slurs and ties are overhand (tips down) or underhand (tips up). */
export enum OverUnder { Over = 'over', Under = 'under' }
// YesNo stays a union for now: extremely high fan-out (print-object, many flags).
/** The yes-no type is used for boolean-like attributes. We cannot use W3C XML Schema booleans due to their restrictions on expression of boolean values. */
export type YesNo = 'yes' | 'no';

// Start/Stop enums
/** The start-stop type is used for an attribute of musical elements that can either start or stop, such as tuplets. The values of start and stop refer to how an element appears in musical score order, not in MusicXML document order. An element with a stop attribute may precede the corresponding element with a start attribute within a MusicXML document. This is particularly common in multi-staff music. For example, the stopping point for a tuplet may appear in staff 1 before the starting point for the tuplet appears in staff 2 later in the document. When multiple elements with the same tag are used within the same note, their order within the MusicXML document should match the musical score order. */
export enum StartStop { Start = 'start', Stop = 'stop' }
/** The start-stop-continue type is used for an attribute of musical elements that can either start or stop, but also need to refer to an intermediate point in the symbol, as for complex slurs or for formatting of symbols across system breaks. The values of start, stop, and continue refer to how an element appears in musical score order, not in MusicXML document order. An element with a stop attribute may precede the corresponding element with a start attribute within a MusicXML document. This is particularly common in multi-staff music. For example, the stopping point for a slur may appear in staff 1 before the starting point for the slur appears in staff 2 later in the document. When multiple elements with the same tag are used within the same note, their order within the MusicXML document should match the musical score order. For example, a note that marks both the end of one slur and the start of a new slur should have the incoming slur element with a type of stop precede the outgoing slur element with a type of start. */
export enum StartStopContinue { Start = 'start', Stop = 'stop', Continue = 'continue' }
/** The start-stop-single type is used for an attribute of musical elements that can be used for either multi-note or single-note musical elements, as for groupings. When multiple elements with the same tag are used within the same note, their order within the MusicXML document should match the musical score order. */
export enum StartStopSingle { Start = 'start', Stop = 'stop', Single = 'single' }
/** The start-stop-discontinue type is used to specify ending types. Typically, the start type is associated with the left barline of the first measure in an ending. The stop and discontinue types are associated with the right barline of the last measure in an ending. Stop is used when the ending mark concludes with a downward jog, as is typical for first endings. Discontinue is used when there is no downward jog, as is typical for second endings that do not conclude a piece. */
export enum StartStopDiscontinue { Start = 'start', Stop = 'stop', Discontinue = 'discontinue' }
/** The tied-type type is used as an attribute of the tied element to specify where the visual representation of a tie begins and ends. A tied element which joins two notes of the same pitch can be specified with tied-type start on the first note and tied-type stop on the second note. To indicate a note should be undamped, use a single tied element with tied-type let-ring. For other ties that are visually attached to a single note, such as a tie leading into or out of a repeated section or coda, use two tied elements on the same note, one start and one stop. In start-stop cases, ties can add more elements using a continue type. This is typically used to specify the formatting of cross-system ties. When multiple elements with the same tag are used within the same note, their order within the MusicXML document should match the musical score order. For example, a note with a tie at the end of a first ending should have the tied element with a type of start precede the tied element with a type of stop. */
export enum TiedType { Start = 'start', Stop = 'stop', Continue = 'continue', LetRing = 'let-ring' }
/** The tremolo-type is used to distinguish double-note, single-note, and unmeasured tremolos. */
export enum TremoloType { Start = 'start', Stop = 'stop', Single = 'single', Unmeasured = 'unmeasured' }
/** The backward-forward type is used to specify repeat directions. The start of the repeat has a forward direction while the end of the repeat has a backward direction. */
export enum BackwardForward { Backward = 'backward', Forward = 'forward' }

/** The clef-sign type represents the different clef symbols. The jianpu sign indicates that the music that follows should be in jianpu numbered notation, just as the TAB sign indicates that the music that follows should be in tablature notation. Unlike TAB, a jianpu sign does not correspond to a visual clef notation. The none sign is deprecated as of MusicXML 4.0. Use the clef element's print-object attribute instead. When the none sign is used, notes should be displayed as if in treble clef. */
export enum ClefSign {
  G = 'G',
  F = 'F',
  C = 'C',
  Percussion = 'percussion',
  Tab = 'TAB',
  Jianpu = 'jianpu',
  None = 'none',
}

/** The note-type-value type is used for the MusicXML type element and represents the graphic note type, from 1024th (shortest) to maxima (longest). */
export enum NoteTypeValue {
  OneThousandTwentyFourth = '1024th',
  FiveHundredTwelfth = '512th',
  TwoHundredFiftySixth = '256th',
  OneHundredTwentyEighth = '128th',
  SixtyFourth = '64th',
  ThirtySecond = '32nd',
  Sixteenth = '16th',
  Eighth = 'eighth',
  Quarter = 'quarter',
  Half = 'half',
  Whole = 'whole',
  Breve = 'breve',
  Long = 'long',
  Maxima = 'maxima',
}

/** The step type (pitch names) represents a step of the diatonic scale, represented using the English letters A through G. */
export enum Step { A = 'A', B = 'B', C = 'C', D = 'D', E = 'E', F = 'F', G = 'G' }

/** The stem-value type represents the notated stem direction. */
export enum StemValue { Down = 'down', Up = 'up', Double = 'double', None = 'none' }

/** The beam-value type represents the type of beam associated with each of 8 beam levels (up to 1024th notes) available for each note. */
export enum BeamValue {
  Begin = 'begin',
  Continue = 'continue',
  End = 'end',
  ForwardHook = 'forward hook',
  BackwardHook = 'backward hook',
}

/** The accidental-value type represents notated accidentals supported by MusicXML. In the MusicXML 2.0 DTD this was a string with values that could be included. The XSD strengthens the data typing to an enumerated list. The quarter- and three-quarters- accidentals are Tartini-style quarter-tone accidentals. The -down and -up accidentals are quarter-tone accidentals that include arrows pointing down or up. The slash- accidentals are used in Turkish classical music. The numbered sharp and flat accidentals are superscripted versions of the accidental signs, used in Turkish folk music. The sori and koron accidentals are microtonal sharp and flat accidentals used in Iranian and Persian music. The other accidental covers accidentals other than those listed here. It is usually used in combination with the smufl attribute to specify a particular SMuFL accidental. The smufl attribute may be used with any accidental value to help specify the appearance of symbols that share the same MusicXML semantics. */
export enum AccidentalValue {
  Sharp = 'sharp',
  Natural = 'natural',
  Flat = 'flat',
  DoubleSharp = 'double-sharp',
  SharpSharp = 'sharp-sharp',
  FlatFlat = 'flat-flat',
  NaturalSharp = 'natural-sharp',
  NaturalFlat = 'natural-flat',
  QuarterFlat = 'quarter-flat',
  QuarterSharp = 'quarter-sharp',
  ThreeQuartersFlat = 'three-quarters-flat',
  ThreeQuartersSharp = 'three-quarters-sharp',
  SharpDown = 'sharp-down',
  SharpUp = 'sharp-up',
  NaturalDown = 'natural-down',
  NaturalUp = 'natural-up',
  FlatDown = 'flat-down',
  FlatUp = 'flat-up',
  DoubleSharpDown = 'double-sharp-down',
  DoubleSharpUp = 'double-sharp-up',
  FlatFlatDown = 'flat-flat-down',
  FlatFlatUp = 'flat-flat-up',
  ArrowDown = 'arrow-down',
  ArrowUp = 'arrow-up',
  TripleSharp = 'triple-sharp',
  TripleFlat = 'triple-flat',
  SlashQuarterSharp = 'slash-quarter-sharp',
  SlashSharp = 'slash-sharp',
  SlashFlat = 'slash-flat',
  DoubleSlashFlat = 'double-slash-flat',
  Sharp1 = 'sharp-1',
  Sharp2 = 'sharp-2',
  Sharp3 = 'sharp-3',
  Sharp5 = 'sharp-5',
  Flat1 = 'flat-1',
  Flat2 = 'flat-2',
  Flat3 = 'flat-3',
  Flat4 = 'flat-4',
  Sori = 'sori',
  Koron = 'koron',
  Other = 'other',
}

/** The bar-style type represents barline style information. Choices are regular, dotted, dashed, heavy, light-light, light-heavy, heavy-light, heavy-heavy, tick (a short stroke through the top line), short (a partial barline between the 2nd and 4th lines), and none. */
export enum BarStyle {
  Regular = 'regular',
  Dotted = 'dotted',
  Dashed = 'dashed',
  Heavy = 'heavy',
  LightLight = 'light-light',
  LightHeavy = 'light-heavy',
  HeavyLight = 'heavy-light',
  HeavyHeavy = 'heavy-heavy',
  Tick = 'tick',
  Short = 'short',
  None = 'none',
}

/** The right-left-middle type is used to specify barline location. */
export enum BarlineLocation { Right = 'right', Left = 'left', Middle = 'middle' }

/** The winged attribute indicates whether the repeat has winged extensions that appear above and below the barline. The straight and curved values represent single wings, while the double-straight and double-curved values represent double wings. The none value indicates no wings and is the default. */
export enum Winged {
  None = 'none',
  Straight = 'straight',
  Curved = 'curved',
  DoubleStraight = 'double-straight',
  DoubleCurved = 'double-curved',
}

/** The notehead-value type indicates shapes other than the open and closed ovals associated with note durations. The values do, re, mi, fa, fa up, so, la, and ti correspond to Aikin's 7-shape system. The fa up shape is typically used with upstems; the fa shape is typically used with downstems or no stems. The arrow shapes differ from triangle and inverted triangle by being centered on the stem. Slashed and back slashed notes include both the normal notehead and a slash. The triangle shape has the tip of the triangle pointing up; the inverted triangle shape has the tip of the triangle pointing down. The left triangle shape is a right triangle with the hypotenuse facing up and to the left. The other notehead covers noteheads other than those listed here. It is usually used in combination with the smufl attribute to specify a particular SMuFL notehead. The smufl attribute may be used with any notehead value to help specify the appearance of symbols that share the same MusicXML semantics. Noteheads in the SMuFL Note name noteheads and Note name noteheads supplement ranges (U+E150–U+E1AF and U+EEE0–U+EEFF) should not use the smufl attribute or the "other" value, but instead use the notehead-text element. */
export enum NoteheadValue {
  Slash = 'slash',
  Triangle = 'triangle',
  Diamond = 'diamond',
  Square = 'square',
  Cross = 'cross',
  X = 'x',
  CircleX = 'circle-x',
  InvertedTriangle = 'inverted triangle',
  ArrowDown = 'arrow down',
  ArrowUp = 'arrow up',
  Circled = 'circled',
  Slashed = 'slashed',
  BackSlashed = 'back slashed',
  Normal = 'normal',
  Cluster = 'cluster',
  CircleDot = 'circle dot',
  LeftTriangle = 'left triangle',
  Rectangle = 'rectangle',
  None = 'none',
  Do = 'do',
  Re = 're',
  Mi = 'mi',
  Fa = 'fa',
  FaUp = 'fa up',
  So = 'so',
  La = 'la',
  Ti = 'ti',
  Other = 'other',
}

/** The symbol-size type is used to distinguish between full, cue sized, grace cue sized, and oversized symbols. */
export enum SymbolSize { Full = 'full', Cue = 'cue', GraceCue = 'grace-cue', Large = 'large' }

// Font styles
/** The font-style type represents a simplified version of the CSS font-style property. */
export enum FontStyle { Normal = 'normal', Italic = 'italic' }
/** The font-weight type represents a simplified version of the CSS font-weight property. */
export enum FontWeight { Normal = 'normal', Bold = 'bold' }

/** The text-direction type is used to adjust and override the Unicode bidirectional text algorithm, similar to the Directionality data category in the W3C Internationalization Tag Set recommendation. Values are ltr (left-to-right embed), rtl (right-to-left embed), lro (left-to-right bidi-override), and rlo (right-to-left bidi-override). The default value is ltr. This type is typically used by applications that store text in left-to-right visual order rather than logical order. Such applications can use the lro value to better communicate with other applications that more fully support bidirectional text. */
export enum TextDirection { Ltr = 'ltr', Rtl = 'rtl', Lro = 'lro', Rlo = 'rlo' }

// Vertical alignment
/** The valign type is used to indicate vertical alignment to the top, middle, bottom, or baseline of the text. If the text is on multiple lines, baseline alignment refers to the baseline of the lowest line of text. Defaults are implementation-dependent. */
export enum Valign { Top = 'top', Middle = 'middle', Bottom = 'bottom', Baseline = 'baseline' }
/** The valign-image type is used to indicate vertical alignment for images and graphics, so it does not include a baseline value. Defaults are implementation-dependent. */
export enum ValignImage { Top = 'top', Middle = 'middle', Bottom = 'bottom' }

// Line types
/** The line-type type distinguishes between solid, dashed, dotted, and wavy lines. */
export enum LineType { Solid = 'solid', Dashed = 'dashed', Dotted = 'dotted', Wavy = 'wavy' }
/** The line-shape type distinguishes between straight and curved lines. */
export enum LineShape { Straight = 'straight', Curved = 'curved' }

/** The enclosure attribute group is used to specify the formatting of an enclosure around text or symbols. */
export enum EnclosureShape {
  Rectangle = 'rectangle',
  Square = 'square',
  Oval = 'oval',
  Circle = 'circle',
  Bracket = 'bracket',
  InvertedBracket = 'inverted-bracket',
  Triangle = 'triangle',
  Diamond = 'diamond',
  Pentagon = 'pentagon',
  Hexagon = 'hexagon',
  Heptagon = 'heptagon',
  Octagon = 'octagon',
  Nonagon = 'nonagon',
  Decagon = 'decagon',
  None = 'none',
}

/** The fermata text content represents the shape of the fermata sign. An empty fermata element represents a normal fermata. The fermata type is upright if not specified. */
export type FermataShape =
  | 'normal'
  | 'angled'
  | 'square'
  | 'double-angled'
  | 'double-square'
  | 'double-dot'
  | 'half-curve'
  | 'curlew'
  | '';

// Fermata orientation
/** The upright-inverted type describes the appearance of a fermata element. The value is upright if not specified. */
export enum UprightInverted { Upright = 'upright', Inverted = 'inverted' }

/** The mode type is used to specify major/minor and other mode distinctions. Valid mode values include major, minor, dorian, phrygian, lydian, mixolydian, aeolian, ionian, locrian, and none. */
export enum Mode {
  Major = 'major',
  Minor = 'minor',
  Dorian = 'dorian',
  Phrygian = 'phrygian',
  Lydian = 'lydian',
  Mixolydian = 'mixolydian',
  Aeolian = 'aeolian',
  Ionian = 'ionian',
  Locrian = 'locrian',
  None = 'none',
}

// Time signature symbols
/** The time-symbol type indicates how to display a time signature. The normal value is the usual fractional display, and is the implied symbol type if none is specified. Other options are the common and cut time symbols, as well as a single number with an implied denominator. The note symbol indicates that the beat-type should be represented with the corresponding downstem note rather than a number. The dotted-note symbol indicates that the beat-type should be represented with a dotted downstem note that corresponds to three times the beat-type value, and a numerator that is one third the beats value. */
export enum TimeSymbol {
  Common = 'common',
  Cut = 'cut',
  SingleNumber = 'single-number',
  Note = 'note',
  DottedNote = 'dotted-note',
  Normal = 'normal',
}
/** The time-separator type indicates how to display the arrangement between the beats and beat-type values in a time signature. The default value is none. The horizontal, diagonal, and vertical values represent horizontal, diagonal lower-left to upper-right, and vertical lines respectively. For these values, the beats and beat-type values are arranged on either side of the separator line. The none value represents no separator with the beats and beat-type arranged vertically. The adjacent value represents no separator with the beats and beat-type arranged horizontally. */
export enum TimeSeparator {
  None = 'none',
  Horizontal = 'horizontal',
  Diagonal = 'diagonal',
  Vertical = 'vertical',
  Adjacent = 'adjacent',
}

// Staff types
/** The staff-type value can be ossia, editorial, cue, alternate, or regular. An ossia staff represents music that can be played instead of what appears on the regular staff. An editorial staff also represents musical alternatives, but is created by an editor rather than the composer. It can be used for suggested interpretations or alternatives from other sources. A cue staff represents music from another part. An alternate staff shares the same music as the prior staff, but displayed differently (e.g., treble and bass clef, standard notation and tablature). It is not included in playback. An alternate staff provides more information to an application reading a file than encoding the same music in separate parts, so its use is preferred in this situation if feasible. A regular staff is the standard default staff-type. */
export enum StaffType {
  Ossia = 'ossia',
  Editorial = 'editorial',
  Cue = 'cue',
  Alternate = 'alternate',
  Regular = 'regular',
}

/** The show-frets type indicates whether to show tablature frets as numbers (0, 1, 2) or letters (a, b, c). The default choice is numbers. */
export enum ShowFrets { Numbers = 'numbers', Letters = 'letters' }

/**
 * The part-group element indicates groupings of parts in the score, usually indicated by braces and brackets. Braces that are used for multi-staff parts should be defined in the attributes element for that part. The part-group start element appears before the first score-part in the group. The part-group stop element appears after the last score-part in the group.
 * The number attribute is used to distinguish overlapping and nested part-groups, not the sequence of groups. As with parts, groups can have a name and abbreviation. Values for the child elements are ignored at the stop of a group.
 * A part-group element is not needed for a single multi-staff part. By default, multi-staff parts include a brace symbol and (if appropriate given the bar-style) common barlines. The symbol formatting for a multi-staff part can be more fully specified using the part-symbol element.
 */
export enum PartGroupType {
  Start = 'start',
  Stop = 'stop',
}

/** The group-symbol-value type indicates how the symbol for a group or multi-staff part is indicated in the score. */
export enum GroupSymbolValue {
  None = 'none',
  Brace = 'brace',
  Line = 'line',
  Bracket = 'bracket',
  Square = 'square',
}

/** The group-barline-value type indicates if the group should have common barlines. */
export enum GroupBarlineValue {
  Yes = 'yes',
  No = 'no',
  Mensurstrich = 'Mensurstrich',
}

/** The wedge type is crescendo for the start of a wedge that is closed at the left side, diminuendo for the start of a wedge that is closed on the right side, and stop for the end of a wedge. The continue type is used for formatting wedges over a system break, or for other situations where a single wedge is divided into multiple segments. */
export enum WedgeType {
  Crescendo = 'crescendo',
  Diminuendo = 'diminuendo',
  Stop = 'stop',
  Continue = 'continue',
}

/** Dynamic marking values for the dynamics element (the empty-element choices such as p, f, mf, sfz). */
export enum DynamicsValue {
  P = 'p',
  Pp = 'pp',
  Ppp = 'ppp',
  Pppp = 'pppp',
  Ppppp = 'ppppp',
  Pppppp = 'pppppp',
  F = 'f',
  Ff = 'ff',
  Fff = 'fff',
  Ffff = 'ffff',
  Fffff = 'fffff',
  Ffffff = 'ffffff',
  Mp = 'mp',
  Mf = 'mf',
  Sf = 'sf',
  Sfp = 'sfp',
  Sfpp = 'sfpp',
  Fp = 'fp',
  Rf = 'rf',
  Rfz = 'rfz',
  Sfz = 'sfz',
  Sffz = 'sffz',
  Fz = 'fz',
  N = 'n',
  Pf = 'pf',
  Sfzp = 'sfzp',
}

/** The pedal-type simple type is used to distinguish types of pedal directions. The start value indicates the start of a damper pedal, while the sostenuto value indicates the start of a sostenuto pedal. The other values can be used with either the damper or sostenuto pedal. The soft pedal is not included here because there is no special symbol or graphic used for it beyond what can be specified with words and bracket elements. The change, continue, discontinue, and resume types are used when the line attribute is yes. The change type indicates a pedal lift and retake indicated with an inverted V marking. The continue type allows more precise formatting across system breaks and for more complex pedaling lines. The discontinue type indicates the end of a pedal line that does not include the explicit lift represented by the stop type. The resume type indicates the start of a pedal line that does not include the downstroke represented by the start type. It can be used when a line resumes after being discontinued, or to start a pedal line that is preceded by a text or symbol representation of the pedal. */
export enum PedalType {
  Start = 'start',
  Stop = 'stop',
  Sostenuto = 'sostenuto',
  Change = 'change',
  Continue = 'continue',
  Discontinue = 'discontinue',
  Resume = 'resume',
}

/** The up-down-stop-continue type is used for octave-shift elements, indicating the direction of the shift from their true pitched values because of printing difficulty. */
export enum OctaveShiftType { Up = 'up', Down = 'down', Stop = 'stop', Continue = 'continue' }

/** The placement attribute indicates whether something is above or below another element, such as a note or a notation. */
export enum Placement { Above = 'above', Below = 'below' }

/** The orientation attribute indicates whether slurs and ties are overhand (tips down) or underhand (tips up). This is distinct from the placement attribute used by any notation type. */
export enum Orientation { Over = 'over', Under = 'under' }

/** The cancel-location type is used to indicate where a key signature cancellation appears relative to a new key signature: to the left, to the right, or before the barline and to the left. It is left by default. For mid-measure key elements, a cancel-location of before-barline should be treated like a cancel-location of left. */
export enum CancelLocation { Left = 'left', Right = 'right', BeforeBarline = 'before-barline' }

/** Lyric hyphenation is indicated by the syllabic type. The single, begin, end, and middle values represent single-syllable words, word-beginning syllables, word-ending syllables, and mid-word syllables, respectively. */
export enum Syllabic { Single = 'single', Begin = 'begin', End = 'end', Middle = 'middle' }

/** The fan type represents the type of beam fanning present on a note, used to represent accelerandos and ritardandos. */
export enum Fan { Accel = 'accel', Rit = 'rit', None = 'none' }

/** The mute type represents muting for different instruments, including brass, winds, and strings. The on and off values are used for undifferentiated mutes. The remaining values represent specific mutes. */
export enum Mute {
  On = 'on',
  Off = 'off',
  Straight = 'straight',
  Cup = 'cup',
  HarmonNoStem = 'harmon-no-stem',
  HarmonStem = 'harmon-stem',
  Bucket = 'bucket',
  Plunger = 'plunger',
  Hat = 'hat',
  Solotone = 'solotone',
  Practice = 'practice',
  StopMute = 'stop-mute',
  StopHand = 'stop-hand',
  Echo = 'echo',
  Palm = 'palm',
}

/** The semi-pitched type represents categories of indefinite pitch for percussion instruments. */
export enum SemiPitched {
  High = 'high',
  MediumHigh = 'medium-high',
  Medium = 'medium',
  MediumLow = 'medium-low',
  Low = 'low',
  VeryLow = 'very-low',
}

/** The line-length type distinguishes between different line lengths for doit, falloff, plop, and scoop articulations. */
export enum LineLength { Short = 'short', Medium = 'medium', Long = 'long' }

/** The start-note type describes the starting note of trills and mordents for playback, relative to the current note. */
export enum StartNote { Upper = 'upper', Main = 'main', Below = 'below' }

/** The trill-step type describes the alternating note of trills and mordents for playback, relative to the current note. */
export enum TrillStep { Whole = 'whole', Half = 'half', Unison = 'unison' }

/** The two-note-turn type describes the ending notes of trills and mordents for playback, relative to the current note. */
export enum TwoNoteTurn { Whole = 'whole', Half = 'half', None = 'none' }

/** The css-font-size type includes the CSS font sizes used as an alternative to a numeric point size. */
export enum CssFontSize {
  XxSmall = 'xx-small',
  XSmall = 'x-small',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  XLarge = 'x-large',
  XxLarge = 'xx-large',
}

/** The system-relation type distinguishes elements that are associated with a system rather than the particular part where the element appears. A value of only-top indicates that the element should appear only on the top part of the current system. A value of also-top indicates that the element should appear on both the current part and the top part of the current system. If this value appears in a score, when parts are created the element should only appear once in this part, not twice. A value of none indicates that the element is associated only with the current part, not with the system. */
export enum SystemRelation {
  OnlyTop = 'only-top',
  OnlyBottom = 'only-bottom',
  AlsoTop = 'also-top',
  AlsoBottom = 'also-bottom',
}

/** The measure-numbering-value type describes how measure numbers are displayed on this part: no numbers, numbers every measure, or numbers every system. */
export enum MeasureNumberingValue { None = 'none', Measure = 'measure', System = 'system' }

/** The staff-divide-symbol type is used for staff division symbols. The down, up, and up-down values correspond to SMuFL code points U+E00B, U+E00C, and U+E00D respectively. */
export enum StaffDivideSymbol { Down = 'down', Up = 'up', UpDown = 'up-down' }

/** The principal-voice-symbol type represents the type of symbol used to indicate a principal or secondary voice. The "plain" value represents a plain square bracket. The value of "none" is used for analysis markup when the principal-voice element does not have a corresponding appearance in the score. */
export enum PrincipalVoiceSymbol {
  Hauptstimme = 'Hauptstimme',
  Nebenstimme = 'Nebenstimme',
  Plain = 'plain',
  None = 'none',
}

/** The hole-closed-value type represents whether the hole is closed, open, or half-open. */
export enum HoleClosedValue { Yes = 'yes', No = 'no', Half = 'half' }
/** The hole-closed-location type indicates which portion of the hole is filled in when the corresponding hole-closed-value is half. */
export enum HoleClosedLocation { Right = 'right', Bottom = 'bottom', Left = 'left', Top = 'top' }

/** The arrow-direction type represents the direction in which an arrow points, using Unicode arrow terminology. */
export enum ArrowDirection {
  Left = 'left',
  Up = 'up',
  Right = 'right',
  Down = 'down',
  Northwest = 'northwest',
  Northeast = 'northeast',
  Southeast = 'southeast',
  Southwest = 'southwest',
  LeftRight = 'left right',
  UpDown = 'up down',
  NorthwestSoutheast = 'northwest southeast',
  NortheastSouthwest = 'northeast southwest',
  Other = 'other',
}

/** The arrow-style type represents the style of an arrow, using Unicode arrow terminology. Filled and hollow arrows indicate polygonal single arrows. Paired arrows are duplicate single arrows in the same direction. Combined arrows apply to double direction arrows like left right, indicating that an arrow in one direction should be combined with an arrow in the other direction. */
export enum ArrowStyle {
  Single = 'single',
  Double = 'double',
  Filled = 'filled',
  Hollow = 'hollow',
  Paired = 'paired',
  Combined = 'combined',
  Other = 'other',
}

/** The circular-arrow type represents the direction in which a circular arrow points, using Unicode arrow terminology. */
export enum CircularArrow { Clockwise = 'clockwise', Anticlockwise = 'anticlockwise' }

/** The handbell-value type represents the type of handbell technique being notated. */
export enum HandbellValue {
  Belltree = 'belltree',
  Damp = 'damp',
  Echo = 'echo',
  Gyro = 'gyro',
  HandMartellato = 'hand martellato',
  MalletLift = 'mallet lift',
  MalletTable = 'mallet table',
  Martellato = 'martellato',
  MartellatoLift = 'martellato lift',
  MutedMartellato = 'muted martellato',
  PluckLift = 'pluck lift',
  Swing = 'swing',
}

/** The harmony-arrangement type indicates how stacked chords and bass notes are displayed within a harmony element. The vertical value specifies that the second element appears below the first. The horizontal value specifies that the second element appears to the right of the first. The diagonal value specifies that the second element appears both below and to the right of the first. */
export enum HarmonyArrangement { Vertical = 'vertical', Horizontal = 'horizontal', Diagonal = 'diagonal' }

/** The harmony-type type differentiates different types of harmonies when alternate harmonies are possible. Explicit harmonies have all note present in the music; implied have some notes missing but implied; alternate represents alternate analyses. */
export enum HarmonyType { Explicit = 'explicit', Implied = 'implied', Alternate = 'alternate' }

/** A kind-value indicates the type of chord. Degree elements can then add, subtract, or alter from these starting points. Values include: Triads: major (major third, perfect fifth) minor (minor third, perfect fifth) augmented (major third, augmented fifth) diminished (minor third, diminished fifth) Sevenths: dominant (major triad, minor seventh) major-seventh (major triad, major seventh) minor-seventh (minor triad, minor seventh) diminished-seventh (diminished triad, diminished seventh) augmented-seventh (augmented triad, minor seventh) half-diminished (diminished triad, minor seventh) major-minor (minor triad, major seventh) Sixths: major-sixth (major triad, added sixth) minor-sixth (minor triad, added sixth) Ninths: dominant-ninth (dominant-seventh, major ninth) major-ninth (major-seventh, major ninth) minor-ninth (minor-seventh, major ninth) 11ths (usually as the basis for alteration): dominant-11th (dominant-ninth, perfect 11th) major-11th (major-ninth, perfect 11th) minor-11th (minor-ninth, perfect 11th) 13ths (usually as the basis for alteration): dominant-13th (dominant-11th, major 13th) major-13th (major-11th, major 13th) minor-13th (minor-11th, major 13th) Suspended: suspended-second (major second, perfect fifth) suspended-fourth (perfect fourth, perfect fifth) Functional sixths: Neapolitan Italian French German Other: pedal (pedal-point bass) power (perfect fifth) Tristan The "other" kind is used when the harmony is entirely composed of add elements. The "none" kind is used to explicitly encode absence of chords or functional harmony. In this case, the root, numeral, or function element has no meaning. When using the root or numeral element, the root-step or numeral-step text attribute should be set to the empty string to keep the root or numeral from being displayed. */
export enum KindValue {
  Major = 'major',
  Minor = 'minor',
  Augmented = 'augmented',
  Diminished = 'diminished',
  Dominant = 'dominant',
  MajorSeventh = 'major-seventh',
  MinorSeventh = 'minor-seventh',
  DiminishedSeventh = 'diminished-seventh',
  AugmentedSeventh = 'augmented-seventh',
  HalfDiminished = 'half-diminished',
  MajorMinor = 'major-minor',
  MajorSixth = 'major-sixth',
  MinorSixth = 'minor-sixth',
  DominantNinth = 'dominant-ninth',
  MajorNinth = 'major-ninth',
  MinorNinth = 'minor-ninth',
  Dominant11th = 'dominant-11th',
  Major11th = 'major-11th',
  Minor11th = 'minor-11th',
  Dominant13th = 'dominant-13th',
  Major13th = 'major-13th',
  Minor13th = 'minor-13th',
  SuspendedSecond = 'suspended-second',
  SuspendedFourth = 'suspended-fourth',
  Neapolitan = 'Neapolitan',
  Italian = 'Italian',
  French = 'French',
  German = 'German',
  Pedal = 'pedal',
  Power = 'power',
  Tristan = 'Tristan',
  Other = 'other',
  None = 'none',
}

/** The numeral-mode type specifies the mode similar to the mode type, but with a restricted set of values. The different minor values are used to interpret numeral-root values of 6 and 7 when present in a minor key. The harmonic minor value sharpens the 7 and the melodic minor value sharpens both 6 and 7. If a minor mode is used without qualification, either in the mode or numeral-mode elements, natural minor is used. */
export enum NumeralMode { Major = 'major', Minor = 'minor' }

/** The degree-symbol-value type indicates which symbol should be used in specifying a degree. */
export enum DegreeSymbolValue {
  Major = 'major',
  Minor = 'minor',
  Augmented = 'augmented',
  Diminished = 'diminished',
  HalfDiminished = 'half-diminished',
}

/** The degree-type-value type indicates whether the current degree element is an addition, alteration, or subtraction to the kind of the current chord in the harmony element. */
export enum DegreeTypeValue { Add = 'add', Alter = 'alter', Subtract = 'subtract' }

/** The show-tuplet type indicates whether to show a part of a tuplet relating to the tuplet-actual element, both the tuplet-actual and tuplet-normal elements, or neither. */
export enum ShowTuplet { Actual = 'actual', Both = 'both', None = 'none' }

/** The breath-mark-value type represents the symbol used for a breath mark. */
export type BreathMarkValue = '' | 'comma' | 'tick' | 'upbow' | 'salzedo';
/** The caesura-value type represents the shape of the caesura sign. */
export type CaesuraValue = '' | 'normal' | 'thick' | 'short' | 'curved' | 'single';

/** Slurs, tuplets, and many other features can be concurrent and overlap within a single musical part. The number-level entity distinguishes up to 16 concurrent objects of the same type when the objects overlap in MusicXML document order. Values greater than 6 are usually only needed for music with a large number of divisi staves in a single part, or if there are more than 6 cross-staff arpeggios in a single measure. When a number-level value is implied, the value is 1 by default. When polyphonic parts are involved, the ordering within a MusicXML document can differ from musical score order. As an example, say we have a piano part in 4/4 where within a single measure, all the notes on the top staff are followed by all the notes on the bottom staff. In this example, each staff has a slur that starts on beat 2 and stops on beat 3, and there is a third slur that goes from beat 1 of one staff to beat 4 of the other staff. In this situation, the two mid-measure slurs can use the same number because they do not overlap in MusicXML document order, even though they do overlap in musical score order. Within the MusicXML document, the top staff slur will both start and stop before the bottom staff slur starts and stops. If the cross-staff slur starts in the top staff and stops in the bottom staff, it will need a separate number from the mid-measure slurs because it overlaps those slurs in MusicXML document order. However, if the cross-staff slur starts in the bottom staff and stops in the top staff, all three slurs can use the same number. None of them overlap within the MusicXML document, even though they all overlap each other in the musical score order. Within the MusicXML document, the start and stop of the top-staff slur will be followed by the stop and start of the cross-staff slur, followed by the start and stop of the bottom-staff slur. As this example demonstrates, a reading program should be prepared to handle cases where the number-levels start and stop in an arbitrary order. Because the start and stop values refer to musical score order, a program may find the stopping point of an object earlier in the MusicXML document than it will find its starting point. */
export type NumberLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
/** The MusicXML format supports six levels of beaming, up to 1024th notes. Unlike the number-level type, the beam-level type identifies concurrent beams in a beam group. It does not distinguish overlapping beams such as grace notes within regular notes, or beams used in different voices. */
export type BeamLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/** The number-of-lines type is used to specify the number of lines in text decoration attributes. */
export type NumberOfLines = 0 | 1 | 2 | 3;

/** The time-relation type indicates the symbol used to represent the interchangeable aspect of dual time signatures. */
export enum TimeRelation {
  Parentheses = 'parentheses',
  Bracket = 'bracket',
  Equals = 'equals',
  Slash = 'slash',
  Space = 'space',
  Hyphen = 'hyphen',
}

/** The tip-direction type represents the direction in which the tip of a stick or beater points, using Unicode arrow terminology. */
export enum TipDirection {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
  Northwest = 'northwest',
  Northeast = 'northeast',
  Southeast = 'southeast',
  Southwest = 'southwest',
}

// ============================================================================
// Instrument Type
// ============================================================================

/**
 * Instrument type for a track/part.
 * 
 * This enum categorizes musical instruments into broad categories.
 * It is used to determine playback behavior (e.g., drums on MIDI channel 10)
 * and UI presentation.
 * 
 * ## Source of Truth: MusicXML `part-abbreviation`
 * 
 * The `InstrumentType` is stored in the MusicXML `<part-abbreviation>` element
 * as the single source of truth. When parsing MusicXML:
 * 1. If `part-abbreviation` contains a valid `InstrumentType` value, use it directly
 * 2. Otherwise, compute from metadata (part name, MIDI channel/program)
 * 
 * @example InstrumentType.Drums, InstrumentType.Guitar
 */
export enum InstrumentType {
  Drums = 'Drums',
  Guitar = 'Guitar',
  Bass = 'Bass',
  Vocals = 'Vocals',
  Keys = 'Keys',
  Other = 'Other',
}
