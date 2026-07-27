import type { AppMode } from '../../types/app';
import type { FeaturedPassage } from '../../features/featured-passages/types/featuredPassage';
import { getRandomFeaturedPassage } from '../../features/featured-passages/utils/featuredPassageSelection';
import type { PracticeRouteState } from '../routes/practiceRouteState';

type CreateAppActionsParams = {
  featuredPassages: FeaturedPassage[];
  featuredSelectedPassageId: string;
  resetPractice: () => void;
  selectPracticeRoute: (routeState: PracticeRouteState) => void;
  setAppMode: (mode: AppMode) => void;
};

/**
 * Centralises cross-page actions that coordinate several stores at once.
 * Pure page-local interactions should stay inside their page or feature hooks.
 */
export function createAppActions({
  featuredPassages,
  featuredSelectedPassageId,
  resetPractice,
  selectPracticeRoute,
  setAppMode,
}: CreateAppActionsParams) {
  function openLibrary() {
    setAppMode('library');
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

  return {
    nextFeaturedPassage,
    openLibrary,
    selectFeaturedPractice,
    selectSavedPractice,
  };
}
