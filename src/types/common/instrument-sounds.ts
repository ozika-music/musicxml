/**
 * InstrumentSounds — the standard MusicXML 4.0 instrument-sound vocabulary,
 * parsed into a typed structure.
 *
 * A `<score-instrument>/<instrument-sound>` value should be one of the ids in
 * the standard sounds catalog (specs/schema/sounds.xml). An id is dot-separated
 * with at least two segments:
 * - `family.instrument`                      (1 dot — e.g. `brass.alphorn`)
 * - `family.subFamily.instrument`            (2 dots — e.g. `wind.flutes.flute`)
 * - `family.subFamily.instrument.variant`    (3+ dots — e.g. `wind.flutes.flute.piccolo`;
 *   a handful of catalog ids have a dotted variant such as `wind.flutes.whistle.tin.bflat`,
 *   parsed as variant `tin.bflat`)
 *
 * @see https://www.w3.org/2021/06/musicxml40/listings/sounds.xml/
 */

import { INSTRUMENT_SOUND_IDS, type InstrumentSoundId } from './instrument-sounds.data';
import { GENERAL_MIDI_PROGRAM_SOUNDS, GM_PROGRAM_BY_SOUND_ID } from './general-midi';

export { INSTRUMENT_SOUND_IDS, GENERAL_MIDI_PROGRAM_SOUNDS };
export type { InstrumentSoundId };

/** One instrument-sound id split into its dot-separated structure. */
export interface InstrumentSound {
  /** The full id, e.g. "wind.flutes.flute.piccolo". */
  id: string;
  /** Top-level family, e.g. "wind", "brass", "pluck". */
  family: string;
  /** Sub-family when the id has 3+ segments, e.g. "flutes". */
  subFamily?: string;
  /** The instrument segment, e.g. "flute". */
  instrument: string;
  /** Variant when the id has 4+ segments (extra segments joined), e.g. "piccolo". */
  variant?: string;
  /**
   * General MIDI Level-1 program (1–128) for which this is the primary sound, if
   * any. Only the ~128 GM-mapped sounds carry one; percussion (channel 10) and
   * non-GM sounds leave it undefined. See {@link GENERAL_MIDI_PROGRAM_SOUNDS}.
   */
  defaultMidiProgram?: number;
}

// Lazy caches — built on first use, the catalog is static.
let allSounds: readonly InstrumentSound[] | undefined;
let soundById: Map<string, InstrumentSound> | undefined;
let allFamilies: readonly string[] | undefined;

export class InstrumentSounds {
  /** Every standard instrument-sound id, in catalog order. */
  static ids(): readonly InstrumentSoundId[] {
    return INSTRUMENT_SOUND_IDS;
  }

  /** Every standard sound, parsed, in catalog order. */
  static all(): readonly InstrumentSound[] {
    allSounds ??= INSTRUMENT_SOUND_IDS.map((id) => InstrumentSounds.parse(id)!);
    return allSounds;
  }

  /** The distinct top-level families, in catalog order. */
  static families(): readonly string[] {
    allFamilies ??= [...new Set(InstrumentSounds.all().map((s) => s.family))];
    return allFamilies;
  }

  /** True when `id` is one of the standard catalog ids. */
  static isStandard(id: string): boolean {
    return InstrumentSounds.get(id) !== undefined;
  }

  /** The parsed standard sound for `id`, or undefined when not in the catalog. */
  static get(id: string): InstrumentSound | undefined {
    soundById ??= new Map(InstrumentSounds.all().map((s) => [s.id, s]));
    return soundById.get(id);
  }

  /**
   * The standard sound that plays General MIDI Level-1 `program` (1–128), or
   * undefined when out of range. Several programs may resolve to the same sound;
   * the returned sound's {@link InstrumentSound.defaultMidiProgram} reflects that
   * sound's own primary (lowest) program, which may differ from `program`.
   */
  static byMidiProgram(program: number): InstrumentSound | undefined {
    const id = GENERAL_MIDI_PROGRAM_SOUNDS[program];
    return id ? InstrumentSounds.get(id) : undefined;
  }

  /**
   * Splits any instrument-sound id by the segment rules above — also works for
   * non-catalog ids. Catalog ids that map to a GM program also carry
   * `defaultMidiProgram`. Returns undefined when `id` has fewer than two segments.
   */
  static parse(id: string): InstrumentSound | undefined {
    const segments = id.split('.').filter((s) => s.length > 0);
    if (segments.length < 2) return undefined;
    const [family, ...rest] = segments;
    const defaultMidiProgram = GM_PROGRAM_BY_SOUND_ID.get(id);
    const base =
      rest.length === 1
        ? { id, family, instrument: rest[0] }
        : { id, family, subFamily: rest[0], instrument: rest[1], variant: rest.length > 2 ? rest.slice(2).join('.') : undefined };
    return defaultMidiProgram !== undefined ? { ...base, defaultMidiProgram } : base;
  }
}
