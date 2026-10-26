import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  createPracticePath,
  readPracticeRouteState,
  resolvePracticeRouteState,
  type PracticeRouteState,
} from './practiceRouteState';

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
      const nextPath = createPracticePath(nextRouteState);
      const currentPath = `${location.pathname}${location.search}`;
      if (nextPath !== currentPath) {
        void navigate(nextPath, {
          replace: options.replace,
          preventScrollReset: true,
        });
      }
    },
    [location.pathname, location.search, navigate],
  );

  useEffect(() => {
    if (!resolvedRouteState) return;

    // Let the URL drive loading so navigation cannot start duplicate requests.
    const { source, passageId } = resolvedRouteState;
    if (passageId) {
      if (source === 'featured' && passageId !== selectedFeaturedPassageId) {
        selectFeaturedPassage(passageId);
      } else if (source === 'saved' && passageId !== selectedSavedPassageId) {
        selectSavedPassage(passageId);
      }
    }

    selectPracticeRoute(resolvedRouteState, { replace: true });
  }, [
    resolvedRouteState,
    selectedFeaturedPassageId,
    selectedSavedPassageId,
    selectFeaturedPassage,
    selectSavedPassage,
    selectPracticeRoute,
  ]);

  return {
    practiceSource: resolvedRouteState?.source ?? routeState.source,
    requestedPassageId: resolvedRouteState?.passageId ?? routeState.passageId,
    selectPracticeRoute,
  };
}
