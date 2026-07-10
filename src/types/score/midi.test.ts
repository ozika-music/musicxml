import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { MidiDevice, MidiInstrument } from './midi';

/** @see musicxml.xsd "midi-device" (value, @id, @port) and "midi-instrument". */
describe('MidiDevice', () => {
  it('round-trips value + @id + @port', () => {
    const node = parseElements('<midi-device id="P1-I1" port="2">Net 1</midi-device>')[0];
    const md = MidiDevice.fromXmlElement(node);
    expect(md.id).toBe('P1-I1');
    expect(md.port).toBe(2);
    expect(md.value).toBe('Net 1');
    const round = MidiDevice.fromXmlElement(parseElements(buildElements([MidiDevice.toXmlElement(md)]))[0]);
    expect(round).toMatchObject({ id: 'P1-I1', port: 2, value: 'Net 1' });
  });
});

describe('MidiInstrument', () => {
  it('round-trips every spec item', () => {
    const xml =
      '<midi-instrument id="P1-I1"><midi-channel>1</midi-channel><midi-program>74</midi-program>' +
      '<midi-bank>1</midi-bank><midi-unpitched>40</midi-unpitched><volume>80</volume><pan>-10</pan>' +
      '<elevation>0</elevation></midi-instrument>';
    const mi = MidiInstrument.fromXmlElement(parseElements(xml)[0]);
    expect(mi).toMatchObject({
      id: 'P1-I1', midiChannel: 1, midiProgram: 74, midiBank: 1, midiUnpitched: 40, volume: 80, pan: -10, elevation: 0,
    });
    const round = MidiInstrument.fromXmlElement(parseElements(buildElements([MidiInstrument.toXmlElement(mi)]))[0]);
    expect(round).toMatchObject({ id: 'P1-I1', midiChannel: 1, midiProgram: 74, volume: 80, pan: -10 });
  });
});
