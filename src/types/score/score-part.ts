/**
 * ScorePart — one `<score-part>` in the part-list.
 * @see musicxml.xsd complexType "score-part"
 *
 * Holds part identification + naming + the instrument/MIDI/player content model,
 * with static `fromXmlElement`/`toXmlElement` (a parent `PartList` composes these)
 * and the `computeInstrumentType` derivation. Static, data-in, so it tolerates
 * plain `ScorePart`-shaped objects (editor fixtures, external callers).
 */

import { attr, childrenOf, el, elementText, textEl, type XmlElement } from '../../xml/xml-element';
import { InstrumentType } from '../enums';
import { InstrumentSounds } from '../common/instrument-sounds';
import { NameDisplay } from '../common/name-display';
import { Identification } from './identification';
import { PartLink } from './part-link';
import { PartName } from './part-name';
import { ScoreInstrument } from './score-instrument';
import { Player } from './player';
import { MidiDevice, MidiInstrument } from './midi';
import type { ScorePart as ScorePartShape } from '../score';

/** Each MusicXML part has a score-part entry carrying its name, instruments and MIDI metadata. */
export class ScorePart implements ScorePartShape {
  id = '';
  identification?: Identification;
  partLinks?: PartLink[];
  partName: PartName = new PartName();
  partNameDisplay?: NameDisplay;
  partAbbreviation?: PartName;
  partAbbreviationDisplay?: NameDisplay;
  groups?: string[];
  scoreInstruments?: ScoreInstrument[];
  players?: Player[];
  midiDevices?: MidiDevice[];
  midiInstruments?: MidiInstrument[];

  constructor(init?: Partial<ScorePart>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): ScorePart {
    const one = (tag: string) => childrenOf(node, tag)[0];
    const many = <T>(tag: string, f: (n: XmlElement) => T): T[] | undefined => {
      const arr = childrenOf(node, tag).map(f);
      return arr.length ? arr : undefined;
    };
    const partName = one('part-name');
    const partAbbreviation = one('part-abbreviation');
    const nameDisplay = one('part-name-display');
    const abbrDisplay = one('part-abbreviation-display');
    const identification = one('identification');
    const groups = childrenOf(node, 'group')
      .map((g) => elementText(g))
      .filter((s): s is string => s !== undefined);
    return new ScorePart({
      id: attr(node, 'id') ?? '',
      identification: identification ? Identification.fromXmlElement(identification) : undefined,
      partLinks: many('part-link', PartLink.fromXmlElement),
      partName: partName ? PartName.fromXmlElement(partName) : new PartName(),
      partNameDisplay: nameDisplay ? NameDisplay.fromXmlElement(nameDisplay) : undefined,
      partAbbreviation: partAbbreviation ? PartName.fromXmlElement(partAbbreviation) : undefined,
      partAbbreviationDisplay: abbrDisplay ? NameDisplay.fromXmlElement(abbrDisplay) : undefined,
      groups: groups.length ? groups : undefined,
      scoreInstruments: many('score-instrument', ScoreInstrument.fromXmlElement),
      players: many('player', Player.fromXmlElement),
      midiDevices: many('midi-device', MidiDevice.fromXmlElement),
      midiInstruments: many('midi-instrument', MidiInstrument.fromXmlElement),
    });
  }

