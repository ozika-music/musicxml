import { describe, expect, it } from 'vitest';
import { PartList, ScorePartwise } from '..';

function makeBaseScore(): ScorePartwise {
  return {
    version: '4.0',
    partList: new PartList(),
    parts: [],
  };
}

describe('extractScoreMetadata', () => {
  it('extracts movementTitle and composer first', () => {
    const score = makeBaseScore();
    score.movementTitle = 'Movement Title';
    score.identification = {
      creators: [{ type: 'composer', value: 'Composer Name' }],
    };

    const metadata = ScorePartwise.extractMetadata(score);
    expect(metadata.title).toBe('Movement Title');
    expect(metadata.artist).toBe('Composer Name');
  });

  it('falls back to workTitle and first creator when no composer type', () => {
    const score = makeBaseScore();
    score.work = { workTitle: 'Work Title' };
    score.identification = {
      creators: [{ type: 'arranger', value: 'First Creator' }],
    };

    const metadata = ScorePartwise.extractMetadata(score);
    expect(metadata.title).toBe('Work Title');
    expect(metadata.artist).toBe('First Creator');
  });

  it('uses credit-type title/composer as fallback', () => {
    const score = makeBaseScore();
    score.credits = [
      {
        creditTypes: ['title'],
        creditWords: [{ value: 'Credit Title' }],
      },
      {
        creditTypes: ['composer'],
        creditWords: [{ value: 'Credit Composer' }],
      },
    ];

    const metadata = ScorePartwise.extractMetadata(score);
    expect(metadata.title).toBe('Credit Title');
    expect(metadata.artist).toBe('Credit Composer');
  });

  it('matches composer creator type case-insensitively', () => {
    const score = makeBaseScore();
    score.identification = {
      creators: [{ type: 'Composer', value: 'Case Composer' }],
    };

    const metadata = ScorePartwise.extractMetadata(score);
    expect(metadata.artist).toBe('Case Composer');
  });
});
