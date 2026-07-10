/**
 * Articulations container + its non-empty leaves.
 * @see musicxml.xsd "articulations", "strong-accent", "breath-mark", "caesura", "other-articulation"
 */

import { attr, childrenOf, el, elementText, type XmlElement } from '../../xml/xml-element';
import type { AboveBelow, BreathMarkValue, CaesuraValue } from '../enums';
import type { Color, Font, SmuflGlyphName, Tenths } from '../common';
import { PlacementAttrs, PrintStyleAttrs } from '../common/attribute-groups';
import { EmptyLine, EmptyPlacement } from './notations-empty';
import type {
  Articulations as ArticulationsShape,
  BreathMark as BreathMarkShape,
  Caesura as CaesuraShape,
  OtherArticulation as OtherArticulationShape,
  StrongAccent as StrongAccentShape,
} from '../note';

type PrintStylePlacement = {
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  placement?: AboveBelow;
  id?: string;
};

function readPsp(node: XmlElement): PrintStylePlacement {
  return { ...PrintStyleAttrs.read(node), ...PlacementAttrs.read(node), id: attr(node, 'id') };
}
function pspAttrs(o: PrintStylePlacement) {
  return { ...PrintStyleAttrs.attrs(o), ...PlacementAttrs.attrs(o), id: o.id };
}

/**
 * The strong-accent type indicates a vertical accent mark. The type attribute indicates if the point of the accent is down or up.
 * @see musicxml.xsd "strong-accent".
 */
export class StrongAccent implements StrongAccentShape, PrintStylePlacement {
  type?: 'up' | 'down';
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  placement?: AboveBelow;
  id?: string;
  constructor(init?: Partial<StrongAccent>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): StrongAccent {
    return new StrongAccent({ type: attr(node, 'type') as 'up' | 'down' | undefined, ...readPsp(node) });
  }
  static toXmlElement(s: StrongAccent): XmlElement {
    return el('strong-accent', [], { type: s.type, ...pspAttrs(s) });
  }
}

/**
 * The breath-mark element indicates a place to take a breath.
 * @see musicxml.xsd "breath-mark".
 */
export class BreathMark implements BreathMarkShape, PrintStylePlacement {
  value: BreathMarkValue = '';
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  placement?: AboveBelow;
  id?: string;
  constructor(init?: Partial<BreathMark>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): BreathMark {
    return new BreathMark({ value: (elementText(node) ?? '') as BreathMarkValue, ...readPsp(node) });
  }
  static toXmlElement(b: BreathMark): XmlElement {
    return el('breath-mark', b.value ? [{ '#text': b.value }] : [], pspAttrs(b));
  }
}

/**
 * The caesura element indicates a slight pause. It is notated using a "railroad tracks" symbol or other variations specified in the element content.
 * @see musicxml.xsd "caesura".
 */
