/**
 * MusicXML 4.0 Types - Main export
 * 
 * Note: Some types have the same name across different modules.
 * We export them with aliases where needed.
 */

// Export all enums
export * from './enums';

// Standard instrument-sound id vocabulary (score-instrument/instrument-sound)
export * from './common/instrument-sounds';

// Export common types
export * from './common';

// Export score types
export * from './score';

// Export part types  
export * from './part';

// Export direction types (before note to get correct Dynamics type)
export * from './direction';

// Note-tier classes (value exports)
export { Pitch, Unpitched, Rest, Stem, Beam, NoteType, Tie, TimeModification, Accidental, Dot, Grace, Notehead, Slur, Tied, Tuplet, TupletDot, TupletNumber, TupletPortion, TupletType, Glissando, Slide, EmptyLine, EmptyPlacement, EmptyPlacementSmufl, Articulations, BreathMark, Caesura, OtherArticulation, StrongAccent, AccidentalMark, EmptyTrillSound, Mordent, Ornaments, OtherOrnament, Tremolo, TrillMark, Turn, VerticalTurn, WavyLine, Arrow, Bend, Handbell, HammerOnPullOff, HarmonClosed, HarmonMute, Harmonic, HeelToe, Hole, HoleClosed, OtherTechnical, PlacementText, StringNumber, Tap, Technical, Arpeggiate, Fermata, NonArpeggiate, OtherNotation, Notations, Lyric, TextElementData, Elision, Extend, Note, NoteheadText, Play, Listen } from './note';

// Export note types with aliases for duplicates
export type {
  Instrument,
  DisplayTextOrAccidentalText,
  AccidentalTextElement,
  Assess,
  Wait,
  GetMidiNoteOptions,
} from './note';

// Class values re-exported under disambiguated aliases for direction-tier consumers.
export { EmptyLine as NoteEmptyLine, Fingering as NoteFingering, Fret as NoteFret, Dynamics as NoteDynamics, OtherDynamics as NoteOtherDynamics } from './note';
