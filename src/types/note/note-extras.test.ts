import { describe, expect, it } from 'vitest';
import { buildElements, parseElements } from '../../xml/xml-element';
import { Listen, NoteheadText, Play } from './note-extras';

/** @see musicxml.xsd "notehead-text"/"play"/"listen". */
describe('note extras', () => {
  it('NoteheadText round-trips display-text + accidental-text', () => {
    const t = NoteheadText.fromXmlElement(parseElements('<notehead-text><display-text>1</display-text><accidental-text smufl="x">sharp</accidental-text></notehead-text>')[0]);
    expect(t.displayTexts?.[0].value).toBe('1');
    expect(t.accidentalTexts?.[0]).toMatchObject({ value: 'sharp', smufl: 'x' });
    const round = NoteheadText.fromXmlElement(parseElements(buildElements([NoteheadText.toXmlElement(t)]))[0]);
    expect(round.accidentalTexts?.[0].smufl).toBe('x');
  });
  it('Play round-trips ipa/mute/other-play', () => {
    const p = Play.fromXmlElement(parseElements('<play id="p1"><mute>palm</mute><other-play type="x">y</other-play></play>')[0]);
    expect(p).toMatchObject({ id: 'p1', mute: 'palm' });
    expect(p.otherPlay).toMatchObject({ type: 'x', value: 'y' });
    const round = Play.fromXmlElement(parseElements(buildElements([Play.toXmlElement(p)]))[0]);
    expect(round.otherPlay?.type).toBe('x');
  });
  it('Listen round-trips assess + wait', () => {
    const l = Listen.fromXmlElement(parseElements('<listen><assess type="yes" player="P1"/><wait player="P2"/></listen>')[0]);
    expect(l.assess).toMatchObject({ type: 'yes', player: 'P1' });
    expect(l.wait).toMatchObject({ player: 'P2' });
    const round = Listen.fromXmlElement(parseElements(buildElements([Listen.toXmlElement(l)]))[0]);
    expect(round.assess?.player).toBe('P1');
  });
});
