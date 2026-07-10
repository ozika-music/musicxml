import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { LineType, StartStopContinue, TiedType } from '../enums';
import { Slur, Tied } from './notations-curves';

/** @see musicxml.xsd "tied"/"slur". */
describe('notation curves', () => {
  it('Tied round-trips type + number + orientation + bezier', () => {
    const t = Tied.fromXmlElement(
      parseElements('<tied type="start" number="1" orientation="over" bezier-x="3" line-type="dashed"/>')[0],
    );
    expect(t).toMatchObject({ type: TiedType.Start, number: 1, orientation: 'over', bezierX: 3, lineType: LineType.Dashed });
    const round = Tied.fromXmlElement(parseElements(buildElements([Tied.toXmlElement(t)]))[0]);
    expect(round).toMatchObject({ type: TiedType.Start, number: 1, orientation: 'over', bezierX: 3, lineType: LineType.Dashed });
  });

  it('Slur round-trips type + placement + color', () => {
    const s = Slur.fromXmlElement(parseElements('<slur type="continue" number="2" placement="above" color="#FF0000"/>')[0]);
    expect(s).toMatchObject({ type: StartStopContinue.Continue, number: 2, placement: 'above', color: '#FF0000' });
    const round = Slur.fromXmlElement(parseElements(buildElements([Slur.toXmlElement(s)]))[0]);
    expect(round).toMatchObject({ type: StartStopContinue.Continue, number: 2, placement: 'above', color: '#FF0000' });
  });
});
