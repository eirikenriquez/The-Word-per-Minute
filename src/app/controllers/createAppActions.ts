import type { AppMode, PracticeSource } from "../../shared/types/app";
import type { FeaturedPassage } from "../../shared/types/featuredPassage";
import type { SavedPassage } from "../../shared/types/savedPassage";

type CreateAppActionsParams = {
  clearReaderSelection: () => void;
  focusSelectedVerses: () => void;
  removeSavedPassage: (passageId: string) => void | Promise<void>;
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
export function createAppActions({
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
}: CreateAppActionsParams) {
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

    openReaderPassage(
      passage,
      createVerseRange(passage.startVerse, passage.endVerse),
    );
  }

  function readSavedPassage(passageId: string) {
    const passage = savedPassages.find((savedPassage) => savedPassage.id === passageId);
    if (!passage) return;

    const selectedVerses = passage.selectedVerses?.length
      ? passage.selectedVerses
      : passage.source === "featured"
        ? createVerseRange(passage.startVerse, passage.endVerse)
        : [];

    openReaderPassage(passage, selectedVerses);
  }

  function openReaderPassage(
    passage: Pick<SavedPassage | FeaturedPassage, "bookId" | "chapter" | "translationId">,
    selectedVerses: number[],
  ) {
    selectTranslation(passage.translationId);
    selectBibleBook(passage.bookId);
    selectBibleChapter(passage.chapter);
    setSelectedVerseNumbers(selectedVerses);

    if (selectedVerses.length) {
      focusSelectedVerses();
    }

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
    readSavedPassage,
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

function createVerseRange(startVerse: number, endVerse: number) {
  return Array.from(
    { length: endVerse - startVerse + 1 },
    (_, index) => startVerse + index,
  );
}
