import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { ScoreInstrument } from './score-instrument';

/**
 * @see musicxml.xsd complexType "score-instrument" — spec items: @id,
 * instrument-name, instrument-abbreviation?, instrument-sound?, (solo | ensemble)?,
 * virtual-instrument? (virtual-library?, virtual-name?). One assertion per item.
 */
describe('ScoreInstrument', () => {
  const XML =
    '<score-instrument id="P1-I1">' +
    '<instrument-name>Flute</instrument-name>' +
    '<instrument-abbreviation>Fl.</instrument-abbreviation>' +
    '<instrument-sound>wind.flutes.flute</instrument-sound>' +
    '<virtual-instrument><virtual-library>VSL</virtual-library><virtual-name>Flute 1</virtual-name></virtual-instrument>' +
    '</score-instrument>';

  const roundTrip = (si: ScoreInstrument) =>
    ScoreInstrument.fromXmlElement(parseElements(buildElements([ScoreInstrument.toXmlElement(si)]))[0]);

  it('parses every spec item', () => {
    const si = ScoreInstrument.fromXmlElement(parseElements(XML)[0]);
    expect(si).toBeInstanceOf(ScoreInstrument);
    expect(si.id).toBe('P1-I1');
    expect(si.instrumentName).toBe('Flute');
    expect(si.instrumentAbbreviation).toBe('Fl.');
    expect(si.instrumentSound).toBe('wind.flutes.flute');
    expect(si.virtualInstrument?.virtualLibrary).toBe('VSL');
    expect(si.virtualInstrument?.virtualName).toBe('Flute 1');
  });

  it('round-trips every spec item', () => {
    const si = roundTrip(ScoreInstrument.fromXmlElement(parseElements(XML)[0]));
    expect(si.id).toBe('P1-I1');
    expect(si.instrumentName).toBe('Flute');
    expect(si.instrumentAbbreviation).toBe('Fl.');
    expect(si.instrumentSound).toBe('wind.flutes.flute');
    expect(si.virtualInstrument?.virtualName).toBe('Flute 1');
  });

  it('handles solo (empty) and ensemble (count)', () => {
    const solo = ScoreInstrument.fromXmlElement(
      parseElements('<score-instrument id="A"><instrument-name>x</instrument-name><solo/></score-instrument>')[0],
    );
    expect(solo.solo).toBe(true);
    expect(buildElements([ScoreInstrument.toXmlElement(solo)])).toContain('<solo');

    const ensemble = ScoreInstrument.fromXmlElement(
      parseElements('<score-instrument id="B"><instrument-name>x</instrument-name><ensemble>2</ensemble></score-instrument>')[0],
    );
    expect(ensemble.ensemble).toBe(2);
    expect(buildElements([ScoreInstrument.toXmlElement(ensemble)])).toContain('<ensemble>2</ensemble>');
  });
});
