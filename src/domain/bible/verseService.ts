import featuredPassagesData from "../../data/featuredPassages.json";
import translationsData from "../../data/translations.json";
import webManifest from "../../data/bibles/web/manifest.json";
import type {
  FeaturedPassage,
  FeaturedPassageListResponse,
  PassageReference,
  PassageResponse,
} from "../../types/featuredPassage";
import type {
  BibleBook,
  BookListResponse,
  BookSummary,
  ChapterResponse,
  Translation,
  TranslationListResponse,
} from "../../types/verse";
import { formatPassageReference, formatSelectedVerseReference } from "../../utils/passageReference";

type BibleManifest = {
  translationId: string;
  books: BookSummary[];
};

const translations = translationsData.translations as Translation[];
const featuredPassages = featuredPassagesData.passages as FeaturedPassage[];
const manifestsByTranslation: Record<string, BibleManifest> = {
  web: webManifest as BibleManifest,
};

// Vite keeps each book as a lazy module so the app does not load the full Bible immediately.
const bookModules = import.meta.glob("../../data/bibles/*/books/*.json");

/**
 * Looks up translation metadata before loading books or chapters.
 */
function findTranslation(translationId: string) {
  return translations.find((translation) => translation.id === translationId);
}

/**
 * Loads a single Bible book JSON file on demand.
 */
async function loadBook(translationId: string, bookId: string) {
  const modulePath = `../../data/bibles/${translationId}/books/${bookId}.json`;
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
  /**
   * Lists available local translations.
   */
  async getTranslations(): Promise<TranslationListResponse> {
    return {
      translations,
    };
  },

  /**
   * Lists the books for a translation without loading every full book file.
   */
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

  /**
   * Loads one chapter from one book.
   */
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

  /**
   * Lists curated prompts used by the default featured mode.
   */
  async getFeaturedPassages(): Promise<FeaturedPassageListResponse> {
    return {
      passages: featuredPassages,
    };
  },

  /**
   * Resolves a curated passage reference into verse text ready for typing.
   */
  async getPassage(passageId: string): Promise<PassageResponse> {
    const passage = featuredPassages.find((availablePassage) => availablePassage.id === passageId);

    if (!passage) {
      throw new Error(`Passage not found: ${passageId}`);
    }

    return this.getReferencePassage(passage);
  },

  /**
   * Resolves any structured reference into verse text ready for typing.
   */
  async getReferencePassage(passage: PassageReference): Promise<PassageResponse> {
    const { translation, book, chapter } = await this.getChapter(
      passage.translationId,
      passage.bookId,
      passage.chapter,
    );
    const selectedVerseSet = passage.selectedVerses?.length
      ? new Set(passage.selectedVerses)
      : null;
    const verses = selectedVerseSet
      ? chapter.verses.filter((verse) => selectedVerseSet.has(verse.number))
      : chapter.verses.filter(
          (verse) => verse.number >= passage.startVerse && verse.number <= passage.endVerse,
        );

    if (!verses.length) {
      throw new Error(`No verses found for passage: ${passage.title}`);
    }

    return {
      passage,
      reference: passage.selectedVerses?.length
        ? formatSelectedVerseReference(book.name, passage.chapter, passage.selectedVerses)
        : formatPassageReference(
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
