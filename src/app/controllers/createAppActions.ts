import type { AppMode } from '../../types/app';
import type { FeaturedPassage } from '../../features/featured-passages/types/featuredPassage';
import { getRandomFeaturedPassage } from '../../features/featured-passages/utils/featuredPassageSelection';
import type { SavedPassage } from '../../features/saved-passages/types/savedPassage';
import type { BibleRouteState } from '../routes/bibleRouteState';
import type { PracticeRouteState } from '../routes/practiceRouteState';

type CreateAppActionsParams = {
  featuredPassages: FeaturedPassage[];
  featuredSelectedPassageId: string;
  removeSavedPassage: (passageId: string) => void | Promise<void>;
  resetPractice: () => void;
  savedPassages: SavedPassage[];
  selectBibleRoute: (routeState: BibleRouteState) => void;
  selectPracticeRoute: (routeState: PracticeRouteState) => void;
  selectSavedPassage: (passageId: string) => void;
  selectedSavedPassageId: string;
  setAppMode: (mode: AppMode) => void;
};

/**
 * Centralises cross-page actions that coordinate several stores at once.
 * Pure page-local interactions should stay inside their page or feature hooks.
 */
export function createAppActions({
  featuredPassages,
  featuredSelectedPassageId,
  removeSavedPassage,
  resetPractice,
  savedPassages,
  selectBibleRoute,
  selectPracticeRoute,
  selectSavedPassage,
  selectedSavedPassageId,
  setAppMode,
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
    selectBibleRoute({
      bookId: passage.bookId,
      chapter: passage.chapter,
      selectedVerseNumbers: selectedVerses,
      translationId: passage.translationId,
    });
    resetPractice();
  }

  return {
    nextFeaturedPassage,
    openBible,
    openLibrary,
    openProfile,
    randomFeaturedReaderPassage,
    readSavedPassage,
    removeSavedPractice,
    selectFeaturedPractice,
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
