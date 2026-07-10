/**
 * Note — the main note element, composing every note-tier leaf class.
 * @see musicxml.xsd "note"
 *
 * Serialization parity: emits the same children/attributes as the prior
 * string serializer plus `<instrument>` (previously dropped). Note-level
 * print-style/printout attributes and `notehead-text`/`play`/`listen` are
 * carried on the type but not yet serialized (FormattedText not class-migrated).
 */

import { attr, childrenOf, el, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import type { Color, Divisions, EditorialVoice, Font, Tenths, TimeOnly } from '../common';
import { NoteTypeValue, Step, type YesNo } from '../enums';
import { Accidental, Dot, Grace, Notehead } from './note-display';
import { Beam, NoteType, Stem, Tie, TimeModification } from './note-parts';
import { Pitch, Rest, Unpitched } from './pitch';
import { Notations } from './notations';
import { Lyric } from './lyric';
import { Listen, NoteheadText, Play } from './note-extras';
import { PrintStyleAttrs } from '../common/attribute-groups';
import type { Bend, Instrument, Note as NoteShape } from '../note';
import type { MidiInstrument } from '../score';
import { getDrumMidiFromDisplay } from '../../utils/drums';

/**
 * Options for {@link Note.getMidiNote}.
 */
export interface GetMidiNoteOptions {
  /**
   * Map of instrument IDs to MidiInstrument definitions.
   * Used to resolve unpitched notes via instrument references.
   */
  midiInstruments?: Map<string, MidiInstrument>;
}

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}
function numAttr(node: XmlElement, name: string): number | undefined {
  const v = attr(node, name);
  return v === undefined ? undefined : Number(v);
}

/**
 * Notes are the most common type of MusicXML data. The MusicXML format distinguishes between elements used for sound information and elements used for notation information (e.g., tie is used for sound, tied for notation). Thus grace notes do not have a duration element. Cue notes have a duration element, as do forward elements, but no tie elements. Having these two types of information available can make interchange easier, as some programs handle one type of information more readily than the other. The print-leger attribute is used to indicate whether leger lines are printed. Notes without leger lines are used to indicate indeterminate high and low notes. By default, it is set to yes. If print-object is set to no, print-leger is interpreted to also be set to no if not present. This attribute is ignored for rests. The dynamics and end-dynamics attributes correspond to MIDI 1.0's Note On and Note Off velocities, respectively. They are expressed in terms of percentages of the default forte value (90 for MIDI 1.0). The attack and release attributes are used to alter the starting and stopping time of the note from when it would otherwise occur based on the flow of durations - information that is specific to a performance. They are expressed in terms of divisions, either positive or negative. A note that starts a tie should not have a release attribute, and a note that stops a tie should not have an attack attribute. The attack and release attributes are independent of each other. The attack attribute only changes the starting time of a note, and the release attribute only changes the stopping time of a note. If a note is played only particular times through a repeat, the time-only attribute shows which times to play the note. The pizzicato attribute is used when just this note is sounded pizzicato, vs. the pizzicato element which changes overall playback between pizzicato and arco.
 * @see musicxml.xsd "note".
 */
export class Note implements NoteShape {
  grace?: Grace;
  cue?: boolean;
  chord?: boolean;
  pitch?: Pitch;
  unpitched?: Unpitched;
  rest?: Rest;
  duration?: Divisions;
  ties?: Tie[];
  instruments?: Instrument[];
  voice?: string;
  type?: NoteType;
  dots?: Dot[];
  accidental?: Accidental;
  timeModification?: TimeModification;
  stem?: Stem;
  notehead?: Notehead;
  staff?: number;
  beams?: Beam[];
  notations?: Notations[];
  lyrics?: Lyric[];
  noteheadText?: NoteheadText;
  play?: Play;
  listen?: Listen;
  // Note attributes serialized below.
  printLeger?: YesNo;
  dynamics?: number;
  endDynamics?: number;
  attack?: Divisions;
  release?: Divisions;
  timeOnly?: TimeOnly;
  pizzicato?: YesNo;
  // Editorial voice (footnote/level) carried but not yet serialized.
  editorial?: EditorialVoice;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  printObject?: YesNo;
  printDot?: YesNo;
  printSpacing?: YesNo;
  printLyric?: YesNo;
  id?: string;

