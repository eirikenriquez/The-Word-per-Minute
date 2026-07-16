import { useCallback, useState } from "react";
import type { AppHeaderProps } from "../components/AppHeader";
import type { AppRoutesProps } from "../components/AppRoutes";
import { useAuthSession } from "../../domain/auth/useAuthSession";
import { useReaderSelection } from "../../domain/bible/hooks/useReaderSelection";
import { useVerseLibrary } from "../../domain/bible/hooks/useVerseLibrary";
import { useFeaturedPassages } from "../../domain/featured-passages/hooks/useFeaturedPassages";
import { usePassageCategories } from "../../domain/featured-passages/hooks/usePassageCategories";
import { usePracticePassage } from "../../domain/practice/hooks/usePracticePassage";
import { usePracticeAttempts } from "../../domain/practice/hooks/usePracticeAttempts";
import { usePracticeSession } from "../../domain/practice/hooks/usePracticeSession";
import { usePassageSaveInput } from "../../domain/saved-passages/hooks/usePassageSaveInput";
import { useSavePassageForm } from "../../domain/saved-passages/hooks/useSavePassageForm";
import { useSavedPassages } from "../../domain/saved-passages/hooks/useSavedPassages";
import type { PracticeSource } from "../../shared/types/app";
import type { PracticeCompletionResult } from "../../shared/types/practice";
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
    appMode,
    bibleChapter: bibleLibrary.chapter,
    featuredPassageResponse: featuredLibrary.passageResponse,
    practiceSource,
    savedPassageResponse: savedLibrary.passageResponse,
    selectedBook: bibleLibrary.selectedBook,
    selectedChapter: bibleLibrary.selectedChapter,
    selectedVerseNumbers: readerSelection.selectedVerseNumbers,
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
    appMode,
    canSaveCurrentPassage: Boolean(saveInput),
    headerReference,
    headerSubtitle,
    headerTitle,
    isCurrentPassageSaved,
    isSavingCurrentPassage: savedLibrary.isSaving,
    saveError: appMode === "bible" ? savedLibrary.mutationError : null,
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
