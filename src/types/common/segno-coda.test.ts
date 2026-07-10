import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Coda, Segno } from './segno-coda';

/** @see musicxml.xsd "segno"/"coda". */
describe('Segno / Coda', () => {
  it('Segno round-trips smufl + print-style-align', () => {
    const s = Segno.fromXmlElement(parseElements('<segno smufl="segno" default-x="5" halign="center"/>')[0]);
    expect(s).toMatchObject({ smufl: 'segno', defaultX: 5, halign: 'center' });
    expect(buildElements([Segno.toXmlElement(s)])).toContain('smufl="segno"');
  });
  it('Coda round-trips under a custom tag', () => {
    const c = Coda.fromXmlElement(parseElements('<coda smufl="coda"/>')[0]);
    expect(c.smufl).toBe('coda');
    expect(buildElements([Coda.toXmlElement(c, 'coda')])).toContain('<coda');
  });
});
