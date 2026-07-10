/**
 * Lyric container + its leaves (text, elision, extend).
 * @see musicxml.xsd "lyric", "text-element-data", "elision", "extend"
 *
 * The XSD lyric content model allows repeated (elision, syllabic, text) groups;
 * the TS model keeps single optional fields, so serialization emits a single
 * syllabic/text/elision in XSD-declaration order. Editorial footnote/level are
 * carried on the type but not serialized (not class-migrated yet).
 */

import { attr, childrenOf, el, elementText, textOf, type XmlElement } from '../../xml/xml-element';
import { AboveBelow, StartStopContinue, Syllabic } from '../enums';
import type { Editorial } from '../common';
import type { YesNo } from '../enums';
import type { Color, Font, SmuflGlyphName, Tenths, TimeOnly } from '../common';
import { asEnum, ColorAttrs, FontAttrs, PrintStyleAttrs } from '../common/attribute-groups';
import type {
  Elision as ElisionShape,
  Extend as ExtendShape,
  Lyric as LyricShape,
  TextElementData as TextElementDataShape,
} from '../note';

type PrintStyleFields = {
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
};

/**
 * The text-element-data type represents a syllable or portion of a syllable for lyric text underlay. A hyphen in the string content should only be used for an actual hyphenated word. Language names for text elements come from ISO 639, with optional country subcodes from ISO 3166.
 * @see musicxml.xsd "text-element-data".
 */
export class TextElementData implements TextElementDataShape, PrintStyleFields {
  value = '';
  lang?: string;
  dir?: 'ltr' | 'rtl' | 'lro' | 'rlo';
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  constructor(init?: Partial<TextElementData>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): TextElementData {
    return new TextElementData({
      value: elementText(node) ?? '',
      lang: attr(node, 'xml:lang'),
      dir: attr(node, 'dir') as TextElementData['dir'],
      ...PrintStyleAttrs.read(node),
    });
  }
  static toXmlElement(t: TextElementData): XmlElement {
    return el('text', t.value ? [{ '#text': t.value }] : [], { 'xml:lang': t.lang, dir: t.dir, ...PrintStyleAttrs.attrs(t) });
  }
}

/**
 * The elision type represents an elision between lyric syllables. The text content specifies the symbol used to display the elision. Common values are a no-break space (Unicode 00A0), an underscore (Unicode 005F), or an undertie (Unicode 203F). If the text content is empty, the smufl attribute is used to specify the symbol to use. Its value is a SMuFL canonical glyph name that starts with lyrics. The SMuFL attribute is ignored if the elision glyph is already specified by the text content. If neither text content nor a smufl attribute are present, the elision glyph is application-specific.
 * @see musicxml.xsd "elision".
 */
