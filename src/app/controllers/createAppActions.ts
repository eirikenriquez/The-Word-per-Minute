import type { AppMode } from '../../types/app';
import type { FeaturedPassage } from '../../features/featured-passages/types/featuredPassage';
import type { SavedPassage } from '../../features/saved-passages/types/savedPassage';
import type { PracticeRouteState } from '../routes/practiceRouteState';

type CreateAppActionsParams = {
  clearReaderSelection: () => void;
  featuredPassages: FeaturedPassage[];
  featuredSelectedPassageId: string;
  focusSelectedVerses: () => void;
  removeSavedPassage: (passageId: string) => void | Promise<void>;
  resetPractice: () => void;
  savedPassages: SavedPassage[];
  selectBibleBook: (bookId: string) => void;
  selectBibleChapter: (chapterNumber: number) => void;
  selectPracticeRoute: (routeState: PracticeRouteState) => void;
  selectSavedPassage: (passageId: string) => void;
  selectTranslation: (translationId: string) => void;
  selectedSavedPassageId: string;
  setAppMode: (mode: AppMode) => void;
  setSelectedVerseNumbers: (verseNumbers: number[]) => void;
};

/**
 * Centralises cross-page actions that coordinate several stores at once.
 * Pure page-local interactions should stay inside their page or feature hooks.
 */
export function createAppActions({
  clearReaderSelection,
  featuredPassages,
  featuredSelectedPassageId,
  focusSelectedVerses,
  removeSavedPassage,
  resetPractice,
  savedPassages,
  selectBibleBook,
  selectBibleChapter,
  selectPracticeRoute,
  selectSavedPassage,
  selectTranslation,
  selectedSavedPassageId,
  setAppMode,
  setSelectedVerseNumbers,
}: CreateAppActionsParams) {
  function openBible() {
    setAppMode('bible');
    resetPractice();
  }

  function openLibrary() {
    const selectedPassageStillExists = savedPassages.some(
      (passage) => passage.id === selectedSavedPassageId,
    );

    if (!selectedPassageStillExists && savedPassages[0]) {
      selectSavedPassage(savedPassages[0].id);
    }

    setAppMode('library');
    resetPractice();
  }

  function openProfile() {
    setAppMode('profile');
  }

  function startFeaturedPractice() {
    const passage = getRandomFeaturedPassage(
      featuredPassages,
      featuredSelectedPassageId,
    );
    selectPracticeRoute({
      passageId: passage?.id ?? null,
      source: 'featured',
    });
    resetPractice();
  }

  function startFeaturedCategory(category: string) {
    const categoryPassages = featuredPassages.filter(
      (passage) => passage.theme === category,
    );
    const passage =
      categoryPassages[Math.floor(Math.random() * categoryPassages.length)];
    if (!passage) return;

    selectPracticeRoute({
      passageId: passage.id,
      source: 'featured',
    });
    resetPractice();
  }

  function nextFeaturedPassage() {
    const passage = getRandomFeaturedPassage(
      featuredPassages,
      featuredSelectedPassageId,
    );
    selectPracticeRoute({
      passageId: passage?.id ?? null,
      source: 'featured',
    });
    resetPractice();
  }

  function selectFeaturedPractice() {
    selectPracticeRoute({
      passageId: featuredSelectedPassageId || null,
      source: 'featured',
    });
    resetPractice();
  }

  function selectSavedPractice(passageId: string) {
    selectPracticeRoute({
      passageId,
      source: 'saved',
    });
    resetPractice();
  }

  async function removeSavedPractice(passageId: string) {
    await removeSavedPassage(passageId);
    resetPractice();
  }

  function selectReaderTranslation(translationId: string) {
    selectTranslation(translationId);
    clearReaderSelection();
    setAppMode('bible');
    resetPractice();
  }

  function selectReaderBook(bookId: string) {
    selectBibleBook(bookId);
    clearReaderSelection();
    setAppMode('bible');
    resetPractice();
  }

  function selectReaderChapter(chapterNumber: number) {
    selectBibleChapter(chapterNumber);
    clearReaderSelection();
    setAppMode('bible');
    resetPractice();
  }

  function randomFeaturedReaderPassage() {
    const passage =
      featuredPassages[Math.floor(Math.random() * featuredPassages.length)];
    if (!passage) return;

    openReaderPassage(
      passage,
      createVerseRange(passage.startVerse, passage.endVerse),
    );
  }

  function readSavedPassage(passageId: string) {
    const passage = savedPassages.find(
      (savedPassage) => savedPassage.id === passageId,
    );
    if (!passage) return;

    const selectedVerses = passage.selectedVerses?.length
      ? passage.selectedVerses
      : passage.source === 'featured'
        ? createVerseRange(passage.startVerse, passage.endVerse)
        : [];

    openReaderPassage(passage, selectedVerses);
  }

  function openReaderPassage(
    passage: Pick<
      SavedPassage | FeaturedPassage,
      'bookId' | 'chapter' | 'translationId'
    >,
    selectedVerses: number[],
  ) {
    selectTranslation(passage.translationId);
    selectBibleBook(passage.bookId);
    selectBibleChapter(passage.chapter);
    setSelectedVerseNumbers(selectedVerses);

    if (selectedVerses.length) {
      focusSelectedVerses();
    }

    setAppMode('bible');
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
    openProfile,
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

function getRandomFeaturedPassage(
  passages: FeaturedPassage[],
  currentPassageId: string,
) {
  const otherPassages = passages.filter(
    (passage) => passage.id !== currentPassageId,
  );
  const availablePassages = otherPassages.length ? otherPassages : passages;
  return availablePassages[
    Math.floor(Math.random() * availablePassages.length)
  ];
}
