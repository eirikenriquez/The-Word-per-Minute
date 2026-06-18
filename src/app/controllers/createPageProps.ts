import type { useReaderSelection } from "../../features/bible-reader/hooks/useReaderSelection";
import type { useVerseLibrary } from "../../features/bible-reader/hooks/useVerseLibrary";
import type { usePracticeSession } from "../../features/practice/hooks/usePracticeSession";
import type { useSavedPassages } from "../../features/saved-passages/hooks/useSavedPassages";
import type { BiblePageProps } from "../../pages/BiblePage";
import type { HomeCategory, HomePageProps } from "../../pages/HomePage";
import type { LibraryPageProps } from "../../pages/LibraryPage";
import type { PracticePageProps } from "../../pages/PracticePage";
import type { PracticeSource } from "../../types/app";
import type { PracticeBatch, PracticeStats } from "../../types/practice";
import type { createAppActions } from "./createAppActions";

type AppActions = ReturnType<typeof createAppActions>;

export function createBiblePageProps({
  appActions,
  bibleLibrary,
  readerSelection,
}: {
  appActions: AppActions;
  bibleLibrary: ReturnType<typeof useVerseLibrary>;
  readerSelection: ReturnType<typeof useReaderSelection>;
}): BiblePageProps {
  return {
    bibleBooks: bibleLibrary.books,
    bibleChapter: bibleLibrary.chapter,
    focusSelectedVerseKey: readerSelection.focusSelectedVerseKey,
    selectedBibleBook: bibleLibrary.selectedBook,
    selectedBibleBookId: bibleLibrary.selectedBookId,
    selectedBibleChapter: bibleLibrary.selectedChapter,
    selectedTranslationId: bibleLibrary.selectedTranslationId,
    selectedVerseNumbers: readerSelection.selectedVerseNumbers,
    translations: bibleLibrary.translations,
    onClearBibleSelection: appActions.clearBibleSelection,
    onRandomFeaturedReaderPassage: appActions.randomFeaturedReaderPassage,
    onSelectBibleBook: appActions.selectReaderBook,
    onSelectBibleChapter: appActions.selectReaderChapter,
    onSelectReaderRange: readerSelection.selectRange,
    onSelectReaderVerse: readerSelection.selectVerse,
    onSelectTranslation: appActions.selectReaderTranslation,
  };
}

export function createHomePageProps({
  appActions,
  featuredHomeCategories,
  savedPassageCount,
}: {
  appActions: AppActions;
  featuredHomeCategories: HomeCategory[];
  savedPassageCount: number;
}): HomePageProps {
  return {
    featuredHomeCategories,
    savedPassageCount,
    onOpenBible: appActions.openBible,
    onOpenLibrary: appActions.openLibrary,
    onSelectFeaturedCategory: appActions.startFeaturedCategory,
    onStartFeaturedPractice: appActions.startFeaturedPractice,
  };
}

export function createLibraryPageProps({
  appActions,
  savedLibrary,
}: {
  appActions: AppActions;
  savedLibrary: ReturnType<typeof useSavedPassages>;
}): LibraryPageProps {
  return {
    savedPassages: savedLibrary.savedPassages,
    selectedSavedPassageId: savedLibrary.selectedSavedPassageId,
    onRemoveSavedPassage: appActions.removeSavedPractice,
    onSelectSavedPassage: appActions.selectSavedPractice,
    onUpdateSavedPassage: savedLibrary.updatePassage,
  };
}

export function createPracticePageProps({
  appActions,
  batches,
  canSaveCurrentPassage,
  currentBatch,
  isCurrentPassageSaved,
  practiceSession,
  practiceSource,
  practiceTitle,
  resetStats,
  savedLibrary,
  stats,
  translationName,
  onSaveCurrentPassage,
}: {
  appActions: AppActions;
  batches: PracticeBatch[];
  canSaveCurrentPassage: boolean;
  currentBatch: PracticeBatch | undefined;
  isCurrentPassageSaved: boolean;
  practiceSession: ReturnType<typeof usePracticeSession>;
  practiceSource: PracticeSource;
  practiceTitle: string;
  resetStats: () => void;
  savedLibrary: ReturnType<typeof useSavedPassages>;
  stats: PracticeStats;
  translationName: string;
  onSaveCurrentPassage: () => void;
}): PracticePageProps | null {
  if (!currentBatch) return null;

  return {
    accuracy: practiceSession.accuracy,
    canSaveCurrentPassage,
    currentBatch,
    currentBatchIndex: practiceSession.currentBatchIndex,
    isCurrentPassageSaved,
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
    onSaveCurrentPassage,
    onSelectFeaturedPractice: appActions.selectFeaturedPractice,
    onSelectSavedPassage: appActions.selectSavedPractice,
    onTypingChange: practiceSession.handleTyping,
  };
}
