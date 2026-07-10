import { NoteheadValue, Step } from '../types/enums';

/* Drum part with its midi code on GM and associated display information (step/octave/notehead) */
export interface DrumPartDescription {
  midi: number;
  name: string;
  step: string;
  octave: number;
  notehead: NoteheadValue;
}

const DRUM_PART_DESCRIPTIONS: DrumPartDescription[] = [
    // Effects
    { midi: 27, name: 'High Q', step: 'A', octave: 5, notehead: NoteheadValue.Cross },
    { midi: 28, name: 'Slap', step: 'A', octave: 5, notehead: NoteheadValue.Slashed },
    { midi: 32, name: 'Square Click', step: 'B', octave: 5, notehead: NoteheadValue.Diamond },
    { midi: 33, name: 'Metronome Click', step: 'C', octave: 6, notehead: NoteheadValue.X },
    { midi: 34, name: 'Metronome Bell', step: 'C', octave: 6, notehead: NoteheadValue.CircleX },
    
    // Kick
    { midi: 35, name: 'Acoustic Bass Drum', step: 'E', octave: 4, notehead: NoteheadValue.Normal },
    { midi: 36, name: 'Bass Drum 1', step: 'F', octave: 4, notehead: NoteheadValue.Normal },
    
    // Snare
    { midi: 31, name: 'Side Stick 2', step: 'C', octave: 5, notehead: NoteheadValue.X },
    { midi: 37, name: 'Side Stick', step: 'C', octave: 5, notehead: NoteheadValue.X },
    { midi: 38, name: 'Acoustic Snare', step: 'C', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 39, name: 'Hand Clap', step: 'C', octave: 5, notehead: NoteheadValue.Slash },
    { midi: 40, name: 'Electric Snare', step: 'C', octave: 5, notehead: NoteheadValue.Diamond },
    { midi: 91, name: 'Rim Shot', step: 'C', octave: 5, notehead: NoteheadValue.Normal },
    
    // Toms
    { midi: 41, name: 'Low Floor Tom', step: 'A', octave: 4, notehead: NoteheadValue.Normal },
    { midi: 43, name: 'Very Low Tom', step: 'G', octave: 4, notehead: NoteheadValue.Normal },
    { midi: 45, name: 'Low Tom', step: 'A', octave: 4, notehead: NoteheadValue.Normal },
    { midi: 47, name: 'Mid Tom', step: 'B', octave: 4, notehead: NoteheadValue.Normal },
    { midi: 48, name: 'High Tom', step: 'D', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 50, name: 'Very High Tom', step: 'E', octave: 5, notehead: NoteheadValue.Normal },
    
    // Hi-Hat
    { midi: 42, name: 'Closed Hi-Hat', step: 'G', octave: 5, notehead: NoteheadValue.X },
    { midi: 44, name: 'Pedal Hi-Hat', step: 'D', octave: 4, notehead: NoteheadValue.X },
    { midi: 46, name: 'Open Hi-Hat', step: 'G', octave: 5, notehead: NoteheadValue.CircleX },
    { midi: 92, name: 'Half Open Hi-Hat', step: 'G', octave: 5, notehead: NoteheadValue.Slashed },
    
    // Cymbals
    { midi: 29, name: 'Ride 2 (choke)', step: 'F', octave: 5, notehead: NoteheadValue.CircleX },
    { midi: 30, name: 'Reverse Cymbal', step: 'F', octave: 5, notehead: NoteheadValue.X },
    { midi: 49, name: 'High Crash 1 (middle)', step: 'A', octave: 5, notehead: NoteheadValue.X },
    { midi: 51, name: 'Ride 1 (middle)', step: 'F', octave: 5, notehead: NoteheadValue.X },
    { midi: 52, name: 'China (middle)', step: 'C', octave: 6, notehead: NoteheadValue.X },
    { midi: 53, name: 'Ride (bell)', step: 'F', octave: 5, notehead: NoteheadValue.X },
    { midi: 55, name: 'Splash Cymbal', step: 'G', octave: 5, notehead: NoteheadValue.X },
    { midi: 57, name: 'Medium Crash 2 (middle)', step: 'G', octave: 5, notehead: NoteheadValue.X },
    { midi: 59, name: 'Ride 2 (edge)', step: 'F', octave: 5, notehead: NoteheadValue.X },
    { midi: 93, name: 'Ride (edge)', step: 'F', octave: 5, notehead: NoteheadValue.X },
    { midi: 94, name: 'Ride (choke)', step: 'F', octave: 5, notehead: NoteheadValue.CircleX },
    { midi: 95, name: 'Splash (choke)', step: 'G', octave: 5, notehead: NoteheadValue.CircleX },
    { midi: 96, name: 'China (choke)', step: 'C', octave: 6, notehead: NoteheadValue.CircleX },
    { midi: 97, name: 'High Crash (choke)', step: 'A', octave: 5, notehead: NoteheadValue.CircleX },
    { midi: 98, name: 'Medium Crash (choke)', step: 'G', octave: 5, notehead: NoteheadValue.CircleX },
    { midi: 115, name: 'Piatti (hit)', step: 'C', octave: 6, notehead: NoteheadValue.X },
    { midi: 116, name: 'Piatti (hand)', step: 'C', octave: 6, notehead: NoteheadValue.X },
    { midi: 126, name: 'Ride 2 (middle)', step: 'F', octave: 5, notehead: NoteheadValue.X },
    { midi: 127, name: 'Ride 2 (bell)', step: 'F', octave: 5, notehead: NoteheadValue.X },

    // Latin percussions / Hand drums
    { midi: 54, name: 'Tambourine (hit)', step: 'C', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 56, name: 'Cowbell medium (hit)', step: 'F', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 58, name: 'Vibraslap', step: 'A', octave: 4, notehead: NoteheadValue.Diamond },
    { midi: 99, name: 'Cowbell low (hit)', step: 'F', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 100, name: 'Cowbell low (tip)', step: 'F', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 101, name: 'Cowbell medium (tip)', step: 'F', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 102, name: 'Cowbell high (hit)', step: 'F', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 103, name: 'Cowbell high (tip)', step: 'F', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 111, name: 'Tambourine (return)', step: 'C', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 112, name: 'Tambourine (roll)', step: 'C', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 113, name: 'Tambourine (hand)', step: 'C', octave: 5, notehead: NoteheadValue.Triangle },

    // Bongos / Congas
    { midi: 60, name: 'High Bongo (hit)', step: 'E', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 61, name: 'Low Bongo (hit)', step: 'D', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 62, name: 'High Conga (mute)', step: 'C', octave: 5, notehead: NoteheadValue.X },
    { midi: 63, name: 'High Conga (hit)', step: 'C', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 64, name: 'Low Conga (hit)', step: 'D', octave: 4, notehead: NoteheadValue.Normal },
    { midi: 104, name: 'High Bongo (mute)', step: 'E', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 105, name: 'High Bongo (slap)', step: 'E', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 106, name: 'Low Bongo (mute)', step: 'D', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 107, name: 'Low Bongo (slap)', step: 'D', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 108, name: 'Low Conga (slap)', step: 'D', octave: 4, notehead: NoteheadValue.Normal },
    { midi: 109, name: 'Low Conga (mute)', step: 'D', octave: 4, notehead: NoteheadValue.Normal },
    { midi: 110, name: 'High Conga (slap)', step: 'C', octave: 5, notehead: NoteheadValue.Normal },

    // Timbales / Agogos
    { midi: 65, name: 'High Timbale', step: 'F', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 66, name: 'Low Timbale', step: 'E', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 67, name: 'High Agogo', step: 'B', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 68, name: 'Low Agogo', step: 'A', octave: 5, notehead: NoteheadValue.Triangle },
    
    // Small Latin percussions
    { midi: 69, name: 'Cabasa (hit)', step: 'G', octave: 4, notehead: NoteheadValue.X },
    { midi: 70, name: 'Left Maraca (hit)', step: 'G', octave: 4, notehead: NoteheadValue.Cross },
    { midi: 73, name: 'Guiro (hit)', step: 'F', octave: 4, notehead: NoteheadValue.X },
    { midi: 74, name: 'Guiro (scrap-return)', step: 'F', octave: 4, notehead: NoteheadValue.Normal },
    { midi: 75, name: 'Claves', step: 'E', octave: 4, notehead: NoteheadValue.X },
    { midi: 78, name: 'Cuica (mute)', step: 'D', octave: 4, notehead: NoteheadValue.X },
    { midi: 79, name: 'Cuica (open)', step: 'D', octave: 4, notehead: NoteheadValue.CircleX },
    { midi: 82, name: 'Shaker (hit)', step: 'G', octave: 4, notehead: NoteheadValue.Slash },
    { midi: 85, name: 'Castanets', step: 'E', octave: 4, notehead: NoteheadValue.X },
    { midi: 86, name: 'Surdo (hit)', step: 'D', octave: 4, notehead: NoteheadValue.Normal },
    { midi: 87, name: 'Surdo (mute)', step: 'D', octave: 4, notehead: NoteheadValue.CircleX },
    { midi: 114, name: 'Grancassa', step: 'G', octave: 4, notehead: NoteheadValue.Normal },
    { midi: 117, name: 'Cabasa (return)', step: 'G', octave: 4, notehead: NoteheadValue.X },
    { midi: 118, name: 'Left Maraca (return)', step: 'G', octave: 4, notehead: NoteheadValue.Cross },
    { midi: 119, name: 'Right Maraca (hit)', step: 'G', octave: 4, notehead: NoteheadValue.Cross },
    { midi: 120, name: 'Right Maraca (return)', step: 'G', octave: 4, notehead: NoteheadValue.Cross },
    { midi: 122, name: 'Shaker (return)', step: 'G', octave: 4, notehead: NoteheadValue.Slash },
    { midi: 124, name: 'Glope (124)', step: 'C', octave: 5, notehead: NoteheadValue.Normal },
    { midi: 125, name: 'Glope (125)', step: 'C', octave: 5, notehead: NoteheadValue.Normal },
    
    // Wood percussions
    { midi: 76, name: 'High Wood Block', step: 'E', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 77, name: 'Low Wood Block', step: 'D', octave: 5, notehead: NoteheadValue.Triangle },
    
    // Orchestral drum
    { midi: 80, name: 'Triangle (mute)', step: 'A', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 81, name: 'Triangle (hit)', step: 'A', octave: 5, notehead: NoteheadValue.CircleX },
    { midi: 83, name: 'Jingle/Tinkle Bell (hit)', step: 'B', octave: 5, notehead: NoteheadValue.Triangle },
    { midi: 84, name: 'Bell Tree (hit)', step: 'C', octave: 6, notehead: NoteheadValue.Diamond },
    { midi: 123, name: 'Bell Tree (return)', step: 'C', octave: 6, notehead: NoteheadValue.Diamond },

    // Whistles
    { midi: 71, name: 'High Whistle', step: 'C', octave: 6, notehead: NoteheadValue.Triangle },
    { midi: 72, name: 'Low Whistle', step: 'C', octave: 6, notehead: NoteheadValue.X },
];

