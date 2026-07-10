import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { FontWeight, LeftCenterRight } from '../enums';
import { Credit } from './credit';

/** @see musicxml.xsd "credit" — @page, @id, credit-type*, credit-words* (text-formatting). */
describe('Credit', () => {
  it('round-trips page, credit-type and credit-words with full text-formatting', () => {
    const xml =
      '<credit page="1" id="c1">' +
      '<credit-type>title</credit-type>' +
      '<credit-words default-x="616" default-y="1500" justify="center" valign="top" font-weight="bold" font-size="24">Sonata</credit-words>' +
      '</credit>';
    const credit = Credit.fromXmlElement(parseElements(xml)[0]);
    expect(credit.page).toBe(1);
    expect(credit.id).toBe('c1');
    expect(credit.creditTypes).toEqual(['title']);
    const cw = credit.creditWords![0];
    expect(cw.value).toBe('Sonata');
    expect(cw.defaultX).toBe(616);
    expect(cw.justify).toBe(LeftCenterRight.Center);
    expect(cw.fontWeight).toBe(FontWeight.Bold);
    expect(cw.fontSize).toBe(24);

    const round = Credit.fromXmlElement(parseElements(buildElements([Credit.toXmlElement(credit)]))[0]);
    expect(round.page).toBe(1);
    expect(round.creditWords![0]).toMatchObject({ value: 'Sonata', defaultX: 616, fontWeight: FontWeight.Bold, fontSize: 24 });
  });
});
