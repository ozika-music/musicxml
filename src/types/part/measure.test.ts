import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Measure, Part } from './measure';

/** @see musicxml.xsd "measure"/"part" (partwise). */
describe('Measure / Part', () => {
  it('Measure round-trips mixed content in order', () => {
    const xml =
      '<measure number="1" width="200">' +
      '<print new-system="yes"/>' +
      '<attributes><divisions>1</divisions></attributes>' +
      '<note><pitch><step>C</step><octave>4</octave></pitch><duration>4</duration></note>' +
      '<direction placement="below"><direction-type><words>cresc.</words></direction-type></direction>' +
      '<barline location="right"><bar-style>light-heavy</bar-style></barline>' +
      '</measure>';
    const m = Measure.fromXmlElement(parseElements(xml)[0]);
    expect(m.number).toBe('1');
    expect(m.width).toBe(200);
    expect(m.content.map((c) => c.type)).toEqual(['print', 'attributes', 'note', 'direction', 'barline']);

    const round = Measure.fromXmlElement(parseElements(buildElements([Measure.toXmlElement(m)]))[0]);
    expect(round.content.map((c) => c.type)).toEqual(['print', 'attributes', 'note', 'direction', 'barline']);
    expect(round.width).toBe(200);
  });

  it('Part round-trips measures', () => {
    const xml = '<part id="P1"><measure number="1"/><measure number="2"/></part>';
    const p = Part.fromXmlElement(parseElements(xml)[0]);
    expect(p.id).toBe('P1');
    expect(p.measures.map((m) => m.number)).toEqual(['1', '2']);
    const round = Part.fromXmlElement(parseElements(buildElements([Part.toXmlElement(p)]))[0]);
    expect(round.measures.map((m) => m.number)).toEqual(['1', '2']);
  });
});
