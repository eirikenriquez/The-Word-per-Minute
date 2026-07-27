import type { PracticeSource } from '../../../features/practice/types/practice';
import { APP_ROUTE_PATHS } from '../appRoutePaths';

export type PracticeRouteState = {
  passageId: string | null;
  source: PracticeSource;
};

type ResolvePracticeRouteStateParams = {
  featuredPassageIds: readonly string[];
  isSavedPassageListLoading: boolean;
  routeState: PracticeRouteState;
  savedPassageIds: readonly string[];
  selectedFeaturedPassageId: string;
  selectedSavedPassageId: string;
};

/**
 * Reads the shareable Practice selection from the current URL.
 */
export function readPracticeRouteState(
  searchParams: URLSearchParams,
): PracticeRouteState {
  const source = searchParams.get('source') === 'saved' ? 'saved' : 'featured';
  const passageId = normalisePassageId(searchParams.get('passage'));

  return {
    passageId,
    source,
  };
}

/**
 * Creates the canonical Practice URL for a source and optional passage.
 */
export function createPracticePath({ passageId, source }: PracticeRouteState) {
  const searchParams = new URLSearchParams({ source });
  const normalisedPassageId = normalisePassageId(passageId);

  if (normalisedPassageId) {
    searchParams.set('passage', normalisedPassageId);
  }

  return `${APP_ROUTE_PATHS.practice}?${searchParams.toString()}`;
}

/**
 * Resolves missing or invalid URL selections against the available passages.
 * Returns null while the required fallback data is still loading.
 */
export function resolvePracticeRouteState({
  featuredPassageIds,
  isSavedPassageListLoading,
  routeState,
  savedPassageIds,
  selectedFeaturedPassageId,
  selectedSavedPassageId,
}: ResolvePracticeRouteStateParams): PracticeRouteState | null {
  if (routeState.source === 'saved') {
    const savedPassageId = resolvePassageId(
      routeState.passageId,
      selectedSavedPassageId,
      savedPassageIds,
    );

    if (savedPassageId) {
      return {
        passageId: savedPassageId,
        source: 'saved',
      };
    }

    if (isSavedPassageListLoading) return null;
  }

  const featuredPassageId = resolvePassageId(
    routeState.source === 'featured' ? routeState.passageId : null,
    selectedFeaturedPassageId,
    featuredPassageIds,
  );

  return featuredPassageId
    ? {
        passageId: featuredPassageId,
        source: 'featured',
      }
    : null;
}

function resolvePassageId(
  requestedPassageId: string | null,
  selectedPassageId: string,
  passageIds: readonly string[],
) {
  if (requestedPassageId && passageIds.includes(requestedPassageId)) {
    return requestedPassageId;
  }

  if (selectedPassageId && passageIds.includes(selectedPassageId)) {
    return selectedPassageId;
  }

  return passageIds[0] ?? null;
}

function normalisePassageId(passageId: string | null) {
  const trimmedPassageId = passageId?.trim();
  return trimmedPassageId || null;
}
