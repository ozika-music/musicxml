import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Articulations } from './articulations';

/** @see musicxml.xsd "articulations". */
describe('Articulations', () => {
  it('round-trips empty-placement + strong-accent + breath-mark + caesura in order', () => {
    const xml =
      '<articulations>' +
      '<accent placement="above"/>' +
      '<strong-accent type="up"/>' +
      '<staccato/>' +
      '<scoop line-length="long"/>' +
      '<breath-mark>comma</breath-mark>' +
      '<caesura>normal</caesura>' +
      '<soft-accent/>' +
      '</articulations>';
    const a = Articulations.fromXmlElement(parseElements(xml)[0]);
    expect(a.accent).toMatchObject({ placement: 'above' });
    expect(a.strongAccent).toMatchObject({ type: 'up' });
    expect(a.staccato).toBeDefined();
    expect(a.scoop).toMatchObject({ lineLength: 'long' });
    expect(a.breathMark?.value).toBe('comma');
    expect(a.caesura?.value).toBe('normal');
    expect(a.softAccent).toBeDefined();

    const out = buildElements([Articulations.toXmlElement(a)]);
    // XSD order: accent before strong-accent before staccato before scoop before breath-mark.
    expect(out.indexOf('accent')).toBeLessThan(out.indexOf('strong-accent'));
    expect(out.indexOf('strong-accent')).toBeLessThan(out.indexOf('staccato'));
    expect(out.indexOf('staccato')).toBeLessThan(out.indexOf('scoop'));
    expect(out.indexOf('scoop')).toBeLessThan(out.indexOf('breath-mark'));

    const round = Articulations.fromXmlElement(parseElements(out)[0]);
    expect(round.strongAccent).toMatchObject({ type: 'up' });
    expect(round.breathMark?.value).toBe('comma');
    expect(round.caesura?.value).toBe('normal');
  });
});
