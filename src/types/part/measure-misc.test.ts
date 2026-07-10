import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Grouping, Link, Listening } from './measure-misc';

/** @see musicxml.xsd "grouping"/"link"/"listening". */
describe('measure misc', () => {
  it('Grouping round-trips type + features', () => {
    const g = Grouping.fromXmlElement(parseElements('<grouping type="start" number="1"><feature type="label">A</feature></grouping>')[0]);
    expect(g).toMatchObject({ type: 'start', number: '1' });
    expect(g.features?.[0]).toMatchObject({ type: 'label', value: 'A' });
    const round = Grouping.fromXmlElement(parseElements(buildElements([Grouping.toXmlElement(g)]))[0]);
    expect(round.features?.[0].value).toBe('A');
  });

  it('Link round-trips xlink href + position', () => {
    const l = Link.fromXmlElement(parseElements('<link xlink:href="#x" name="n" default-x="5"/>')[0]);
    expect(l).toMatchObject({ href: '#x', name: 'n', defaultX: 5 });
    expect(buildElements([Link.toXmlElement(l)])).toContain('xlink:href="#x"');
  });

  it('Listening round-trips sync + offset', () => {
    const ls = Listening.fromXmlElement(parseElements('<listening><sync type="start" latency="10"/><offset>2</offset></listening>')[0]);
    expect(ls.sync).toMatchObject({ type: 'start', latency: 10 });
    expect(ls.offset?.value).toBe(2);
    const round = Listening.fromXmlElement(parseElements(buildElements([Listening.toXmlElement(ls)]))[0]);
    expect(round.sync?.latency).toBe(10);
    expect(round.offset?.value).toBe(2);
  });
});
