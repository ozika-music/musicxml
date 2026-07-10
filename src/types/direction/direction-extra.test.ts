import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { StartStop } from '../enums';
import { DirectionType } from './direction';

/** @see musicxml.xsd "harp-pedals"/"scordatura"/"image"/"principal-voice"/"percussion". */
describe('direction-type extra elements', () => {
  it('round-trips harp-pedals + scordatura + image + principal-voice + percussion', () => {
    const xml =
      '<direction-type>' +
      '<harp-pedals><pedal-tuning><pedal-step>D</pedal-step><pedal-alter>0</pedal-alter></pedal-tuning></harp-pedals>' +
      '<scordatura><accord string="1"><tuning-step>E</tuning-step><tuning-octave>2</tuning-octave></accord></scordatura>' +
      '<image source="x.png" type="image/png" height="40" width="60"/>' +
      '<principal-voice type="start" symbol="Hauptstimme">HS</principal-voice>' +
      '<percussion><stick><stick-type>bass drum</stick-type><stick-material>soft</stick-material></stick></percussion>' +
      '<percussion><metal smufl="x">cymbal</metal></percussion>' +
      '</direction-type>';
    const d = DirectionType.fromXmlElement(parseElements(xml)[0]);
    expect(d.harpPedals?.pedalTunings[0]).toMatchObject({ pedalStep: 'D', pedalAlter: 0 });
    expect(d.scordatura?.accords[0]).toMatchObject({ string: 1, tuningStep: 'E', tuningOctave: 2 });
    expect(d.image).toMatchObject({ source: 'x.png', type: 'image/png', height: 40, width: 60 });
    expect(d.principalVoice).toMatchObject({ type: StartStop.Start, symbol: 'Hauptstimme', value: 'HS' });
    expect(d.percussions?.[0].stick).toMatchObject({ stickType: 'bass drum', stickMaterial: 'soft' });
    expect(d.percussions?.[1].metal).toMatchObject({ value: 'cymbal', smufl: 'x' });

    const round = DirectionType.fromXmlElement(parseElements(buildElements([DirectionType.toXmlElement(d)]))[0]);
    expect(round.harpPedals?.pedalTunings[0].pedalStep).toBe('D');
    expect(round.scordatura?.accords[0].tuningStep).toBe('E');
    expect(round.image?.source).toBe('x.png');
    expect(round.principalVoice?.symbol).toBe('Hauptstimme');
    expect(round.percussions?.[0].stick?.stickType).toBe('bass drum');
    expect(round.percussions?.[1].metal?.smufl).toBe('x');
  });
});
