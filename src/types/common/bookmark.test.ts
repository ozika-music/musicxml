import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Bookmark } from './bookmark';

/** @see musicxml.xsd "bookmark". */
describe('Bookmark', () => {
  it('round-trips id + name + element + position', () => {
    const b = Bookmark.fromXmlElement(parseElements('<bookmark id="b1" name="A" element="note" position="2"/>')[0]);
    expect(b).toMatchObject({ id: 'b1', name: 'A', element: 'note', position: 2 });
    const round = Bookmark.fromXmlElement(parseElements(buildElements([Bookmark.toXmlElement(b)]))[0]);
    expect(round).toMatchObject({ id: 'b1', name: 'A', position: 2 });
  });
});
