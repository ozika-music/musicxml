/**
 * Notations container — aggregates every notation child element.
 * @see musicxml.xsd "notations"
 *
 * NOTE: the XSD allows the notation children to interleave freely in document
 * order; the TS model groups them into per-kind arrays, so serialization emits
 * them in a fixed XSD-declaration order. The optional editorial footnote/level
 * are carried on the type but not yet serialized (FormattedText/Level are not
 * class-migrated yet) — matching prior serializer behavior.
 */

import { attr, childrenOf, el, type XmlElement } from '../../xml/xml-element';
import type { YesNo } from '../enums';
import type { Editorial } from '../common';
import { AccidentalMark } from './accidental-mark';
import { Articulations } from './articulations';
import { Glissando, Slide } from './notations-lines';
import { Arpeggiate, Dynamics, Fermata, NonArpeggiate, OtherNotation } from './notations-misc';
import { Ornaments } from './ornaments';
import { Slur, Tied } from './notations-curves';
import { Technical } from './technical';
import { Tuplet } from './tuplet';
import type { Notations as NotationsShape } from '../note';

/**
 * Notations refer to musical notations, not XML notations. Multiple notations are allowed in order to represent multiple editorial levels. The print-object attribute, added in Version 3.0, allows notations to represent details of performance technique, such as fingerings, without having them appear in the score.
 * @see musicxml.xsd "notations".
 */
export class Notations implements NotationsShape {
  tieds?: Tied[];
  slurs?: Slur[];
  tuplets?: Tuplet[];
  glissandos?: Glissando[];
  slides?: Slide[];
  ornaments?: Ornaments[];
  technicals?: Technical[];
  articulations?: Articulations[];
  dynamics?: Dynamics[];
  fermatas?: Fermata[];
  arpeggiate?: Arpeggiate;
  nonArpeggiate?: NonArpeggiate;
  accidentalMarks?: AccidentalMark[];
  otherNotations?: OtherNotation[];
  // Editorial (carried, not yet serialized).
  footnote?: Editorial['footnote'];
  level?: Editorial['level'];
  printObject?: YesNo;
  id?: string;

  constructor(init?: Partial<Notations>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Notations {
    const many = <T>(tag: string, f: (n: XmlElement) => T): T[] | undefined => {
      const arr = childrenOf(node, tag).map(f);
      return arr.length ? arr : undefined;
    };
    const arp = childrenOf(node, 'arpeggiate')[0];
    const nonArp = childrenOf(node, 'non-arpeggiate')[0];
    return new Notations({
      tieds: many('tied', Tied.fromXmlElement),
      slurs: many('slur', Slur.fromXmlElement),
      tuplets: many('tuplet', Tuplet.fromXmlElement),
      glissandos: many('glissando', Glissando.fromXmlElement),
      slides: many('slide', Slide.fromXmlElement),
      ornaments: many('ornaments', Ornaments.fromXmlElement),
      technicals: many('technical', Technical.fromXmlElement),
      articulations: many('articulations', Articulations.fromXmlElement),
      dynamics: many('dynamics', Dynamics.fromXmlElement),
      fermatas: many('fermata', Fermata.fromXmlElement),
      arpeggiate: arp ? Arpeggiate.fromXmlElement(arp) : undefined,
      nonArpeggiate: nonArp ? NonArpeggiate.fromXmlElement(nonArp) : undefined,
      accidentalMarks: many('accidental-mark', AccidentalMark.fromXmlElement),
      otherNotations: many('other-notation', OtherNotation.fromXmlElement),
      printObject: attr(node, 'print-object') as YesNo | undefined,
      id: attr(node, 'id'),
    });
  }

  static toXmlElement(n: Notations): XmlElement {
    const c: XmlElement[] = [];
    for (const t of n.tieds ?? []) c.push(Tied.toXmlElement(t));
    for (const s of n.slurs ?? []) c.push(Slur.toXmlElement(s));
    for (const t of n.tuplets ?? []) c.push(Tuplet.toXmlElement(t));
    for (const g of n.glissandos ?? []) c.push(Glissando.toXmlElement(g));
    for (const s of n.slides ?? []) c.push(Slide.toXmlElement(s));
    for (const o of n.ornaments ?? []) c.push(Ornaments.toXmlElement(o));
    for (const t of n.technicals ?? []) c.push(Technical.toXmlElement(t));
    for (const a of n.articulations ?? []) c.push(Articulations.toXmlElement(a));
    for (const d of n.dynamics ?? []) c.push(Dynamics.toXmlElement(d));
    for (const f of n.fermatas ?? []) c.push(Fermata.toXmlElement(f));
    if (n.arpeggiate) c.push(Arpeggiate.toXmlElement(n.arpeggiate));
    if (n.nonArpeggiate) c.push(NonArpeggiate.toXmlElement(n.nonArpeggiate));
    for (const m of n.accidentalMarks ?? []) c.push(AccidentalMark.toXmlElement(m));
    for (const o of n.otherNotations ?? []) c.push(OtherNotation.toXmlElement(o));
    return el('notations', c, { 'print-object': n.printObject, id: n.id });
  }
}
