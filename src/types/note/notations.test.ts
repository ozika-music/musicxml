import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Notations } from './notations';

/** @see musicxml.xsd "notations". */
describe('Notations', () => {
  it('round-trips a mix of children + print-object', () => {
    const xml =
      '<notations print-object="yes">' +
      '<tied type="start"/>' +
      '<slur type="start" number="1"/>' +
      '<tuplet type="start" number="1"/>' +
      '<ornaments><trill-mark/></ornaments>' +
      '<technical><up-bow/></technical>' +
      '<articulations><staccato/></articulations>' +
      '<dynamics><f/></dynamics>' +
      '<fermata>normal</fermata>' +
      '<arpeggiate/>' +
      '<accidental-mark>sharp</accidental-mark>' +
      '</notations>';
    const n = Notations.fromXmlElement(parseElements(xml)[0]);
    expect(n.tieds?.length).toBe(1);
    expect(n.slurs?.[0].number).toBe(1);
    expect(n.tuplets?.length).toBe(1);
    expect(n.ornaments?.[0].trillMark).toBeDefined();
    expect(n.technicals?.[0].upBow).toBeDefined();
    expect(n.articulations?.[0].staccato).toBeDefined();
    expect(n.dynamics?.[0].values.length).toBe(1);
    expect(n.fermatas?.[0].value).toBe('normal');
    expect(n.arpeggiate).toBeDefined();
    expect(n.accidentalMarks?.[0].value).toBe('sharp');
    expect(n.printObject).toBe('yes');

    const round = Notations.fromXmlElement(parseElements(buildElements([Notations.toXmlElement(n)]))[0]);
    expect(round.tieds?.length).toBe(1);
    expect(round.technicals?.[0].upBow).toBeDefined();
    expect(round.fermatas?.[0].value).toBe('normal');
    expect(round.accidentalMarks?.[0].value).toBe('sharp');
    expect(round.printObject).toBe('yes');
  });
});
