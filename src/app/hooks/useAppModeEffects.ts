import { useEffect } from 'react';
import type { PracticeSource } from '@/features/practice/types/practice';

type UseAppModeEffectsParams = {
  featuredSelectedPassageId: string;
  practiceSource: PracticeSource;
  resetPractice: () => void;
  savedSelectedPassageId: string;
};

/**
 * Keeps practice state valid when backing data changes.
 * Saved-practice mode should fall back when no saved passages remain.
 */
export function useAppModeEffects({
  featuredSelectedPassageId,
  practiceSource,
  resetPractice,
  savedSelectedPassageId,
}: UseAppModeEffectsParams) {
  useEffect(() => {
    resetPractice();
  }, [
    featuredSelectedPassageId,
    practiceSource,
    resetPractice,
    savedSelectedPassageId,
  ]);
}
