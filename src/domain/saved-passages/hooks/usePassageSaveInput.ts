import { useMemo } from "react";
import { DEFAULT_SAVED_CATEGORY, getDefaultSavedCategory } from "../savedPassageCategories";
import type { AppMode, PracticeSource } from "../../../shared/types/app";
import type { PassageResponse } from "../../../shared/types/featuredPassage";
import type { SavePassageInput } from "../../../shared/types/savedPassage";
import type { BibleChapter, BookSummary, Translation } from "../../../shared/types/verse";
import { formatPassageReference, formatSelectedVerseReference } from "../../../shared/utils/passageReference";

type UsePassageSaveInputParams = {
  appMode: AppMode;
  bibleChapter: BibleChapter | null;
  practiceSource: PracticeSource;
  featuredPassageResponse: PassageResponse | null;
  savedPassageCategories: string[];
  selectedBook?: BookSummary;
  selectedChapter: number;
  selectedTranslationId: string;
  selectedVerseNumbers: number[];
  translations: Translation[];
};

/**
 * Builds the save payload for the currently visible saveable passage.
 * Featured practice and Bible reader selections have different metadata rules, so they live here.
 */
export function usePassageSaveInput({
  appMode,
  bibleChapter,
  practiceSource,
  featuredPassageResponse,
  savedPassageCategories,
  selectedBook,
  selectedChapter,
  selectedTranslationId,
  selectedVerseNumbers,
  translations,
}: UsePassageSaveInputParams) {
  return useMemo((): SavePassageInput | null => {
    if (appMode === "practice" && practiceSource === "featured" && featuredPassageResponse) {
      const { passage, reference, translation, bookName } = featuredPassageResponse;

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

    if (appMode === "bible" && bibleChapter && selectedBook) {
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

    return null;
  }, [
    appMode,
    bibleChapter,
    featuredPassageResponse,
    practiceSource,
    savedPassageCategories,
    selectedBook,
    selectedChapter,
    selectedTranslationId,
    selectedVerseNumbers,
    translations,
  ]);
}
