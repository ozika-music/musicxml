/**
 * Figured bass + its leaves (figure, style-text, figure extend).
 * @see musicxml.xsd "figured-bass", "figure"
 * Editorial footnote/level carried but not yet serialized.
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import { StartStopContinue } from '../enums';
import type { Divisions, Editorial } from '../common';
import type { AboveBelow, YesNo } from '../enums';
import { asEnum, PrintStyleAlignAttrs, PrintStyleAttrs } from '../common/attribute-groups';
import { PrintStyleAlignFieldBag, PrintStyleFieldBag } from '../common/field-bags';
import type {
  Figure as FigureShape,
  FigureExtend as FigureExtendShape,
  FiguredBass as FiguredBassShape,
  StyleText as StyleTextShape,
} from '../direction';

/**
 * The style-text type represents a text element with a print-style attribute group.
 * @see musicxml.xsd "style-text".
 */
export class StyleText extends PrintStyleFieldBag implements StyleTextShape {
  value = '';
  constructor(init?: Partial<StyleText>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): StyleText {
    return new StyleText({ value: elementText(n) ?? '', ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: StyleText, tag: string): XmlElement {
    return el(tag, o.value ? [{ '#text': o.value }] : [], { ...PrintStyleAttrs.attrs(o) });
  }
}

/**
 * The extend type represents lyric word extension / melisma lines as well as figured bass extensions. The optional type and position attributes are added in Version 3.0 to provide better formatting control.
 * @see musicxml.xsd "extend" (figure context).
 */
export class FigureExtend extends PrintStyleFieldBag implements FigureExtendShape {
  type?: StartStopContinue;
  constructor(init?: Partial<FigureExtend>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): FigureExtend {
    return new FigureExtend({ type: asEnum(StartStopContinue, attr(n, 'type')), ...PrintStyleAttrs.read(n) });
  }
  static toXmlElement(o: FigureExtend): XmlElement {
    return el('extend', [], { type: o.type, ...PrintStyleAttrs.attrs(o) });
  }
}

/**
 * The figure type represents a single figure within a figured-bass element.
 * @see musicxml.xsd "figure".
 */
export class Figure implements FigureShape {
  prefix?: StyleText;
  figureNumber?: StyleText;
  suffix?: StyleText;
  extend?: FigureExtend;
  footnote?: Editorial['footnote'];
  level?: Editorial['level'];
  id?: string;
  constructor(init?: Partial<Figure>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Figure {
    const get = (tag: string) => childrenOf(n, tag)[0];
    const ext = get('extend');
    return new Figure({
      prefix: get('prefix') ? StyleText.fromXmlElement(get('prefix')) : undefined,
      figureNumber: get('figure-number') ? StyleText.fromXmlElement(get('figure-number')) : undefined,
      suffix: get('suffix') ? StyleText.fromXmlElement(get('suffix')) : undefined,
      extend: ext ? FigureExtend.fromXmlElement(ext) : undefined,
      id: attr(n, 'id'),
    });
  }
  static toXmlElement(f: Figure): XmlElement {
    const c: XmlElement[] = [];
    if (f.prefix) c.push(StyleText.toXmlElement(f.prefix, 'prefix'));
    if (f.figureNumber) c.push(StyleText.toXmlElement(f.figureNumber, 'figure-number'));
    if (f.suffix) c.push(StyleText.toXmlElement(f.suffix, 'suffix'));
    if (f.extend) c.push(FigureExtend.toXmlElement(f.extend));
    return el('figure', c, { id: f.id });
  }
}

/**
 * The figured-bass element represents figured bass notation. Figured bass elements take their position from the first regular note (not a grace note or chord note) that follows in score order. The optional duration element is used to indicate changes of figures under a note. Figures are ordered from top to bottom. The value of parentheses is "no" if not present.
 * @see musicxml.xsd "figured-bass".
 */
export class FiguredBass extends PrintStyleAlignFieldBag implements FiguredBassShape {
  figures: Figure[] = [];
  duration?: Divisions;
  parentheses?: YesNo;
  printObject?: YesNo;
  placement?: AboveBelow;
  footnote?: Editorial['footnote'];
  level?: Editorial['level'];
  id?: string;
  constructor(init?: Partial<FiguredBass>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): FiguredBass {
    const dur = textOf(n, 'duration');
    return new FiguredBass({
      figures: childrenOf(n, 'figure').map(Figure.fromXmlElement),
      duration: dur === undefined ? undefined : Number(dur),
      parentheses: attr(n, 'parentheses') as YesNo | undefined,
      printObject: attr(n, 'print-object') as YesNo | undefined,
      ...PrintStyleAlignAttrs.read(n),
      id: attr(n, 'id'),
    });
  }
  static toXmlElement(fb: FiguredBass): XmlElement {
    const c: XmlElement[] = fb.figures.map(Figure.toXmlElement);
    if (fb.duration !== undefined) c.push(textEl('duration', fb.duration));
    return el('figured-bass', c, {
      parentheses: fb.parentheses,
      'print-object': fb.printObject,
      ...PrintStyleAlignAttrs.attrs(fb),
      id: fb.id,
    });
  }
}
