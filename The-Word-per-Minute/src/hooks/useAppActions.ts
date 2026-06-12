import type { AppMode, PracticeSource } from "../types/appMode";
import type { FeaturedPassage } from "../types/featuredPassage";
import type { SavedPassage } from "../types/savedPassage";

type UseAppActionsParams = {
  clearReaderSelection: () => void;
  focusSelectedVerses: () => void;
  removeSavedPassage: (passageId: string) => void;
  resetPractice: () => void;
  savedPassages: SavedPassage[];
  selectBibleBook: (bookId: string) => void;
  selectBibleChapter: (chapterNumber: number) => void;
  selectFeaturedPassage: (passageId: string) => void;
  selectRandomFeaturedPassage: () => void;
  selectSavedPassage: (passageId: string) => void;
  selectTranslation: (translationId: string) => void;
  selectedSavedPassageId: string;
  setAppMode: (mode: AppMode) => void;
  setPracticeSource: (source: PracticeSource) => void;
  setSelectedVerseNumbers: (verseNumbers: number[]) => void;
  featuredPassages: FeaturedPassage[];
};

/**
 * Centralises cross-page actions that coordinate several stores at once.
 * Pure page-local interactions should stay inside their page or feature hooks.
 */
export function useAppActions({
  clearReaderSelection,
  featuredPassages,
  focusSelectedVerses,
  removeSavedPassage,
  resetPractice,
  savedPassages,
  selectBibleBook,
  selectBibleChapter,
  selectFeaturedPassage,
  selectRandomFeaturedPassage,
  selectSavedPassage,
  selectTranslation,
  selectedSavedPassageId,
  setAppMode,
  setPracticeSource,
  setSelectedVerseNumbers,
}: UseAppActionsParams) {
  function openBible() {
    setAppMode("bible");
    resetPractice();
  }

  function openLibrary() {
    const selectedPassageStillExists = savedPassages.some((passage) => passage.id === selectedSavedPassageId);

    if (!selectedPassageStillExists && savedPassages[0]) {
      selectSavedPassage(savedPassages[0].id);
    }

    setAppMode("library");
    resetPractice();
  }

  function startFeaturedPractice() {
    selectRandomFeaturedPassage();
    setPracticeSource("featured");
    setAppMode("practice");
    resetPractice();
  }

  function startFeaturedCategory(category: string) {
    const categoryPassages = featuredPassages.filter((passage) => passage.theme === category);
    const passage = categoryPassages[Math.floor(Math.random() * categoryPassages.length)];
    if (!passage) return;

    selectFeaturedPassage(passage.id);
    setPracticeSource("featured");
    setAppMode("practice");
    resetPractice();
  }

  function nextFeaturedPassage() {
    selectRandomFeaturedPassage();
    setPracticeSource("featured");
    setAppMode("practice");
    resetPractice();
  }

  function selectFeaturedPractice() {
    setPracticeSource("featured");
    setAppMode("practice");
    resetPractice();
  }

  function selectSavedPractice(passageId: string) {
    selectSavedPassage(passageId);
    setPracticeSource("saved");
    setAppMode("practice");
    resetPractice();
  }

  function removeSavedPractice(passageId: string) {
    removeSavedPassage(passageId);
    resetPractice();
  }

  function selectReaderTranslation(translationId: string) {
    selectTranslation(translationId);
    clearReaderSelection();
    setAppMode("bible");
    resetPractice();
  }

  function selectReaderBook(bookId: string) {
    selectBibleBook(bookId);
    clearReaderSelection();
    setAppMode("bible");
    resetPractice();
  }

  function selectReaderChapter(chapterNumber: number) {
    selectBibleChapter(chapterNumber);
    clearReaderSelection();
    setAppMode("bible");
    resetPractice();
  }

  function randomFeaturedReaderPassage() {
    const passage = featuredPassages[Math.floor(Math.random() * featuredPassages.length)];
    if (!passage) return;

    selectTranslation(passage.translationId);
    selectBibleBook(passage.bookId);
    selectBibleChapter(passage.chapter);
    setSelectedVerseNumbers(
      Array.from(
        { length: passage.endVerse - passage.startVerse + 1 },
        (_, index) => passage.startVerse + index,
      ),
    );
    focusSelectedVerses();
    setAppMode("bible");
    resetPractice();
  }

  function clearBibleSelection() {
    clearReaderSelection();
    resetPractice();
  }

  return {
    clearBibleSelection,
    nextFeaturedPassage,
    openBible,
    openLibrary,
    randomFeaturedReaderPassage,
    removeSavedPractice,
    selectFeaturedPractice,
    selectReaderBook,
    selectReaderChapter,
    selectReaderTranslation,
    selectSavedPractice,
    startFeaturedCategory,
    startFeaturedPractice,
  };
}
