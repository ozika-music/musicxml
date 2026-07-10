/**
 * transpose — written-vs-sounding transposition for a part.
 * @see musicxml.xsd complexType "transpose"
 *   diatonic?, chromatic, octave-change?, double?; @number, @id
 */

import { attr, childrenOf, el, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import type { TransposeShape } from '../part';

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

/** The transpose type represents what must be added to a written pitch to get a correct sounding pitch. The optional number attribute refers to staff numbers, from top to bottom on the system. If absent, the transposition applies to all staves in the part. Per-staff transposition is most often used in parts that represent multiple instruments. */
export class Transpose implements TransposeShape {
  number?: number;
  diatonic?: number;
  chromatic = 0;
  octaveChange?: number;
  double?: boolean;

  constructor(init?: Partial<Transpose>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Transpose {
    const num = attr(node, 'number');
    return new Transpose({
      number: num === undefined ? undefined : Number(num),
      diatonic: numText(node, 'diatonic'),
      chromatic: numText(node, 'chromatic') ?? 0,
      octaveChange: numText(node, 'octave-change'),
      double: childrenOf(node, 'double').length ? true : undefined,
    });
  }

  static toXmlElement(t: Transpose): XmlElement {
    const c: XmlElement[] = [];
    if (t.diatonic !== undefined) c.push(textEl('diatonic', t.diatonic));
    c.push(textEl('chromatic', t.chromatic));
    if (t.octaveChange !== undefined) c.push(textEl('octave-change', t.octaveChange));
    if (t.double) c.push(el('double', []));
    return el('transpose', c, { number: t.number });
  }
}
