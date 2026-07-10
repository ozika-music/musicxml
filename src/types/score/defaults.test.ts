import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Defaults } from './defaults';

/**
 * @see musicxml.xsd "defaults" — scaling, concert-score, page-layout,
 * system-layout, staff-layout*, music-font, word-font, lyric-font*, lyric-language*.
 */
describe('Defaults', () => {
  const XML =
    '<defaults>' +
    '<scaling><millimeters>7</millimeters><tenths>40</tenths></scaling>' +
    '<page-layout><page-height>1700</page-height><page-width>1200</page-width>' +
    '<page-margins type="both"><left-margin>85</left-margin><right-margin>85</right-margin>' +
    '<top-margin>85</top-margin><bottom-margin>85</bottom-margin></page-margins></page-layout>' +
    '<system-layout><system-margins><left-margin>0</left-margin><right-margin>0</right-margin></system-margins>' +
    '<system-distance>120</system-distance></system-layout>' +
    '<music-font font-family="Maestro" font-size="20"/>' +
    '<word-font font-family="Times" font-size="10"/>' +
    '<lyric-language number="1" xml:lang="en"/>' +
    '</defaults>';

  it('round-trips scaling, layouts, fonts and lyric-language', () => {
    const d = Defaults.fromXmlElement(parseElements(XML)[0]);
    expect(d.scaling).toMatchObject({ millimeters: 7, tenths: 40 });
    expect(d.pageLayout?.pageHeight).toBe(1700);
    expect(d.pageLayout?.pageMargins?.[0]).toMatchObject({ type: 'both', leftMargin: 85, bottomMargin: 85 });
    expect(d.systemLayout?.systemDistance).toBe(120);
    expect(d.musicFont?.fontFamily).toBe('Maestro');
    expect(d.wordFont?.fontSize).toBe(10);
    expect(d.lyricLanguages?.[0]).toMatchObject({ number: '1', lang: 'en' });

    const round = Defaults.fromXmlElement(parseElements(buildElements([Defaults.toXmlElement(d)]))[0]);
    expect(round.scaling).toMatchObject({ millimeters: 7, tenths: 40 });
    expect(round.pageLayout?.pageMargins?.[0].type).toBe('both');
    expect(round.systemLayout?.systemDistance).toBe(120);
    expect(round.musicFont?.fontFamily).toBe('Maestro');
    expect(round.lyricLanguages?.[0].lang).toBe('en');
  });
});
