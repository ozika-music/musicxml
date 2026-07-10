/**
 * work — identifies the work (e.g. opus/movement context).
 * @see musicxml.xsd complexType "work" — work-number?, work-title?, opus?
 *   opus = link-attributes (xlink:href, …)
 */

import { attr, childrenOf, el, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import type { Opus } from '../score';

/** Works are optionally identified by number and title. The work type also may indicate a link to the opus document that composes multiple scores into a collection. */
export class Work {
  workNumber?: string;
  workTitle?: string;
  opus?: Opus;

  constructor(init?: Partial<Work>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Work {
    const opusEl = childrenOf(node, 'opus')[0];
    return new Work({
      workNumber: textOf(node, 'work-number'),
      workTitle: textOf(node, 'work-title'),
      opus: opusEl ? ({ href: attr(opusEl, 'xlink:href') ?? '' } as Opus) : undefined,
    });
  }

  static toXmlElement(work: Work): XmlElement {
    const c: XmlElement[] = [];
    if (work.workNumber !== undefined) c.push(textEl('work-number', work.workNumber));
    if (work.workTitle !== undefined) c.push(textEl('work-title', work.workTitle));
    if (work.opus) c.push(el('opus', [], { 'xlink:href': work.opus.href }));
    return el('work', c);
  }
}
