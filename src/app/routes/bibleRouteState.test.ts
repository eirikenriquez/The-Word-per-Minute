import { describe, expect, it } from 'vitest';
import { createBiblePath, readBibleRouteState } from './bibleRouteState';

describe('Bible route state', () => {
  it('uses empty reader state when URL parameters are missing', () => {
    expect(readBibleRouteState(new URLSearchParams())).toEqual({
      bookId: null,
      chapter: null,
      selectedVerseNumbers: [],
      translationId: null,
    });
  });

  it('reads a complete reader selection', () => {
    const searchParams = new URLSearchParams({
      book: 'John',
      chapter: '3',
      translation: 'web',
      verses: '16,17',
    });

    expect(readBibleRouteState(searchParams)).toEqual({
      bookId: 'John',
      chapter: 3,
      selectedVerseNumbers: [16, 17],
      translationId: 'web',
    });
  });

  it('normalises identifiers and verse numbers', () => {
    const searchParams = new URLSearchParams({
      book: ' John ',
      chapter: '0',
      translation: ' web ',
      verses: '17,invalid,16,17,-1',
    });

    expect(readBibleRouteState(searchParams)).toEqual({
      bookId: 'John',
      chapter: null,
      selectedVerseNumbers: [16, 17],
      translationId: 'web',
    });
  });

  it('creates a canonical Bible URL', () => {
    expect(
      createBiblePath({
        bookId: 'John',
        chapter: 3,
        selectedVerseNumbers: [17, 16, 17],
        translationId: 'web',
      }),
    ).toBe('/bible?translation=web&book=John&chapter=3&verses=16%2C17');
  });

  it('omits empty and invalid reader state', () => {
    expect(
      createBiblePath({
        bookId: ' ',
        chapter: 0,
        selectedVerseNumbers: [0, -1],
        translationId: null,
      }),
    ).toBe('/bible');
  });
});
