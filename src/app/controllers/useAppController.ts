import { useState } from "react";
import type { AppHeaderProps } from "../components/AppHeader";
import type { AppRoutesProps } from "../components/AppRoutes";
import { useReaderSelection } from "../../domain/bible/hooks/useReaderSelection";
import { useVerseLibrary } from "../../domain/bible/hooks/useVerseLibrary";
import { useFeaturedPassages } from "../../domain/featured-passages/hooks/useFeaturedPassages";
import { usePassageCategories } from "../../domain/featured-passages/hooks/usePassageCategories";
import { usePracticePassage } from "../../domain/practice/hooks/usePracticePassage";
import { usePracticeSession } from "../../domain/practice/hooks/usePracticeSession";
import { usePracticeStats } from "../../domain/practice/hooks/usePracticeStats";
import { usePassageSaveInput } from "../../domain/saved-passages/hooks/usePassageSaveInput";
import { useSavePassageForm } from "../../domain/saved-passages/hooks/useSavePassageForm";
import { useSavedPassages } from "../../domain/saved-passages/hooks/useSavedPassages";
import type { PracticeSource } from "../../shared/types/app";
import { useAppDisplayState } from "../hooks/useAppDisplayState";
import { useAppModeEffects } from "../hooks/useAppModeEffects";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useTheme } from "../hooks/useTheme";
import { createAppActions } from "./createAppActions";
import {
  createBiblePageProps,
  createHomePageProps,
  createLibraryPageProps,
  createPracticePageProps,
} from "./createPageProps";

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

  const practicePassage = usePracticePassage({
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
    passage: practicePassage,
    onCompletedAttempt: recordCompletedAttempt,
  });
  const { resetPractice } = practiceSession;

  const { error, headerReference, headerSubtitle, headerTitle, isLoading, translationName } =
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
      selectedSavedPassage: savedLibrary.selectedSavedPassage,
      selectedTranslationId: bibleLibrary.selectedTranslationId,
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
  const appActions = createAppActions({
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
    error ?? (appMode === "practice" && !practicePassage
      ? practiceSource === "saved"
        ? "Save a passage first."
        : "No practice passage found."
      : null);

  const headerProps: AppHeaderProps = {
    appMode,
    canSaveCurrentPassage: Boolean(saveInput),
    headerReference,
    headerSubtitle,
    headerTitle,
    isCurrentPassageSaved,
    saveCategory,
    savedPassageCategories,
    saveTitle,
    onSaveCategoryChange: setSaveCategory,
    onSaveCurrentPassage: saveCurrentPassage,
    onSaveTitleChange: setSaveTitle,
  };

  const pageRoutesProps: AppRoutesProps = {
    biblePageProps: createBiblePageProps({
      appActions,
      bibleLibrary,
      readerSelection,
    }),
    homePageProps: createHomePageProps({
      appActions,
      featuredHomeCategories,
      savedPassageCount,
    }),
    libraryPageProps: createLibraryPageProps({
      appActions,
      savedLibrary,
    }),
    practicePageProps: createPracticePageProps({
      appActions,
      canSaveCurrentPassage: Boolean(saveInput),
      isCurrentPassageSaved,
      passage: practicePassage,
      practiceSession,
      practiceSource,
      practiceTitle: headerTitle,
      resetStats,
      savedLibrary,
      stats,
      translationName,
      onSaveCurrentPassage: saveCurrentPassage,
    }),
  };

  return {
    appMode,
    errorMessage,
    hasSavedPassages: savedPassageCount > 0,
    headerProps,
    isLoading,
    onSelectMode: selectAppMode,
    pageRoutesProps,
    theme,
    toggleTheme,
  };
}
