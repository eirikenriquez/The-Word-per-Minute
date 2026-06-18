import { useEffect } from "react";
import type { AppMode, PracticeSource } from "../../types/app";

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
  setAppMode: (mode: AppMode) => void;
  setPracticeSource: (source: PracticeSource) => void;
};

/**
 * Keeps mode state valid when backing data changes.
 * For example, saved-practice mode should fall back when no saved passages remain.
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
  setAppMode,
  setPracticeSource,
}: UseAppModeEffectsParams) {
  useEffect(() => {
    if (appMode === "library" && !savedPassageCount) {
      setAppMode("home");
    }
  }, [appMode, savedPassageCount, setAppMode]);

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
