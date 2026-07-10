import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Fan, NoteTypeValue, StartStop, StemValue, SymbolSize } from '../enums';
import { Beam, NoteType, Stem, Tie, TimeModification } from './note-parts';

/** @see musicxml.xsd "stem"/"beam"/"note-type"/"tie"/"time-modification". */
describe('note leaf elements', () => {
  it('Stem round-trips value + position', () => {
    const s = Stem.fromXmlElement(parseElements('<stem default-y="-40">down</stem>')[0]);
    expect(s).toMatchObject({ value: StemValue.Down, defaultY: -40 });
    expect(buildElements([Stem.toXmlElement(s)])).toContain('>down<');
  });

  it('Beam round-trips value + number + fan', () => {
    const b = Beam.fromXmlElement(parseElements('<beam number="1" fan="accel">begin</beam>')[0]);
    expect(b).toMatchObject({ value: 'begin', number: 1, fan: Fan.Accel });
    const round = Beam.fromXmlElement(parseElements(buildElements([Beam.toXmlElement(b)]))[0]);
    expect(round).toMatchObject({ value: 'begin', number: 1, fan: Fan.Accel });
  });

  it('NoteType round-trips value + size', () => {
    const t = NoteType.fromXmlElement(parseElements('<type size="cue">16th</type>')[0]);
    expect(t).toMatchObject({ value: NoteTypeValue.Sixteenth, size: SymbolSize.Cue });
    expect(buildElements([NoteType.toXmlElement(t)])).toContain('>16th<');
  });

  it('Tie round-trips type', () => {
    const tie = Tie.fromXmlElement(parseElements('<tie type="start"/>')[0]);
    expect(tie.type).toBe(StartStop.Start);
    expect(buildElements([Tie.toXmlElement(tie)])).toContain('type="start"');
  });

  it('TimeModification round-trips actual/normal + normal-dot', () => {
    const tm = TimeModification.fromXmlElement(
      parseElements('<time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes><normal-type>eighth</normal-type><normal-dot/></time-modification>')[0],
    );
    expect(tm).toMatchObject({ actualNotes: 3, normalNotes: 2, normalType: NoteTypeValue.Eighth, normalDots: 1 });
    const round = TimeModification.fromXmlElement(parseElements(buildElements([TimeModification.toXmlElement(tm)]))[0]);
    expect(round).toMatchObject({ actualNotes: 3, normalNotes: 2, normalType: NoteTypeValue.Eighth, normalDots: 1 });
  });
});
