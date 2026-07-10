/**
 * part-link / instrument-link — links a score-part to external parts documents.
 * @see musicxml.xsd complexType "part-link" — instrument-link*, group-link*;
 *   link-attributes (xlink:href, …)
 * @see musicxml.xsd complexType "instrument-link" — link-attributes (xlink:href)
 */

import { attr, childrenOf, el, elementText, textEl, type XmlElement } from '../../xml/xml-element';

/** Multiple part-link elements can link a condensed part within a score file to multiple MusicXML parts files. For example, a "Clarinet 1 and 2" part in a score file could link to separate "Clarinet 1" and "Clarinet 2" part files. The instrument-link type distinguish which of the score-instruments within a score-part are in which part file. The instrument-link id attribute refers to a score-instrument id attribute. */
export class InstrumentLink {
  /** xlink:href of the linked instrument. */
  id = '';

  constructor(init?: Partial<InstrumentLink>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): InstrumentLink {
    return new InstrumentLink({ id: attr(node, 'xlink:href') ?? '' });
  }

  static toXmlElement(il: InstrumentLink): XmlElement {
    return el('instrument-link', [], { 'xlink:href': il.id });
  }
}

/** The part-link type allows MusicXML data for both score and parts to be contained within a single compressed MusicXML file. It links a score-part from a score document to MusicXML documents that contain parts data. In the case of a single compressed MusicXML file, the link href values are paths that are relative to the root folder of the zip file. */
export class PartLink {
  /** xlink:href of the linked document. */
  href = '';
  instrumentLinks?: InstrumentLink[];
  groupLinks?: string[];

  constructor(init?: Partial<PartLink>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): PartLink {
    const instrumentLinks = childrenOf(node, 'instrument-link').map((l) => InstrumentLink.fromXmlElement(l));
    const groupLinks = childrenOf(node, 'group-link').map((g) => elementText(g) ?? '');
    return new PartLink({
      href: attr(node, 'xlink:href') ?? '',
      instrumentLinks: instrumentLinks.length ? instrumentLinks : undefined,
      groupLinks: groupLinks.length ? groupLinks : undefined,
    });
  }

  static toXmlElement(link: PartLink): XmlElement {
    const c: XmlElement[] = [];
    for (const il of link.instrumentLinks ?? []) c.push(InstrumentLink.toXmlElement(il));
    for (const gl of link.groupLinks ?? []) c.push(textEl('group-link', gl));
    return el('part-link', c, { 'xlink:href': link.href });
  }
}
