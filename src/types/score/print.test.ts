import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Print } from './print';

/** @see musicxml.xsd "print". */
describe('Print', () => {
  it('round-trips break attrs + layout subtree + part-name-display', () => {
    const xml =
      '<print new-system="yes" new-page="no" staff-spacing="20" page-number="3">' +
      '<page-layout><page-height>1700</page-height><page-width>1200</page-width>' +
      '<page-margins type="both"><left-margin>50</left-margin><right-margin>50</right-margin><top-margin>50</top-margin><bottom-margin>50</bottom-margin></page-margins></page-layout>' +
      '<system-layout><system-margins><left-margin>0</left-margin><right-margin>0</right-margin></system-margins><system-distance>100</system-distance></system-layout>' +
      '<staff-layout number="2"><staff-distance>80</staff-distance></staff-layout>' +
      '<measure-numbering system="only-top">measure</measure-numbering>' +
      '<part-name-display><display-text>Vln</display-text></part-name-display>' +
      '</print>';
    const p = Print.fromXmlElement(parseElements(xml)[0]);
    expect(p).toMatchObject({ newSystem: 'yes', newPage: 'no', staffSpacing: 20, pageNumber: '3' });
    expect(p.pageLayout?.pageHeight).toBe(1700);
    expect(p.pageLayout?.pageMargins?.[0]).toMatchObject({ type: 'both', leftMargin: 50 });
    expect(p.systemLayout?.systemDistance).toBe(100);
    expect(p.staffLayouts?.[0]).toMatchObject({ number: 2, staffDistance: 80 });
    expect(p.measureNumbering).toMatchObject({ value: 'measure', system: 'only-top' });
    expect(p.partNameDisplay).toBeDefined();

    const round = Print.fromXmlElement(parseElements(buildElements([Print.toXmlElement(p)]))[0]);
    expect(round.pageLayout?.pageWidth).toBe(1200);
    expect(round.systemLayout?.systemDistance).toBe(100);
    expect(round.measureNumbering?.value).toBe('measure');
    expect(round.partNameDisplay).toBeDefined();
  });
});
