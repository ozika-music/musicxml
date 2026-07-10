import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { StaffType } from '../enums';
import { StaffDetails } from './staff-details';

/** @see musicxml.xsd "staff-details" — staff-type?, staff-lines?, staff-tuning*, capo?, staff-size?. */
describe('StaffDetails', () => {
  it('round-trips staff-type, lines, tunings, capo and attributes', () => {
    const xml =
      '<staff-details number="1" show-frets="numbers"><staff-type>regular</staff-type><staff-lines>6</staff-lines>' +
      '<staff-tuning line="1"><tuning-step>E</tuning-step><tuning-octave>2</tuning-octave></staff-tuning>' +
      '<staff-tuning line="6"><tuning-step>E</tuning-step><tuning-alter>0</tuning-alter><tuning-octave>4</tuning-octave></staff-tuning>' +
      '<capo>2</capo></staff-details>';
    const sd = StaffDetails.fromXmlElement(parseElements(xml)[0]);
    expect(sd.number).toBe(1);
    expect(sd.showFrets).toBe('numbers');
    expect(sd.staffType).toBe(StaffType.Regular);
    expect(sd.staffLines).toBe(6);
    expect(sd.staffTunings).toHaveLength(2);
    expect(sd.staffTunings?.[0]).toMatchObject({ line: 1, tuningStep: 'E', tuningOctave: 2 });
    expect(sd.capo).toBe(2);

    const round = StaffDetails.fromXmlElement(parseElements(buildElements([StaffDetails.toXmlElement(sd)]))[0]);
    expect(round.staffLines).toBe(6);
    expect(round.staffTunings?.[1]).toMatchObject({ line: 6, tuningStep: 'E', tuningOctave: 4 });
    expect(round.capo).toBe(2);
  });
});