export class Elision implements ElisionShape {
  value = '';
  smufl?: SmuflGlyphName;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  constructor(init?: Partial<Elision>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Elision {
    return new Elision({ value: elementText(node) ?? '', smufl: attr(node, 'smufl'), ...FontAttrs.read(node), ...ColorAttrs.read(node) });
  }
  static toXmlElement(e: Elision): XmlElement {
    return el('elision', e.value ? [{ '#text': e.value }] : [], { smufl: e.smufl, ...FontAttrs.attrs(e), ...ColorAttrs.attrs(e) });
  }
}

/**
 * The extend type represents lyric word extension / melisma lines as well as figured bass extensions. The optional type and position attributes are added in Version 3.0 to provide better formatting control.
 * @see musicxml.xsd "extend".
 */
export class Extend implements ExtendShape, PrintStyleFields {
  type?: StartStopContinue;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  constructor(init?: Partial<Extend>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Extend {
    return new Extend({ type: asEnum(StartStopContinue, attr(node, 'type')), ...PrintStyleAttrs.read(node) });
  }
  static toXmlElement(e: Extend): XmlElement {
    return el('extend', [], { type: e.type, ...PrintStyleAttrs.attrs(e) });
  }
}

/**
 * The lyric type represents text underlays for lyrics. Two text elements that are not separated by an elision element are part of the same syllable, but may have different text formatting. The MusicXML XSD is more strict than the DTD in enforcing this by disallowing a second syllabic element unless preceded by an elision element. The lyric number indicates multiple lines, though a name can be used as well. Common name examples are verse and chorus. Justification is center by default; placement is below by default. Vertical alignment is to the baseline of the text and horizontal alignment matches justification. The print-object attribute can override a note's print-lyric attribute in cases where only some lyrics on a note are printed, as when lyrics for later verses are printed in a block of text rather than with each note. The time-only attribute precisely specifies which lyrics are to be sung which time through a repeated section.
 * @see musicxml.xsd "lyric".
 */
export class Lyric implements LyricShape {
  number?: string;
  name?: string;
  justify?: 'left' | 'center' | 'right';
  syllabic?: Syllabic;
  text?: TextElementData;
  elision?: Elision;
  extend?: Extend;
  laughing?: boolean;
  humming?: boolean;
  endLine?: boolean;
  endParagraph?: boolean;
  footnote?: Editorial['footnote'];
  level?: Editorial['level'];
  timeOnly?: TimeOnly;
  printObject?: YesNo;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  placement?: AboveBelow;
  color?: Color;
  id?: string;
  constructor(init?: Partial<Lyric>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Lyric {
    const text = childrenOf(node, 'text')[0];
    const elision = childrenOf(node, 'elision')[0];
    const extend = childrenOf(node, 'extend')[0];
    const syl = textOf(node, 'syllabic');
    return new Lyric({
      number: attr(node, 'number'),
      name: attr(node, 'name'),
      justify: attr(node, 'justify') as Lyric['justify'],
      syllabic: asEnum(Syllabic, syl),
      text: text ? TextElementData.fromXmlElement(text) : undefined,
      elision: elision ? Elision.fromXmlElement(elision) : undefined,
      extend: extend ? Extend.fromXmlElement(extend) : undefined,
      laughing: childrenOf(node, 'laughing').length > 0 || undefined,
      humming: childrenOf(node, 'humming').length > 0 || undefined,
      endLine: childrenOf(node, 'end-line').length > 0 || undefined,
      endParagraph: childrenOf(node, 'end-paragraph').length > 0 || undefined,
      timeOnly: attr(node, 'time-only'),
      printObject: attr(node, 'print-object') as YesNo | undefined,
      placement: asEnum(AboveBelow, attr(node, 'placement')),
      color: attr(node, 'color'),
      id: attr(node, 'id'),
      defaultX: numAttr(node, 'default-x'),
      defaultY: numAttr(node, 'default-y'),
      relativeX: numAttr(node, 'relative-x'),
      relativeY: numAttr(node, 'relative-y'),
    });
  }

  static toXmlElement(l: Lyric): XmlElement {
    const c: XmlElement[] = [];
    if (l.syllabic !== undefined) c.push(el('syllabic', [{ '#text': l.syllabic }]));
    if (l.text) c.push(TextElementData.toXmlElement(l.text));
    if (l.elision) c.push(Elision.toXmlElement(l.elision));
    if (l.extend) c.push(Extend.toXmlElement(l.extend));
    if (l.laughing) c.push(el('laughing', []));
    if (l.humming) c.push(el('humming', []));
    if (l.endLine) c.push(el('end-line', []));
    if (l.endParagraph) c.push(el('end-paragraph', []));
    return el('lyric', c, {
      number: l.number,
      name: l.name,
      justify: l.justify,
      'default-x': l.defaultX,
      'default-y': l.defaultY,
      'relative-x': l.relativeX,
      'relative-y': l.relativeY,
      placement: l.placement,
      color: l.color,
      'print-object': l.printObject,
      'time-only': l.timeOnly,
      id: l.id,
    });
  }
}

function numAttr(node: XmlElement, name: string): number | undefined {
  const v = attr(node, name);
  return v === undefined ? undefined : Number(v);
}
