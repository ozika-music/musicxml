import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Identification } from './identification';

/**
 * @see musicxml.xsd "identification" — creator*, rights*, encoding?, source?,
 * relation*, miscellaneous?. encoding: encoding-date, software*, supports*.
 */
describe('Identification', () => {
  const XML =
    '<identification>' +
    '<creator type="composer">Bach</creator>' +
    '<creator type="lyricist">Anon</creator>' +
    '<rights>Public Domain</rights>' +
    '<encoding>' +
    '<encoding-date>2024-01-01</encoding-date>' +
    '<software>Finale</software>' +
    '<supports element="accidental" type="yes"/>' +
    '</encoding>' +
    '<source>From a scan</source>' +
    '<miscellaneous><miscellaneous-field name="difficulty">hard</miscellaneous-field></miscellaneous>' +
    '</identification>';

  const roundTrip = (id: Identification) =>
    Identification.fromXmlElement(parseElements(buildElements([Identification.toXmlElement(id)]))[0]);

  it('parses every spec item', () => {
    const id = Identification.fromXmlElement(parseElements(XML)[0]);
    expect(id).toBeInstanceOf(Identification);
    expect(id.creators?.map((c) => `${c.type}:${c.value}`)).toEqual(['composer:Bach', 'lyricist:Anon']);
    expect(id.rights?.[0].value).toBe('Public Domain');
    expect(id.encoding?.encodingDate).toBe('2024-01-01');
    expect(id.encoding?.software).toEqual(['Finale']);
    expect(id.encoding?.supports?.[0]).toMatchObject({ element: 'accidental', type: 'yes' });
    expect(id.source).toBe('From a scan');
    expect(id.miscellaneous?.miscellaneousFields?.[0]).toMatchObject({ name: 'difficulty', value: 'hard' });
  });

  it('round-trips every spec item', () => {
    const id = roundTrip(Identification.fromXmlElement(parseElements(XML)[0]));
    expect(id.creators?.map((c) => `${c.type}:${c.value}`)).toEqual(['composer:Bach', 'lyricist:Anon']);
    expect(id.encoding?.software).toEqual(['Finale']);
    expect(id.encoding?.supports?.[0].element).toBe('accidental');
    expect(id.source).toBe('From a scan');
    expect(id.miscellaneous?.miscellaneousFields?.[0].name).toBe('difficulty');
  });
});
