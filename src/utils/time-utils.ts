/**
 * Playback timing helpers — convert a {@link TimeSignature} + BPM into wall-clock
 * durations. This is a *playback* concern (not MusicXML structure), so it stays a
 * util; the structural `Time.parseSignature` lives on the {@link Time} class.
 *
 * @module musicxml-4.0/utils
 */

import type { TimeSignature } from '../types/part';

/**
 * Duration of one beat in milliseconds, given BPM and the time-signature
 * denominator (whole=1 … sixty-fourth=64).
 */
function computeBeatDurationMs(bpm: number, timeSignature: TimeSignature): number {
  const quarterNoteDurationMs = 60000 / bpm;
  switch (timeSignature.denominator) {
    case 1: return quarterNoteDurationMs * 4;
    case 2: return quarterNoteDurationMs * 2;
    case 4: return quarterNoteDurationMs;
    case 8: return quarterNoteDurationMs / 2;
    case 16: return quarterNoteDurationMs / 4;
    case 32: return quarterNoteDurationMs / 8;
    case 64: return quarterNoteDurationMs / 16;
    default: return quarterNoteDurationMs;
  }
}

/** Theoretical duration of one measure in milliseconds (`beatDuration * numerator`). */
function computeMeasureDurationMs(bpm: number, timeSignature: TimeSignature): number {
  return computeBeatDurationMs(bpm, timeSignature) * timeSignature.numerator;
}

/** Static facade for playback timing math (BPM → milliseconds). */
export class TimeUtils {
  /** Duration of one beat in milliseconds from BPM + time signature. */
  static computeBeatDurationMs = computeBeatDurationMs;

  /** Theoretical duration of one measure in milliseconds. */
  static computeMeasureDurationMs = computeMeasureDurationMs;
}
