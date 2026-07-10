import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { FiguredBass } from './figured-bass';

/** @see musicxml.xsd "figured-bass". */
describe('FiguredBass', () => {
  it('round-trips figures + duration + parentheses', () => {
    const xml =
      '<figured-bass parentheses="yes">' +
      '<figure><prefix>flat</prefix><figure-number>6</figure-number><extend type="start"/></figure>' +
      '<figure><figure-number>4</figure-number></figure>' +
      '<duration>4</duration>' +
      '</figured-bass>';
    const fb = FiguredBass.fromXmlElement(parseElements(xml)[0]);
    expect(fb.parentheses).toBe('yes');
    expect(fb.figures.length).toBe(2);
    expect(fb.figures[0].prefix?.value).toBe('flat');
    expect(fb.figures[0].figureNumber?.value).toBe('6');
    expect(fb.figures[0].extend?.type).toBe('start');
    expect(fb.duration).toBe(4);

    const round = FiguredBass.fromXmlElement(parseElements(buildElements([FiguredBass.toXmlElement(fb)]))[0]);
    expect(round.figures.length).toBe(2);
    expect(round.figures[0].figureNumber?.value).toBe('6');
    expect(round.duration).toBe(4);
  });
});
