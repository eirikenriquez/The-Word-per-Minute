import { usePracticeAttemptHistory } from './usePracticeAttemptHistory';
import { usePracticeAttemptMutations } from './usePracticeAttemptMutations';

/**
 * Temporary compatibility facade for the legacy Practice controller.
 */
export function usePracticeAttempts(userId?: string | null) {
  const history = usePracticeAttemptHistory(userId);
  const mutations = usePracticeAttemptMutations(userId);

  return {
    ...history,
    ...mutations,
  };
}
