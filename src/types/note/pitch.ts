/**
 * pitch / unpitched / rest — the three "what sounds" forms of a note.
 * @see musicxml.xsd complexType "pitch" — step, alter?, octave
 * @see musicxml.xsd complexType "unpitched" — display-step?, display-octave?
 * @see musicxml.xsd complexType "rest" — display-step?, display-octave?; @measure
 */

import { attr, el, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import { Step, type YesNo } from '../enums';
import { asEnum } from '../common/attribute-groups';
import type { PitchShape, RestShape, UnpitchedShape } from '../note';

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

/** Step letter → semitone offset from C. */
const STEP_TO_SEMITONE: Record<Step, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/** Semitone (0-11) → pitch, spelled with sharps. */
const SEMITONE_TO_PITCH_SHARP: Array<{ step: Step; alter?: number }> = [
  { step: Step.C },
  { step: Step.C, alter: 1 },
  { step: Step.D },
  { step: Step.D, alter: 1 },
  { step: Step.E },
  { step: Step.F },
  { step: Step.F, alter: 1 },
  { step: Step.G },
  { step: Step.G, alter: 1 },
  { step: Step.A },
  { step: Step.A, alter: 1 },
  { step: Step.B },
];

/** Semitone (0-11) → pitch, spelled with flats. */
const SEMITONE_TO_PITCH_FLAT: Array<{ step: Step; alter?: number }> = [
  { step: Step.C },
  { step: Step.D, alter: -1 },
  { step: Step.D },
  { step: Step.E, alter: -1 },
  { step: Step.E },
  { step: Step.F },
  { step: Step.G, alter: -1 },
  { step: Step.G },
  { step: Step.A, alter: -1 },
  { step: Step.A },
  { step: Step.B, alter: -1 },
  { step: Step.B },
];

/** Pitch is represented as a combination of the step of the diatonic scale, the chromatic alteration, and the octave. */
export class Pitch implements PitchShape {
  step: Step = Step.C;
  alter?: number;
  octave = 4;

  constructor(init?: Partial<Pitch>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Pitch {
    return new Pitch({
      step: asEnum(Step, textOf(node, 'step')) ?? Step.C,
      alter: numText(node, 'alter'),
      octave: numText(node, 'octave') ?? 4,
    });
  }

  static toXmlElement(p: Pitch): XmlElement {
    const c: XmlElement[] = [textEl('step', p.step)];
    if (p.alter !== undefined) c.push(textEl('alter', p.alter));
    c.push(textEl('octave', p.octave));
    return el('pitch', c);
  }

  // ----------------------------------------------------------- behavior ----
  // Static (data-in) so these work on plain `Pitch`-shaped objects too.

  /**
   * Convert a pitch to a MIDI note number (C4 / middle C = 60). MusicXML
   * octave 4 maps to MIDI octave 5 (MIDI octave -1 starts at note 0).
   */
  static toMidiNote(pitch: Pitch): number {
    const stepValue = STEP_TO_SEMITONE[pitch.step] ?? 0;
    const alter = pitch.alter ?? 0;
    return (pitch.octave + 1) * 12 + stepValue + alter;
  }

  /** Convert a MIDI note number to a pitch, spelling accidentals with sharps. */
  static fromMidiNote(midiNote: number): Pitch {
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = ((midiNote % 12) + 12) % 12; // ensure positive index
    const noteInfo = SEMITONE_TO_PITCH_SHARP[noteIndex];
    return new Pitch({ step: noteInfo.step, alter: noteInfo.alter, octave });
  }

  /** Convert a MIDI note number to a pitch, spelling accidentals with flats. */
  static fromMidiNoteWithFlats(midiNote: number): Pitch {
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = ((midiNote % 12) + 12) % 12;
    const noteInfo = SEMITONE_TO_PITCH_FLAT[noteIndex];
    return new Pitch({ step: noteInfo.step, alter: noteInfo.alter, octave });
  }

  /** Render the note name (e.g. `C4`, `F#5`, `B♭3`). */
  static toNoteName(pitch: Pitch, useFlats = false): string {
    let accidental = '';
    if (pitch.alter === 1) accidental = useFlats ? '♯' : '#';
    else if (pitch.alter === -1) accidental = useFlats ? 'b' : '♭';
    else if (pitch.alter === 2) accidental = '##';
    else if (pitch.alter === -2) accidental = 'bb';
    return `${pitch.step}${accidental}${pitch.octave}`;
  }

  /** Interval in semitones from `from` to `to` (positive = ascending). */
  static intervalInSemitones(from: Pitch, to: Pitch): number {
    return Pitch.toMidiNote(to) - Pitch.toMidiNote(from);
  }

  /** Transpose a pitch by a number of semitones (sharps spelling). */
  static transpose(pitch: Pitch, semitones: number): Pitch {
    return Pitch.fromMidiNote(Pitch.toMidiNote(pitch) + semitones);
  }
}

/** The unpitched type represents musical elements that are notated on the staff but lack definite pitch, such as unpitched percussion and speaking voice. If the child elements are not present, the note is placed on the middle line of the staff. This is generally used with a one-line staff. Notes in percussion clef should always use an unpitched element rather than a pitch element. */
export class Unpitched implements UnpitchedShape {
  displayStep?: Step;
  displayOctave?: number;

  constructor(init?: Partial<Unpitched>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Unpitched {
    return new Unpitched({
      displayStep: asEnum(Step, textOf(node, 'display-step')),
      displayOctave: numText(node, 'display-octave'),
    });
  }

  static toXmlElement(u: Unpitched): XmlElement {
    const c: XmlElement[] = [];
    if (u.displayStep !== undefined) c.push(textEl('display-step', u.displayStep));
    if (u.displayOctave !== undefined) c.push(textEl('display-octave', u.displayOctave));
    return el('unpitched', c);
  }
}

/** The rest element indicates notated rests or silences. Rest elements are usually empty, but placement on the staff can be specified using display-step and display-octave elements. If the measure attribute is set to yes, this indicates this is a complete measure rest. */
export class Rest implements RestShape {
  displayStep?: Step;
  displayOctave?: number;
  measure?: YesNo;

  constructor(init?: Partial<Rest>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Rest {
    return new Rest({
      displayStep: asEnum(Step, textOf(node, 'display-step')),
      displayOctave: numText(node, 'display-octave'),
      measure: attr(node, 'measure') as YesNo | undefined,
    });
  }

  static toXmlElement(r: Rest): XmlElement {
    const c: XmlElement[] = [];
    if (r.displayStep !== undefined) c.push(textEl('display-step', r.displayStep));
    if (r.displayOctave !== undefined) c.push(textEl('display-octave', r.displayOctave));
    return el('rest', c, { measure: r.measure });
  }
}
