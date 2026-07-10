import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Metronome } from './metronome';

/** @see musicxml.xsd "metronome" — standard and complex (metronome-note) forms. */
describe('Metronome', () => {
  it('round-trips the standard beat-unit / per-minute form', () => {
    const m = Metronome.fromXmlElement(
      parseElements('<metronome parentheses="yes"><beat-unit>quarter</beat-unit><beat-unit-dot/><per-minute>120</per-minute></metronome>')[0],
    );
    expect(m).toMatchObject({ parentheses: 'yes', beatUnit: 'quarter', beatUnitDots: 1 });
    expect(m.perMinute?.value).toBe('120');
    const round = Metronome.fromXmlElement(parseElements(buildElements([Metronome.toXmlElement(m)]))[0]);
    expect(round).toMatchObject({ beatUnit: 'quarter', beatUnitDots: 1 });
    expect(round.perMinute?.value).toBe('120');
  });

  it('round-trips a beat-unit-tied in the standard form', () => {
    const xml =
      '<metronome><beat-unit>quarter</beat-unit>' +
      '<beat-unit-tied><beat-unit>eighth</beat-unit><beat-unit-dot/></beat-unit-tied>' +
      '<per-minute>90</per-minute></metronome>';
    const m = Metronome.fromXmlElement(parseElements(xml)[0]);
    expect(m.beatUnit).toBe('quarter');
    expect(m.beatUnitTied?.[0]).toMatchObject({ beatUnit: 'eighth', beatUnitDots: 1 });
    const round = Metronome.fromXmlElement(parseElements(buildElements([Metronome.toXmlElement(m)]))[0]);
    expect(round.beatUnitTied?.[0]).toMatchObject({ beatUnit: 'eighth', beatUnitDots: 1 });
    expect(round.perMinute?.value).toBe('90');
  });

  it('round-trips the complex metronome-note form with beam + tuplet + relation', () => {
    const xml =
      '<metronome>' +
      '<metronome-note><metronome-type>eighth</metronome-type><metronome-dot/>' +
      '<metronome-beam>begin</metronome-beam>' +
      '<metronome-tuplet type="start" bracket="yes"><actual-notes>3</actual-notes><normal-notes>2</normal-notes></metronome-tuplet>' +
      '</metronome-note>' +
      '<metronome-relation>equals</metronome-relation>' +
      '<metronome-note><metronome-type>quarter</metronome-type></metronome-note>' +
      '</metronome>';
    const m = Metronome.fromXmlElement(parseElements(xml)[0]);
    expect(m.metronomeNotes?.length).toBe(2);
    expect(m.metronomeNotes?.[0]).toMatchObject({ metronomeType: 'eighth', metronomeDots: 1 });
    expect(m.metronomeNotes?.[0].metronomeBeams?.[0].value).toBe('begin');
    expect(m.metronomeNotes?.[0].metronomeTuplet).toMatchObject({ type: 'start', bracket: 'yes', actualNotes: 3, normalNotes: 2 });
    expect(m.metronomeRelation).toBe('equals');

    const round = Metronome.fromXmlElement(parseElements(buildElements([Metronome.toXmlElement(m)]))[0]);
    expect(round.metronomeNotes?.length).toBe(2);
    expect(round.metronomeNotes?.[0].metronomeTuplet?.actualNotes).toBe(3);
    expect(round.metronomeRelation).toBe('equals');
  });
});
