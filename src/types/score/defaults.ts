/**
 * defaults — score-wide layout / scaling / font defaults.
 *
 * @see musicxml.xsd complexType "defaults"
 *   scaling?, concert-score?, page-layout?, system-layout?, staff-layout*,
 *   appearance?, music-font?, word-font?, lyric-font*, lyric-language*
 *
 * Covered: scaling, concert-score, page-layout, system-layout, staff-layout*,
 * music-font, word-font, lyric-font*, lyric-language*. `appearance` and
 * `system-dividers` are retained on the model but not yet serialized (deep
 * layout sub-types); the legacy serializer also dropped them, so no regression.
 */

import { attr, childrenOf, el, textOf, textEl, type XmlElement } from '../../xml/xml-element';
import { FontAttrs } from '../common/attribute-groups';
import type { Font } from '../common';
import { PageLayout, StaffLayout, SystemLayout } from './layout';
import type { Appearance, DefaultsShape, LyricFont, LyricLanguage, Scaling } from '../score';

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}
function fontNode(tag: string, f: Font): XmlElement {
  return el(tag, [], FontAttrs.attrs(f));
}

/** The defaults type specifies score-wide defaults for scaling; whether or not the file is a concert score; layout; and default values for the music font, word font, lyric font, and lyric language. Except for the concert-score element, if any defaults are missing, the choice of what to use is determined by the application. */
export class Defaults implements DefaultsShape {
  scaling?: Scaling;
  concertScore?: boolean;
  pageLayout?: PageLayout;
  systemLayout?: SystemLayout;
  staffLayout?: StaffLayout[];
  appearance?: Appearance;
  musicFont?: Font;
  wordFont?: Font;
  lyricFonts?: LyricFont[];
  lyricLanguages?: LyricLanguage[];

  constructor(init?: Partial<Defaults>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Defaults {
    const scalingEl = childrenOf(node, 'scaling')[0];
    const pageLayout = childrenOf(node, 'page-layout')[0];
    const systemLayout = childrenOf(node, 'system-layout')[0];
    const musicFont = childrenOf(node, 'music-font')[0];
    const wordFont = childrenOf(node, 'word-font')[0];
    const staffLayout = childrenOf(node, 'staff-layout').map(StaffLayout.fromXmlElement);
    const lyricFonts = childrenOf(node, 'lyric-font').map(
      (lf): LyricFont => ({ ...FontAttrs.read(lf), number: attr(lf, 'number'), name: attr(lf, 'name') }),
    );
    const lyricLanguages = childrenOf(node, 'lyric-language').map(
      (ll): LyricLanguage => ({ number: attr(ll, 'number'), name: attr(ll, 'name'), lang: attr(ll, 'xml:lang') ?? '' }),
    );
    return new Defaults({
      scaling: scalingEl ? { millimeters: numText(scalingEl, 'millimeters') ?? 0, tenths: numText(scalingEl, 'tenths') ?? 0 } : undefined,
      concertScore: childrenOf(node, 'concert-score').length ? true : undefined,
      pageLayout: pageLayout ? PageLayout.fromXmlElement(pageLayout) : undefined,
      systemLayout: systemLayout ? SystemLayout.fromXmlElement(systemLayout) : undefined,
      staffLayout: staffLayout.length ? staffLayout : undefined,
      musicFont: musicFont ? FontAttrs.read(musicFont) : undefined,
      wordFont: wordFont ? FontAttrs.read(wordFont) : undefined,
      lyricFonts: lyricFonts.length ? lyricFonts : undefined,
      lyricLanguages: lyricLanguages.length ? lyricLanguages : undefined,
    });
  }

  static toXmlElement(d: Defaults): XmlElement {
    const c: XmlElement[] = [];
    if (d.scaling) c.push(el('scaling', [textEl('millimeters', d.scaling.millimeters), textEl('tenths', d.scaling.tenths)]));
    if (d.concertScore) c.push(el('concert-score', []));
    if (d.pageLayout) c.push(PageLayout.toXmlElement(d.pageLayout));
    if (d.systemLayout) c.push(SystemLayout.toXmlElement(d.systemLayout));
    for (const sl of d.staffLayout ?? []) c.push(StaffLayout.toXmlElement(sl));
    if (d.musicFont) c.push(fontNode('music-font', d.musicFont));
    if (d.wordFont) c.push(fontNode('word-font', d.wordFont));
    for (const lf of d.lyricFonts ?? []) c.push(el('lyric-font', [], { ...FontAttrs.attrs(lf), number: lf.number, name: lf.name }));
    for (const ll of d.lyricLanguages ?? []) c.push(el('lyric-language', [], { number: ll.number, name: ll.name, 'xml:lang': ll.lang }));
    return el('defaults', c);
  }
}
