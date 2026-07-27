import { describe, expect, it } from 'vitest';
import { addVerseRange, toggleVerseSelection } from './readerSelection';

describe('Reader selection', () => {
  it('adds and removes one selected verse', () => {
    expect(toggleVerseSelection([1, 3], 2)).toEqual([1, 2, 3]);
    expect(toggleVerseSelection([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it('adds a continuous range without duplicates', () => {
    expect(addVerseRange([1, 3], 2, 4)).toEqual([1, 2, 3, 4]);
  });

  it('supports a range selected in reverse', () => {
    expect(addVerseRange([], 4, 2)).toEqual([2, 3, 4]);
  });
});
