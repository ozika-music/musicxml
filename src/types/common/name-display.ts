/**
 * name-display — exact multi-font formatting for part/group names.
 *
 * @see musicxml.xsd complexType "name-display"
 *   sequence (choice, unbounded):
 *     - display-text   (formatted-text)
 *     - accidental-text (accidental-text)
 *   attributes:
 *     - print-object   (yes-no)
 *
 * First Tier-1 element class: establishes the `fromXmlElement` / `toXmlElement`
 * convention over the shared preserve-order node. NOTE: the deep text-formatting
 * / print-style attributes on display-text / accidental-text are not yet
 * captured (they await the attribute-group convention); the element structure,
 * text, and print-object round-trip.
 */

import { attr, childrenOf, el, elementText, textEl, type XmlElement } from '../../xml/xml-element';
import type { YesNo } from '../enums';
import type { AccidentalText, DisplayText } from '../common';

/** The name-display type is used for exact formatting of multi-font text in part and group names to the left of the system. The print-object attribute can be used to determine what, if anything, is printed at the start of each system. Enclosure for the display-text element is none by default. Language for the display-text element is Italian ("it") by default. */
export class NameDisplay {
  displayText?: DisplayText[];
  accidentalText?: AccidentalText[];
  printObject?: YesNo;

  constructor(init?: Partial<NameDisplay>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): NameDisplay {
    const displayText = childrenOf(node, 'display-text').map((c): DisplayText => ({ value: elementText(c) ?? '' }));
    const accidentalText = childrenOf(node, 'accidental-text').map((c): AccidentalText => ({ value: elementText(c) ?? '' }));
    return new NameDisplay({
      displayText: displayText.length ? displayText : undefined,
      accidentalText: accidentalText.length ? accidentalText : undefined,
      printObject: attr(node, 'print-object') as YesNo | undefined,
    });
  }

  /**
   * Serialize under `tag` (e.g. 'part-name-display', 'group-name-display').
   * Static so serialization tolerates plain-object data, not just instances.
   */
  static toXmlElement(nd: NameDisplay, tag: string): XmlElement {
    const children: XmlElement[] = [];
    for (const d of nd.displayText ?? []) children.push(textEl('display-text', d.value));
    for (const a of nd.accidentalText ?? []) children.push(textEl('accidental-text', a.value));
    return el(tag, children, { 'print-object': nd.printObject });
  }
}
