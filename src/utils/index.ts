/**
 * MusicXML 4.0 Utilities
 *
 * Only *cross-cutting* / non-structural helpers live here. Behavior scoped to a
 * single model element lives as a static method on that element's class (e.g.
 * `Note.getDuration`, `Pitch.toMidiNote`, `ScorePart.computeInstrumentType`,
 * `Measure.expandRepeats`, `Time.parseSignature`, `ScorePartwise.extractMetadata`).
 *
 * @module musicxml-4.0/utils
 */

// Playback timing math (BPM → milliseconds).
export * from './time-utils';
// Drum kit source of truth: MIDI ↔ staff position ↔ notehead mapping.
// (Note → MIDI lives on `Note.getMidiNote`, in the note model.)
export * from './drums';
// Whole-score drum re-voicing (the `drumsVoiceMode` parse/serialize option).
export * from './drums-voice-utils';
