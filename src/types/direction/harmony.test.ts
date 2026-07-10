import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { KindValue } from '../enums';
import { Harmony } from './harmony';

/** @see musicxml.xsd "harmony". */
describe('Harmony', () => {
  it('round-trips root + kind + bass + degree + frame', () => {
    const xml =
      '<harmony print-frame="yes">' +
      '<root><root-step>C</root-step><root-alter>-1</root-alter></root>' +
      '<kind use-symbols="yes" text="m">minor</kind>' +
      '<inversion>1</inversion>' +
      '<bass><bass-step>E</bass-step></bass>' +
      '<degree><degree-value>5</degree-value><degree-alter>-1</degree-alter><degree-type>alter</degree-type></degree>' +
      '<frame><frame-strings>6</frame-strings><frame-frets>4</frame-frets>' +
      '<frame-note><string>6</string><fret>0</fret></frame-note></frame>' +
      '<staff>1</staff>' +
      '</harmony>';
    const h = Harmony.fromXmlElement(parseElements(xml)[0]);
    expect(h.printFrame).toBe('yes');
    expect(h.roots?.[0].rootStep.value).toBe('C');
    expect(h.roots?.[0].rootAlter?.value).toBe(-1);
    expect(h.kind).toMatchObject({ value: KindValue.Minor, useSymbols: 'yes', text: 'm' });
    expect(h.inversion?.value).toBe(1);
    expect(h.bass?.bassStep.value).toBe('E');
    expect(h.degrees?.[0].degreeValue.value).toBe(5);
    expect(h.frame?.frameStrings).toBe(6);
    expect(h.frame?.frameNotes[0].string.value).toBe(6);
    expect(h.staff).toBe(1);

    const round = Harmony.fromXmlElement(parseElements(buildElements([Harmony.toXmlElement(h)]))[0]);
    expect(round.roots?.[0].rootStep.value).toBe('C');
    expect(round.kind?.value).toBe(KindValue.Minor);
    expect(round.bass?.bassStep.value).toBe('E');
    expect(round.degrees?.[0].degreeType.value).toBe('alter');
    expect(round.frame?.frameNotes[0].fret.value).toBe(0);
  });
});
