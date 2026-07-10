/**
 * key — key signature (traditional or non-traditional) + key-octaves.
 * @see musicxml.xsd complexType "key"
 *   ((cancel?, fifths, mode?) | (key-step, key-alter, key-accidental?)*), key-octave*;
 *   @number, print-style, print-object
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import {
  Mode,
  type CancelLocation,
  type CssFontSize,
  type FontStyle,
  type FontWeight,
  type YesNo,
} from '../enums';
import type { Color } from '../common';
import { asEnum, PrintStyleAttrs } from '../common/attribute-groups';
import type { Cancel, Key as KeyShape, KeyOctave, KeyStep } from '../part';

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

/** The key type represents a key signature. Both traditional and non-traditional key signatures are supported. The optional number attribute refers to staff numbers. If absent, the key signature applies to all staves in the part. Key signatures appear at the start of each system unless the print-object attribute has been set to "no". */
export class Key implements KeyShape {
  number?: number;
  cancel?: Cancel;
  fifths?: number;
  mode?: Mode;
  keySteps?: KeyStep[];
  keyOctaves?: KeyOctave[];
  printObject?: YesNo;
  // print-style
  defaultX?: number;
  defaultY?: number;
  relativeX?: number;
  relativeY?: number;
  fontFamily?: string;
  fontStyle?: FontStyle;
  fontSize?: number | CssFontSize;
  fontWeight?: FontWeight;
  color?: Color;

  constructor(init?: Partial<Key>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Key {
    const cancelEl = childrenOf(node, 'cancel')[0];
    const steps = childrenOf(node, 'key-step');
    const alters = childrenOf(node, 'key-alter');
    const accidentals = childrenOf(node, 'key-accidental');
    const keySteps = steps.map(
      (s, i): KeyStep => ({
        step: elementText(s) ?? '',
        alter: Number(elementText(alters[i]) ?? '0'),
        accidental: accidentals[i] ? { value: elementText(accidentals[i]) ?? '' } : undefined,
      }),
    );
    const keyOctaves = childrenOf(node, 'key-octave').map(
      (o): KeyOctave => ({
        number: Number(attr(o, 'number') ?? '0'),
        value: Number(elementText(o) ?? '0'),
        cancel: attr(o, 'cancel') as YesNo | undefined,
      }),
    );
    const num = attr(node, 'number');
    return new Key({
      number: num === undefined ? undefined : Number(num),
      cancel: cancelEl
        ? { value: Number(elementText(cancelEl) ?? '0'), location: attr(cancelEl, 'location') as CancelLocation | undefined }
        : undefined,
      fifths: numText(node, 'fifths'),
      mode: asEnum(Mode, textOf(node, 'mode')),
      keySteps: keySteps.length ? keySteps : undefined,
      keyOctaves: keyOctaves.length ? keyOctaves : undefined,
      printObject: attr(node, 'print-object') as YesNo | undefined,
      ...PrintStyleAttrs.read(node),
    });
  }

  static toXmlElement(key: Key): XmlElement {
    const c: XmlElement[] = [];
    if (key.keySteps?.length) {
      for (const ks of key.keySteps) {
        c.push(textEl('key-step', ks.step));
        c.push(textEl('key-alter', ks.alter));
        if (ks.accidental) c.push(textEl('key-accidental', ks.accidental.value));
      }
    } else {
      if (key.cancel) c.push(textEl('cancel', key.cancel.value, { location: key.cancel.location }));
      if (key.fifths !== undefined) c.push(textEl('fifths', key.fifths));
      if (key.mode !== undefined) c.push(textEl('mode', key.mode));
    }
    for (const ko of key.keyOctaves ?? []) {
      c.push(textEl('key-octave', ko.value, { number: ko.number, cancel: ko.cancel }));
    }
    return el('key', c, { ...PrintStyleAttrs.attrs(key), number: key.number, 'print-object': key.printObject });
  }
}
