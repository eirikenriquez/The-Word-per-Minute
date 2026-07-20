import type { useReaderSelection } from "../../domain/bible/hooks/useReaderSelection";
import type { useVerseLibrary } from "../../domain/bible/hooks/useVerseLibrary";
import type { usePracticeSession } from "../../domain/practice/hooks/usePracticeSession";
import type { useSavedPassages } from "../../domain/saved-passages/hooks/useSavedPassages";
import type { BiblePageProps } from "../../pages/bible/BiblePage";
import type { HomeCategory, HomePageProps } from "../../pages/home/HomePage";
import type { LibraryPageProps } from "../../pages/library/LibraryPage";
import type { PracticePageProps } from "../../pages/practice/PracticePage";
import type { ProfilePageProps } from "../../pages/profile/ProfilePage";
import type { PracticeSource } from "../../shared/types/app";
import type { PracticePassage } from "../../shared/types/practice";
import type { createAppActions } from "./createAppActions";
import type { usePracticeAttempts } from "../../domain/practice/hooks/usePracticeAttempts";

type AppActions = ReturnType<typeof createAppActions>;

export function createBiblePageProps({
  appActions,
  bibleLibrary,
  readerSelection,
  saveControls,
}: {
  appActions: AppActions;
  bibleLibrary: ReturnType<typeof useVerseLibrary>;
  readerSelection: ReturnType<typeof useReaderSelection>;
  saveControls: BiblePageProps["saveControls"];
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
    saveControls,
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
  isSignedIn,
  onCreateAccount,
  savedPassageCount,
}: {
  appActions: AppActions;
  featuredHomeCategories: HomeCategory[];
  isSignedIn: boolean;
  onCreateAccount: () => void;
  savedPassageCount: number;
}): HomePageProps {
  return {
    featuredHomeCategories,
    isSignedIn,
    onCreateAccount,
    savedPassageCount,
    onOpenBible: appActions.openBible,
    onOpenLibrary: appActions.openLibrary,
    onOpenProfile: appActions.openProfile,
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
    errorMessage: savedLibrary.listError ?? savedLibrary.mutationError,
    savedPassages: savedLibrary.savedPassages,
    onPracticeSavedPassage: appActions.selectSavedPractice,
    onReadSavedPassage: appActions.readSavedPassage,
    onRemoveSavedPassage: appActions.removeSavedPractice,
    onUpdateSavedPassage: savedLibrary.updatePassage,
  };
}

export function createPracticePageProps({
  appActions,
  attemptSaveError,
  canSaveReflection,
  canSaveCurrentPassage,
  isCurrentPassageSaved,
  isSavingReflection,
  isSignedIn,
  passage,
  practiceSession,
  practiceSource,
  practiceTitle,
  reflectionError,
  savedLibrary,
  translationName,
  onSaveCurrentPassage,
  onSaveReflection,
}: {
  appActions: AppActions;
  attemptSaveError: string | null;
  canSaveReflection: boolean;
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  isSavingReflection: boolean;
  isSignedIn: boolean;
  passage: PracticePassage | undefined;
  practiceSession: ReturnType<typeof usePracticeSession>;
  practiceSource: PracticeSource;
  practiceTitle: string;
  reflectionError: string | null;
  savedLibrary: ReturnType<typeof useSavedPassages>;
  translationName: string;
  onSaveCurrentPassage: () => void;
  onSaveReflection: (reflection: string) => Promise<boolean>;
}): PracticePageProps | null {
  if (!passage) return null;

  return {
    accuracy: practiceSession.accuracy,
    attemptSaveError,
    canSaveReflection,
    canSaveCurrentPassage,
    isCurrentPassageSaved,
    isPassageComplete: practiceSession.isPassageComplete,
    isSavingReflection,
    isSignedIn,
    passage,
    practiceSource,
    practiceTitle,
    progress: practiceSession.progress,
    reflectionError,
    savedPassages: savedLibrary.savedPassages,
    selectedSavedPassageId: savedLibrary.selectedSavedPassageId,
    status: practiceSession.status,
    translationName,
    typedText: practiceSession.typedText,
    wpm: practiceSession.wpm,
    onNextFeaturedPassage: appActions.nextFeaturedPassage,
    onOpenLibrary: appActions.openLibrary,
    onResetPractice: practiceSession.resetPractice,
    onSaveCurrentPassage,
    onSaveReflection,
    onSelectFeaturedPractice: appActions.selectFeaturedPractice,
    onSelectSavedPassage: appActions.selectSavedPractice,
    onTypingChange: practiceSession.handleTyping,
  };
}

export function createProfilePageProps({
  authSession,
  practiceAttempts,
}: {
  authSession: {
    isSignedIn: boolean;
    user?: {
      email?: string;
    } | null;
  };
  practiceAttempts: ReturnType<typeof usePracticeAttempts>;
}): ProfilePageProps {
  return {
    hasMoreRecentAttempts: practiceAttempts.hasMoreAttempts,
    isLoadingMoreRecentAttempts: practiceAttempts.isLoadingMore,
    isLoadingPracticeSummary: practiceAttempts.isLoadingSummary,
    isLoadingRecentAttempts: practiceAttempts.isLoading,
    isSignedIn: authSession.isSignedIn,
    practiceSummary: practiceAttempts.summary,
    practiceSummaryError: practiceAttempts.summaryError,
    recentAttemptsError: practiceAttempts.historyError,
    recentAttemptsLoadMoreError: practiceAttempts.loadMoreError,
    recentPracticeAttempts: practiceAttempts.recentAttempts,
    userEmail: authSession.user?.email,
    onLoadMoreRecentAttempts: practiceAttempts.loadMoreAttempts,
  };
}
