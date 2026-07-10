import { describe, expect, it } from 'vitest';
import { INSTRUMENT_SOUND_IDS, InstrumentSounds, GENERAL_MIDI_PROGRAM_SOUNDS } from './instrument-sounds';

/** @see specs/schema/sounds.xml (MusicXML 4.0 standard sounds catalog). */
describe('InstrumentSounds catalog', () => {
  it('exposes the full standard catalog (894 ids, all unique, ≥2 segments)', () => {
    expect(INSTRUMENT_SOUND_IDS).toHaveLength(894);
    expect(new Set<string>(INSTRUMENT_SOUND_IDS).size).toBe(894);
    expect(InstrumentSounds.ids()).toBe(INSTRUMENT_SOUND_IDS);
    for (const id of INSTRUMENT_SOUND_IDS) expect(id.split('.').length).toBeGreaterThanOrEqual(2);
  });

  it('parses every catalog id into the typed structure', () => {
    const all = InstrumentSounds.all();
    expect(all).toHaveLength(894);
    for (const sound of all) {
      expect(sound.family).toBeTruthy();
      expect(sound.instrument).toBeTruthy();
    }
  });

  it('lists the standard families', () => {
    expect(InstrumentSounds.families()).toEqual([
      'brass', 'drum', 'effect', 'keyboard', 'metal', 'pitched-percussion',
      'pluck', 'rattle', 'strings', 'synth', 'voice', 'wind', 'wood',
    ]);
  });

  it('isStandard / get distinguish catalog ids from foreign ones', () => {
    expect(InstrumentSounds.isStandard('wind.flutes.flute.piccolo')).toBe(true);
    expect(InstrumentSounds.isStandard('strings.violin')).toBe(true);
    expect(InstrumentSounds.isStandard('not.a.real.sound')).toBe(false);
    expect(InstrumentSounds.get('strings.violin')).toMatchObject({ family: 'strings', instrument: 'violin' });
    expect(InstrumentSounds.get('nope')).toBeUndefined();
  });
});

describe('InstrumentSounds.parse (segment rules)', () => {
  it('1 dot → family.instrument', () => {
    expect(InstrumentSounds.parse('brass.alphorn')).toEqual({
      id: 'brass.alphorn',
      family: 'brass',
      instrument: 'alphorn',
      subFamily: undefined,
      variant: undefined,
    });
  });

  it('2 dots → family.subFamily.instrument', () => {
    expect(InstrumentSounds.parse('wind.flutes.flute')).toEqual({
      id: 'wind.flutes.flute',
      family: 'wind',
      subFamily: 'flutes',
      instrument: 'flute',
      variant: undefined,
      defaultMidiProgram: 74, // GM Flute
    });
  });

  it('3 dots → family.subFamily.instrument.variant', () => {
    expect(InstrumentSounds.parse('wind.flutes.flute.piccolo')).toEqual({
      id: 'wind.flutes.flute.piccolo',
      family: 'wind',
      subFamily: 'flutes',
      instrument: 'flute',
      variant: 'piccolo',
      defaultMidiProgram: 73, // GM Piccolo
    });
  });

  it('4+ dots → extra segments folded into the variant', () => {
    expect(InstrumentSounds.parse('wind.flutes.whistle.tin.bflat')).toMatchObject({
      family: 'wind',
      subFamily: 'flutes',
      instrument: 'whistle',
      variant: 'tin.bflat',
    });
  });

  it('rejects ids with fewer than two segments', () => {
    expect(InstrumentSounds.parse('brass')).toBeUndefined();
    expect(InstrumentSounds.parse('')).toBeUndefined();
    expect(InstrumentSounds.parse('brass.')).toBeUndefined();
  });
});

describe('General MIDI mapping', () => {
  it('covers all 128 GM Level-1 programs with valid catalog ids', () => {
    for (let program = 1; program <= 128; program++) {
      const id = GENERAL_MIDI_PROGRAM_SOUNDS[program];
      expect(id, `program ${program}`).toBeTruthy();
      expect(InstrumentSounds.isStandard(id), `program ${program} → ${id}`).toBe(true);
    }
  });

  it('byMidiProgram resolves a program to its sound', () => {
    expect(InstrumentSounds.byMidiProgram(1)?.id).toBe('keyboard.piano.grand');
    expect(InstrumentSounds.byMidiProgram(30)?.id).toBe('pluck.guitar.electric'); // Overdriven Guitar
    expect(InstrumentSounds.byMidiProgram(41)?.id).toBe('strings.violin');
    expect(InstrumentSounds.byMidiProgram(0)).toBeUndefined();
    expect(InstrumentSounds.byMidiProgram(129)).toBeUndefined();
  });

  it('parsed sounds carry defaultMidiProgram (lowest program wins on shared sounds)', () => {
    expect(InstrumentSounds.get('strings.violin')?.defaultMidiProgram).toBe(41);
    // pluck.guitar.electric is shared by programs 27–32; primary is the lowest.
    expect(InstrumentSounds.get('pluck.guitar.electric')?.defaultMidiProgram).toBe(27);
    expect(InstrumentSounds.parse('wind.flutes.flute')?.defaultMidiProgram).toBe(74);
    // A real catalog sound with no GM program leaves it undefined.
    expect(InstrumentSounds.get('brass.alphorn')?.defaultMidiProgram).toBeUndefined();
  });

  it('byMidiProgram returns the sound even when its primary program differs', () => {
    // Program 5 (Electric Piano 1) shares keyboard.piano.electric, whose primary is 3.
    const sound = InstrumentSounds.byMidiProgram(5);
    expect(sound?.id).toBe('keyboard.piano.electric');
    expect(sound?.defaultMidiProgram).toBe(3);
  });
});
