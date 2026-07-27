import { useEffect } from 'react';
import type { PracticeSource } from '@/features/practice/types/practice';
import type { AppMode } from '../../types/app';

type UseAppModeEffectsParams = {
  appMode: AppMode;
  bibleSelectedBookId: string;
  bibleSelectedChapter: number;
  featuredSelectedPassageId: string;
  practiceSource: PracticeSource;
  resetPractice: () => void;
  savedSelectedPassageId: string;
  selectedVerseNumbers: number[];
};

/**
 * Keeps practice state valid when backing data changes.
 * Saved-practice mode should fall back when no saved passages remain.
 */
export function useAppModeEffects({
  appMode,
  bibleSelectedBookId,
  bibleSelectedChapter,
  featuredSelectedPassageId,
  practiceSource,
  resetPractice,
  savedSelectedPassageId,
  selectedVerseNumbers,
}: UseAppModeEffectsParams) {
  useEffect(() => {
    resetPractice();
  }, [
    appMode,
    bibleSelectedBookId,
    bibleSelectedChapter,
    featuredSelectedPassageId,
    practiceSource,
    resetPractice,
    savedSelectedPassageId,
    selectedVerseNumbers,
  ]);
}
