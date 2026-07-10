/**
 * Standalone notation leaves: dynamics, fermata, arpeggiate, non-arpeggiate,
 * other-notation.
 * @see musicxml.xsd "dynamics", "fermata", "arpeggiate", "non-arpeggiate", "other-notation"
 */

import { allChildren, attr, el, elementText, tagOf, type XmlElement } from '../../xml/xml-element';
import { DynamicsValue, StartStopContinue, UprightInverted } from '../enums';
import type { AboveBelow, FermataShape, NumberLevel, YesNo } from '../enums';
import type { Color, Font, SmuflGlyphName, Tenths } from '../common';
import { asEnum, ColorAttrs, PlacementAttrs, PositionAttrs, PrintStyleAlignAttrs, PrintStyleAttrs } from '../common/attribute-groups';
import type {
  Arpeggiate as ArpeggiateShape,
  Dynamics as DynamicsShape,
  Fermata as FermataElementShape,
  NonArpeggiate as NonArpeggiateShape,
  OtherDynamics as OtherDynamicsShape,
  OtherNotation as OtherNotationShape,
} from '../note';

/** @see musicxml.xsd "other-dynamics" (other-text). */
export class OtherDynamics implements OtherDynamicsShape {
  value = '';
  smufl?: SmuflGlyphName;
  constructor(init?: Partial<OtherDynamics>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): OtherDynamics {
    return new OtherDynamics({ value: elementText(node) ?? '', smufl: attr(node, 'smufl') });
  }
  static toXmlElement(o: OtherDynamics): XmlElement {
    return el('other-dynamics', o.value ? [{ '#text': o.value }] : [], { smufl: o.smufl });
  }
}

/**
 * Dynamics can be associated either with a note or a general musical direction. To avoid inconsistencies between and amongst the letter abbreviations for dynamics (what is sf vs. sfz, standing alone or with a trailing dynamic that is not always piano), we use the actual letters as the names of these dynamic elements. The other-dynamics element allows other dynamic marks that are not covered here. Dynamics elements may also be combined to create marks not covered by a single element, such as sfmp. These letter dynamic symbols are separated from crescendo, decrescendo, and wedge indications. Dynamic representation is inconsistent in scores. Many things are assumed by the composer and left out, such as returns to original dynamics. The MusicXML format captures what is in the score, but does not try to be optimal for analysis or synthesis of dynamics. The placement attribute is used when the dynamics are associated with a note. It is ignored when the dynamics are associated with a direction. In that case the direction element's placement attribute is used instead.
 * @see musicxml.xsd "dynamics".
 */
