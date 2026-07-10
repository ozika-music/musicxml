import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { ClefSign, Mode } from '../enums';
import { Attributes } from './attributes';

/**
 * @see musicxml.xsd "attributes" — divisions?, key*, time*, staves?, part-symbol?,
 * instruments?, clef*, staff-details*, transpose*. Composes the leaf classes.
 */
describe('Attributes', () => {
  const XML =
    '<attributes><divisions>480</divisions>' +
    '<key><fifths>2</fifths><mode>major</mode></key>' +
    '<time><beats>4</beats><beat-type>4</beat-type></time>' +
    '<staves>2</staves>' +
    '<clef number="1"><sign>G</sign><line>2</line></clef>' +
    '<clef number="2"><sign>F</sign><line>4</line></clef>' +
    '<transpose><chromatic>-2</chromatic></transpose></attributes>';

  it('parses + round-trips the whole attributes element in order', () => {
    const a = Attributes.fromXmlElement(parseElements(XML)[0]);
    expect(a).toBeInstanceOf(Attributes);
    expect(a.divisions).toBe(480);
    expect(a.keys?.[0]).toMatchObject({ fifths: 2, mode: Mode.Major });
    expect(a.times?.[0]).toMatchObject({ beats: ['4'], beatTypes: ['4'] });
    expect(a.staves).toBe(2);
    expect(a.clefs?.map((c) => c.sign)).toEqual([ClefSign.G, ClefSign.F]);
    expect(a.transposes?.[0].chromatic).toBe(-2);

    const out = buildElements([Attributes.toXmlElement(a)]);
    expect(out.indexOf('<divisions>')).toBeLessThan(out.indexOf('<key>'));
    expect(out.indexOf('<staves>')).toBeLessThan(out.indexOf('<clef'));
    const round = Attributes.fromXmlElement(parseElements(out)[0]);
    expect(round.divisions).toBe(480);
    expect(round.clefs?.map((c) => c.sign)).toEqual([ClefSign.G, ClefSign.F]);
    expect(round.transposes?.[0].chromatic).toBe(-2);
  });
});
