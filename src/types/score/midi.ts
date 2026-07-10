/**
 * midi-device / midi-instrument.
 *
 * @see musicxml.xsd complexType "midi-device" — text value + @id + @port
 * @see musicxml.xsd complexType "midi-instrument" — midi-channel?, midi-name?,
 *   midi-bank?, midi-program?, midi-unpitched?, volume?, pan?, elevation?; @id
 */

import { attr, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';

function numOf(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

/** The midi-device type corresponds to the DeviceName meta event in Standard MIDI Files. The optional port attribute is a number from 1 to 16 that can be used with the unofficial MIDI 1.0 port (or cable) meta event. Unlike the DeviceName meta event, there can be multiple midi-device elements per MusicXML part. The optional id attribute refers to the score-instrument assigned to this device. If missing, the device assignment affects all score-instrument elements in the score-part. */
export class MidiDevice {
  id?: string;
  port?: number;
  value?: string;

  constructor(init?: Partial<MidiDevice>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): MidiDevice {
    const port = attr(node, 'port');
    return new MidiDevice({
      id: attr(node, 'id'),
      port: port === undefined ? undefined : Number(port),
      value: elementText(node),
    });
  }

  static toXmlElement(md: MidiDevice): XmlElement {
    const children = md.value !== undefined ? [{ '#text': md.value }] : [];
    return el('midi-device', children, { id: md.id, port: md.port });
  }
}

/** The midi-instrument type defines MIDI 1.0 instrument playback. The midi-instrument element can be a part of either the score-instrument element at the start of a part, or the sound element within a part. The id attribute refers to the score-instrument affected by the change. */
export class MidiInstrument {
  id = '';
  midiChannel?: number;
  midiName?: string;
  midiBank?: number;
  midiProgram?: number;
  midiUnpitched?: number;
  volume?: number;
  pan?: number;
  elevation?: number;

  constructor(init?: Partial<MidiInstrument>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): MidiInstrument {
    return new MidiInstrument({
      id: attr(node, 'id') ?? '',
      midiChannel: numOf(node, 'midi-channel'),
      midiName: textOf(node, 'midi-name'),
      midiBank: numOf(node, 'midi-bank'),
      midiProgram: numOf(node, 'midi-program'),
      midiUnpitched: numOf(node, 'midi-unpitched'),
      volume: numOf(node, 'volume'),
      pan: numOf(node, 'pan'),
      elevation: numOf(node, 'elevation'),
    });
  }

  static toXmlElement(mi: MidiInstrument): XmlElement {
    const c: XmlElement[] = [];
    if (mi.midiChannel !== undefined) c.push(textEl('midi-channel', mi.midiChannel));
    if (mi.midiName !== undefined) c.push(textEl('midi-name', mi.midiName));
    if (mi.midiBank !== undefined) c.push(textEl('midi-bank', mi.midiBank));
    if (mi.midiProgram !== undefined) c.push(textEl('midi-program', mi.midiProgram));
    if (mi.midiUnpitched !== undefined) c.push(textEl('midi-unpitched', mi.midiUnpitched));
    if (mi.volume !== undefined) c.push(textEl('volume', mi.volume));
    if (mi.pan !== undefined) c.push(textEl('pan', mi.pan));
    if (mi.elevation !== undefined) c.push(textEl('elevation', mi.elevation));
    return el('midi-instrument', c, { id: mi.id });
  }
}
