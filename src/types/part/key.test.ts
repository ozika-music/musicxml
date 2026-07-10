import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Mode } from '../enums';
import { Key } from './key';

/** @see musicxml.xsd "key" — (cancel?, fifths, mode?) | key-step/key-alter*, key-octave*. */
describe('Key', () => {
  it('round-trips traditional key (cancel, fifths, mode) + key-octave', () => {
    const xml =
      '<key number="1"><cancel location="left">-2</cancel><fifths>3</fifths><mode>major</mode>' +
      '<key-octave number="1">4</key-octave></key>';
    const key = Key.fromXmlElement(parseElements(xml)[0]);
    expect(key.number).toBe(1);
    expect(key.cancel).toMatchObject({ value: -2, location: 'left' });
    expect(key.fifths).toBe(3);
    expect(key.mode).toBe(Mode.Major);
    expect(key.keyOctaves?.[0]).toMatchObject({ number: 1, value: 4 });

    const round = Key.fromXmlElement(parseElements(buildElements([Key.toXmlElement(key)]))[0]);
    expect(round).toMatchObject({ fifths: 3, mode: Mode.Major });
    expect(round.cancel?.value).toBe(-2);
    expect(round.keyOctaves?.[0].value).toBe(4);
  });

  it('round-trips non-traditional key (key-step / key-alter)', () => {
    const key = Key.fromXmlElement(
      parseElements('<key><key-step>0</key-step><key-alter>-1</key-alter><key-step>3</key-step><key-alter>1</key-alter></key>')[0],
    );
    expect(key.keySteps).toEqual([
      { step: '0', alter: -1, accidental: undefined },
      { step: '3', alter: 1, accidental: undefined },
    ]);
    expect(buildElements([Key.toXmlElement(key)])).toContain('<key-alter>-1</key-alter>');
  });
});
