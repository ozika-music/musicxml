import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Step } from '../enums';
import { Pitch, Rest, Unpitched } from './pitch';

/** @see musicxml.xsd "pitch" / "unpitched" / "rest". */
describe('Pitch / Unpitched / Rest', () => {
  it('Pitch round-trips step/alter/octave', () => {
    const p = Pitch.fromXmlElement(parseElements('<pitch><step>B</step><alter>-1</alter><octave>4</octave></pitch>')[0]);
    expect(p).toMatchObject({ step: Step.B, alter: -1, octave: 4 });
    const round = Pitch.fromXmlElement(parseElements(buildElements([Pitch.toXmlElement(p)]))[0]);
    expect(round).toMatchObject({ step: Step.B, alter: -1, octave: 4 });
  });

  it('Unpitched round-trips display-step/display-octave', () => {
    const u = Unpitched.fromXmlElement(parseElements('<unpitched><display-step>E</display-step><display-octave>5</display-octave></unpitched>')[0]);
    expect(u).toMatchObject({ displayStep: Step.E, displayOctave: 5 });
    expect(buildElements([Unpitched.toXmlElement(u)])).toContain('<display-octave>5</display-octave>');
  });

  it('Rest round-trips @measure and empty form', () => {
    const measureRest = Rest.fromXmlElement(parseElements('<rest measure="yes"/>')[0]);
    expect(measureRest.measure).toBe('yes');
    expect(buildElements([Rest.toXmlElement(measureRest)])).toContain('measure="yes"');
    const plain = Rest.fromXmlElement(parseElements('<rest/>')[0]);
    expect(buildElements([Rest.toXmlElement(plain)])).toContain('<rest');
  });
});
