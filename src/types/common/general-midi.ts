/**
 * General MIDI Level 1 ↔ MusicXML instrument-sound mapping.
 *
 * The MusicXML sounds catalog (specs/schema/sounds.xml) ships **no** General
 * MIDI data, so this table is hand-curated: each of the 128 GM Level-1 program
 * numbers maps to its representative standard sound id.
 *
 * Scope notes:
 * - GM **melodic programs only** (1–128). Percussion lives on MIDI channel 10
 *   and is addressed by note number, not by a program, so drum kits/instruments
 *   are intentionally absent here.
 * - GM2 **bank-select** variations are out of scope (the catalog has no finer
 *   timbres for them).
 * - Several programs may share a sound id where the catalog lacks a distinct
 *   timbre (e.g. the three electric pianos). The reverse lookup (a sound's
 *   {@link InstrumentSound.defaultMidiProgram}) keeps the **lowest** such program
 *   as the primary.
 */

import type { InstrumentSoundId } from './instrument-sounds.data';

/** GM Level-1 program number (1–128) → representative MusicXML sound id. */
export const GENERAL_MIDI_PROGRAM_SOUNDS: Readonly<Record<number, InstrumentSoundId>> = {
  // Piano (1–8)
  1: 'keyboard.piano.grand', // Acoustic Grand Piano
  2: 'keyboard.piano.upright', // Bright Acoustic Piano
  3: 'keyboard.piano.electric', // Electric Grand Piano
  4: 'keyboard.piano.honky-tonk', // Honky-tonk Piano
  5: 'keyboard.piano.electric', // Electric Piano 1
  6: 'keyboard.piano.electric', // Electric Piano 2
  7: 'keyboard.harpsichord', // Harpsichord
  8: 'keyboard.clavichord', // Clavi(net)

  // Chromatic Percussion (9–16)
  9: 'keyboard.celesta', // Celesta
  10: 'pitched-percussion.glockenspiel', // Glockenspiel
  11: 'pitched-percussion.music-box', // Music Box
  12: 'pitched-percussion.vibraphone', // Vibraphone
  13: 'pitched-percussion.marimba', // Marimba
  14: 'pitched-percussion.xylophone', // Xylophone
  15: 'pitched-percussion.tubular-bells', // Tubular Bells
  16: 'pitched-percussion.hammer-dulcimer', // Dulcimer

  // Organ (17–24)
  17: 'keyboard.organ.drawbar', // Drawbar Organ
  18: 'keyboard.organ.percussive', // Percussive Organ
  19: 'keyboard.organ.rotary', // Rock Organ
  20: 'keyboard.organ.pipe', // Church Organ
  21: 'keyboard.organ.reed', // Reed Organ
  22: 'keyboard.accordion', // Accordion
  23: 'wind.reed.harmonica', // Harmonica
  24: 'keyboard.bandoneon', // Tango Accordion

  // Guitar (25–32)
  25: 'pluck.guitar.nylon-string', // Acoustic Guitar (nylon)
  26: 'pluck.guitar.steel-string', // Acoustic Guitar (steel)
  27: 'pluck.guitar.electric', // Electric Guitar (jazz)
  28: 'pluck.guitar.electric', // Electric Guitar (clean)
  29: 'pluck.guitar.electric', // Electric Guitar (muted)
  30: 'pluck.guitar.electric', // Overdriven Guitar
  31: 'pluck.guitar.electric', // Distortion Guitar
  32: 'pluck.guitar.electric', // Guitar Harmonics

  // Bass (33–40)
  33: 'pluck.bass.acoustic', // Acoustic Bass
  34: 'pluck.bass.electric', // Electric Bass (finger)
  35: 'pluck.bass.electric', // Electric Bass (pick)
  36: 'pluck.bass.fretless', // Fretless Bass
  37: 'pluck.bass.electric', // Slap Bass 1
  38: 'pluck.bass.electric', // Slap Bass 2
  39: 'pluck.bass.synth', // Synth Bass 1
  40: 'pluck.bass.synth', // Synth Bass 2

  // Strings (41–48)
  41: 'strings.violin', // Violin
  42: 'strings.viola', // Viola
  43: 'strings.cello', // Cello
  44: 'strings.contrabass', // Contrabass
  45: 'strings.group', // Tremolo Strings
  46: 'strings.group', // Pizzicato Strings
  47: 'pluck.harp', // Orchestral Harp
  48: 'drum.timpani', // Timpani

  // Ensemble (49–56)
  49: 'strings.group', // String Ensemble 1
  50: 'strings.group', // String Ensemble 2
  51: 'strings.group.synth', // Synth Strings 1
  52: 'strings.group.synth', // Synth Strings 2
  53: 'voice.aa', // Choir Aahs
  54: 'voice.oo', // Voice Oohs
  55: 'voice.synth', // Synth Voice
  56: 'synth.group.orchestra', // Orchestra Hit

  // Brass (57–64)
  57: 'brass.trumpet', // Trumpet
  58: 'brass.trombone', // Trombone
  59: 'brass.tuba', // Tuba
  60: 'brass.trumpet', // Muted Trumpet
  61: 'brass.french-horn', // French Horn
  62: 'brass.group', // Brass Section
  63: 'brass.group.synth', // Synth Brass 1
  64: 'brass.group.synth', // Synth Brass 2

  // Reed (65–72)
  65: 'wind.reed.saxophone.soprano', // Soprano Sax
  66: 'wind.reed.saxophone.alto', // Alto Sax
  67: 'wind.reed.saxophone.tenor', // Tenor Sax
  68: 'wind.reed.saxophone.baritone', // Baritone Sax
  69: 'wind.reed.oboe', // Oboe
  70: 'wind.reed.english-horn', // English Horn
  71: 'wind.reed.bassoon', // Bassoon
  72: 'wind.reed.clarinet', // Clarinet

  // Pipe (73–80)
  73: 'wind.flutes.flute.piccolo', // Piccolo
  74: 'wind.flutes.flute', // Flute
  75: 'wind.flutes.recorder', // Recorder
  76: 'wind.flutes.panpipes', // Pan Flute
  77: 'wind.flutes.blown-bottle', // Blown Bottle
  78: 'wind.flutes.shakuhachi', // Shakuhachi
  79: 'wind.flutes.whistle', // Whistle
  80: 'wind.flutes.ocarina', // Ocarina

  // Synth Lead (81–88)
  81: 'synth.tone.square', // Lead 1 (square)
  82: 'synth.tone.sawtooth', // Lead 2 (sawtooth)
  83: 'wind.flutes.calliope', // Lead 3 (calliope)
  84: 'pluck.synth.chiff', // Lead 4 (chiff)
  85: 'pluck.synth.charang', // Lead 5 (charang)
  86: 'voice.synth', // Lead 6 (voice)
  87: 'synth.group.fifths', // Lead 7 (fifths)
  88: 'pluck.bass.synth.lead', // Lead 8 (bass + lead)

  // Synth Pad (89–96)
  89: 'synth.pad', // Pad 1 (new age)
  90: 'synth.pad.warm', // Pad 2 (warm)
  91: 'synth.pad.polysynth', // Pad 3 (polysynth)
  92: 'synth.pad.choir', // Pad 4 (choir)
  93: 'synth.pad.bowed', // Pad 5 (bowed)
  94: 'synth.pad.metallic', // Pad 6 (metallic)
  95: 'synth.pad.halo', // Pad 7 (halo)
  96: 'synth.pad.sweep', // Pad 8 (sweep)

  // Synth Effects (97–104)
  97: 'synth.effects.rain', // FX 1 (rain)
  98: 'synth.effects.soundtrack', // FX 2 (soundtrack)
  99: 'synth.effects.crystal', // FX 3 (crystal)
  100: 'synth.effects.atmosphere', // FX 4 (atmosphere)
  101: 'synth.effects.brightness', // FX 5 (brightness)
  102: 'synth.effects.goblins', // FX 6 (goblins)
  103: 'synth.effects.echoes', // FX 7 (echoes)
  104: 'synth.effects.sci-fi', // FX 8 (sci-fi)

  // Ethnic (105–112)
  105: 'pluck.sitar', // Sitar
  106: 'pluck.banjo', // Banjo
  107: 'pluck.shamisen', // Shamisen
  108: 'pluck.koto', // Koto
  109: 'pitched-percussion.kalimba', // Kalimba
  110: 'wind.pipes.bagpipes', // Bag pipe
  111: 'strings.fiddle', // Fiddle
  112: 'wind.reed.shenai', // Shanai

  // Percussive (113–120)
  113: 'metal.bells.tinklebell', // Tinkle Bell
  114: 'metal.bells.agogo', // Agogo
  115: 'metal.steel-drums', // Steel Drums
  116: 'wood.wood-block', // Woodblock
  117: 'drum.taiko', // Taiko Drum
  118: 'drum.tom-tom', // Melodic Tom
  119: 'drum.tom-tom.synth', // Synth Drum
  120: 'metal.cymbal.reverse', // Reverse Cymbal

  // Sound Effects (121–128)
  121: 'effect.guitar-fret', // Guitar Fret Noise
  122: 'effect.breath', // Breath Noise
  123: 'effect.seashore', // Seashore
  124: 'effect.bird.tweet', // Bird Tweet
  125: 'effect.telephone-ring', // Telephone Ring
  126: 'effect.helicopter', // Helicopter
  127: 'effect.applause', // Applause
  128: 'effect.gunshot', // Gunshot
};

/** Lowest GM program per sound id — the sound's primary/default program. */
export const GM_PROGRAM_BY_SOUND_ID: ReadonlyMap<string, number> = (() => {
  const map = new Map<string, number>();
  for (let program = 1; program <= 128; program++) {
    const id = GENERAL_MIDI_PROGRAM_SOUNDS[program];
    if (id && !map.has(id)) map.set(id, program);
  }
  return map;
})();
