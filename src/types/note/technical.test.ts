import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { StartStop } from '../enums';
import { Technical } from './technical';

/** @see musicxml.xsd "technical". */
describe('Technical', () => {
  it('round-trips empty + fingering + bend + hammer-on + harmonic + hole', () => {
    const xml =
      '<technical>' +
      '<up-bow placement="above"/>' +
      '<harmonic><artificial/><sounding-pitch/></harmonic>' +
      '<fingering substitution="yes">3</fingering>' +
      '<string>5</string>' +
      '<hammer-on type="start" number="1">H</hammer-on>' +
      '<bend shape="curved"><bend-alter>-2</bend-alter><release/><with-bar>scoop</with-bar></bend>' +
      '<hole><hole-type>circle</hole-type><hole-closed location="bottom">half</hole-closed></hole>' +
      '</technical>';
    const t = Technical.fromXmlElement(parseElements(xml)[0]);
    expect(t.upBow).toMatchObject({ placement: 'above' });
    expect(t.harmonic).toMatchObject({ artificial: true, soundingPitch: true });
    expect(t.fingering).toMatchObject({ value: '3', substitution: 'yes' });
    expect(t.string?.value).toBe(5);
    expect(t.hammerOn).toMatchObject({ type: StartStop.Start, number: 1, value: 'H' });
    expect(t.bends?.[0]).toMatchObject({ bendAlter: -2, release: true, shape: 'curved' });
    expect(t.bends?.[0].withBar?.value).toBe('scoop');
    expect(t.hole).toMatchObject({ holeType: 'circle' });
    expect(t.hole?.holeClosed).toMatchObject({ value: 'half', location: 'bottom' });

    const round = Technical.fromXmlElement(parseElements(buildElements([Technical.toXmlElement(t)]))[0]);
    expect(round.harmonic).toMatchObject({ artificial: true, soundingPitch: true });
    expect(round.hammerOn).toMatchObject({ type: StartStop.Start, number: 1, value: 'H' });
    expect(round.bends?.[0]).toMatchObject({ bendAlter: -2, release: true, shape: 'curved' });
    expect(round.hole?.holeClosed).toMatchObject({ value: 'half', location: 'bottom' });
  });
});