  static toXmlElement(sp: ScorePart): XmlElement {
    const c: XmlElement[] = [];
    if (sp.identification) c.push(Identification.toXmlElement(sp.identification));
    for (const link of sp.partLinks ?? []) c.push(PartLink.toXmlElement(link));
    c.push(PartName.toXmlElement(sp.partName, 'part-name'));
    if (sp.partNameDisplay) c.push(NameDisplay.toXmlElement(sp.partNameDisplay, 'part-name-display'));
    if (sp.partAbbreviation) c.push(PartName.toXmlElement(sp.partAbbreviation, 'part-abbreviation'));
    if (sp.partAbbreviationDisplay) c.push(NameDisplay.toXmlElement(sp.partAbbreviationDisplay, 'part-abbreviation-display'));
    for (const g of sp.groups ?? []) c.push(textEl('group', g));
    for (const si of sp.scoreInstruments ?? []) c.push(ScoreInstrument.toXmlElement(si));
    for (const player of sp.players ?? []) c.push(Player.toXmlElement(player));
    for (const md of sp.midiDevices ?? []) c.push(MidiDevice.toXmlElement(md));
    for (const mi of sp.midiInstruments ?? []) c.push(MidiInstrument.toXmlElement(mi));
    return el('score-part', c, { id: sp.id });
  }

  // ----------------------------------------------------------- behavior ----

  /**
   * Compute an {@link InstrumentType} from a score-part's metadata, in order of
   * reliability:
   * 1. MIDI channel 10 — the definitive percussion routing.
   * 2. The `<instrument-sound>` id — a structured standard taxonomy
   *    ({@link InstrumentSounds}); the most reliable timbre signal when present.
   * 3. Part-name keywords.
   * 4. The MIDI program, resolved through the standard GM sound set (so e.g.
   *    organ → Keys and choir → Vocals, not just the piano/guitar/bass ranges).
   *
   * Used when a part-abbreviation doesn't carry a valid InstrumentType.
   */
  static computeInstrumentType(scorePart: ScorePart): InstrumentType {
    const name = (scorePart.partName?.value ?? '').toLowerCase();
    const midi = scorePart.midiInstruments?.[0];
    const soundId = scorePart.scoreInstruments?.[0]?.instrumentSound;

    // 1. Channel 10 is unambiguously percussion.
    if (midi?.midiChannel === 10) return InstrumentType.Drums;

    // 2. The standard instrument-sound id (when it maps to a known category).
    if (soundId) {
      const fromSound = instrumentTypeFromSoundId(soundId);
      if (fromSound) return fromSound;
    }

    // 3. Part-name keywords.
    if (name.includes('drum') || name.includes('percussion')) return InstrumentType.Drums;
    if (name.includes('guitar') || name.includes('gtr')) return InstrumentType.Guitar;
    if (name.includes('bass')) return InstrumentType.Bass;
    if (name.includes('vocal') || name.includes('voice') || name.includes('sing')) return InstrumentType.Vocals;
    if (name.includes('piano') || name.includes('keys') || name.includes('keyboard')) return InstrumentType.Keys;

    // 4. MIDI program → its standard GM sound → category.
    if (midi?.midiProgram !== undefined) {
      const gmSound = InstrumentSounds.byMidiProgram(midi.midiProgram);
      const fromProgram = gmSound && instrumentTypeFromSoundId(gmSound.id);
      if (fromProgram) return fromProgram;
    }

    return InstrumentType.Other;
  }
}

/**
 * Map a standard MusicXML instrument-sound id to a coarse {@link InstrumentType},
 * or undefined when the family doesn't correspond to one of the app's categories
 * (so callers fall through to other heuristics rather than mis-classify).
 */
function instrumentTypeFromSoundId(soundId: string): InstrumentType | undefined {
  const sound = InstrumentSounds.parse(soundId);
  if (!sound) return undefined;
  switch (sound.family) {
    case 'voice':
      return InstrumentType.Vocals;
    case 'keyboard':
      return InstrumentType.Keys;
    case 'drum':
      return InstrumentType.Drums;
    case 'pluck': {
      // "guitar"/"bass" is the instrument for a 2-segment id (pluck.guitar) but
      // the sub-family for a deeper one (pluck.guitar.electric, pluck.bass.fretless).
      const kind = sound.subFamily ?? sound.instrument;
      if (kind === 'guitar') return InstrumentType.Guitar;
      if (kind === 'bass') return InstrumentType.Bass;
      return undefined;
    }
    default:
      return undefined;
  }
}
