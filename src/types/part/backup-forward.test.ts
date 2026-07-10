import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Backup, Forward } from './backup-forward';

/** @see musicxml.xsd "backup"/"forward". */
describe('Backup / Forward', () => {
  it('Backup round-trips duration', () => {
    const b = Backup.fromXmlElement(parseElements('<backup><duration>4</duration></backup>')[0]);
    expect(b.duration).toBe(4);
    expect(buildElements([Backup.toXmlElement(b)])).toContain('<duration>4</duration>');
  });

  it('Forward round-trips duration + voice + staff', () => {
    const f = Forward.fromXmlElement(parseElements('<forward><duration>2</duration><voice>1</voice><staff>2</staff></forward>')[0]);
    expect(f).toMatchObject({ duration: 2, voice: '1', staff: 2 });
    const round = Forward.fromXmlElement(parseElements(buildElements([Forward.toXmlElement(f)]))[0]);
    expect(round).toMatchObject({ duration: 2, voice: '1', staff: 2 });
  });
});
