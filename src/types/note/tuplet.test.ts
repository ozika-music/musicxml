import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { ShowTuplet, StartStop } from '../enums';
import { Tuplet } from './tuplet';

/** @see musicxml.xsd "tuplet" + tuplet-actual/normal portions. */
describe('Tuplet', () => {
  it('round-trips attributes + nested actual/normal portions', () => {
    const xml =
      '<tuplet type="start" number="1" bracket="yes" show-number="actual" placement="above">' +
      '<tuplet-actual><tuplet-number>3</tuplet-number><tuplet-type>eighth</tuplet-type></tuplet-actual>' +
      '<tuplet-normal><tuplet-number>2</tuplet-number><tuplet-type>eighth</tuplet-type><tuplet-dot/></tuplet-normal>' +
      '</tuplet>';
    const t = Tuplet.fromXmlElement(parseElements(xml)[0]);
    expect(t).toMatchObject({
      type: StartStop.Start,
      number: 1,
      bracket: 'yes',
      showNumber: ShowTuplet.Actual,
      placement: 'above',
    });
    expect(t.tupletActual?.tupletNumber?.value).toBe(3);
    expect(t.tupletActual?.tupletType?.value).toBe('eighth');
    expect(t.tupletNormal?.tupletNumber?.value).toBe(2);
    expect(t.tupletNormal?.tupletDots?.length).toBe(1);

    const round = Tuplet.fromXmlElement(parseElements(buildElements([Tuplet.toXmlElement(t)]))[0]);
    expect(round.tupletActual?.tupletNumber?.value).toBe(3);
    expect(round.tupletNormal?.tupletNumber?.value).toBe(2);
    expect(round.tupletNormal?.tupletDots?.length).toBe(1);
    expect(round.bracket).toBe('yes');
  });
});
