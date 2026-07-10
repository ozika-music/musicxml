import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { LineType, StartStop } from '../enums';
import { Glissando, Slide } from './notations-lines';

/** @see musicxml.xsd "glissando"/"slide". */
describe('notation lines', () => {
  it('Glissando round-trips type + number + line-type + text', () => {
    const g = Glissando.fromXmlElement(parseElements('<glissando type="start" number="1" line-type="wavy">gliss.</glissando>')[0]);
    expect(g).toMatchObject({ type: StartStop.Start, number: 1, lineType: LineType.Wavy, value: 'gliss.' });
    const round = Glissando.fromXmlElement(parseElements(buildElements([Glissando.toXmlElement(g)]))[0]);
    expect(round).toMatchObject({ type: StartStop.Start, number: 1, lineType: LineType.Wavy, value: 'gliss.' });
  });

  it('Slide round-trips type + bend-sound attrs', () => {
    const s = Slide.fromXmlElement(parseElements('<slide type="stop" number="1" accelerate="yes" beats="2"/>')[0]);
    expect(s).toMatchObject({ type: StartStop.Stop, number: 1, accelerate: 'yes', beats: 2 });
    const round = Slide.fromXmlElement(parseElements(buildElements([Slide.toXmlElement(s)]))[0]);
    expect(round).toMatchObject({ type: StartStop.Stop, number: 1, accelerate: 'yes', beats: 2 });
  });
});
