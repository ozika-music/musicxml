import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { StartStopContinue, TremoloType } from '../enums';
import { Ornaments } from './ornaments';

/** @see musicxml.xsd "ornaments". */
describe('Ornaments', () => {
  it('round-trips trill-mark, turn(slash), wavy-line, mordent, tremolo, accidental-mark', () => {
    const xml =
      '<ornaments>' +
      '<trill-mark placement="above" start-note="upper"/>' +
      '<turn slash="yes"/>' +
      '<wavy-line type="start" number="1" smufl="wiggleTrill"/>' +
      '<mordent long="yes" approach="below"/>' +
      '<tremolo type="single">3</tremolo>' +
      '<accidental-mark>sharp</accidental-mark>' +
      '</ornaments>';
    const o = Ornaments.fromXmlElement(parseElements(xml)[0]);
    expect(o.trillMark).toMatchObject({ placement: 'above', startNote: 'upper' });
    expect(o.turn).toMatchObject({ slash: 'yes' });
    expect(o.wavyLines?.[0]).toMatchObject({ type: StartStopContinue.Start, number: 1, smufl: 'wiggleTrill' });
    expect(o.mordent).toMatchObject({ long: 'yes', approach: 'below' });
    expect(o.tremolo).toMatchObject({ value: 3, type: TremoloType.Single });
    expect(o.accidentalMarks?.[0].value).toBe('sharp');

    const round = Ornaments.fromXmlElement(parseElements(buildElements([Ornaments.toXmlElement(o)]))[0]);
    expect(round.turn).toMatchObject({ slash: 'yes' });
    expect(round.tremolo).toMatchObject({ value: 3, type: TremoloType.Single });
    expect(round.wavyLines?.[0]).toMatchObject({ type: StartStopContinue.Start, number: 1 });
    expect(round.accidentalMarks?.[0].value).toBe('sharp');
  });
});
