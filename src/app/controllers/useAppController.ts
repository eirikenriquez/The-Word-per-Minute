import { useCallback, useMemo, useState } from "react";
import type { AppHeaderProps } from "../components/AppHeader";
import type { AppRoutesProps } from "../components/AppRoutes";
import { useAuthSession } from "../../features/auth/hooks/useAuthSession";
import { useReaderSelection } from "../../features/bible-reader/hooks/useReaderSelection";
import { useVerseLibrary } from "../../features/bible-reader/hooks/useVerseLibrary";
import { useFeaturedPassages } from "../../features/featured-passages/hooks/useFeaturedPassages";
import { usePracticePassage } from "../../features/practice/hooks/usePracticePassage";
import { usePracticeAttempts } from "../../features/practice/hooks/usePracticeAttempts";
import { usePracticeSession } from "../../features/practice/hooks/usePracticeSession";
import { useSavePassageForm } from "../../features/saved-passages/hooks/useSavePassageForm";
import { useSavedPassages } from "../../features/saved-passages/hooks/useSavedPassages";
import {
  createBiblePassageSaveInput,
  createFeaturedPassageSaveInput,
} from "../../features/saved-passages/utils/passageSaveInput";
import type { PracticeSource } from "../../types/app";
import type { PracticeCompletionResult } from "../../features/practice/types/practice";
import { useAppDisplayState } from "../hooks/useAppDisplayState";
import { useAppModeEffects } from "../hooks/useAppModeEffects";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { usePassageCategories } from "../hooks/usePassageCategories";
import { useTheme } from "../hooks/useTheme";
import { createAppActions } from "./createAppActions";
import {
  createBiblePageProps,
  createHomePageProps,
  createLibraryPageProps,
  createPracticePageProps,
  createProfilePageProps,
} from "./createPageProps";

/**
 * App-level controller for cross-feature state.
 * Page-specific prop wiring is delegated to page controllers below this layer.
 */
