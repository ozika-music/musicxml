/**
 * staff-details — staff configuration (lines, tuning, capo, size).
 * @see musicxml.xsd complexType "staff-details"
 *   staff-type?, staff-lines?, line-detail*, staff-tuning*, capo?, staff-size?;
 *   @number, @show-frets, @print-object, @print-spacing
 *
 * `lineDetails` is retained on the model but not yet serialized (deep sub-type);
 * the legacy serializer also dropped it, so no regression.
 */

import { attr, childrenOf, el, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import { ShowFrets, StaffType, type YesNo } from '../enums';
import { asEnum } from '../common/attribute-groups';
import type { LineDetail, StaffDetailsShape, StaffTuning } from '../part';

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

/** The staff-details element is used to indicate different types of staves. The optional number attribute specifies the staff number from top to bottom on the system, as with clef. The print-object attribute is used to indicate when a staff is not printed in a part, usually in large scores where empty parts are omitted. It is yes by default. If print-spacing is yes while print-object is no, the score is printed in cutaway format where vertical space is left for the empty part. */
export class StaffDetails implements StaffDetailsShape {
  number?: number;
  showFrets?: ShowFrets;
  printSpacing?: YesNo;
  printObject?: YesNo;
  staffType?: StaffType;
  staffLines?: number;
  lineDetails?: LineDetail[];
  staffTunings?: StaffTuning[];
  capo?: number;
  staffSize?: number;

  constructor(init?: Partial<StaffDetails>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): StaffDetails {
    const num = attr(node, 'number');
    const staffTunings = childrenOf(node, 'staff-tuning').map(
      (st): StaffTuning => ({
        line: Number(attr(st, 'line') ?? '0'),
        tuningStep: textOf(st, 'tuning-step') ?? '',
        tuningAlter: numText(st, 'tuning-alter'),
        tuningOctave: numText(st, 'tuning-octave') ?? 0,
      }),
    );
    return new StaffDetails({
      number: num === undefined ? undefined : Number(num),
      showFrets: asEnum(ShowFrets, attr(node, 'show-frets')),
      printSpacing: attr(node, 'print-spacing') as YesNo | undefined,
      printObject: attr(node, 'print-object') as YesNo | undefined,
      staffType: asEnum(StaffType, textOf(node, 'staff-type')),
      staffLines: numText(node, 'staff-lines'),
      staffTunings: staffTunings.length ? staffTunings : undefined,
      capo: numText(node, 'capo'),
      staffSize: numText(node, 'staff-size'),
    });
  }

  static toXmlElement(sd: StaffDetails): XmlElement {
    const c: XmlElement[] = [];
    if (sd.staffType !== undefined) c.push(textEl('staff-type', sd.staffType));
    if (sd.staffLines !== undefined) c.push(textEl('staff-lines', sd.staffLines));
    for (const st of sd.staffTunings ?? []) {
      const stc: XmlElement[] = [textEl('tuning-step', st.tuningStep)];
      if (st.tuningAlter !== undefined) stc.push(textEl('tuning-alter', st.tuningAlter));
      stc.push(textEl('tuning-octave', st.tuningOctave));
      c.push(el('staff-tuning', stc, { line: st.line }));
    }
    if (sd.capo !== undefined) c.push(textEl('capo', sd.capo));
    if (sd.staffSize !== undefined) c.push(textEl('staff-size', sd.staffSize));
    return el('staff-details', c, {
      number: sd.number,
      'show-frets': sd.showFrets,
      'print-object': sd.printObject,
      'print-spacing': sd.printSpacing,
    });
  }
}