/** MIDI note -> drum part definition. */
const DRUM_PART_DESCRIPTION_BY_MIDI: Map<number, DrumPartDescription> = new Map(
  DRUM_PART_DESCRIPTIONS.map((dp) => [dp.midi, dp]),
);

/**
 * Get the full drum part definition for a MIDI note.
 */
export function getDrumPart(midi: number): DrumPartDescription | undefined {
  return DRUM_PART_DESCRIPTION_BY_MIDI.get(midi);
}

/**
 * All known drum part definitions (for percussion element pickers).
 */
export function getAllDrumParts(): readonly DrumPartDescription[] {
  return DRUM_PART_DESCRIPTIONS;
}

/**
 * Get the notation display position (step + octave) for a drum MIDI note.
 */
export function getDrumDisplay(
  midi: number,
): { step: Step; octave: number } | undefined {
  const dp = DRUM_PART_DESCRIPTION_BY_MIDI.get(midi);
  return dp ? { step: dp.step as Step, octave: dp.octave } : undefined;
}

/**
 * Get the notehead shape used to notate a drum MIDI note.
 */
export function getDrumNotehead(midi: number): NoteheadValue | undefined {
  return DRUM_PART_DESCRIPTION_BY_MIDI.get(midi)?.notehead;
}

/**
 * Reverse lookup: notation display position (+ optional notehead) -> MIDI note.
 *
 * Several drums can share a staff position; the notehead disambiguates them.
 * When no notehead is supplied (or none matches), the Normal-notehead entry is
 * preferred, falling back to the first drum found at that position.
 */
export function getDrumMidiFromDisplay(
  step: string,
  octave: number,
  notehead?: NoteheadValue,
): number | undefined {
  const candidates = DRUM_PART_DESCRIPTIONS.filter(
    (dp) => dp.step === step && dp.octave === octave,
  );
  if (candidates.length === 0) return undefined;
  if (notehead !== undefined) {
    const exact = candidates.find((dp) => dp.notehead === notehead);
    if (exact) return exact.midi;
  }
  const normal = candidates.find((dp) => dp.notehead === NoteheadValue.Normal);
  return (normal ?? candidates[0]).midi;
}