export class Caesura implements CaesuraShape, PrintStylePlacement {
  value: CaesuraValue = '';
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  placement?: AboveBelow;
  id?: string;
  constructor(init?: Partial<Caesura>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Caesura {
    return new Caesura({ value: (elementText(node) ?? '') as CaesuraValue, ...readPsp(node) });
  }
  static toXmlElement(c: Caesura): XmlElement {
    return el('caesura', c.value ? [{ '#text': c.value }] : [], pspAttrs(c));
  }
}

/** @see musicxml.xsd "other-articulation" (other-placement-text). */
export class OtherArticulation implements OtherArticulationShape, PrintStylePlacement {
  value = '';
  smufl?: SmuflGlyphName;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  placement?: AboveBelow;
  id?: string;
  constructor(init?: Partial<OtherArticulation>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): OtherArticulation {
    return new OtherArticulation({ value: elementText(node) ?? '', smufl: attr(node, 'smufl'), ...readPsp(node) });
  }
  static toXmlElement(o: OtherArticulation): XmlElement {
    return el('other-articulation', o.value ? [{ '#text': o.value }] : [], { smufl: o.smufl, ...pspAttrs(o) });
  }
}

/** EmptyPlacement-typed articulation fields, in XSD sequence order. */
const EMPTY_PLACEMENT_FIELDS: ReadonlyArray<[keyof ArticulationsShape, string]> = [
  ['accent', 'accent'],
  ['staccato', 'staccato'],
  ['tenuto', 'tenuto'],
  ['detachedLegato', 'detached-legato'],
  ['staccatissimo', 'staccatissimo'],
  ['spiccato', 'spiccato'],
  ['stress', 'stress'],
  ['unstress', 'unstress'],
  ['softAccent', 'soft-accent'],
];
const EMPTY_LINE_FIELDS: ReadonlyArray<[keyof ArticulationsShape, string]> = [
  ['scoop', 'scoop'],
  ['plop', 'plop'],
  ['doit', 'doit'],
  ['falloff', 'falloff'],
];

/**
 * Articulations and accents are grouped together here.
 * @see musicxml.xsd "articulations".
 */
export class Articulations implements ArticulationsShape {
  accent?: EmptyPlacement;
  strongAccent?: StrongAccent;
  staccato?: EmptyPlacement;
  tenuto?: EmptyPlacement;
  detachedLegato?: EmptyPlacement;
  staccatissimo?: EmptyPlacement;
  spiccato?: EmptyPlacement;
  scoop?: EmptyLine;
  plop?: EmptyLine;
  doit?: EmptyLine;
  falloff?: EmptyLine;
  breathMark?: BreathMark;
  caesura?: Caesura;
  stress?: EmptyPlacement;
  unstress?: EmptyPlacement;
  softAccent?: EmptyPlacement;
  otherArticulation?: OtherArticulation;
  id?: string;
  constructor(init?: Partial<Articulations>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Articulations {
    const a = new Articulations({ id: attr(node, 'id') });
    for (const [field, tag] of EMPTY_PLACEMENT_FIELDS) {
      const c = childrenOf(node, tag)[0];
      if (c) (a as Record<string, unknown>)[field] = EmptyPlacement.fromXmlElement(c);
    }
    for (const [field, tag] of EMPTY_LINE_FIELDS) {
      const c = childrenOf(node, tag)[0];
      if (c) (a as Record<string, unknown>)[field] = EmptyLine.fromXmlElement(c);
    }
    const sa = childrenOf(node, 'strong-accent')[0];
    if (sa) a.strongAccent = StrongAccent.fromXmlElement(sa);
    const bm = childrenOf(node, 'breath-mark')[0];
    if (bm) a.breathMark = BreathMark.fromXmlElement(bm);
    const ca = childrenOf(node, 'caesura')[0];
    if (ca) a.caesura = Caesura.fromXmlElement(ca);
    const oa = childrenOf(node, 'other-articulation')[0];
    if (oa) a.otherArticulation = OtherArticulation.fromXmlElement(oa);
    return a;
  }

  static toXmlElement(a: Articulations): XmlElement {
    const c: XmlElement[] = [];
    const push = (v: EmptyPlacement | undefined, tag: string) => {
      if (v) c.push(EmptyPlacement.toXmlElement(v, tag));
    };
    // XSD sequence order: accent, strong-accent, staccato, tenuto, detached-legato,
    // staccatissimo, spiccato, scoop, plop, doit, falloff, breath-mark, caesura,
    // stress, unstress, soft-accent, other-articulation.
    push(a.accent, 'accent');
    if (a.strongAccent) c.push(StrongAccent.toXmlElement(a.strongAccent));
    push(a.staccato, 'staccato');
    push(a.tenuto, 'tenuto');
    push(a.detachedLegato, 'detached-legato');
    push(a.staccatissimo, 'staccatissimo');
    push(a.spiccato, 'spiccato');
    if (a.scoop) c.push(EmptyLine.toXmlElement(a.scoop, 'scoop'));
    if (a.plop) c.push(EmptyLine.toXmlElement(a.plop, 'plop'));
    if (a.doit) c.push(EmptyLine.toXmlElement(a.doit, 'doit'));
    if (a.falloff) c.push(EmptyLine.toXmlElement(a.falloff, 'falloff'));
    if (a.breathMark) c.push(BreathMark.toXmlElement(a.breathMark));
    if (a.caesura) c.push(Caesura.toXmlElement(a.caesura));
    push(a.stress, 'stress');
    push(a.unstress, 'unstress');
    push(a.softAccent, 'soft-accent');
    if (a.otherArticulation) c.push(OtherArticulation.toXmlElement(a.otherArticulation));
    return el('articulations', c, { id: a.id });
  }
}
