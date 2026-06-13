import type { useAppActions } from "../hooks/useAppActions";
import type { usePracticeSession } from "../../features/practice/hooks/usePracticeSession";
import type { useSavedPassages } from "../../features/saved-passages/hooks/useSavedPassages";
import type { PracticePageProps } from "../../pages/PracticePage";
import type { PracticeSource } from "../../types/appMode";
import type { PracticeStats } from "../../types/practice";
import type { PracticeBatch } from "../../types/practiceBatch";

type UsePracticePageControllerParams = {
  appActions: ReturnType<typeof useAppActions>;
  batches: PracticeBatch[];
  currentBatch: PracticeBatch | undefined;
  practiceSession: ReturnType<typeof usePracticeSession>;
  practiceSource: PracticeSource;
  practiceTitle: string;
  resetStats: () => void;
  savedLibrary: ReturnType<typeof useSavedPassages>;
  stats: PracticeStats;
  translationName: string;
};

/**
 * Prepares the props for the typing practice page.
 * Returns null until a current batch exists, so routes never render incomplete practice state.
 */
export function usePracticePageController({
  appActions,
  batches,
  currentBatch,
  practiceSession,
  practiceSource,
  practiceTitle,
  resetStats,
  savedLibrary,
  stats,
  translationName,
}: UsePracticePageControllerParams): PracticePageProps | null {
  if (!currentBatch) return null;

  return {
    accuracy: practiceSession.accuracy,
    currentBatch,
    currentBatchIndex: practiceSession.currentBatchIndex,
    isBatchComplete: practiceSession.isBatchComplete,
    isPassageComplete: practiceSession.isPassageComplete,
    practiceSource,
    practiceTitle,
    progress: practiceSession.progress,
    savedPassages: savedLibrary.savedPassages,
    selectedSavedPassageId: savedLibrary.selectedSavedPassageId,
    stats,
    status: practiceSession.status,
    totalBatches: batches.length,
    translationName,
    typedText: practiceSession.typedText,
    wpm: practiceSession.wpm,
    onNextFeaturedPassage: appActions.nextFeaturedPassage,
    onOpenLibrary: appActions.openLibrary,
    onResetPractice: practiceSession.resetPractice,
    onResetStats: resetStats,
    onSelectFeaturedPractice: appActions.selectFeaturedPractice,
    onSelectSavedPassage: appActions.selectSavedPractice,
    onTypingChange: practiceSession.handleTyping,
  };
}
