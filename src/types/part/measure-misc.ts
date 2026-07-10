/**
 * Misc measure-content elements: grouping, link, listening.
 * @see musicxml.xsd "grouping", "link", "listening"
 */

import { attr, childrenOf, el, elementText, type XmlElement } from '../../xml/xml-element';
import type { StartStop } from '../enums';
import { PositionAttrs } from '../common/attribute-groups';
import { PositionFieldBag } from '../common/field-bags';
import { Offset } from './sound';
import type {
  Feature as FeatureShape,
  Grouping as GroupingShape,
  Link as LinkShape,
  Listening as ListeningShape,
  OtherListening as OtherListeningShape,
  Sync as SyncShape,
} from '../part';

function numAttr(node: XmlElement, name: string): number | undefined {
  const v = attr(node, name);
  return v === undefined ? undefined : Number(v);
}

/**
 * The feature type is a part of the grouping element used for musical analysis. The type attribute represents the type of the feature and the element content represents its value. This type is flexible to allow for different analyses.
 * @see musicxml.xsd "feature".
 */
export class Feature implements FeatureShape {
  type?: string;
  value = '';
  constructor(init?: Partial<Feature>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Feature {
    return new Feature({ type: attr(n, 'type'), value: elementText(n) ?? '' });
  }
  static toXmlElement(f: Feature): XmlElement {
    return el('feature', f.value ? [{ '#text': f.value }] : [], { type: f.type });
  }
}

/**
 * The grouping type is used for musical analysis. When the type attribute is "start" or "single", it usually contains one or more feature elements. The number attribute is used for distinguishing between overlapping and hierarchical groupings. The member-of attribute allows for easy distinguishing of what grouping elements are in what hierarchy. Feature elements contained within a "stop" type of grouping may be ignored. This element is flexible to allow for different types of analyses. Future versions of the MusicXML format may add elements that can represent more standardized categories of analysis data, allowing for easier data sharing.
 * @see musicxml.xsd "grouping".
 */
export class Grouping implements GroupingShape {
  type: 'start' | 'stop' | 'single' = 'single';
  number?: string;
  memberOf?: string;
  features?: Feature[];
  id?: string;
  constructor(init?: Partial<Grouping>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Grouping {
    const features = childrenOf(n, 'feature').map(Feature.fromXmlElement);
    return new Grouping({
      type: (attr(n, 'type') as Grouping['type']) ?? 'single',
      number: attr(n, 'number'),
      memberOf: attr(n, 'member-of'),
      features: features.length ? features : undefined,
      id: attr(n, 'id'),
    });
  }
  static toXmlElement(g: Grouping): XmlElement {
    const c: XmlElement[] = (g.features ?? []).map(Feature.toXmlElement);
    return el('grouping', c, { type: g.type, number: g.number, 'member-of': g.memberOf, id: g.id });
  }
}

/**
 * The link type serves as an outgoing simple XLink. If a relative link is used within a document that is part of a compressed MusicXML file, the link is relative to the root folder of the zip file.
 * @see musicxml.xsd "link".
 */
export class Link extends PositionFieldBag implements LinkShape {
  href = '';
  type?: 'simple';
  role?: string;
  title?: string;
  show?: 'new' | 'replace' | 'embed' | 'other' | 'none';
  actuate?: 'onRequest' | 'onLoad' | 'other' | 'none';
  name?: string;
  element?: string;
  position?: number;
  id?: string;
  constructor(init?: Partial<Link>) { super(); if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Link {
    return new Link({
      href: attr(n, 'xlink:href') ?? '',
      type: attr(n, 'xlink:type') as 'simple' | undefined,
      role: attr(n, 'xlink:role'),
      title: attr(n, 'xlink:title'),
      show: attr(n, 'xlink:show') as Link['show'],
      actuate: attr(n, 'xlink:actuate') as Link['actuate'],
      name: attr(n, 'name'),
      element: attr(n, 'element'),
      position: numAttr(n, 'position'),
      ...PositionAttrs.read(n),
      id: attr(n, 'id'),
    });
  }
  static toXmlElement(l: Link): XmlElement {
    return el('link', [], {
      'xlink:href': l.href,
      'xlink:type': l.type,
      'xlink:role': l.role,
      'xlink:title': l.title,
      'xlink:show': l.show,
      'xlink:actuate': l.actuate,
      name: l.name,
      element: l.element,
      position: l.position,
      ...PositionAttrs.attrs(l),
      id: l.id,
    });
  }
}

/**
 * The sync type specifies the style that a score following application should use the synchronize an accompaniment with a performer. If this type is not included in a score, default synchronization depends on the application. The optional latency attribute specifies a time in milliseconds that the listening application should expect from the performer. The optional player and time-only attributes restrict the element to apply to a single player or set of times through a repeated section, respectively.
 * @see musicxml.xsd "sync".
 */
export class Sync implements SyncShape {
  type: StartStop = 'start' as StartStop;
  latency?: number;
  player?: string;
  timeOnly?: string;
  constructor(init?: Partial<Sync>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Sync {
    return new Sync({ type: (attr(n, 'type') ?? 'start') as StartStop, latency: numAttr(n, 'latency'), player: attr(n, 'player'), timeOnly: attr(n, 'time-only') });
  }
  static toXmlElement(s: Sync): XmlElement {
    return el('sync', [], { type: s.type, latency: s.latency, player: s.player, 'time-only': s.timeOnly });
  }
}

/**
 * The other-listening type represents other types of listening control and interaction. The required type attribute indicates the type of listening to which the element content applies. The optional player and time-only attributes restrict the element to apply to a single player or set of times through a repeated section, respectively.
 * @see musicxml.xsd "other-listening".
 */
export class OtherListening implements OtherListeningShape {
  type = '';
  player?: string;
  timeOnly?: string;
  value = '';
  constructor(init?: Partial<OtherListening>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): OtherListening {
    return new OtherListening({ type: attr(n, 'type') ?? '', player: attr(n, 'player'), timeOnly: attr(n, 'time-only'), value: elementText(n) ?? '' });
  }
  static toXmlElement(o: OtherListening): XmlElement {
    return el('other-listening', o.value ? [{ '#text': o.value }] : [], { type: o.type, player: o.player, 'time-only': o.timeOnly });
  }
}

/**
 * The listen and listening types, new in Version 4.0, specify different ways that a score following or machine listening application can interact with a performer. The listening type handles interactions that change the state of the listening application from the specified point in the performance onward. If multiple child elements of the same type are present, they should have distinct player and/or time-only attributes. The offset element is used to indicate that the listening change takes place offset from the current score position. If the listening element is a child of a direction element, the listening offset element overrides the direction offset element if both elements are present. Note that the offset reflects the intended musical position for the change in state. It should not be used to compensate for latency issues in particular hardware configurations.
 * @see musicxml.xsd "listening".
 */
export class Listening implements ListeningShape {
  sync?: Sync;
  otherListening?: OtherListening;
  offset?: Offset;
  constructor(init?: Partial<Listening>) { if (init) Object.assign(this, init); }
  static fromXmlElement(n: XmlElement): Listening {
    const sync = childrenOf(n, 'sync')[0];
    const other = childrenOf(n, 'other-listening')[0];
    const offset = childrenOf(n, 'offset')[0];
    return new Listening({
      sync: sync ? Sync.fromXmlElement(sync) : undefined,
      otherListening: other ? OtherListening.fromXmlElement(other) : undefined,
      offset: offset ? Offset.fromXmlElement(offset) : undefined,
    });
  }
  static toXmlElement(l: Listening): XmlElement {
    const c: XmlElement[] = [];
    if (l.sync) c.push(Sync.toXmlElement(l.sync));
    if (l.otherListening) c.push(OtherListening.toXmlElement(l.otherListening));
    if (l.offset) c.push(Offset.toXmlElement(l.offset));
    return el('listening', c);
  }
}