export function useAppController() {
  const { appMode, selectAppMode } = useAppNavigation();
  const [authMenuRequest, setAuthMenuRequest] = useState<{ id: number; mode: "signUp" } | null>(null);
  const [completedPracticeAttemptId, setCompletedPracticeAttemptId] = useState<string | null>(null);
  const [practiceSource, setPracticeSource] = useState<PracticeSource>("featured");
  const { theme, toggleTheme } = useTheme();
  const authSession = useAuthSession();

  const readerSelection = useReaderSelection();
  const featuredLibrary = useFeaturedPassages();
  const bibleLibrary = useVerseLibrary();
  const savedLibrary = useSavedPassages(authSession.user?.id);
  const practiceAttempts = usePracticeAttempts(authSession.user?.id);
  const {
    saveAttempt: savePracticeAttempt,
    updateReflection: updatePracticeReflection,
  } = practiceAttempts;
  const savedPassageCount = savedLibrary.savedPassages.length;
  const { featuredHomeCategories, savedPassageCategories } = usePassageCategories(featuredLibrary.passages);

  const practicePassage = usePracticePassage({
    enabled: appMode === "practice",
    featuredPassageResponse: featuredLibrary.passageResponse,
    practiceSource,
    savedPassageResponse: savedLibrary.passageResponse,
  });

  const handleCompletedPracticeAttempt = useCallback((result: PracticeCompletionResult) => {
    setCompletedPracticeAttemptId(null);

    const activePassageResponse =
      practiceSource === "featured"
        ? featuredLibrary.passageResponse
        : savedLibrary.passageResponse;

    if (!activePassageResponse) return;

    void savePracticeAttempt({
      accuracy: result.accuracy,
      bookId: activePassageResponse.passage.bookId,
      chapter: activePassageResponse.passage.chapter,
      durationSeconds: result.durationSeconds,
      endVerse: activePassageResponse.passage.endVerse,
      featuredPassageId: practiceSource === "featured" ? featuredLibrary.selectedPassageId : undefined,
      mistakeCount: result.mistakeCount,
      passageReference: activePassageResponse.reference,
      savedPassageId: practiceSource === "saved" ? savedLibrary.selectedSavedPassageId : undefined,
      selectedVerses: activePassageResponse.passage.selectedVerses,
      startVerse: activePassageResponse.passage.startVerse,
      translationId: activePassageResponse.translation.id,
      typedCharacterCount: result.typedCharacterCount,
      wpm: result.wpm,
    }).then((savedAttempt) => {
      if (savedAttempt) setCompletedPracticeAttemptId(savedAttempt.id);
    });
  }, [
    featuredLibrary.passageResponse,
    featuredLibrary.selectedPassageId,
    practiceSource,
    savePracticeAttempt,
    savedLibrary.passageResponse,
    savedLibrary.selectedSavedPassageId,
  ]);

  const practiceSession = usePracticeSession({
    passage: practicePassage,
    onCompletedAttempt: handleCompletedPracticeAttempt,
  });
  const { resetPractice } = practiceSession;

  const resetPracticeSession = useCallback(() => {
    resetPractice();
    setCompletedPracticeAttemptId(null);
  }, [resetPractice]);

  const savePracticeReflection = useCallback(async (reflection: string) => {
    if (!completedPracticeAttemptId) return false;

    const updatedAttempt = await updatePracticeReflection(completedPracticeAttemptId, reflection);
    return Boolean(updatedAttempt);
  }, [completedPracticeAttemptId, updatePracticeReflection]);

  const { error, headerReference, headerSubtitle, headerTitle, isLoading, translationName } =
    useAppDisplayState({
      appMode,
      bibleError: bibleLibrary.error,
      bibleIsLoading: bibleLibrary.isLoading,
      featuredError: featuredLibrary.error,
      featuredIsLoading: featuredLibrary.isLoading,
      featuredPassageResponse: featuredLibrary.passageResponse,
      practiceSource,
      savedPassageError: savedLibrary.selectedPassageError ?? savedLibrary.listError,
      savedIsLoading: savedLibrary.isLoading,
      savedPassageResponse: savedLibrary.passageResponse,
      savedPassageCount,
      selectedSavedPassage: savedLibrary.selectedSavedPassage,
      selectedTranslationId: bibleLibrary.selectedTranslationId,
      translations: bibleLibrary.translations,
    });
  const saveInput = useMemo(() => {
    if (appMode === "practice" && practiceSource === "featured") {
      return createFeaturedPassageSaveInput(
        featuredLibrary.passageResponse,
        savedPassageCategories,
      );
    }

    if (appMode === "bible") {
      return createBiblePassageSaveInput({
        bibleChapter: bibleLibrary.chapter,
        selectedBook: bibleLibrary.selectedBook,
        selectedChapter: bibleLibrary.selectedChapter,
        selectedTranslationId: bibleLibrary.selectedTranslationId,
        selectedVerseNumbers: readerSelection.selectedVerseNumbers,
        translations: bibleLibrary.translations,
      });
    }

    return null;
  }, [
    appMode,
    bibleLibrary.chapter,
    bibleLibrary.selectedBook,
    bibleLibrary.selectedChapter,
    bibleLibrary.selectedTranslationId,
    bibleLibrary.translations,
    featuredLibrary.passageResponse,
    practiceSource,
    readerSelection.selectedVerseNumbers,
    savedPassageCategories,
  ]);
  const {
    isCurrentPassageSaved,
    saveCategory,
    saveCurrentPassage,
    saveTitle,
    setSaveCategory,
    setSaveTitle,
  } = useSavePassageForm({
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
    resetPractice: resetPracticeSession,
    savedPassageCount,
    savedSelectedPassageId: savedLibrary.selectedSavedPassageId,
    selectedVerseNumbers: readerSelection.selectedVerseNumbers,
    setPracticeSource,
  });
  const appActions = createAppActions({
    clearReaderSelection: readerSelection.clearSelection,
    featuredPassages: featuredLibrary.passages,
    focusSelectedVerses: readerSelection.focusSelectedVerses,
    removeSavedPassage: savedLibrary.removePassage,
    resetPractice: resetPracticeSession,
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
    headerReference,
    headerSubtitle,
    headerTitle,
  };

  const pageRoutesProps: AppRoutesProps = {
    biblePageProps: createBiblePageProps({
      appActions,
      bibleLibrary,
      readerSelection,
      saveControls: {
        canSaveCurrentPassage: Boolean(saveInput),
        isCurrentPassageSaved,
        isSavingCurrentPassage: savedLibrary.isSaving,
        saveError: savedLibrary.mutationError,
        saveCategory,
        savedPassageCategories,
        saveTitle,
        onSaveCategoryChange: setSaveCategory,
        onSaveCurrentPassage: saveCurrentPassage,
        onSaveTitleChange: setSaveTitle,
      },
    }),
    homePageProps: createHomePageProps({
      appActions,
      featuredHomeCategories,
      isSignedIn: authSession.isSignedIn,
      onCreateAccount: () =>
        setAuthMenuRequest((currentRequest) => ({
          id: (currentRequest?.id ?? 0) + 1,
          mode: "signUp",
        })),
      savedPassageCount,
    }),
    libraryPageProps: createLibraryPageProps({
      appActions,
      savedLibrary,
    }),
    practicePageProps: createPracticePageProps({
      appActions,
      attemptSaveError: practiceAttempts.attemptSaveError,
      canSaveCurrentPassage: Boolean(saveInput),
      isCurrentPassageSaved,
      isSavingReflection: practiceAttempts.isSavingReflection,
      passage: practicePassage,
      practiceSession,
      practiceSource,
      practiceTitle: headerTitle,
      reflectionError: practiceAttempts.reflectionError,
      savedLibrary,
      canSaveReflection: authSession.isSignedIn && Boolean(completedPracticeAttemptId),
      isSignedIn: authSession.isSignedIn,
      translationName,
      onSaveCurrentPassage: saveCurrentPassage,
      onSaveReflection: savePracticeReflection,
    }),
    profilePageProps: createProfilePageProps({
      authSession,
      practiceAttempts,
    }),
  };

  return {
    appMode,
    authMenuRequest,
    authSession,
    errorMessage,
    headerProps,
    isLoading,
    onAuthMenuRequestHandled: () => setAuthMenuRequest(null),
    onSelectMode: selectAppMode,
    pageRoutesProps,
    theme,
    toggleTheme,
  };
}
