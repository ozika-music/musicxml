/**
 * identification (+ encoding / supports / miscellaneous).
 *
 * @see musicxml.xsd complexType "identification"
 *   creator*, rights*, encoding?, source?, relation*, miscellaneous?
 * @see musicxml.xsd complexType "encoding"
 *   (encoding-date | encoder | software | encoding-description | supports)*
 * @see musicxml.xsd complexType "supports" — @element, @type, @attribute?, @value?
 * @see musicxml.xsd complexType "miscellaneous" — miscellaneous-field*
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import type { YesNo } from '../enums';
import type { TypedText } from '../common';

function typedText(node: XmlElement): TypedText {
  return { value: elementText(node) ?? '', type: attr(node, 'type') };
}
function typedTextEl(tag: string, t: TypedText): XmlElement {
  return textEl(tag, t.value, { type: t.type });
}

/** The supports type indicates if a MusicXML encoding supports a particular MusicXML element. This is recommended for elements like beam, stem, and accidental, where the absence of an element is ambiguous if you do not know if the encoding supports that element. For Version 2.0, the supports element is expanded to allow programs to indicate support for particular attributes or particular values. This lets applications communicate, for example, that all system and/or page breaks are contained in the MusicXML file. */
export class Supports {
  element = '';
  type: YesNo = 'yes';
  attribute?: string;
  value?: string;

  constructor(init?: Partial<Supports>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Supports {
    return new Supports({
      element: attr(node, 'element') ?? '',
      type: (attr(node, 'type') as YesNo | undefined) ?? 'yes',
      attribute: attr(node, 'attribute'),
      value: attr(node, 'value'),
    });
  }

  static toXmlElement(s: Supports): XmlElement {
    return el('supports', [], { element: s.element, type: s.type, attribute: s.attribute, value: s.value });
  }
}

/** If a program has other metadata not yet supported in the MusicXML format, each type of metadata can go in a miscellaneous-field element. The required name attribute indicates the type of metadata the element content represents. */
export class MiscellaneousField {
  name = '';
  value = '';
  constructor(init?: Partial<MiscellaneousField>) {
    if (init) Object.assign(this, init);
  }
}

/** If a program has other metadata not yet supported in the MusicXML format, it can go in the miscellaneous element. The miscellaneous type puts each separate part of metadata into its own miscellaneous-field type. */
export class Miscellaneous {
  miscellaneousFields?: MiscellaneousField[];

  constructor(init?: Partial<Miscellaneous>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Miscellaneous {
    const fields = childrenOf(node, 'miscellaneous-field').map(
      (f) => new MiscellaneousField({ name: attr(f, 'name') ?? '', value: elementText(f) ?? '' }),
    );
    return new Miscellaneous({ miscellaneousFields: fields.length ? fields : undefined });
  }

  static toXmlElement(m: Miscellaneous): XmlElement {
    return el(
      'miscellaneous',
      (m.miscellaneousFields ?? []).map((f) => textEl('miscellaneous-field', f.value, { name: f.name })),
    );
  }
}

/** The encoding element contains information about who did the digital encoding, when, with what software, and in what aspects. Standard type values for the encoder element are music, words, and arrangement, but other types may be used. The type attribute is only needed when there are multiple encoder elements. */
export class Encoding {
  encodingDate?: string;
  encoders?: TypedText[];
  software?: string[];
  encodingDescription?: string[];
  supports?: Supports[];

  constructor(init?: Partial<Encoding>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Encoding {
    const encoders = childrenOf(node, 'encoder').map(typedText);
    const software = childrenOf(node, 'software').map((s) => elementText(s) ?? '');
    const encodingDescription = childrenOf(node, 'encoding-description').map((d) => elementText(d) ?? '');
    const supports = childrenOf(node, 'supports').map((s) => Supports.fromXmlElement(s));
    return new Encoding({
      encodingDate: textOf(node, 'encoding-date'),
      encoders: encoders.length ? encoders : undefined,
      software: software.length ? software : undefined,
      encodingDescription: encodingDescription.length ? encodingDescription : undefined,
      supports: supports.length ? supports : undefined,
    });
  }

  static toXmlElement(e: Encoding): XmlElement {
    const c: XmlElement[] = [];
    if (e.encodingDate !== undefined) c.push(textEl('encoding-date', e.encodingDate));
    for (const enc of e.encoders ?? []) c.push(typedTextEl('encoder', enc));
    for (const sw of e.software ?? []) c.push(textEl('software', sw));
    for (const d of e.encodingDescription ?? []) c.push(textEl('encoding-description', d));
    for (const s of e.supports ?? []) c.push(Supports.toXmlElement(s));
    return el('encoding', c);
  }
}

/** Identification contains basic metadata about the score. It includes information that may apply at a score-wide, movement-wide, or part-wide level. The creator, rights, source, and relation elements are based on Dublin Core. */
export class Identification {
  creators?: TypedText[];
  rights?: TypedText[];
  encoding?: Encoding;
  source?: string;
  relations?: TypedText[];
  miscellaneous?: Miscellaneous;

  constructor(init?: Partial<Identification>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Identification {
    const creators = childrenOf(node, 'creator').map(typedText);
    const rights = childrenOf(node, 'rights').map(typedText);
    const relations = childrenOf(node, 'relation').map(typedText);
    const encoding = childrenOf(node, 'encoding')[0];
    const miscellaneous = childrenOf(node, 'miscellaneous')[0];
    return new Identification({
      creators: creators.length ? creators : undefined,
      rights: rights.length ? rights : undefined,
      encoding: encoding ? Encoding.fromXmlElement(encoding) : undefined,
      source: textOf(node, 'source'),
      relations: relations.length ? relations : undefined,
      miscellaneous: miscellaneous ? Miscellaneous.fromXmlElement(miscellaneous) : undefined,
    });
  }

  static toXmlElement(id: Identification): XmlElement {
    const c: XmlElement[] = [];
    for (const creator of id.creators ?? []) c.push(typedTextEl('creator', creator));
    for (const right of id.rights ?? []) c.push(typedTextEl('rights', right));
    if (id.encoding) c.push(Encoding.toXmlElement(id.encoding));
    if (id.source !== undefined) c.push(textEl('source', id.source));
    for (const relation of id.relations ?? []) c.push(typedTextEl('relation', relation));
    if (id.miscellaneous) c.push(Miscellaneous.toXmlElement(id.miscellaneous));
    return el('identification', c);
  }
}
