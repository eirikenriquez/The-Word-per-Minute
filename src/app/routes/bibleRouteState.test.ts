import { describe, expect, it } from 'vitest';
import type { BookSummary, Translation } from '../../types/bible';
import {
  createBiblePath,
  readBibleRouteState,
  resolveBibleRouteState,
} from './bibleRouteState';

const translations: Translation[] = [
  {
    abbreviation: 'WEB',
    id: 'web',
    language: 'English',
    license: 'Public domain',
    name: 'World English Bible',
    source: 'Local',
  },
  {
    abbreviation: 'ASV',
    id: 'asv',
    language: 'English',
    license: 'Public domain',
    name: 'American Standard Version',
    source: 'Local',
  },
];

const books: BookSummary[] = [
  {
    chapterCount: 3,
    id: 'John',
    name: 'John',
    testament: 'NT',
    verseCounts: [51, 25, 36],
  },
  {
    chapterCount: 2,
    id: 'Acts',
    name: 'Acts',
    testament: 'NT',
    verseCounts: [26, 47],
  },
];

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

  it('resolves a valid requested reader location', () => {
    expect(
      resolveBibleRouteState({
        books,
        routeState: {
          bookId: 'Acts',
          chapter: 2,
          selectedVerseNumbers: [28, 1],
          translationId: 'asv',
        },
        selectedBookId: 'John',
        selectedChapter: 1,
        selectedTranslationId: 'web',
        translations,
      }),
    ).toEqual({
      bookId: 'Acts',
      chapter: 2,
      selectedVerseNumbers: [1, 28],
      translationId: 'asv',
    });
  });

  it('falls back from invalid translation, book, and chapter values', () => {
    expect(
      resolveBibleRouteState({
        books,
        routeState: {
          bookId: 'MissingBook',
          chapter: 99,
          selectedVerseNumbers: [0, 16, 99, 16],
          translationId: 'missing-translation',
        },
        selectedBookId: 'John',
        selectedChapter: 2,
        selectedTranslationId: 'web',
        translations,
      }),
    ).toEqual({
      bookId: 'John',
      chapter: 2,
      selectedVerseNumbers: [16],
      translationId: 'web',
    });
  });

  it('uses the first available options when current selections are invalid', () => {
    expect(
      resolveBibleRouteState({
        books,
        routeState: {
          bookId: null,
          chapter: null,
          selectedVerseNumbers: [],
          translationId: null,
        },
        selectedBookId: 'MissingBook',
        selectedChapter: 0,
        selectedTranslationId: 'missing-translation',
        translations,
      }),
    ).toEqual({
      bookId: 'John',
      chapter: 1,
      selectedVerseNumbers: [],
      translationId: 'web',
    });
  });

  it('waits until translation and book options are available', () => {
    const routeState = {
      bookId: 'John',
      chapter: 3,
      selectedVerseNumbers: [16],
      translationId: 'web',
    };

    expect(
      resolveBibleRouteState({
        books,
        routeState,
        selectedBookId: 'John',
        selectedChapter: 3,
        selectedTranslationId: 'web',
        translations: [],
      }),
    ).toBeNull();
    expect(
      resolveBibleRouteState({
        books: [],
        routeState,
        selectedBookId: 'John',
        selectedChapter: 3,
        selectedTranslationId: 'web',
        translations,
      }),
    ).toBeNull();
  });
});
