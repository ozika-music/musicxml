import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { DynamicsValue, StartStopContinue, UprightInverted } from '../enums';
import { Arpeggiate, Dynamics, Fermata, NonArpeggiate, OtherNotation } from './notations-misc';

/** @see musicxml.xsd "dynamics"/"fermata"/"arpeggiate"/"non-arpeggiate"/"other-notation". */
describe('standalone notation leaves', () => {
  it('Dynamics round-trips marks + other-dynamics in order', () => {
    const d = Dynamics.fromXmlElement(parseElements('<dynamics placement="below"><f/><p/><other-dynamics>abc</other-dynamics></dynamics>')[0]);
    expect(d.values).toEqual([DynamicsValue.F, DynamicsValue.P, expect.objectContaining({ value: 'abc' })]);
    expect(d.placement).toBe('below');
    const round = Dynamics.fromXmlElement(parseElements(buildElements([Dynamics.toXmlElement(d)]))[0]);
    expect(round.values[0]).toBe(DynamicsValue.F);
    expect(round.values[2]).toMatchObject({ value: 'abc' });
  });

  it('Fermata round-trips value + type', () => {
    const f = Fermata.fromXmlElement(parseElements('<fermata type="inverted">angled</fermata>')[0]);
    expect(f).toMatchObject({ value: 'angled', type: UprightInverted.Inverted });
    expect(buildElements([Fermata.toXmlElement(f)])).toContain('type="inverted"');
  });

  it('Arpeggiate + NonArpeggiate round-trip', () => {
    const a = Arpeggiate.fromXmlElement(parseElements('<arpeggiate direction="up" number="1"/>')[0]);
    expect(a).toMatchObject({ direction: 'up', number: 1 });
    const na = NonArpeggiate.fromXmlElement(parseElements('<non-arpeggiate type="bottom" number="2"/>')[0]);
    expect(na).toMatchObject({ type: 'bottom', number: 2 });
    expect(buildElements([Arpeggiate.toXmlElement(a)])).toContain('direction="up"');
    expect(buildElements([NonArpeggiate.toXmlElement(na)])).toContain('type="bottom"');
  });

  it('OtherNotation round-trips type + value', () => {
    const o = OtherNotation.fromXmlElement(parseElements('<other-notation type="single" number="1">x</other-notation>')[0]);
    expect(o).toMatchObject({ value: 'x', number: 1 });
    const round = OtherNotation.fromXmlElement(parseElements(buildElements([OtherNotation.toXmlElement(o)]))[0]);
    expect(round.value).toBe('x');
  });
});
