import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { MeasureLayout, MeasureNumbering, PageLayout, StaffLayout, SystemLayout } from './layout';

/** @see musicxml.xsd "page-layout"/"system-layout"/"staff-layout"/"measure-layout"/"measure-numbering". */
describe('layout elements', () => {
  it('PageLayout round-trips dimensions + margins', () => {
    const pl = PageLayout.fromXmlElement(parseElements('<page-layout><page-height>1700</page-height><page-width>1200</page-width><page-margins type="both"><left-margin>50</left-margin><right-margin>50</right-margin><top-margin>40</top-margin><bottom-margin>40</bottom-margin></page-margins></page-layout>')[0]);
    expect(pl).toMatchObject({ pageHeight: 1700, pageWidth: 1200 });
    expect(pl.pageMargins?.[0]).toMatchObject({ type: 'both', leftMargin: 50, topMargin: 40 });
    const round = PageLayout.fromXmlElement(parseElements(buildElements([PageLayout.toXmlElement(pl)]))[0]);
    expect(round.pageMargins?.[0].bottomMargin).toBe(40);
  });
  it('SystemLayout round-trips margins + distances + dividers', () => {
    const sl = SystemLayout.fromXmlElement(parseElements('<system-layout><system-margins><left-margin>0</left-margin><right-margin>0</right-margin></system-margins><system-distance>100</system-distance><system-dividers><left-divider print-object="yes"/></system-dividers></system-layout>')[0]);
    expect(sl.systemDistance).toBe(100);
    expect(sl.systemDividers?.leftDivider?.printObject).toBe('yes');
    const round = SystemLayout.fromXmlElement(parseElements(buildElements([SystemLayout.toXmlElement(sl)]))[0]);
    expect(round.systemDividers?.leftDivider?.printObject).toBe('yes');
  });
  it('StaffLayout / MeasureLayout / MeasureNumbering round-trip', () => {
    expect(StaffLayout.fromXmlElement(parseElements('<staff-layout number="2"><staff-distance>80</staff-distance></staff-layout>')[0])).toMatchObject({ number: 2, staffDistance: 80 });
    expect(MeasureLayout.fromXmlElement(parseElements('<measure-layout><measure-distance>30</measure-distance></measure-layout>')[0]).measureDistance).toBe(30);
    const mn = MeasureNumbering.fromXmlElement(parseElements('<measure-numbering system="only-top">measure</measure-numbering>')[0]);
    expect(mn).toMatchObject({ value: 'measure', system: 'only-top' });
    expect(buildElements([MeasureNumbering.toXmlElement(mn)])).toContain('>measure<');
  });
});
