import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Sound } from './sound';

/** @see musicxml.xsd "sound". */
describe('Sound', () => {
  it('round-trips attrs + midi-instrument + offset + swing', () => {
    const xml =
      '<sound tempo="120" dynamics="90" damper-pedal="yes">' +
      '<midi-instrument id="P1-I1"><midi-channel>1</midi-channel><midi-program>1</midi-program><volume>80</volume></midi-instrument>' +
      '<swing><first>2</first><second>1</second><swing-type>eighth</swing-type></swing>' +
      '<offset sound="yes">2</offset>' +
      '</sound>';
    const s = Sound.fromXmlElement(parseElements(xml)[0]);
    expect(s).toMatchObject({ tempo: 120, dynamics: 90, damperPedal: 'yes' });
    expect(s.midiInstruments?.[0]).toMatchObject({ id: 'P1-I1', midiChannel: 1, midiProgram: 1, volume: 80 });
    expect(s.swing).toMatchObject({ first: 2, second: 1, swingType: 'eighth' });
    expect(s.offset).toMatchObject({ value: 2, sound: 'yes' });

    const round = Sound.fromXmlElement(parseElements(buildElements([Sound.toXmlElement(s)]))[0]);
    expect(round).toMatchObject({ tempo: 120, damperPedal: 'yes' });
    expect(round.midiInstruments?.[0]).toMatchObject({ id: 'P1-I1', midiChannel: 1, volume: 80 });
    expect(round.swing).toMatchObject({ first: 2, swingType: 'eighth' });
    expect(round.offset).toMatchObject({ value: 2, sound: 'yes' });
  });
});
