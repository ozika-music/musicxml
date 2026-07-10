import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { BackwardForward, BarStyle, BarlineLocation, StartStopDiscontinue } from '../enums';
import { Barline } from './barline';

/** @see musicxml.xsd "barline". */
describe('Barline', () => {
  it('round-trips bar-style + ending + repeat + location', () => {
    const xml =
      '<barline location="right">' +
      '<bar-style>light-heavy</bar-style>' +
      '<ending number="1" type="stop">1.</ending>' +
      '<repeat direction="backward" times="2"/>' +
      '</barline>';
    const b = Barline.fromXmlElement(parseElements(xml)[0]);
    expect(b.location).toBe(BarlineLocation.Right);
    expect(b.barStyle?.value).toBe(BarStyle.LightHeavy);
    expect(b.ending).toMatchObject({ number: '1', type: StartStopDiscontinue.Stop, value: '1.' });
    expect(b.repeat).toMatchObject({ direction: BackwardForward.Backward, times: 2 });

    const round = Barline.fromXmlElement(parseElements(buildElements([Barline.toXmlElement(b)]))[0]);
    expect(round.barStyle?.value).toBe(BarStyle.LightHeavy);
    expect(round.ending).toMatchObject({ number: '1', value: '1.' });
    expect(round.repeat).toMatchObject({ direction: BackwardForward.Backward, times: 2 });
    expect(round.location).toBe(BarlineLocation.Right);
  });

  it('round-trips segno/coda/fermata children', () => {
    const xml = '<barline><segno/><coda/><fermata type="upright">normal</fermata></barline>';
    const b = Barline.fromXmlElement(parseElements(xml)[0]);
    expect(b.segnoElement).toBeDefined();
    expect(b.codaElement).toBeDefined();
    expect(b.fermatas?.[0].value).toBe('normal');
    const round = Barline.fromXmlElement(parseElements(buildElements([Barline.toXmlElement(b)]))[0]);
    expect(round.segnoElement).toBeDefined();
    expect(round.fermatas?.[0].value).toBe('normal');
  });
});
