import type { useReaderSelection } from "../../domain/bible/hooks/useReaderSelection";
import type { useVerseLibrary } from "../../domain/bible/hooks/useVerseLibrary";
import type { usePracticeSession } from "../../domain/practice/hooks/usePracticeSession";
import type { useSavedPassages } from "../../domain/saved-passages/hooks/useSavedPassages";
import type { BiblePageProps } from "../../pages/bible/BiblePage";
import type { HomeCategory, HomePageProps } from "../../pages/home/HomePage";
import type { LibraryPageProps } from "../../pages/library/LibraryPage";
import type { PracticePageProps } from "../../pages/practice/PracticePage";
import type { PracticeSource } from "../../shared/types/app";
import type { PracticePassage, PracticeStats } from "../../shared/types/practice";
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
    onReadSavedPassage: appActions.readSavedPassage,
    onRemoveSavedPassage: appActions.removeSavedPractice,
    onSelectSavedPassage: appActions.selectSavedPractice,
    onUpdateSavedPassage: savedLibrary.updatePassage,
  };
}

export function createPracticePageProps({
  appActions,
  canSaveCurrentPassage,
  isCurrentPassageSaved,
  passage,
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
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  passage: PracticePassage | undefined;
  practiceSession: ReturnType<typeof usePracticeSession>;
  practiceSource: PracticeSource;
  practiceTitle: string;
  resetStats: () => void;
  savedLibrary: ReturnType<typeof useSavedPassages>;
  stats: PracticeStats;
  translationName: string;
  onSaveCurrentPassage: () => void;
}): PracticePageProps | null {
  if (!passage) return null;

  return {
    accuracy: practiceSession.accuracy,
    canSaveCurrentPassage,
    isCurrentPassageSaved,
    isPassageComplete: practiceSession.isPassageComplete,
    passage,
    practiceSource,
    practiceTitle,
    progress: practiceSession.progress,
    savedPassages: savedLibrary.savedPassages,
    selectedSavedPassageId: savedLibrary.selectedSavedPassageId,
    stats,
    status: practiceSession.status,
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
