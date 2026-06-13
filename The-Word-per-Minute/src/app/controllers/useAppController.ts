import { useState } from "react";
import type { AppHeaderProps } from "../components/AppHeader";
import type { AppPageRoutesProps } from "../components/AppPageRoutes";
import { useReaderSelection } from "../../features/bible-reader/hooks/useReaderSelection";
import { useVerseLibrary } from "../../features/bible-reader/hooks/useVerseLibrary";
import { useFeaturedPassages } from "../../features/featured-passages/hooks/useFeaturedPassages";
import { usePassageCategories } from "../../features/featured-passages/hooks/usePassageCategories";
import { usePracticeBatches } from "../../features/practice/hooks/usePracticeBatches";
import { usePracticeSession } from "../../features/practice/hooks/usePracticeSession";
import { usePracticeStats } from "../../features/practice/hooks/usePracticeStats";
import { usePassageSaveInput } from "../../features/saved-passages/hooks/usePassageSaveInput";
import { useSavePassageForm } from "../../features/saved-passages/hooks/useSavePassageForm";
import { useSavedPassages } from "../../features/saved-passages/hooks/useSavedPassages";
import type { PracticeSource } from "../../types/appMode";
import { useAppActions } from "../hooks/useAppActions";
import { useAppDisplayState } from "../hooks/useAppDisplayState";
import { useAppModeEffects } from "../hooks/useAppModeEffects";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useTheme } from "../hooks/useTheme";
import { useBiblePageController } from "./useBiblePageController";
import { useHomePageController } from "./useHomePageController";
import { useLibraryPageController } from "./useLibraryPageController";
import { usePracticePageController } from "./usePracticePageController";

/**
 * App-level controller for cross-feature state.
 * Page-specific prop wiring is delegated to page controllers below this layer.
 */
