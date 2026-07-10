import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { LineLength } from '../enums';
import { EmptyLine, EmptyPlacement, EmptyPlacementSmufl } from './notations-empty';

/** @see musicxml.xsd "empty-placement"/"empty-placement-smufl"/"empty-line". */
describe('notations empty leaves', () => {
  it('EmptyPlacement round-trips print-style + placement under a tag', () => {
    const e = EmptyPlacement.fromXmlElement(parseElements('<accent placement="above" default-y="3"/>')[0]);
    expect(e).toMatchObject({ placement: 'above', defaultY: 3 });
    expect(buildElements([EmptyPlacement.toXmlElement(e, 'accent')])).toContain('<accent');
  });
  it('EmptyPlacementSmufl round-trips smufl', () => {
    const e = EmptyPlacementSmufl.fromXmlElement(parseElements('<open smufl="brassMuteOpen"/>')[0]);
    expect(e.smufl).toBe('brassMuteOpen');
    expect(buildElements([EmptyPlacementSmufl.toXmlElement(e, 'open')])).toContain('smufl="brassMuteOpen"');
  });
  it('EmptyLine round-trips line-length', () => {
    const e = EmptyLine.fromXmlElement(parseElements('<scoop line-length="long" placement="below"/>')[0]);
    expect(e).toMatchObject({ lineLength: LineLength.Long, placement: 'below' });
    expect(buildElements([EmptyLine.toXmlElement(e, 'scoop')])).toContain('line-length="long"');
  });
});