  constructor(init?: Partial<Note>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Note {
    const one = <T>(tag: string, f: (n: XmlElement) => T): T | undefined => {
      const c = childrenOf(node, tag)[0];
      return c ? f(c) : undefined;
    };
    const many = <T>(tag: string, f: (n: XmlElement) => T): T[] | undefined => {
      const arr = childrenOf(node, tag).map(f);
      return arr.length ? arr : undefined;
    };
    const instruments = childrenOf(node, 'instrument').map((n) => ({ id: attr(n, 'id') ?? '' }));
    return new Note({
      grace: one('grace', Grace.fromXmlElement),
      cue: childrenOf(node, 'cue').length > 0 || undefined,
      chord: childrenOf(node, 'chord').length > 0 || undefined,
      pitch: one('pitch', Pitch.fromXmlElement),
      unpitched: one('unpitched', Unpitched.fromXmlElement),
      rest: one('rest', Rest.fromXmlElement),
      duration: numText(node, 'duration'),
      ties: many('tie', Tie.fromXmlElement),
      instruments: instruments.length ? instruments : undefined,
      voice: textOf(node, 'voice'),
      type: one('type', NoteType.fromXmlElement),
      dots: many('dot', Dot.fromXmlElement),
      accidental: one('accidental', Accidental.fromXmlElement),
      timeModification: one('time-modification', TimeModification.fromXmlElement),
      stem: one('stem', Stem.fromXmlElement),
      notehead: one('notehead', Notehead.fromXmlElement),
      noteheadText: one('notehead-text', NoteheadText.fromXmlElement),
      staff: numText(node, 'staff'),
      beams: many('beam', Beam.fromXmlElement),
      notations: many('notations', Notations.fromXmlElement),
      lyrics: many('lyric', Lyric.fromXmlElement),
      play: one('play', Play.fromXmlElement),
      listen: one('listen', Listen.fromXmlElement),
      printLeger: attr(node, 'print-leger') as YesNo | undefined,
      dynamics: numAttr(node, 'dynamics'),
      endDynamics: numAttr(node, 'end-dynamics'),
      attack: numAttr(node, 'attack'),
      release: numAttr(node, 'release'),
      timeOnly: attr(node, 'time-only'),
      pizzicato: attr(node, 'pizzicato') as YesNo | undefined,
      printObject: attr(node, 'print-object') as YesNo | undefined,
      printDot: attr(node, 'print-dot') as YesNo | undefined,
      printSpacing: attr(node, 'print-spacing') as YesNo | undefined,
      printLyric: attr(node, 'print-lyric') as YesNo | undefined,
      ...PrintStyleAttrs.read(node),
      id: attr(node, 'id'),
    });
  }

  static toXmlElement(note: Note): XmlElement {
    const c: XmlElement[] = [];
    if (note.grace) c.push(Grace.toXmlElement(note.grace));
    if (note.cue) c.push(el('cue', []));
    if (note.chord) c.push(el('chord', []));
    if (note.pitch) c.push(Pitch.toXmlElement(note.pitch));
    else if (note.unpitched) c.push(Unpitched.toXmlElement(note.unpitched));
    else if (note.rest) c.push(Rest.toXmlElement(note.rest));
    if (note.duration !== undefined) c.push(textEl('duration', note.duration));
    for (const tie of note.ties ?? []) c.push(Tie.toXmlElement(tie));
    for (const inst of note.instruments ?? []) c.push(el('instrument', [], { id: inst.id }));
    if (note.voice) c.push(textEl('voice', note.voice));
    if (note.type) c.push(NoteType.toXmlElement(note.type));
    if (Array.isArray(note.dots)) for (const dot of note.dots) c.push(Dot.toXmlElement(dot));
    if (note.accidental) c.push(Accidental.toXmlElement(note.accidental));
    if (note.timeModification) c.push(TimeModification.toXmlElement(note.timeModification));
    if (note.stem) c.push(Stem.toXmlElement(note.stem));
    if (note.notehead) c.push(Notehead.toXmlElement(note.notehead));
    if (note.noteheadText) c.push(NoteheadText.toXmlElement(note.noteheadText));
    if (note.staff !== undefined) c.push(textEl('staff', note.staff));
    for (const beam of note.beams ?? []) c.push(Beam.toXmlElement(beam));
    for (const notations of note.notations ?? []) c.push(Notations.toXmlElement(notations));
    for (const lyric of note.lyrics ?? []) c.push(Lyric.toXmlElement(lyric));
    if (note.play) c.push(Play.toXmlElement(note.play));
    if (note.listen) c.push(Listen.toXmlElement(note.listen));
    return el('note', c, {
      ...PrintStyleAttrs.attrs(note),
      'print-object': note.printObject,
      'print-dot': note.printDot,
      'print-spacing': note.printSpacing,
      'print-lyric': note.printLyric,
      'print-leger': note.printLeger,
      dynamics: note.dynamics,
      'end-dynamics': note.endDynamics,
      attack: note.attack,
      release: note.release,
      'time-only': note.timeOnly,
      pizzicato: note.pizzicato,
      id: note.id,
    });
  }

  // ----------------------------------------------------------- behavior ----
  // Static (data-in) so these work on plain `Note`-shaped objects too.

  /**
   * Duration in divisions. Grace notes return 0 (they don't advance position
   * per the MusicXML spec).
   * @throws if a non-grace note is missing the required duration element.
   */
  static getDuration(note: Note): Divisions {
    if (note.grace) return 0;
    if (note.duration === undefined) {
      throw new Error('Non-grace note is missing required duration element');
    }
    return note.duration;
  }

  /**
   * Visual/rhythmic duration in divisions. Regular notes use `duration`; grace
   * notes derive it from `grace.makeTime`, then `type`, then default to an
   * eighth note — useful where grace notes need a non-zero grid duration.
   * @throws if a non-grace note is missing the required duration element.
   */
  static getRawDuration(note: Note, divisions: Divisions): Divisions {
    if (note.duration !== undefined) return note.duration;
    if (note.grace?.makeTime !== undefined) return note.grace.makeTime;
    if (note.grace) {
      if (note.type) {
        const duration = noteTypeValueToDivisions(note.type.value, divisions);
        if (duration !== undefined) return duration;
      }
      return divisions / 2; // most common grace value (eighth)
    }
    throw new Error('Non-grace note is missing required duration element');
  }

  /** True if the note is a grace note. */
  static isGraceNote(note: Note): boolean {
    return note.grace !== undefined;
  }

  /** True if the note is part of a chord (sounds with the previous note). */
  static isChordNote(note: Note): boolean {
    return note.chord === true;
  }

  /** True if the note is a rest. */
  static isRest(note: Note): boolean {
    return note.rest !== undefined;
  }

  /** True if the note is a cue note. */
  static isCueNote(note: Note): boolean {
    return note.cue === true;
  }

  /** True if the note has a pitch (vs. unpitched/rest). */
  static hasPitch(note: Note): boolean {
    return note.pitch !== undefined;
  }

  /** True if the note is unpitched (percussion). */
  static isUnpitched(note: Note): boolean {
    return note.unpitched !== undefined;
  }

  /**
   * MIDI note number (0–127) for this note, or `undefined` for rests.
   *
   * - **Pitched notes** use the pitch element (step, octave, alter).
   * - **Unpitched notes** (percussion) resolve in order:
   *   1. instrument reference → `midiUnpitched` (standard MusicXML), when an
   *      `options.midiInstruments` map is supplied;
   *   2. display position (+ notehead) — the notehead disambiguates drums sharing a staff position;
   *   3. mathematical fallback derived from the display position.
   */
  static getMidiNote(note: Note, options: GetMidiNoteOptions = {}): number | undefined {
    const { midiInstruments } = options;

    // Pitched note - use pitch element.
    if (note.pitch) {
      return Pitch.toMidiNote(note.pitch);
    }

    // Unpitched note (drums/percussion).
    if (note.unpitched) {
      // 1. Instrument reference → midiUnpitched (standard MusicXML path).
      if (midiInstruments && note.instruments && note.instruments.length > 0) {
        const instrumentId = note.instruments[0].id;
        const midiInstrument = midiInstruments.get(instrumentId);
        if (midiInstrument?.midiUnpitched) {
          // midi-unpitched is 1-indexed (Midi128: 1–128); convert to 0–127.
          return midiInstrument.midiUnpitched - 1;
        }
      }

      // 2. Display position.
      const step = note.unpitched.displayStep ?? 'C'as Step;
      const octave = note.unpitched.displayOctave ?? 4;
      const midiNote = getDrumMidiFromDisplay(step, octave, note.notehead?.value);
      if (midiNote !== undefined) {
        return midiNote;
      }

      // 3. Derive from display position mathematically (approximate fallback),
      //    reusing the canonical pitch→MIDI math.
      return Pitch.toMidiNote(new Pitch({ step: step, octave }));
    }

    // Rest or unknown - no MIDI note.
    return undefined;
  }

  /** String number from technical notation (tablature); 1 = highest string. */
  static getStringNumber(note: Note): number | undefined {
    for (const notation of note.notations ?? []) {
      for (const technical of notation.technicals ?? []) {
        if (technical.string?.value !== undefined) return technical.string.value;
      }
    }
    return undefined;
  }

  /** Fret number from technical notation (tablature); 0 = open string. */
  static getFretNumber(note: Note): number | undefined {
    for (const notation of note.notations ?? []) {
      for (const technical of notation.technicals ?? []) {
        if (technical.fret?.value !== undefined) return technical.fret.value;
      }
    }
    return undefined;
  }

  /**
   * Pitch-bend elements from technical notation, in document order (a
   * bend-and-release is two sibling `<bend>` elements). Empty array if none.
   */
  static getBends(note: Note): Bend[] {
    for (const notation of note.notations ?? []) {
      for (const technical of notation.technicals ?? []) {
        if (technical.bends && technical.bends.length > 0) return technical.bends;
      }
    }
    return [];
  }

  /**
   * True if the note carries an active vibrato (wavy-line) ornament. A wavy
   * line of type `start`/`continue` marks active vibrato; a lone `stop` only
   * closes a run and is not treated as vibrato.
   */
  static hasVibrato(note: Note): boolean {
    for (const notation of note.notations ?? []) {
      for (const ornament of notation.ornaments ?? []) {
        for (const wavyLine of ornament.wavyLines ?? []) {
          if (wavyLine.type === 'start' || wavyLine.type === 'continue') return true;
        }
      }
    }
    return false;
  }
}

/**
 * Convert a note-type value to a duration in divisions (maxima … 1024th);
 * undefined for unknown types. Module-private; reached via {@link Note.getRawDuration}.
 */
function noteTypeValueToDivisions(typeValue: NoteTypeValue, divisions: Divisions): Divisions | undefined {
  switch (typeValue) {
    case NoteTypeValue.Maxima: return divisions * 32;
    case NoteTypeValue.Long: return divisions * 16;
    case NoteTypeValue.Breve: return divisions * 8;
    case NoteTypeValue.Whole: return divisions * 4;
    case NoteTypeValue.Half: return divisions * 2;
    case NoteTypeValue.Quarter: return divisions;
    case NoteTypeValue.Eighth: return divisions / 2;
    case NoteTypeValue.Sixteenth: return divisions / 4;
    case NoteTypeValue.ThirtySecond: return divisions / 8;
    case NoteTypeValue.SixtyFourth: return divisions / 16;
    case NoteTypeValue.OneHundredTwentyEighth: return divisions / 32;
    case NoteTypeValue.TwoHundredFiftySixth: return divisions / 64;
    case NoteTypeValue.FiveHundredTwelfth: return divisions / 128;
    case NoteTypeValue.OneThousandTwentyFourth: return divisions / 256;
    default: return undefined;
  }
}
