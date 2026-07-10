/**
 * time — time signature.
 * @see musicxml.xsd complexType "time"
 *   (beats, beat-type)+ [interchangeable] | senza-misura;
 *   @number, @symbol, @separator, print-style-align, print-object
 *
 * `interchangeable` is retained on the model but not yet serialized (deep
 * sub-type); the legacy serializer also dropped it, so no regression.
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import {
  TimeSeparator,
  TimeSymbol,
  type CssFontSize,
  type FontStyle,
  type FontWeight,
  type LeftCenterRight,
  type Valign,
  type YesNo,
} from '../enums';
import { asEnum, PrintStyleAlignAttrs } from '../common/attribute-groups';
import type { Interchangeable, Time as TimeShape } from '../part';

/** Parsed time signature (top/bottom numbers) derived from a {@link Time}. */
export interface TimeSignature {
  /** Beats per measure (top number). */
  numerator: number;
  /** Note value that gets one beat (bottom number). */
  denominator: number;
}

/** Time signatures are represented by the beats element for the numerator and the beat-type element for the denominator. The symbol attribute is used to indicate common and cut time symbols as well as a single number display. Multiple pairs of beat and beat-type elements are used for composite time signatures with multiple denominators, such as 2/4 + 3/8. A composite such as 3+2/8 requires only one beat/beat-type pair. The print-object attribute allows a time signature to be specified but not printed, as is the case for excerpts from the middle of a score. The value is "yes" if not present. The optional number attribute refers to staff numbers within the part. If absent, the time signature applies to all staves in the part. */
export class Time implements TimeShape {
  number?: number;
  symbol?: TimeSymbol;
  separator?: TimeSeparator;
  beats?: string[];
  beatTypes?: string[];
  interchangeable?: Interchangeable;
  senzaMisura?: string;
  printObject?: YesNo;
  // print-style-align
  defaultX?: number;
  defaultY?: number;
  relativeX?: number;
  relativeY?: number;
  fontFamily?: string;
  fontStyle?: FontStyle;
  fontSize?: number | CssFontSize;
  fontWeight?: FontWeight;
  color?: string;
  halign?: LeftCenterRight;
  valign?: Valign;

  constructor(init?: Partial<Time>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Time {
    const num = attr(node, 'number');
    const beats = childrenOf(node, 'beats').map((b) => elementText(b) ?? '');
    const beatTypes = childrenOf(node, 'beat-type').map((b) => elementText(b) ?? '');
    return new Time({
      number: num === undefined ? undefined : Number(num),
      symbol: asEnum(TimeSymbol, attr(node, 'symbol')),
      separator: asEnum(TimeSeparator, attr(node, 'separator')),
      beats: beats.length ? beats : undefined,
      beatTypes: beatTypes.length ? beatTypes : undefined,
      senzaMisura: childrenOf(node, 'senza-misura').length ? (textOf(node, 'senza-misura') ?? '') : undefined,
      printObject: attr(node, 'print-object') as YesNo | undefined,
      ...PrintStyleAlignAttrs.read(node),
    });
  }

  static toXmlElement(time: Time): XmlElement {
    const c: XmlElement[] = [];
    if (time.senzaMisura !== undefined) {
      c.push(textEl('senza-misura', time.senzaMisura));
    } else {
      const beats = time.beats ?? [];
      const beatTypes = time.beatTypes ?? [];
      for (let i = 0; i < Math.max(beats.length, beatTypes.length); i++) {
        if (beats[i] !== undefined) c.push(textEl('beats', beats[i]));
        if (beatTypes[i] !== undefined) c.push(textEl('beat-type', beatTypes[i]));
      }
    }
    return el('time', c, {
      ...PrintStyleAlignAttrs.attrs(time),
      number: time.number,
      symbol: time.symbol,
      separator: time.separator,
      'print-object': time.printObject,
    });
  }

  // ----------------------------------------------------------- behavior ----

  /**
   * Parse the first beats/beat-type pair into a {@link TimeSignature}.
   * Static (data-in) so it works on plain `Time`-shaped objects too.
   * @throws if beats or beat-type are missing or non-numeric.
   */
  static parseSignature(time: Time): TimeSignature {
    if (!time.beats || time.beats.length === 0 || !time.beatTypes || time.beatTypes.length === 0) {
      throw new Error('Time signature is missing beats or beat-type');
    }
    const numerator = parseInt(time.beats[0], 10);
    const denominator = parseInt(time.beatTypes[0], 10);
    if (isNaN(numerator) || isNaN(denominator)) {
      throw new Error(`Invalid time signature: ${time.beats[0]}/${time.beatTypes[0]}`);
    }
    return { numerator, denominator };
  }
}
