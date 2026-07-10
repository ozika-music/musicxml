/**
 * Layout elements shared by defaults and print.
 * @see musicxml.xsd "page-layout", "system-layout", "staff-layout",
 *      "measure-layout", "measure-numbering"
 */

import { attr, childrenOf, el, elementText, textEl, textOf, type XmlElement } from '../../xml/xml-element';
import type { Tenths } from '../common';
import type { YesNo } from '../enums';
import { PrintStyleAlignAttrs } from '../common/attribute-groups';
import { PrintStyleAlignFieldBag } from '../common/field-bags';
import type {
  MeasureLayout as MeasureLayoutShape,
  MeasureNumbering as MeasureNumberingShape,
  PageLayout as PageLayoutShape,
  PageMargins,
  StaffLayout as StaffLayoutShape,
  SystemDividers,
  SystemLayout as SystemLayoutShape,
  SystemMargins,
} from '../score';

function numText(node: XmlElement, tag: string): number | undefined {
  const t = textOf(node, tag);
  return t === undefined ? undefined : Number(t);
}

/**
 * Page layout can be defined both in score-wide defaults and in the print element. Page margins are specified either for both even and odd pages, or via separate odd and even page number values. The type is not needed when used as part of a print element. If omitted when used in the defaults element, "both" is the default. If no page-layout element is present in the defaults element, default page layout values are chosen by the application. When used in the print element, the page-layout element affects the appearance of the current page only. All other pages use the default values as determined by the defaults element. If any child elements are missing from the page-layout element in a print element, the values determined by the defaults element are used there as well.
 * @see musicxml.xsd "page-layout".
 */
export class PageLayout implements PageLayoutShape {
  pageHeight?: Tenths;
  pageWidth?: Tenths;
  pageMargins?: PageMargins[];
  constructor(init?: Partial<PageLayout>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): PageLayout {
    const pageMargins = childrenOf(node, 'page-margins').map(
      (pm): PageMargins => ({
        type: attr(pm, 'type') as PageMargins['type'],
        leftMargin: numText(pm, 'left-margin') ?? 0,
        rightMargin: numText(pm, 'right-margin') ?? 0,
        topMargin: numText(pm, 'top-margin') ?? 0,
        bottomMargin: numText(pm, 'bottom-margin') ?? 0,
      }),
    );
    return new PageLayout({
      pageHeight: numText(node, 'page-height'),
      pageWidth: numText(node, 'page-width'),
      pageMargins: pageMargins.length ? pageMargins : undefined,
    });
  }
  static toXmlElement(pl: PageLayout): XmlElement {
    const c: XmlElement[] = [];
    if (pl.pageHeight !== undefined) c.push(textEl('page-height', pl.pageHeight));
    if (pl.pageWidth !== undefined) c.push(textEl('page-width', pl.pageWidth));
    for (const pm of pl.pageMargins ?? []) {
      c.push(
        el('page-margins', [
          textEl('left-margin', pm.leftMargin),
          textEl('right-margin', pm.rightMargin),
          textEl('top-margin', pm.topMargin),
          textEl('bottom-margin', pm.bottomMargin),
        ], { type: pm.type }),
      );
    }
    return el('page-layout', c);
  }
}

/**
 * A system is a group of staves that are read and played simultaneously. System layout includes left and right margins and the vertical distance from the previous system. The system distance is measured from the bottom line of the previous system to the top line of the current system. It is ignored for the first system on a page. The top system distance is measured from the page's top margin to the top line of the first system. It is ignored for all but the first system on a page. Sometimes the sum of measure widths in a system may not equal the system width specified by the layout elements due to roundoff or other errors. The behavior when reading MusicXML files in these cases is application-dependent. For instance, applications may find that the system layout data is more reliable than the sum of the measure widths, and adjust the measure widths accordingly. When used in the defaults element, the system-layout element defines a default appearance for all systems in the score. If no system-layout element is present in the defaults element, default system layout values are chosen by the application. When used in the print element, the system-layout element affects the appearance of the current system only. All other systems use the default values as determined by the defaults element. If any child elements are missing from the system-layout element in a print element, the values determined by the defaults element are used there as well. This type of system-layout element need only be read from or written to the first visible part in the score.
 * @see musicxml.xsd "system-layout".
 */
