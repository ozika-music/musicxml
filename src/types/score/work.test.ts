import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Work } from './work';

/** @see musicxml.xsd "work" — work-number?, work-title?, opus? (@xlink:href). */
describe('Work', () => {
  it('round-trips work-number, work-title and opus', () => {
    const xml = '<work><work-number>Op. 1</work-number><work-title>Sonata</work-title><opus xlink:href="op1.xml"/></work>';
    const work = Work.fromXmlElement(parseElements(xml)[0]);
    expect(work.workNumber).toBe('Op. 1');
    expect(work.workTitle).toBe('Sonata');
    expect(work.opus?.href).toBe('op1.xml');

    const round = Work.fromXmlElement(parseElements(buildElements([Work.toXmlElement(work)]))[0]);
    expect(round).toMatchObject({ workNumber: 'Op. 1', workTitle: 'Sonata' });
    expect(round.opus?.href).toBe('op1.xml');
  });
});
