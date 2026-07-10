/**
 * attributes — measure-level musical attributes (divisions, key, time, clef, …).
 * @see musicxml.xsd complexType "attributes"
 *   editorial, divisions?, key*, time*, staves?, part-symbol?, instruments?,
 *   clef*, staff-details*, (transpose | for-part)*, directive*, measure-style*
 *
 * Composes the leaf classes (Key/Time/Clef/Transpose/PartSymbol/StaffDetails).
 * `forParts`, `directives`, `measureStyles` and editorial footnote/level are
 * retained on the model but not yet serialized (deep sub-types); the legacy
 * serializer also dropped them, so no regression.
 */

import { childrenOf, el, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import type { Divisions } from '../common';
import type { AttributesShape, Directive, ForPart, MeasureStyle } from '../part';
import { Clef } from './clef';
import { Key } from './key';
import { PartSymbol } from './part-symbol';
import { StaffDetails } from './staff-details';
import { Time } from './time';
import { Transpose } from './transpose';

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

/** The attributes element contains musical information that typically changes on measure boundaries. This includes key and time signatures, clefs, transpositions, and staving. When attributes are changed mid-measure, it affects the music in score order, not in MusicXML document order. */
export class Attributes implements AttributesShape {
  divisions?: Divisions;
  keys?: Key[];
  times?: Time[];
  staves?: number;
  partSymbol?: PartSymbol;
  instruments?: number;
  clefs?: Clef[];
  staffDetails?: StaffDetails[];
  transposes?: Transpose[];
  forParts?: ForPart[];
  directives?: Directive[];
  measureStyles?: MeasureStyle[];

  constructor(init?: Partial<Attributes>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Attributes {
    const partSymbol = childrenOf(node, 'part-symbol')[0];
    const list = <T>(tag: string, fn: (n: XmlElement) => T): T[] | undefined => {
      const items = childrenOf(node, tag).map(fn);
      return items.length ? items : undefined;
    };
    return new Attributes({
      divisions: numText(node, 'divisions'),
      keys: list('key', Key.fromXmlElement),
      times: list('time', Time.fromXmlElement),
      staves: numText(node, 'staves'),
      partSymbol: partSymbol ? PartSymbol.fromXmlElement(partSymbol) : undefined,
      instruments: numText(node, 'instruments'),
      clefs: list('clef', Clef.fromXmlElement),
      staffDetails: list('staff-details', StaffDetails.fromXmlElement),
      transposes: list('transpose', Transpose.fromXmlElement),
    });
  }

  static toXmlElement(a: Attributes): XmlElement {
    const c: XmlElement[] = [];
    if (a.divisions !== undefined) c.push(textEl('divisions', a.divisions));
    for (const k of a.keys ?? []) c.push(Key.toXmlElement(k));
    for (const t of a.times ?? []) c.push(Time.toXmlElement(t));
    if (a.staves !== undefined) c.push(textEl('staves', a.staves));
    if (a.partSymbol !== undefined) c.push(PartSymbol.toXmlElement(a.partSymbol));
    if (a.instruments !== undefined) c.push(textEl('instruments', a.instruments));
    for (const clef of a.clefs ?? []) c.push(Clef.toXmlElement(clef));
    for (const sd of a.staffDetails ?? []) c.push(StaffDetails.toXmlElement(sd));
    for (const tr of a.transposes ?? []) c.push(Transpose.toXmlElement(tr));
    return el('attributes', c);
  }
}
