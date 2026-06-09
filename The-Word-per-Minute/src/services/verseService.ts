import translationsData from "../data/translations.json";
import webManifest from "../data/bibles/web/manifest.json";
import type {
  BibleBook,
  BookListResponse,
  BookSummary,
  ChapterResponse,
  PracticeVerseResponse,
  Translation,
  TranslationListResponse,
} from "../types/verse";

type BibleManifest = {
  translationId: string;
  books: BookSummary[];
};

const translations = translationsData.translations as Translation[];
const manifestsByTranslation: Record<string, BibleManifest> = {
  web: webManifest as BibleManifest,
};
const bookModules = import.meta.glob("../data/bibles/*/books/*.json");

function findTranslation(translationId: string) {
  return translations.find((translation) => translation.id === translationId);
}

async function loadBook(translationId: string, bookId: string) {
  const modulePath = `../data/bibles/${translationId}/books/${bookId}.json`;
  const loadModule = bookModules[modulePath];

  if (!loadModule) {
    throw new Error(`Book not found: ${translationId}/${bookId}`);
  }

  const bookModule = (await loadModule()) as { default: BibleBook };
  return bookModule.default;
}

export const verseService = {
  async getTranslations(): Promise<TranslationListResponse> {
    return {
      translations,
    };
  },

  async getBooks(translationId: string): Promise<BookListResponse> {
    const translation = findTranslation(translationId);
    const manifest = manifestsByTranslation[translationId];

    if (!translation || !manifest) {
      throw new Error(`Translation not found: ${translationId}`);
    }

    return {
      translation,
      books: manifest.books,
    };
  },

  async getChapter(translationId: string, bookId: string, chapterNumber: number): Promise<ChapterResponse> {
    const translation = findTranslation(translationId);
    const book = await loadBook(translationId, bookId);
    const chapter = book.chapters.find((availableChapter) => availableChapter.chapter === chapterNumber);

    if (!translation) {
      throw new Error(`Translation not found: ${translationId}`);
    }

    if (!chapter) {
      throw new Error(`Chapter not found: ${book.name} ${chapterNumber}`);
    }

    return {
      translation,
      book,
      chapter,
    };
  },

  async getPracticeVerse(
    translationId: string,
    bookId: string,
    chapterNumber: number,
    verseNumber: number,
  ): Promise<PracticeVerseResponse> {
    const { translation, book, chapter } = await this.getChapter(translationId, bookId, chapterNumber);
    const verse = chapter.verses.find((availableVerse) => availableVerse.number === verseNumber);

    if (!verse) {
      throw new Error(`Verse not found: ${book.name} ${chapterNumber}:${verseNumber}`);
    }

    return {
      translation,
      verse: {
        id: `${translationId}-${bookId}-${chapterNumber}-${verseNumber}`,
        translationId,
        translationName: translation.abbreviation,
        book: book.name,
        bookId,
        chapter: chapterNumber,
        verseStart: verseNumber,
        ref: `${book.name} ${chapterNumber}:${verseNumber}`,
        text: verse.text,
      },
    };
  },
};
