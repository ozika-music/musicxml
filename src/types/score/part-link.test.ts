import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { PartLink } from './part-link';

/** @see musicxml.xsd "part-link" — instrument-link*, group-link*, @xlink:href. */
describe('PartLink', () => {
  it('round-trips href, instrument-links and group-links', () => {
    const xml =
      '<part-link xlink:href="vln.musicxml">' +
      '<instrument-link xlink:href="P1-I1"/><group-link>score</group-link><group-link>parts</group-link>' +
      '</part-link>';
    const link = PartLink.fromXmlElement(parseElements(xml)[0]);
    expect(link.href).toBe('vln.musicxml');
    expect(link.instrumentLinks?.[0].id).toBe('P1-I1');
    expect(link.groupLinks).toEqual(['score', 'parts']);

    const round = PartLink.fromXmlElement(parseElements(buildElements([PartLink.toXmlElement(link)]))[0]);
    expect(round.href).toBe('vln.musicxml');
    expect(round.instrumentLinks?.[0].id).toBe('P1-I1');
    expect(round.groupLinks).toEqual(['score', 'parts']);
  });
});
