import { describe, expect, it } from 'vitest';
import { InstrumentType, type ScorePart } from '../../types';
import { ScorePart as ScorePartClass } from './score-part';

const part = (init: Partial<ScorePart>): ScorePart =>
  ({ id: 'P1', partName: { value: '' }, ...init }) as ScorePart;

const sound = (instrumentSound: string): ScorePart =>
  part({ scoreInstruments: [{ id: 'P1-I1', instrumentName: '', instrumentSound }] });

describe('ScorePart.computeInstrumentType', () => {
  it('MIDI channel 10 wins as Drums regardless of other signals', () => {
    expect(
      ScorePartClass.computeInstrumentType(
        part({ partName: { value: 'Lead Guitar' }, midiInstruments: [{ id: 'i', midiChannel: 10 }] }),
      ),
    ).toBe(InstrumentType.Drums);
  });

  it('classifies from the instrument-sound id (most reliable)', () => {
    expect(ScorePartClass.computeInstrumentType(sound('pluck.guitar.electric'))).toBe(InstrumentType.Guitar);
    expect(ScorePartClass.computeInstrumentType(sound('pluck.bass.fretless'))).toBe(InstrumentType.Bass);
    expect(ScorePartClass.computeInstrumentType(sound('drum.group.set'))).toBe(InstrumentType.Drums);
    expect(ScorePartClass.computeInstrumentType(sound('voice.alto'))).toBe(InstrumentType.Vocals);
    expect(ScorePartClass.computeInstrumentType(sound('keyboard.organ.pipe'))).toBe(InstrumentType.Keys);
  });

  it('a confident sound id overrides a misleading part name', () => {
    expect(
      ScorePartClass.computeInstrumentType(
        part({ partName: { value: 'Bass' }, scoreInstruments: [{ id: 'i', instrumentName: '', instrumentSound: 'pluck.guitar.electric' }] }),
      ),
    ).toBe(InstrumentType.Guitar);
  });

  it('falls through to the name when the sound family is not a known category', () => {
    // pluck.harp / pluck.banjo are not guitar/bass → don't mis-classify, use the name.
    expect(
      ScorePartClass.computeInstrumentType(
        part({ partName: { value: 'Acoustic Guitar' }, scoreInstruments: [{ id: 'i', instrumentName: '', instrumentSound: 'pluck.banjo' }] }),
      ),
    ).toBe(InstrumentType.Guitar);
    expect(ScorePartClass.computeInstrumentType(sound('pluck.harp'))).toBe(InstrumentType.Other);
  });

  it('resolves the MIDI program through the GM sound set (beyond the old ranges)', () => {
    expect(ScorePartClass.computeInstrumentType(part({ midiInstruments: [{ id: 'i', midiProgram: 1 }] }))).toBe(InstrumentType.Keys); // Grand Piano
    expect(ScorePartClass.computeInstrumentType(part({ midiInstruments: [{ id: 'i', midiProgram: 20 }] }))).toBe(InstrumentType.Keys); // Church Organ (new)
    expect(ScorePartClass.computeInstrumentType(part({ midiInstruments: [{ id: 'i', midiProgram: 30 }] }))).toBe(InstrumentType.Guitar); // Distortion Guitar
    expect(ScorePartClass.computeInstrumentType(part({ midiInstruments: [{ id: 'i', midiProgram: 34 }] }))).toBe(InstrumentType.Bass); // Electric Bass
    expect(ScorePartClass.computeInstrumentType(part({ midiInstruments: [{ id: 'i', midiProgram: 53 }] }))).toBe(InstrumentType.Vocals); // Choir Aahs (new)
    expect(ScorePartClass.computeInstrumentType(part({ midiInstruments: [{ id: 'i', midiProgram: 41 }] }))).toBe(InstrumentType.Other); // Violin → no category
  });

  it('defaults to Other with no usable signal', () => {
    expect(ScorePartClass.computeInstrumentType(part({ partName: { value: 'Mystery' } }))).toBe(InstrumentType.Other);
  });
});
