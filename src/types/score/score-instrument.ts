/**
 * score-instrument / virtual-instrument.
 *
 * @see musicxml.xsd complexType "score-instrument"
 *   - instrument-name        (xs:string)
 *   - instrument-abbreviation? (xs:string)
 *   - virtual-instrument-data: instrument-sound?, (solo | ensemble)?, virtual-instrument?
 *   - @id (required)
 * @see musicxml.xsd complexType "virtual-instrument"
 *   - virtual-library?, virtual-name?
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';

/** The virtual-instrument element defines a specific virtual instrument used for an instrument sound. */
export class VirtualInstrument {
  virtualLibrary?: string;
  virtualName?: string;

  constructor(init?: Partial<VirtualInstrument>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): VirtualInstrument {
    return new VirtualInstrument({
      virtualLibrary: textOf(node, 'virtual-library'),
      virtualName: textOf(node, 'virtual-name'),
    });
  }

  /** Static so serialization tolerates plain-object data, not just instances. */
  static toXmlElement(vi: VirtualInstrument): XmlElement {
    const c: XmlElement[] = [];
    if (vi.virtualLibrary !== undefined) c.push(textEl('virtual-library', vi.virtualLibrary));
    if (vi.virtualName !== undefined) c.push(textEl('virtual-name', vi.virtualName));
    return el('virtual-instrument', c);
  }
}

/** The score-instrument type represents a single instrument within a score-part. As with the score-part type, each score-instrument has a required ID attribute, a name, and an optional abbreviation. A score-instrument type is also required if the score specifies MIDI 1.0 channels, banks, or programs. An initial midi-instrument assignment can also be made here. MusicXML software should be able to automatically assign reasonable channels and instruments without these elements in simple cases, such as where part names match General MIDI instrument names. The score-instrument element can also distinguish multiple instruments of the same type that are on the same part, such as Clarinet 1 and Clarinet 2 instruments within a Clarinets 1 and 2 part. */
export class ScoreInstrument {
  id = '';
  instrumentName = '';
  instrumentAbbreviation?: string;
  instrumentSound?: string;
  solo?: boolean;
  ensemble?: boolean | number;
  virtualInstrument?: VirtualInstrument;

  constructor(init?: Partial<ScoreInstrument>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): ScoreInstrument {
    const ensembleEl = childrenOf(node, 'ensemble')[0];
    const ensembleText = ensembleEl && elementText(ensembleEl);
    const virtual = childrenOf(node, 'virtual-instrument')[0];
    return new ScoreInstrument({
      id: attr(node, 'id') ?? '',
      instrumentName: textOf(node, 'instrument-name') ?? '',
      instrumentAbbreviation: textOf(node, 'instrument-abbreviation'),
      instrumentSound: textOf(node, 'instrument-sound'),
      solo: childrenOf(node, 'solo').length ? true : undefined,
      ensemble: ensembleEl ? (ensembleText ? Number(ensembleText) : true) : undefined,
      virtualInstrument: virtual ? VirtualInstrument.fromXmlElement(virtual) : undefined,
    });
  }

  /** Static so serialization tolerates plain-object data, not just instances. */
  static toXmlElement(si: ScoreInstrument): XmlElement {
    const c: XmlElement[] = [textEl('instrument-name', si.instrumentName)];
    if (si.instrumentAbbreviation !== undefined) c.push(textEl('instrument-abbreviation', si.instrumentAbbreviation));
    if (si.instrumentSound !== undefined) c.push(textEl('instrument-sound', si.instrumentSound));
    if (si.solo) c.push(el('solo', []));
    else if (si.ensemble !== undefined && si.ensemble !== false) {
      c.push(typeof si.ensemble === 'number' ? textEl('ensemble', si.ensemble) : el('ensemble', []));
    }
    if (si.virtualInstrument) c.push(VirtualInstrument.toXmlElement(si.virtualInstrument));
    return el('score-instrument', c, { id: si.id });
  }
}
