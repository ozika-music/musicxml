import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { StartStopContinue, Syllabic } from '../enums';
import { Lyric } from './lyric';

/** @see musicxml.xsd "lyric". */
describe('Lyric', () => {
  it('round-trips syllabic + text + extend + attrs', () => {
    const xml =
      '<lyric number="1" placement="below" default-y="-80">' +
      '<syllabic>begin</syllabic>' +
      '<text xml:lang="en">la</text>' +
      '<extend type="start"/>' +
      '</lyric>';
    const l = Lyric.fromXmlElement(parseElements(xml)[0]);
    expect(l).toMatchObject({ number: '1', placement: 'below', defaultY: -80, syllabic: Syllabic.Begin });
    expect(l.text).toMatchObject({ value: 'la', lang: 'en' });
    expect(l.extend).toMatchObject({ type: StartStopContinue.Start });

    const round = Lyric.fromXmlElement(parseElements(buildElements([Lyric.toXmlElement(l)]))[0]);
    expect(round).toMatchObject({ number: '1', placement: 'below', syllabic: Syllabic.Begin });
    expect(round.text).toMatchObject({ value: 'la', lang: 'en' });
    expect(round.extend?.type).toBe(StartStopContinue.Start);
  });

  it('round-trips elision + end-line + humming flags', () => {
    const xml = '<lyric><elision smufl="x">‿</elision><syllabic>middle</syllabic><text>do</text><end-line/></lyric>';
    const l = Lyric.fromXmlElement(parseElements(xml)[0]);
    expect(l.elision).toMatchObject({ value: '‿', smufl: 'x' });
    expect(l.endLine).toBe(true);
    const round = Lyric.fromXmlElement(parseElements(buildElements([Lyric.toXmlElement(l)]))[0]);
    expect(round.elision?.smufl).toBe('x');
    expect(round.endLine).toBe(true);
  });
});
