import type { BibleChapter, BookSummary, Translation } from "../../../types/bible";
import type { PassageResponse } from "../../../types/passage";
import {
  formatPassageReference,
  formatSelectedVerseReference,
} from "../../../utils/passageReference";
import {
  DEFAULT_SAVED_CATEGORY,
  getDefaultSavedCategory,
} from "../constants/savedPassageCategories";
import type { SavePassageInput } from "../types/savedPassage";

export function createFeaturedPassageSaveInput(
  passageResponse: PassageResponse | null,
  savedPassageCategories: string[],
): SavePassageInput | null {
  if (!passageResponse) return null;

  const { passage, reference, translation, bookName } = passageResponse;

  return {
    title: passage.title,
    theme: passage.theme,
    category: getDefaultSavedCategory(passage.theme, savedPassageCategories),
    reference,
    translationId: passage.translationId,
    translationAbbreviation: translation.abbreviation,
    bookId: passage.bookId,
    bookName,
    chapter: passage.chapter,
    startVerse: passage.startVerse,
    endVerse: passage.endVerse,
    source: "featured",
  };
}

type CreateBiblePassageSaveInputParams = {
  bibleChapter: BibleChapter | null;
  selectedBook?: BookSummary;
  selectedChapter: number;
  selectedTranslationId: string;
  selectedVerseNumbers: number[];
  translations: Translation[];
};

export function createBiblePassageSaveInput({
  bibleChapter,
  selectedBook,
  selectedChapter,
  selectedTranslationId,
  selectedVerseNumbers,
  translations,
}: CreateBiblePassageSaveInputParams): SavePassageInput | null {
  if (!bibleChapter || !selectedBook) return null;

  const translation = translations.find((availableTranslation) => {
    return availableTranslation.id === selectedTranslationId;
  });
  const lastVerse = bibleChapter.verses[bibleChapter.verses.length - 1];

  if (!lastVerse) return null;

  const startVerse = selectedVerseNumbers[0] ?? 1;
  const endVerse = selectedVerseNumbers[selectedVerseNumbers.length - 1] ?? lastVerse.number;
  const reference = selectedVerseNumbers.length
    ? formatSelectedVerseReference(selectedBook.name, selectedChapter, selectedVerseNumbers)
    : formatPassageReference(selectedBook.name, selectedChapter, startVerse, endVerse);

  return {
    title: reference,
    category: DEFAULT_SAVED_CATEGORY,
    theme: selectedVerseNumbers.length ? "Selected verses" : "Bible reader",
    reference,
    translationId: selectedTranslationId,
    translationAbbreviation: translation?.abbreviation ?? selectedTranslationId.toUpperCase(),
    bookId: selectedBook.id,
    bookName: selectedBook.name,
    chapter: selectedChapter,
    startVerse,
    endVerse,
    selectedVerses: selectedVerseNumbers.length ? selectedVerseNumbers : undefined,
    source: "bible",
  };
}
