/**
 * Bookmark element.
 * @see musicxml.xsd "bookmark"
 */

import { attr, el, type XmlElement } from '../../xml/xml-element';
import type { Bookmark as BookmarkShape } from '../common';

/**
 * The bookmark type serves as a well-defined target for an incoming simple XLink.
 * @see musicxml.xsd "bookmark".
 */
export class Bookmark implements BookmarkShape {
  id = '';
  name?: string;
  element?: string;
  position?: number;
  constructor(init?: Partial<Bookmark>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Bookmark {
    const pos = attr(node, 'position');
    return new Bookmark({
      id: attr(node, 'id') ?? '',
      name: attr(node, 'name'),
      element: attr(node, 'element'),
      position: pos === undefined ? undefined : Number(pos),
    });
  }
  static toXmlElement(b: Bookmark): XmlElement {
    return el('bookmark', [], { id: b.id, name: b.name, element: b.element, position: b.position });
  }
}
