import featuredPassagesData from "../data/featuredPassages.json";
import translationsData from "../data/translations.json";
import webManifest from "../data/bibles/web/manifest.json";
import type {
  FeaturedPassage,
  FeaturedPassageListResponse,
  PassageResponse,
} from "../types/featuredPassage";
import type {
  BibleBook,
  BookListResponse,
  BookSummary,
  ChapterResponse,
  Translation,
  TranslationListResponse,
} from "../types/verse";
import { formatPassageReference } from "../utils/passageReference";

type BibleManifest = {
  translationId: string;
  books: BookSummary[];
};

const translations = translationsData.translations as Translation[];
const featuredPassages = featuredPassagesData.passages as FeaturedPassage[];
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

/**
 * Local data service with an API-shaped interface.
 * Swapping these methods to fetch from Vercel later should not require UI rewrites.
 */
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

  async getFeaturedPassages(): Promise<FeaturedPassageListResponse> {
    return {
      passages: featuredPassages,
    };
  },

  async getPassage(passageId: string): Promise<PassageResponse> {
    const passage = featuredPassages.find((availablePassage) => availablePassage.id === passageId);

    if (!passage) {
      throw new Error(`Passage not found: ${passageId}`);
    }

    const { translation, book, chapter } = await this.getChapter(
      passage.translationId,
      passage.bookId,
      passage.chapter,
    );
    // Featured passages store references; the service resolves them into actual verse text.
    const verses = chapter.verses.filter(
      (verse) => verse.number >= passage.startVerse && verse.number <= passage.endVerse,
    );

    if (!verses.length) {
      throw new Error(`No verses found for passage: ${passageId}`);
    }

    return {
      passage,
      reference: formatPassageReference(
        book.name,
        passage.chapter,
        passage.startVerse,
        passage.endVerse,
      ),
      translation,
      bookName: book.name,
      chapter,
      verses,
    };
  },

};
