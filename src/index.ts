/**
 * MusicXML 4.0 Parser
 * 
 * A comprehensive TypeScript parser for MusicXML 4.0 format documents.
 * 
 * @example
 * ```typescript
 * import { MusicXml, ScorePartwise } from 'musicxml-4.0';
 *
 * // Parse a MusicXML string
 * const score = MusicXml.parseFromMusicXml(xmlString);
 * console.log(score.movementTitle);
 *
 * // Auto-detect and parse MusicXML or MXL bytes
 * const score2 = await MusicXml.parse(data);
 *
 * // Serialize back to bytes
 * const bytes = MusicXml.serializeToMusicXml(score);
 *
 * // Access parsed data
 * for (const part of score.parts) {
 *   for (const measure of part.measures) {
 *     for (const content of measure.content) {
 *       if (content.type === 'note') {
 *         console.log(content.data.pitch);
 *       }
 *     }
 *   }
 * }
 * ```
 * 
 * @module musicxml-4.0
 */

// Export all types
export * from './types';

// Parse/serialize is a single facade: MusicXml.parseFrom*/serializeTo*.
export { GENERAL_MIDI_PROGRAM_SOUNDS } from './types/common/general-midi';
export { INSTRUMENT_SOUND_IDS } from './types/common/instrument-sounds.data';
export type { InstrumentSoundId } from './types/common/instrument-sounds.data';
export { MusicXml } from './musicxml';
export type { MusicXmlOptions } from './musicxml';
// BOM-aware bytes→XML string decode (UTF-8/UTF-16), for callers that sniff content.
export { decodeXmlBytes } from './xml/xml-element';

// Single-element behavior lives as static methods on the model classes (e.g.
// `Note.getDuration`, `Pitch.toMidiNote`, `ScorePart.computeInstrumentType`,
// `Part.getTablatureStaffNumber`, `Measure.expandRepeats`, `Time.parseSignature`,
// `ScorePartwise.extractMetadata`) — exported via `./types` above. Only
// cross-cutting / non-structural helpers remain as utils:
export { TimeUtils } from './utils/time-utils'; // playback timing (BPM → ms)
// Drum kit source of truth: MIDI ↔ staff position ↔ notehead.
export {
  getDrumPart,
  getAllDrumParts,
  getDrumDisplay,
  getDrumNotehead,
  getDrumMidiFromDisplay,
} from './utils/drums';
export type { DrumPartDescription as DrumPart } from './utils/drums';
export type { DrumsVoiceMode } from './utils/drums-voice-utils';
