import { describe, expect, it } from 'vitest';
import { buildPracticePassage } from './practicePassage';

describe('buildPracticePassage', () => {
  it('returns no passage when there are no verses', () => {
    expect(buildPracticePassage('Genesis', 1, [])).toBeUndefined();
  });

  it('builds a single-verse passage', () => {
    const passage = buildPracticePassage('Genesis', 1, [
      { number: 1, text: 'In the beginning.' },
    ]);

    expect(passage).toMatchObject({
      startVerse: 1,
      endVerse: 1,
      ref: 'Genesis 1:1',
      text: 'In the beginning.',
    });
  });

  it('joins multiple verses into one typing passage', () => {
    const verses = [
      { number: 1, text: 'In the beginning.' },
      { number: 2, text: 'The earth was formless.' },
      { number: 3, text: 'God said, “Let there be light.”' },
    ];

    const passage = buildPracticePassage('Genesis', 1, verses);

    expect(passage).toEqual({
      startVerse: 1,
      endVerse: 3,
      ref: 'Genesis 1:1-3',
      text: 'In the beginning. The earth was formless. God said, “Let there be light.”',
      verses,
    });
  });
});