export class Dynamics implements DynamicsShape {
  values: (DynamicsValue | OtherDynamics)[] = [];
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  halign?: PrintStyleAlignReturn['halign'];
  valign?: PrintStyleAlignReturn['valign'];
  placement?: AboveBelow;
  id?: string;
  constructor(init?: Partial<Dynamics>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Dynamics {
    const values: (DynamicsValue | OtherDynamics)[] = [];
    for (const child of allChildren(node)) {
      const t = tagOf(child);
      if (t === 'other-dynamics') values.push(OtherDynamics.fromXmlElement(child));
      else {
        const dv = asEnum(DynamicsValue, t);
        if (dv) values.push(dv);
      }
    }
    return new Dynamics({
      values,
      ...PrintStyleAlignAttrs.read(node),
      ...PlacementAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(d: Dynamics): XmlElement {
    const c: XmlElement[] = d.values.map((v) =>
      typeof v === 'string' ? el(v, []) : OtherDynamics.toXmlElement(v),
    );
    return el('dynamics', c, { ...PrintStyleAlignAttrs.attrs(d), ...PlacementAttrs.attrs(d), id: d.id });
  }
}
type PrintStyleAlignReturn = ReturnType<typeof PrintStyleAlignAttrs.read>;

/**
 * The fermata text content represents the shape of the fermata sign. An empty fermata element represents a normal fermata. The fermata type is upright if not specified.
 * @see musicxml.xsd "fermata".
 */
export class Fermata implements FermataElementShape {
  value: FermataShape = 'normal';
  type?: UprightInverted;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  fontFamily?: Font['fontFamily'];
  fontStyle?: Font['fontStyle'];
  fontSize?: Font['fontSize'];
  fontWeight?: Font['fontWeight'];
  color?: Color;
  id?: string;
  constructor(init?: Partial<Fermata>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Fermata {
    return new Fermata({
      value: (elementText(node) ?? 'normal') as FermataShape,
      type: asEnum(UprightInverted, attr(node, 'type')),
      ...PrintStyleAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(f: Fermata): XmlElement {
    return el('fermata', f.value ? [{ '#text': f.value }] : [], { type: f.type, ...PrintStyleAttrs.attrs(f), id: f.id });
  }
}

/**
 * The arpeggiate type indicates that this note is part of an arpeggiated chord. The number attribute can be used to distinguish between two simultaneous chords arpeggiated separately (different numbers) or together (same number). The direction attribute is used if there is an arrow on the arpeggio sign. By default, arpeggios go from the lowest to highest note. The length of the sign can be determined from the position attributes for the arpeggiate elements used with the top and bottom notes of the arpeggiated chord. If the unbroken attribute is set to yes, it indicates that the arpeggio continues onto another staff within the part. This serves as a hint to applications and is not required for cross-staff arpeggios.
 * @see musicxml.xsd "arpeggiate".
 */
export class Arpeggiate implements ArpeggiateShape {
  number?: NumberLevel;
  direction?: 'up' | 'down';
  unbroken?: YesNo;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  placement?: AboveBelow;
  color?: Color;
  id?: string;
  constructor(init?: Partial<Arpeggiate>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): Arpeggiate {
    const num = attr(node, 'number');
    return new Arpeggiate({
      number: num === undefined ? undefined : (Number(num) as NumberLevel),
      direction: attr(node, 'direction') as 'up' | 'down' | undefined,
      unbroken: attr(node, 'unbroken') as YesNo | undefined,
      ...PositionAttrs.read(node),
      ...PlacementAttrs.read(node),
      ...ColorAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(a: Arpeggiate): XmlElement {
    return el('arpeggiate', [], {
      number: a.number,
      direction: a.direction,
      unbroken: a.unbroken,
      ...PositionAttrs.attrs(a),
      ...PlacementAttrs.attrs(a),
      ...ColorAttrs.attrs(a),
      id: a.id,
    });
  }
}

/**
 * The non-arpeggiate type indicates that this note is at the top or bottom of a bracket indicating to not arpeggiate these notes. Since this does not involve playback, it is only used on the top or bottom notes, not on each note as for the arpeggiate type.
 * @see musicxml.xsd "non-arpeggiate".
 */
export class NonArpeggiate implements NonArpeggiateShape {
  type: 'top' | 'bottom' = 'top';
  number?: NumberLevel;
  defaultX?: Tenths;
  defaultY?: Tenths;
  relativeX?: Tenths;
  relativeY?: Tenths;
  placement?: AboveBelow;
  color?: Color;
  id?: string;
  constructor(init?: Partial<NonArpeggiate>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): NonArpeggiate {
    const num = attr(node, 'number');
    return new NonArpeggiate({
      type: (attr(node, 'type') as 'top' | 'bottom') ?? 'top',
      number: num === undefined ? undefined : (Number(num) as NumberLevel),
      ...PositionAttrs.read(node),
      ...PlacementAttrs.read(node),
      ...ColorAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(n: NonArpeggiate): XmlElement {
    return el('non-arpeggiate', [], {
      type: n.type,
      number: n.number,
      ...PositionAttrs.attrs(n),
      ...PlacementAttrs.attrs(n),
      ...ColorAttrs.attrs(n),
      id: n.id,
    });
  }
}

/**
 * The other-notation type is used to define any notations not yet in the MusicXML format. It handles notations where more specific extension elements such as other-dynamics and other-technical are not appropriate. The smufl attribute can be used to specify a particular notation, allowing application interoperability without requiring every SMuFL glyph to have a MusicXML element equivalent. Using the other-notation type without the smufl attribute allows for extended representation, though without application interoperability.
 * @see musicxml.xsd "other-notation".
 */
export class OtherNotation implements OtherNotationShape {
  type: StartStopContinue = StartStopContinue.Start;
  number?: NumberLevel;
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
  constructor(init?: Partial<OtherNotation>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): OtherNotation {
    const num = attr(node, 'number');
    return new OtherNotation({
      type: asEnum(StartStopContinue, attr(node, 'type')) ?? StartStopContinue.Start,
      number: num === undefined ? undefined : (Number(num) as NumberLevel),
      value: elementText(node) ?? '',
      smufl: attr(node, 'smufl'),
      ...PrintStyleAttrs.read(node),
      ...PlacementAttrs.read(node),
      id: attr(node, 'id'),
    });
  }
  static toXmlElement(o: OtherNotation): XmlElement {
    return el('other-notation', o.value ? [{ '#text': o.value }] : [], {
      type: o.type,
      number: o.number,
      smufl: o.smufl,
      ...PrintStyleAttrs.attrs(o),
      ...PlacementAttrs.attrs(o),
      id: o.id,
    });
  }
}
