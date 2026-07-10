/**
 * part-symbol — bracket/brace spanning a multi-staff part.
 * @see musicxml.xsd complexType "part-symbol"
 *   value (group-symbol-value-like); @top-staff, @bottom-staff, position, color
 */

import { attr, el, elementText, type XmlElement } from '../../xml/xml-element';
import { ColorAttrs, PositionAttrs } from '../common/attribute-groups';
import type { PartSymbolShape } from '../part';

/** The part-symbol type indicates how a symbol for a multi-staff part is indicated in the score; brace is the default value. The top-staff and bottom-staff attributes are used when the brace does not extend across the entire part. For example, in a 3-staff organ part, the top-staff will typically be 1 for the right hand, while the bottom-staff will typically be 2 for the left hand. Staff 3 for the pedals is usually outside the brace. By default, the presence of a part-symbol element that does not extend across the entire part also indicates a corresponding change in the common barlines within a part. */
export class PartSymbol implements PartSymbolShape {
  value: PartSymbolShape['value'] = 'none';
  topStaff?: number;
  bottomStaff?: number;
  // position + color
  defaultX?: number;
  defaultY?: number;
  relativeX?: number;
  relativeY?: number;
  color?: string;

  constructor(init?: Partial<PartSymbol>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): PartSymbol {
    const top = attr(node, 'top-staff');
    const bottom = attr(node, 'bottom-staff');
    return new PartSymbol({
      value: (elementText(node) ?? 'none') as PartSymbolShape['value'],
      topStaff: top === undefined ? undefined : Number(top),
      bottomStaff: bottom === undefined ? undefined : Number(bottom),
      ...PositionAttrs.read(node),
      ...ColorAttrs.read(node),
    });
  }

  static toXmlElement(ps: PartSymbol): XmlElement {
    return el('part-symbol', [{ '#text': ps.value }], {
      'top-staff': ps.topStaff,
      'bottom-staff': ps.bottomStaff,
      ...PositionAttrs.attrs(ps),
      ...ColorAttrs.attrs(ps),
    });
  }
}
