/**
 * Drum-voice normalization (model level).
 *
 * Exposed as the `drumsVoiceMode` parse/serialize option on {@link MusicXml};
 * this module is the private implementation behind it.
 */

import { InstrumentType, ScorePart, StemValue } from '../types';
import type { MeasureContent, Note, ScorePartwise } from '../types';

export type DrumsVoiceMode = 'AsIs' | 'MergeVoices' | 'SplitVoices';

type NoteItem = { type: 'note'; data: Note };
type PositionedNote = { pos: number; item: NoteItem };

/** Diatonic position of a step within an octave (C=0 … B=6), for staff ordering. */
const STEP_STAFF_ORDER: Record<string, number> = {
  C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6,
};

/** Staff rank of the F5 line — cymbals/hi-hats sit on or above it. */
const CYMBAL_MIN_STAFF_RANK = 5 * 7 + STEP_STAFF_ORDER.F;

/**
 * True if the note is notated as a cymbal/hi-hat — i.e. at staff position F5 or
 * higher (F5, G5, A5, B5, C6, …), the upper region of the percussion staff.
 * Uses the display step/octave rather than the MIDI note.
 */
function isCymbal(note: Note): boolean {
  const { displayStep, displayOctave } = note.unpitched ?? {};
  if (displayStep === undefined || displayOctave === undefined) return false;
  const rank = displayOctave * 7 + (STEP_STAFF_ORDER[displayStep] ?? 0);
  return rank >= CYMBAL_MIN_STAFF_RANK;
}

function buildVoiceSequence(
  group: PositionedNote[],
  voice: string,
  stem: StemValue,
): MeasureContent[] {
  const sorted = [...group].sort((a, b) => a.pos - b.pos);
  const result: MeasureContent[] = [];
  let currentPos = 0;
  let lastGroupPos = -1;

  for (const { pos, item } of sorted) {
    if (pos > currentPos) {
      result.push({ type: 'forward', data: { duration: pos - currentPos } });
      currentPos = pos;
      lastGroupPos = -1;
    }

    const isChord = pos === lastGroupPos;

    result.push({
      type: 'note',
      data: {
        ...item.data,
        voice,
        stem: { value: stem },
        chord: isChord ? true : undefined,
        beams: undefined,
      },
    });

    if (!isChord) {
      lastGroupPos = pos;
      currentPos = pos + (item.data.duration ?? 0);
    }
  }

  return result;
}

function splitDrumMeasure(content: MeasureContent[]): MeasureContent[] {
  const v1: PositionedNote[] = [];
  const v2: PositionedNote[] = [];
  const nonNotes: MeasureContent[] = [];

  let pos = 0;
  let lastNonChordPos = 0;

  for (const item of content) {
    if (item.type === 'backup') {
      pos = Math.max(0, pos - item.data.duration);
      continue;
    }
    if (item.type === 'forward') {
      pos += item.data.duration;
      continue;
    }

    if (item.type !== 'note') {
      nonNotes.push(item);
      continue;
    }

    const note = item.data;

    if (note.rest) {
      nonNotes.push(item);
      if (!note.chord) {
        lastNonChordPos = pos;
        pos += note.duration ?? 0;
      }
      continue;
    }

    const notePos = note.chord ? lastNonChordPos : pos;

    if (!note.chord) {
      lastNonChordPos = pos;
      pos += note.duration ?? 0;
    }

    if (note.unpitched && isCymbal(note)) {
      v1.push({ pos: notePos, item: item as NoteItem });
    } else {
      v2.push({ pos: notePos, item: item as NoteItem });
    }
  }

  let totalDuration = pos;
  for (const pn of [...v1, ...v2]) {
    const end = pn.pos + (pn.item.data.duration ?? 0);
    if (end > totalDuration) totalDuration = end;
  }

  const result: MeasureContent[] = [...nonNotes];

  const v1Sequence = buildVoiceSequence(v1, '1', StemValue.Up);
  const v2Sequence = buildVoiceSequence(v2, '2', StemValue.Down);

  if (v1Sequence.length > 0) {
    result.push(...v1Sequence);
  }

  if (v2Sequence.length > 0) {
    if (totalDuration > 0) {
      result.push({ type: 'backup', data: { duration: totalDuration } });
    }
    result.push(...v2Sequence);
  }

  return result;
}

function mergeDrumMeasure(content: MeasureContent[]): MeasureContent[] {
  return content.map((item) => {
    if (item.type !== 'note') return item;
    const note = item.data;
    if (!note.unpitched) return item;

    return {
      type: 'note',
      data: { ...note, voice: '1', stem: undefined },
    };
  });
}

/**
 * Re-voice unpitched drum notes in a score per {@link DrumsVoiceMode} (`AsIs`
 * no-op, `MergeVoices`, or `SplitVoices` by cymbal/non-cymbal). Non-mutating:
 * returns a new score with drum parts' measures transformed.
 */
export function applyDrumsVoiceModeToScore(score: ScorePartwise, mode: DrumsVoiceMode): ScorePartwise {
  if (mode === 'AsIs') return score;

  const scorePartsMap = new Map(score.partList.scoreParts.map((sp) => [sp.id, sp]));
  const parts = score.parts.map((part) => {
    const scorePart = scorePartsMap.get(part.id);
    if (!scorePart || ScorePart.computeInstrumentType(scorePart) !== InstrumentType.Drums) {
      return part;
    }
    return {
      ...part,
      measures: part.measures.map((measure) => ({
        ...measure,
        content: mode === 'SplitVoices' ? splitDrumMeasure(measure.content) : mergeDrumMeasure(measure.content),
      })),
    };
  });

  return { ...score, parts };
}
