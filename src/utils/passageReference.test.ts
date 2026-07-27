import { describe, expect, it } from 'vitest';
import {
  formatChapterReference,
  formatPassageReference,
  formatSelectedVerseReference,
} from './passageReference';

describe('passage reference formatting', () => {
  it('formats a single verse', () => {
    expect(formatPassageReference('Matthew', 5, 3)).toBe('Matthew 5:3');
  });

  it('formats a verse range', () => {
    expect(formatPassageReference('Matthew', 5, 3, 10)).toBe('Matthew 5:3-10');
  });

  it('sorts and deduplicates contiguous selected verses', () => {
    expect(formatSelectedVerseReference('Genesis', 1, [3, 1, 2, 2])).toBe(
      'Genesis 1:1-3',
    );
  });

  it('preserves non-contiguous selected verses in the reference', () => {
    expect(formatSelectedVerseReference('Genesis', 1, [5, 1, 3])).toBe(
      'Genesis 1:1,3,5',
    );
  });

  it('formats the chapter when there are no selected verses', () => {
    expect(formatSelectedVerseReference('Psalm', 23, [])).toBe('Psalm 23');
    expect(formatChapterReference('Psalm', 23)).toBe('Psalm 23');
  });
});
