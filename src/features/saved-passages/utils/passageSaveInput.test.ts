import { describe, expect, it } from 'vitest';
import type {
  BibleChapter,
  BookSummary,
  Translation,
} from '../../../types/bible';
import { DEFAULT_SAVED_CATEGORY } from '../constants/savedPassageCategories';
import { createBiblePassageSaveInput } from './passageSaveInput';

const bibleChapter: BibleChapter = {
  chapter: 1,
  verses: [
    { number: 1, text: 'In the beginning.' },
    { number: 2, text: 'The earth was formless.' },
    { number: 3, text: 'God said, “Let there be light.”' },
  ],
};

const selectedBook: BookSummary = {
  id: 'Gen',
  name: 'Genesis',
  testament: 'OT',
  chapterCount: 50,
  verseCounts: [3],
};

const translations: Translation[] = [
  {
    id: 'web',
    name: 'World English Bible',
    abbreviation: 'WEB',
    language: 'English',
    license: 'Public domain',
    source: 'Local',
  },
];

describe('createBiblePassageSaveInput', () => {
  it('saves the whole chapter when no verses are selected', () => {
    const saveInput = createBiblePassageSaveInput({
      bibleChapter,
      selectedBook,
      selectedChapter: 1,
      selectedTranslationId: 'web',
      selectedVerseNumbers: [],
      translations,
    });

    expect(saveInput).toMatchObject({
      title: 'Genesis 1:1-3',
      category: DEFAULT_SAVED_CATEGORY,
      theme: 'Bible reader',
      reference: 'Genesis 1:1-3',
      translationId: 'web',
      translationAbbreviation: 'WEB',
      bookId: 'Gen',
      bookName: 'Genesis',
      chapter: 1,
      startVerse: 1,
      endVerse: 3,
      source: 'bible',
    });
    expect(saveInput?.selectedVerses).toBeUndefined();
  });

  it('preserves an explicit non-contiguous verse selection', () => {
    const saveInput = createBiblePassageSaveInput({
      bibleChapter,
      selectedBook,
      selectedChapter: 1,
      selectedTranslationId: 'web',
      selectedVerseNumbers: [1, 3],
      translations,
    });

    expect(saveInput).toMatchObject({
      title: 'Genesis 1:1,3',
      theme: 'Selected verses',
      reference: 'Genesis 1:1,3',
      startVerse: 1,
      endVerse: 3,
      selectedVerses: [1, 3],
    });
  });

  it('returns no save input without a loaded chapter or selected book', () => {
    const baseInput = {
      selectedBook,
      selectedChapter: 1,
      selectedTranslationId: 'web',
      selectedVerseNumbers: [],
      translations,
    };

    expect(
      createBiblePassageSaveInput({
        ...baseInput,
        bibleChapter: null,
      }),
    ).toBeNull();
    expect(
      createBiblePassageSaveInput({
        ...baseInput,
        bibleChapter,
        selectedBook: undefined,
      }),
    ).toBeNull();
  });
});
