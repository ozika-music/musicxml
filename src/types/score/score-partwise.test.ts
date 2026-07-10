import { describe, expect, it } from 'vitest';
import { buildElements } from '../../xml/xml-element';
import { PartList } from './part-list';
import { ScorePartwise } from './score-partwise';
import type { ScorePart } from '../score';

/** @see musicxml.xsd "score-partwise". */
describe('ScorePartwise.toXmlElement', () => {
  it('composes header + part-list + parts into <score-partwise>', () => {
    const scorePart = { id: 'P1', partName: { value: 'Flute' } } as unknown as ScorePart;
    const score = new ScorePartwise({
      version: '4.0',
      movementTitle: 'Test',
      partList: new PartList([{ kind: 'score-part', scorePart }]),
      parts: [{ id: 'P1', measures: [{ number: '1', content: [] }] }] as never,
    });
    const xml = buildElements([ScorePartwise.toXmlElement(score)]);
    expect(xml).toContain('<score-partwise version="4.0">');
    expect(xml).toContain('<movement-title>Test</movement-title>');
    expect(xml).toContain('<part-list>');
    expect(xml).toContain('<part id="P1">');
    expect(xml).toContain('<measure number="1"');
  });
});
