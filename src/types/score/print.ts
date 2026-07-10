/**
 * Print — page/system layout hints at a measure boundary.
 * @see musicxml.xsd "print"
 *
 * Layout children (page-layout, system-layout, staff-layout, measure-layout,
 * measure-numbering) are carried on the type but not yet serialized — they need
 * the layout subtree (PageLayout/SystemLayout/StaffLayout) class-migrated, a
 * shared common-tier task also pending for Defaults. The break attributes and
 * part-name/abbreviation displays (the editor-relevant parts) round-trip.
 */

import { attr, childrenOf, el, type XmlElement } from '../../xml/xml-element';
import { NameDisplay } from '../common/name-display';
import { MeasureLayout, MeasureNumbering, PageLayout, StaffLayout, SystemLayout } from './layout';
import type { Tenths } from '../common';
import type { YesNo } from '../enums';
import type { Print as PrintShape } from '../score';

function numAttr(node: XmlElement, name: string): number | undefined {
  const v = attr(node, name);
  return v === undefined ? undefined : Number(v);
}

/**
 * The print type contains general printing parameters, including layout elements. The part-name-display and part-abbreviation-display elements may also be used here to change how a part name or abbreviation is displayed over the course of a piece. They take effect when the current measure or a succeeding measure starts a new system. Layout group elements in a print element only apply to the current page, system, or staff. Music that follows continues to take the default values from the layout determined by the defaults element.
 * @see musicxml.xsd "print".
 */
export class Print implements PrintShape {
  staffSpacing?: Tenths;
  newSystem?: YesNo;
  newPage?: YesNo;
  blankPage?: number;
  pageNumber?: string;
  pageLayout?: PageLayout;
  systemLayout?: SystemLayout;
  staffLayouts?: StaffLayout[];
  measureLayout?: MeasureLayout;
  measureNumbering?: MeasureNumbering;
  partNameDisplay?: NameDisplay;
  partAbbreviationDisplay?: NameDisplay;
  id?: string;
  constructor(init?: Partial<Print>) {
    if (init) Object.assign(this, init);
  }

  static fromXmlElement(node: XmlElement): Print {
    const nameDisplay = childrenOf(node, 'part-name-display')[0];
    const abbrDisplay = childrenOf(node, 'part-abbreviation-display')[0];
    const pageLayout = childrenOf(node, 'page-layout')[0];
    const systemLayout = childrenOf(node, 'system-layout')[0];
    const measureLayout = childrenOf(node, 'measure-layout')[0];
    const measureNumbering = childrenOf(node, 'measure-numbering')[0];
    const staffLayouts = childrenOf(node, 'staff-layout').map(StaffLayout.fromXmlElement);
    return new Print({
      staffSpacing: numAttr(node, 'staff-spacing'),
      newSystem: attr(node, 'new-system') as YesNo | undefined,
      newPage: attr(node, 'new-page') as YesNo | undefined,
      blankPage: numAttr(node, 'blank-page'),
      pageNumber: attr(node, 'page-number'),
      pageLayout: pageLayout ? PageLayout.fromXmlElement(pageLayout) : undefined,
      systemLayout: systemLayout ? SystemLayout.fromXmlElement(systemLayout) : undefined,
      staffLayouts: staffLayouts.length ? staffLayouts : undefined,
      measureLayout: measureLayout ? MeasureLayout.fromXmlElement(measureLayout) : undefined,
      measureNumbering: measureNumbering ? MeasureNumbering.fromXmlElement(measureNumbering) : undefined,
      partNameDisplay: nameDisplay ? NameDisplay.fromXmlElement(nameDisplay) : undefined,
      partAbbreviationDisplay: abbrDisplay ? NameDisplay.fromXmlElement(abbrDisplay) : undefined,
      id: attr(node, 'id'),
    });
  }

  static toXmlElement(p: Print): XmlElement {
    const c: XmlElement[] = [];
    // XSD order: page-layout, system-layout, staff-layout*, measure-layout,
    // measure-numbering, part-name-display, part-abbreviation-display.
    if (p.pageLayout) c.push(PageLayout.toXmlElement(p.pageLayout));
    if (p.systemLayout) c.push(SystemLayout.toXmlElement(p.systemLayout));
    for (const sl of p.staffLayouts ?? []) c.push(StaffLayout.toXmlElement(sl));
    if (p.measureLayout) c.push(MeasureLayout.toXmlElement(p.measureLayout));
    if (p.measureNumbering) c.push(MeasureNumbering.toXmlElement(p.measureNumbering));
    if (p.partNameDisplay) c.push(NameDisplay.toXmlElement(p.partNameDisplay, 'part-name-display'));
    if (p.partAbbreviationDisplay) c.push(NameDisplay.toXmlElement(p.partAbbreviationDisplay, 'part-abbreviation-display'));
    return el('print', c, {
      'staff-spacing': p.staffSpacing,
      'new-system': p.newSystem,
      'new-page': p.newPage,
      'blank-page': p.blankPage,
      'page-number': p.pageNumber,
      id: p.id,
    });
  }
}
