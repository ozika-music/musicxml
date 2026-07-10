/**
 * Sound + its leaves (offset, midi-device, midi-instrument, play, swing).
 * @see musicxml.xsd "sound"
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import type { Divisions } from '../common';
import type { YesNo } from '../enums';
import type {
  MidiDeviceSound as MidiDeviceSoundShape,
  MidiInstrumentSound as MidiInstrumentSoundShape,
  Offset as OffsetShape,
  PlaySound as PlaySoundShape,
  Sound as SoundShape,
  Swing as SwingShape,
} from '../part';

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}
function numAttr(node: XmlElement, name: string): number | undefined {
  const v = attr(node, name);
  return v === undefined ? undefined : Number(v);
}

/**
 * An offset is represented in terms of divisions, and indicates where the direction will appear relative to the current musical location. The current musical location is always within the current measure, even at the end of a measure. The offset affects the visual appearance of the direction. If the sound attribute is "yes", then the offset affects playback and listening too. If the sound attribute is "no", then any sound or listening associated with the direction takes effect at the current location. The sound attribute is "no" by default for compatibility with earlier versions of the MusicXML format. If an element within a direction includes a default-x attribute, the offset value will be ignored when determining the appearance of that element.
 * @see musicxml.xsd "offset".
 */
export class Offset implements OffsetShape {
  value: Divisions = 0;
  sound?: YesNo;
  constructor(init?: Partial<Offset>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Offset {
    return new Offset({ value: Number(elementText(node) ?? 0), sound: attr(node, 'sound') as YesNo | undefined });
  }
  static toXmlElement(o: Offset): XmlElement {
    return el('offset', [{ '#text': String(o.value) }], { sound: o.sound });
  }
}

/**
 * The midi-device type corresponds to the DeviceName meta event in Standard MIDI Files. The optional port attribute is a number from 1 to 16 that can be used with the unofficial MIDI 1.0 port (or cable) meta event. Unlike the DeviceName meta event, there can be multiple midi-device elements per MusicXML part. The optional id attribute refers to the score-instrument assigned to this device. If missing, the device assignment affects all score-instrument elements in the score-part.
 * @see musicxml.xsd "midi-device" (sound context).
 */
export class MidiDeviceSound implements MidiDeviceSoundShape {
  id?: string;
  port?: number;
  value?: string;
  constructor(init?: Partial<MidiDeviceSound>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): MidiDeviceSound {
    return new MidiDeviceSound({ id: attr(node, 'id'), port: numAttr(node, 'port'), value: elementText(node) || undefined });
  }
  static toXmlElement(m: MidiDeviceSound): XmlElement {
    return el('midi-device', m.value ? [{ '#text': m.value }] : [], { port: m.port, id: m.id });
  }
}

/**
 * The midi-instrument type defines MIDI 1.0 instrument playback. The midi-instrument element can be a part of either the score-instrument element at the start of a part, or the sound element within a part. The id attribute refers to the score-instrument affected by the change.
 * @see musicxml.xsd "midi-instrument" (sound context).
 */
export class MidiInstrumentSound implements MidiInstrumentSoundShape {
  id = '';
  midiChannel?: number;
  midiName?: string;
  midiBank?: number;
  midiProgram?: number;
  midiUnpitched?: number;
  volume?: number;
  pan?: number;
  elevation?: number;
  constructor(init?: Partial<MidiInstrumentSound>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): MidiInstrumentSound {
    return new MidiInstrumentSound({
      id: attr(node, 'id') ?? '',
      midiChannel: numText(node, 'midi-channel'),
      midiName: textOf(node, 'midi-name'),
      midiBank: numText(node, 'midi-bank'),
      midiProgram: numText(node, 'midi-program'),
      midiUnpitched: numText(node, 'midi-unpitched'),
      volume: numText(node, 'volume'),
      pan: numText(node, 'pan'),
      elevation: numText(node, 'elevation'),
    });
  }
  static toXmlElement(m: MidiInstrumentSound): XmlElement {
    const c: XmlElement[] = [];
    const n = (tag: string, v: number | string | undefined) => {
      if (v !== undefined) c.push(textEl(tag, v));
    };
    n('midi-channel', m.midiChannel);
    n('midi-name', m.midiName);
    n('midi-bank', m.midiBank);
    n('midi-program', m.midiProgram);
    n('midi-unpitched', m.midiUnpitched);
    n('volume', m.volume);
    n('pan', m.pan);
    n('elevation', m.elevation);
    return el('midi-instrument', c, { id: m.id });
  }
}

/**
 * The play type specifies playback techniques to be used in conjunction with the instrument-sound element. When used as part of a sound element, it applies to all notes going forward in score order. In multi-instrument parts, the affected instrument should be specified using the id attribute. When used as part of a note element, it applies to the current note only.
 * @see musicxml.xsd "play" (sound context).
 */
export class PlaySound implements PlaySoundShape {
  id?: string;
  ipa?: string;
  mute?: string;
  semiPitched?: string;
  otherPlay?: { type: string; value: string };
  constructor(init?: Partial<PlaySound>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): PlaySound {
    const other = childrenOf(node, 'other-play')[0];
    return new PlaySound({
      id: attr(node, 'id'),
      ipa: textOf(node, 'ipa'),
      mute: textOf(node, 'mute'),
      semiPitched: textOf(node, 'semi-pitched'),
      otherPlay: other ? { type: attr(other, 'type') ?? '', value: elementText(other) ?? '' } : undefined,
    });
  }
  static toXmlElement(p: PlaySound): XmlElement {
    const c: XmlElement[] = [];
    if (p.ipa !== undefined) c.push(textEl('ipa', p.ipa));
    if (p.mute !== undefined) c.push(textEl('mute', p.mute));
    if (p.semiPitched !== undefined) c.push(textEl('semi-pitched', p.semiPitched));
    if (p.otherPlay) c.push(el('other-play', [{ '#text': p.otherPlay.value }], { type: p.otherPlay.type }));
    return el('play', c, { id: p.id });
  }
}

/**
 * The swing element specifies whether or not to use swing playback, where consecutive on-beat / off-beat eighth or 16th notes are played with unequal nominal durations. The straight element specifies that no swing is present, so consecutive notes have equal durations. The first and second elements are positive integers that specify the ratio between durations of consecutive notes. For example, a first element with a value of 2 and a second element with a value of 1 applied to eighth notes specifies a quarter note / eighth note tuplet playback, where the first note is twice as long as the second note. Ratios should be specified with the smallest integers possible. For example, a ratio of 6 to 4 should be specified as 3 to 2 instead. The optional swing-type element specifies the note type, either eighth or 16th, to which the ratio is applied. The value is eighth if this element is not present. The optional swing-style element is a string describing the style of swing used. The swing element has no effect for playback of grace notes, notes where a type element is not present, and notes where the specified duration is different than the nominal value associated with the specified type. If a swung note has attack and release attributes, those values modify the swung playback.
 * @see musicxml.xsd "swing".
 */
export class Swing implements SwingShape {
  straight?: boolean;
  first?: number;
  second?: number;
  swingType?: string;
  swingStyle?: string;
  constructor(init?: Partial<Swing>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Swing {
    return new Swing({
      straight: childrenOf(node, 'straight').length > 0 || undefined,
      first: numText(node, 'first'),
      second: numText(node, 'second'),
      swingType: textOf(node, 'swing-type'),
      swingStyle: textOf(node, 'swing-style'),
    });
  }
  static toXmlElement(s: Swing): XmlElement {
    const c: XmlElement[] = [];
    if (s.straight) c.push(el('straight', []));
    if (s.first !== undefined) c.push(textEl('first', s.first));
    if (s.second !== undefined) c.push(textEl('second', s.second));
    if (s.swingType !== undefined) c.push(textEl('swing-type', s.swingType));
    if (s.swingStyle !== undefined) c.push(textEl('swing-style', s.swingStyle));
    return el('swing', c);
  }
}

/**
 * The sound element contains general playback parameters. They can stand alone within a part/measure, or be a component element within a direction. Tempo is expressed in quarter notes per minute. If 0, the sound-generating program should prompt the user at the time of compiling a sound (MIDI) file. Dynamics (or MIDI velocity) are expressed as a percentage of the default forte value (90 for MIDI 1.0). Dacapo indicates to go back to the beginning of the movement. When used it always has the value "yes". Segno and dalsegno are used for backwards jumps to a segno sign; coda and tocoda are used for forward jumps to a coda sign. If there are multiple jumps, the value of these parameters can be used to name and distinguish them. If segno or coda is used, the divisions attribute can also be used to indicate the number of divisions per quarter note. Otherwise sound and MIDI generating programs may have to recompute this. By default, a dalsegno or dacapo attribute indicates that the jump should occur the first time through, while a tocoda attribute indicates the jump should occur the second time through. The time that jumps occur can be changed by using the time-only attribute. The forward-repeat attribute indicates that a forward repeat sign is implied but not displayed. It is used for example in two-part forms with repeats, such as a minuet and trio where no repeat is displayed at the start of the trio. This usually occurs after a barline. When used it always has the value of "yes". The fine attribute follows the final note or rest in a movement with a da capo or dal segno direction. If numeric, the value represents the actual duration of the final note or rest, which can be ambiguous in written notation and different among parts and voices. The value may also be "yes" to indicate no change to the final duration. If the sound element applies only particular times through a repeat, the time-only attribute indicates which times to apply the sound element. Pizzicato in a sound element effects all following notes. Yes indicates pizzicato, no indicates arco. The pan and elevation attributes are deprecated in Version 2.0. The pan and elevation elements in the midi-instrument element should be used instead. The meaning of the pan and elevation attributes is the same as for the pan and elevation elements. If both are present, the mid-instrument elements take priority. The damper-pedal, soft-pedal, and sostenuto-pedal attributes effect playback of the three common piano pedals and their MIDI controller equivalents. The yes value indicates the pedal is depressed; no indicates the pedal is released. A numeric value from 0 to 100 may also be used for half pedaling. This value is the percentage that the pedal is depressed. A value of 0 is equivalent to no, and a value of 100 is equivalent to yes. Instrument changes, MIDI devices, MIDI instruments, and playback techniques are changed using the instrument-change, midi-device, midi-instrument, and play elements. When there are multiple instances of these elements, they should be grouped together by instrument using the id attribute values. The offset element is used to indicate that the sound takes place offset from the current score position. If the sound element is a child of a direction element, the sound offset element overrides the direction offset element if both elements are present. Note that the offset reflects the intended musical position for the change in sound. It should not be used to compensate for latency issues in particular hardware configurations.
 * @see musicxml.xsd "sound".
 */
export class Sound implements SoundShape {
  tempo?: number;
  dynamics?: number;
  dacapo?: YesNo;
  segno?: string;
  dalsegno?: string;
  coda?: string;
  tocoda?: string;
  divisions?: Divisions;
  forwardRepeat?: YesNo;
  fine?: string;
  timeOnly?: string;
  pizzicato?: YesNo;
  pan?: number;
  elevation?: number;
  damperPedal?: YesNo | number;
  softPedal?: YesNo | number;
  sostenutoPedal?: YesNo | number;
  offset?: Offset;
  midiDevices?: MidiDeviceSound[];
  midiInstruments?: MidiInstrumentSound[];
  plays?: PlaySound[];
  swing?: Swing;
  id?: string;
  constructor(init?: Partial<Sound>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Sound {
    const pedal = (name: string): YesNo | number | undefined => {
      const v = attr(node, name);
      if (v === undefined) return undefined;
      return v === 'yes' || v === 'no' ? (v as YesNo) : Number(v);
    };
    const swing = childrenOf(node, 'swing')[0];
    const offset = childrenOf(node, 'offset')[0];
    const midiDevices = childrenOf(node, 'midi-device').map(MidiDeviceSound.fromXmlElement);
    const midiInstruments = childrenOf(node, 'midi-instrument').map(MidiInstrumentSound.fromXmlElement);
    const plays = childrenOf(node, 'play').map(PlaySound.fromXmlElement);
    return new Sound({
      tempo: numAttr(node, 'tempo'),
      dynamics: numAttr(node, 'dynamics'),
      dacapo: attr(node, 'dacapo') as YesNo | undefined,
      segno: attr(node, 'segno'),
      dalsegno: attr(node, 'dalsegno'),
      coda: attr(node, 'coda'),
      tocoda: attr(node, 'tocoda'),
      divisions: numAttr(node, 'divisions'),
      forwardRepeat: attr(node, 'forward-repeat') as YesNo | undefined,
      fine: attr(node, 'fine'),
      timeOnly: attr(node, 'time-only'),
      pizzicato: attr(node, 'pizzicato') as YesNo | undefined,
      pan: numAttr(node, 'pan'),
      elevation: numAttr(node, 'elevation'),
      damperPedal: pedal('damper-pedal'),
      softPedal: pedal('soft-pedal'),
      sostenutoPedal: pedal('sostenuto-pedal'),
      midiDevices: midiDevices.length ? midiDevices : undefined,
      midiInstruments: midiInstruments.length ? midiInstruments : undefined,
      plays: plays.length ? plays : undefined,
      swing: swing ? Swing.fromXmlElement(swing) : undefined,
      offset: offset ? Offset.fromXmlElement(offset) : undefined,
      id: attr(node, 'id'),
    });
  }

  static toXmlElement(s: Sound): XmlElement {
    const c: XmlElement[] = [];
    for (const m of s.midiDevices ?? []) c.push(MidiDeviceSound.toXmlElement(m));
    for (const m of s.midiInstruments ?? []) c.push(MidiInstrumentSound.toXmlElement(m));
    for (const p of s.plays ?? []) c.push(PlaySound.toXmlElement(p));
    if (s.swing) c.push(Swing.toXmlElement(s.swing));
    if (s.offset) c.push(Offset.toXmlElement(s.offset));
    return el('sound', c, {
      tempo: s.tempo,
      dynamics: s.dynamics,
      dacapo: s.dacapo,
      segno: s.segno,
      dalsegno: s.dalsegno,
      coda: s.coda,
      tocoda: s.tocoda,
      divisions: s.divisions,
      'forward-repeat': s.forwardRepeat,
      fine: s.fine,
      'time-only': s.timeOnly,
      pizzicato: s.pizzicato,
      pan: s.pan,
      elevation: s.elevation,
      'damper-pedal': s.damperPedal,
      'soft-pedal': s.softPedal,
      'sostenuto-pedal': s.sostenutoPedal,
      id: s.id,
    });
  }
}