export class SystemLayout implements SystemLayoutShape {
  systemMargins?: SystemMargins;
  systemDistance?: Tenths;
  topSystemDistance?: Tenths;
  systemDividers?: SystemDividers;
  constructor(init?: Partial<SystemLayout>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): SystemLayout {
    const margins = childrenOf(node, 'system-margins')[0];
    const dividers = childrenOf(node, 'system-dividers')[0];
    return new SystemLayout({
      systemMargins: margins
        ? { leftMargin: numText(margins, 'left-margin') ?? 0, rightMargin: numText(margins, 'right-margin') ?? 0 }
        : undefined,
      systemDistance: numText(node, 'system-distance'),
      topSystemDistance: numText(node, 'top-system-distance'),
      systemDividers: dividers
        ? {
            leftDivider: childrenOf(dividers, 'left-divider')[0] ? { ...PrintStyleAlignAttrs.read(childrenOf(dividers, 'left-divider')[0]), printObject: attr(childrenOf(dividers, 'left-divider')[0], 'print-object') as YesNo | undefined } : undefined,
            rightDivider: childrenOf(dividers, 'right-divider')[0] ? { ...PrintStyleAlignAttrs.read(childrenOf(dividers, 'right-divider')[0]), printObject: attr(childrenOf(dividers, 'right-divider')[0], 'print-object') as YesNo | undefined } : undefined,
          }
        : undefined,
    });
  }
  static toXmlElement(sl: SystemLayout): XmlElement {
    const c: XmlElement[] = [];
    if (sl.systemMargins) {
      c.push(el('system-margins', [textEl('left-margin', sl.systemMargins.leftMargin), textEl('right-margin', sl.systemMargins.rightMargin)]));
    }
    if (sl.systemDistance !== undefined) c.push(textEl('system-distance', sl.systemDistance));
    if (sl.topSystemDistance !== undefined) c.push(textEl('top-system-distance', sl.topSystemDistance));
    if (sl.systemDividers) {
      const dc: XmlElement[] = [];
      if (sl.systemDividers.leftDivider) dc.push(el('left-divider', [], { ...PrintStyleAlignAttrs.attrs(sl.systemDividers.leftDivider), 'print-object': sl.systemDividers.leftDivider.printObject }));
      if (sl.systemDividers.rightDivider) dc.push(el('right-divider', [], { ...PrintStyleAlignAttrs.attrs(sl.systemDividers.rightDivider), 'print-object': sl.systemDividers.rightDivider.printObject }));
      c.push(el('system-dividers', dc));
    }
    return el('system-layout', c);
  }
}

/**
 * Staff layout includes the vertical distance from the bottom line of the previous staff in this system to the top line of the staff specified by the number attribute. The optional number attribute refers to staff numbers within the part, from top to bottom on the system. A value of 1 is used if not present. When used in the defaults element, the values apply to all systems in all parts. When used in the print element, the values apply to the current system only. This value is ignored for the first staff in a system.
 * @see musicxml.xsd "staff-layout".
 */
export class StaffLayout implements StaffLayoutShape {
  number?: number;
  staffDistance?: Tenths;
  constructor(init?: Partial<StaffLayout>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): StaffLayout {
    return new StaffLayout({
      number: attr(node, 'number') ? Number(attr(node, 'number')) : undefined,
      staffDistance: numText(node, 'staff-distance'),
    });
  }
  static toXmlElement(sl: StaffLayout): XmlElement {
    return el('staff-layout', sl.staffDistance !== undefined ? [textEl('staff-distance', sl.staffDistance)] : [], { number: sl.number });
  }
}

/**
 * The measure-layout type includes the horizontal distance from the previous measure. It applies to the current measure only.
 * @see musicxml.xsd "measure-layout".
 */
export class MeasureLayout implements MeasureLayoutShape {
  measureDistance?: Tenths;
  constructor(init?: Partial<MeasureLayout>) {
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): MeasureLayout {
    return new MeasureLayout({ measureDistance: numText(node, 'measure-distance') });
  }
  static toXmlElement(ml: MeasureLayout): XmlElement {
    return el('measure-layout', ml.measureDistance !== undefined ? [textEl('measure-distance', ml.measureDistance)] : []);
  }
}

/**
 * The measure-numbering type describes how frequently measure numbers are displayed on this part. The text attribute from the measure element is used for display, or the number attribute if the text attribute is not present. Measures with an implicit attribute set to "yes" never display a measure number, regardless of the measure-numbering setting. The optional staff attribute refers to staff numbers within the part, from top to bottom on the system. It indicates which staff is used as the reference point for vertical positioning. A value of 1 is assumed if not present. The optional multiple-rest-always and multiple-rest-range attributes describe how measure numbers are shown on multiple rests when the measure-numbering value is not set to none. The multiple-rest-always attribute is set to yes when the measure number should always be shown, even if the multiple rest starts midway through a system when measure numbering is set to system level. The multiple-rest-range attribute is set to yes when measure numbers on multiple rests display the range of numbers for the first and last measure, rather than just the number of the first measure.
 * @see musicxml.xsd "measure-numbering".
 */
export class MeasureNumbering extends PrintStyleAlignFieldBag implements MeasureNumberingShape {
  value: 'none' | 'measure' | 'system' = 'none';
  system?: 'only-top' | 'only-bottom' | 'also-top' | 'also-bottom';
  staff?: number;
  multipleRestAlways?: YesNo;
  multipleRestRange?: YesNo;
  constructor(init?: Partial<MeasureNumbering>) {
    super();
    if (init) Object.assign(this, init);
  }
  static fromXmlElement(node: XmlElement): MeasureNumbering {
    return new MeasureNumbering({
      value: (elementText(node) ?? 'none') as MeasureNumbering['value'],
      system: attr(node, 'system') as MeasureNumbering['system'],
      staff: attr(node, 'staff') ? Number(attr(node, 'staff')) : undefined,
      multipleRestAlways: attr(node, 'multiple-rest-always') as YesNo | undefined,
      multipleRestRange: attr(node, 'multiple-rest-range') as YesNo | undefined,
      ...PrintStyleAlignAttrs.read(node),
    });
  }
  static toXmlElement(mn: MeasureNumbering): XmlElement {
    return el('measure-numbering', [{ '#text': mn.value }], {
      system: mn.system,
      staff: mn.staff,
      'multiple-rest-always': mn.multipleRestAlways,
      'multiple-rest-range': mn.multipleRestRange,
      ...PrintStyleAlignAttrs.attrs(mn),
    });
  }
}
