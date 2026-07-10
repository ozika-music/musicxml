import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { TimeSymbol } from '../enums';
import { Time } from './time';

/** @see musicxml.xsd "time" — (beats, beat-type)+ | senza-misura; @number/@symbol. */
describe('Time', () => {
  it('round-trips beats/beat-type pairs + symbol', () => {
    const xml = '<time symbol="common"><beats>6</beats><beat-type>8</beat-type><beats>3</beats><beat-type>4</beat-type></time>';
    const time = Time.fromXmlElement(parseElements(xml)[0]);
    expect(time.symbol).toBe(TimeSymbol.Common);
    expect(time.beats).toEqual(['6', '3']);
    expect(time.beatTypes).toEqual(['8', '4']);

    const out = buildElements([Time.toXmlElement(time)]);
    // beats/beat-type stay interleaved in document order
    expect(out.indexOf('<beats>6')).toBeLessThan(out.indexOf('<beat-type>8'));
    expect(out.indexOf('<beat-type>8')).toBeLessThan(out.indexOf('<beats>3'));
    const round = Time.fromXmlElement(parseElements(out)[0]);
    expect(round.beats).toEqual(['6', '3']);
    expect(round.beatTypes).toEqual(['8', '4']);
  });

  it('round-trips senza-misura', () => {
    const time = Time.fromXmlElement(parseElements('<time><senza-misura>X</senza-misura></time>')[0]);
    expect(time.senzaMisura).toBe('X');
    expect(buildElements([Time.toXmlElement(time)])).toContain('<senza-misura>X</senza-misura>');
  });
});