export function useAppController() {
  const { appMode, selectAppMode } = useAppNavigation();
  const [practiceSource, setPracticeSource] = useState<PracticeSource>("featured");
  const { theme, toggleTheme } = useTheme();

  const readerSelection = useReaderSelection();
  const { stats, recordCompletedAttempt, resetStats } = usePracticeStats();
  const featuredLibrary = useFeaturedPassages();
  const bibleLibrary = useVerseLibrary();
  const savedLibrary = useSavedPassages();
  const savedPassageCount = savedLibrary.savedPassages.length;
  const { featuredHomeCategories, savedPassageCategories } = usePassageCategories(featuredLibrary.passages);

  const { batches } = usePracticeBatches({
    appMode,
    bibleChapter: bibleLibrary.chapter,
    featuredPassageResponse: featuredLibrary.passageResponse,
    practiceSource,
    savedPassageResponse: savedLibrary.passageResponse,
    selectedBook: bibleLibrary.selectedBook,
    selectedChapter: bibleLibrary.selectedChapter,
    selectedVerseNumbers: readerSelection.selectedVerseNumbers,
  });

  const practiceSession = usePracticeSession({
    batches,
    onCompletedAttempt: recordCompletedAttempt,
  });
  const { currentBatch, resetPractice } = practiceSession;

  const { error, isLoading, practiceReference, practiceSubtitle, practiceTitle, translationName } =
    useAppDisplayState({
      appMode,
      bibleError: bibleLibrary.error,
      bibleIsLoading: bibleLibrary.isLoading,
      featuredError: featuredLibrary.error,
      featuredIsLoading: featuredLibrary.isLoading,
      featuredPassageResponse: featuredLibrary.passageResponse,
      practiceSource,
      savedError: savedLibrary.error,
      savedIsLoading: savedLibrary.isLoading,
      savedPassageCount,
      selectedBook: bibleLibrary.selectedBook,
      selectedChapter: bibleLibrary.selectedChapter,
      selectedSavedPassage: savedLibrary.selectedSavedPassage,
      selectedTranslationId: bibleLibrary.selectedTranslationId,
      selectedVerseNumbers: readerSelection.selectedVerseNumbers,
      translations: bibleLibrary.translations,
    });
  const saveInput = usePassageSaveInput({
    appMode,
    bibleChapter: bibleLibrary.chapter,
    featuredPassageResponse: featuredLibrary.passageResponse,
    practiceSource,
    savedPassageCategories,
    selectedBook: bibleLibrary.selectedBook,
    selectedChapter: bibleLibrary.selectedChapter,
    selectedTranslationId: bibleLibrary.selectedTranslationId,
    selectedVerseNumbers: readerSelection.selectedVerseNumbers,
    translations: bibleLibrary.translations,
  });
  const {
    isCurrentPassageSaved,
    saveCategory,
    saveCurrentPassage,
    saveTitle,
    setSaveCategory,
    setSaveTitle,
  } = useSavePassageForm({
    appMode,
    isPassageSaved: savedLibrary.isPassageSaved,
    saveInput,
    savePassage: savedLibrary.savePassage,
  });

  useAppModeEffects({
    appMode,
    bibleSelectedBookId: bibleLibrary.selectedBookId,
    bibleSelectedChapter: bibleLibrary.selectedChapter,
    featuredSelectedPassageId: featuredLibrary.selectedPassageId,
    practiceSource,
    resetPractice,
    savedPassageCount,
    savedSelectedPassageId: savedLibrary.selectedSavedPassageId,
    selectedVerseNumbers: readerSelection.selectedVerseNumbers,
    setAppMode: selectAppMode,
    setPracticeSource,
  });
  const appActions = useAppActions({
    clearReaderSelection: readerSelection.clearSelection,
    featuredPassages: featuredLibrary.passages,
    focusSelectedVerses: readerSelection.focusSelectedVerses,
    removeSavedPassage: savedLibrary.removePassage,
    resetPractice,
    savedPassages: savedLibrary.savedPassages,
    selectBibleBook: bibleLibrary.selectBook,
    selectBibleChapter: bibleLibrary.selectChapter,
    selectFeaturedPassage: featuredLibrary.selectPassage,
    selectRandomFeaturedPassage: featuredLibrary.selectRandomPassage,
    selectSavedPassage: savedLibrary.selectSavedPassage,
    selectTranslation: bibleLibrary.selectTranslation,
    selectedSavedPassageId: savedLibrary.selectedSavedPassageId,
    setAppMode: selectAppMode,
    setPracticeSource,
    setSelectedVerseNumbers: readerSelection.setSelectedVerseNumbers,
  });

  const errorMessage =
    error ?? (appMode === "practice" && !currentBatch
      ? practiceSource === "saved"
        ? "Save a passage first."
        : "No practice passage found."
      : null);

  const headerProps: AppHeaderProps = {
    appMode,
    canSaveCurrentPassage: Boolean(saveInput),
    hasSavedPassages: savedPassageCount > 0,
    isCurrentPassageSaved,
    practiceReference,
    practiceSubtitle,
    practiceTitle,
    saveCategory,
    savedPassageCategories,
    saveTitle,
    showPracticeSave: appMode === "practice" && practiceSource === "featured",
    onSaveCategoryChange: setSaveCategory,
    onSaveCurrentPassage: saveCurrentPassage,
    onSaveTitleChange: setSaveTitle,
    onSelectMode: selectAppMode,
  };

  const pageRoutesProps: AppPageRoutesProps = {
    biblePageProps: useBiblePageController({
      appActions,
      bibleLibrary,
      readerSelection,
    }),
    homePageProps: useHomePageController({
      appActions,
      featuredHomeCategories,
      savedPassageCount,
    }),
    libraryPageProps: useLibraryPageController({
      appActions,
      savedLibrary,
    }),
    practicePageProps: usePracticePageController({
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
    }),
  };

  return {
    appMode,
    errorMessage,
    headerProps,
    isLoading,
    pageRoutesProps,
    theme,
    toggleTheme,
  };
}
