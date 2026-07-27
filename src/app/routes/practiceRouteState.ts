import type { PracticeSource } from '../../features/practice/types/practice';
import { APP_ROUTE_PATHS } from './appRoutePaths';

export type PracticeRouteState = {
  passageId: string | null;
  source: PracticeSource;
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

function normalisePassageId(passageId: string | null) {
  const trimmedPassageId = passageId?.trim();
  return trimmedPassageId || null;
}
