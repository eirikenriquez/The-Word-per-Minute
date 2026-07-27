import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  createPracticePath,
  readPracticeRouteState,
  resolvePracticeRouteState,
  type PracticeRouteState,
} from '../routes/practiceRouteState';

type PassageOption = {
  id: string;
};

type UsePracticeRouteSelectionParams = {
  featuredPassages: readonly PassageOption[];
  isSavedPassageListLoading: boolean;
  savedPassages: readonly PassageOption[];
  selectedFeaturedPassageId: string;
  selectedSavedPassageId: string;
  selectFeaturedPassage: (passageId: string) => void;
  selectSavedPassage: (passageId: string) => void;
};

type SelectPracticeRouteOptions = {
  replace?: boolean;
};

/**
 * Keeps the shareable Practice URL and feature selections synchronized.
 */
export function usePracticeRouteSelection({
  featuredPassages,
  isSavedPassageListLoading,
  savedPassages,
  selectedFeaturedPassageId,
  selectedSavedPassageId,
  selectFeaturedPassage,
  selectSavedPassage,
}: UsePracticeRouteSelectionParams) {
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = useMemo(
    () => readPracticeRouteState(new URLSearchParams(location.search)),
    [location.search],
  );
  const resolvedRouteState = useMemo(
    () =>
      resolvePracticeRouteState({
        featuredPassageIds: featuredPassages.map((passage) => passage.id),
        isSavedPassageListLoading,
        routeState,
        savedPassageIds: savedPassages.map((passage) => passage.id),
        selectedFeaturedPassageId,
        selectedSavedPassageId,
      }),
    [
      featuredPassages,
      isSavedPassageListLoading,
      routeState,
      savedPassages,
      selectedFeaturedPassageId,
      selectedSavedPassageId,
    ],
  );

  const selectPracticeRoute = useCallback(
    (
      nextRouteState: PracticeRouteState,
      options: SelectPracticeRouteOptions = {},
    ) => {
      if (nextRouteState.passageId) {
        if (
          nextRouteState.source === 'featured' &&
          nextRouteState.passageId !== selectedFeaturedPassageId
        ) {
          selectFeaturedPassage(nextRouteState.passageId);
        } else if (
          nextRouteState.source === 'saved' &&
          nextRouteState.passageId !== selectedSavedPassageId
        ) {
          selectSavedPassage(nextRouteState.passageId);
        }
      }

      const nextPath = createPracticePath(nextRouteState);
      const currentPath = `${location.pathname}${location.search}`;
      if (nextPath !== currentPath) {
        void navigate(nextPath, { replace: options.replace });
      }
    },
    [
      location.pathname,
      location.search,
      navigate,
      selectedFeaturedPassageId,
      selectedSavedPassageId,
      selectFeaturedPassage,
      selectSavedPassage,
    ],
  );

  useEffect(() => {
    if (!resolvedRouteState) return;

    selectPracticeRoute(resolvedRouteState, { replace: true });
  }, [resolvedRouteState, selectPracticeRoute]);

  return {
    practiceSource: resolvedRouteState?.source ?? routeState.source,
    selectPracticeRoute,
  };
}
