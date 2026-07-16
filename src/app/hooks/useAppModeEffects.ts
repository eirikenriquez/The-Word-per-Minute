import { useEffect } from "react";
import type { AppMode, PracticeSource } from "../../shared/types/app";

type UseAppModeEffectsParams = {
  appMode: AppMode;
  bibleSelectedBookId: string;
  bibleSelectedChapter: number;
  featuredSelectedPassageId: string;
  practiceSource: PracticeSource;
  resetPractice: () => void;
  savedPassageCount: number;
  savedSelectedPassageId: string;
  selectedVerseNumbers: number[];
  setPracticeSource: (source: PracticeSource) => void;
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
  savedPassageCount,
  savedSelectedPassageId,
  selectedVerseNumbers,
  setPracticeSource,
}: UseAppModeEffectsParams) {
  useEffect(() => {
    if (practiceSource === "saved" && !savedPassageCount) {
      setPracticeSource("featured");
    }
  }, [practiceSource, savedPassageCount, setPracticeSource]);

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
