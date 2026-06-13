import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppErrorState } from "./app/components/AppErrorState";
import { AppHeader } from "./app/components/AppHeader";
import { AppLoadingState } from "./app/components/AppLoadingState";
import { AppPageRoutes } from "./app/components/AppPageRoutes";
import { useAppActions } from "./app/hooks/useAppActions";
import { useAppDisplayState } from "./app/hooks/useAppDisplayState";
import { useAppModeEffects } from "./app/hooks/useAppModeEffects";
import { getAppModeFromPathname, getPathnameFromAppMode } from "./app/routes/appRoutePaths";
import { useReaderSelection } from "./features/bible-reader/hooks/useReaderSelection";
import { useVerseLibrary } from "./features/bible-reader/hooks/useVerseLibrary";
import { useFeaturedPassages } from "./features/featured-passages/hooks/useFeaturedPassages";
import { usePassageCategories } from "./features/featured-passages/hooks/usePassageCategories";
import { usePracticeBatches } from "./features/practice/hooks/usePracticeBatches";
import { usePracticeSession } from "./features/practice/hooks/usePracticeSession";
import { usePracticeStats } from "./features/practice/hooks/usePracticeStats";
import { usePassageSaveInput } from "./features/saved-passages/hooks/usePassageSaveInput";
import { useSavePassageForm } from "./features/saved-passages/hooks/useSavePassageForm";
import { useSavedPassages } from "./features/saved-passages/hooks/useSavedPassages";
import { PageShell } from "./shared/components/PageShell";
import { useTheme } from "./shared/hooks/useTheme";
import type { AppMode, PracticeSource } from "./types/appMode";

/**
 * Main practice screen.
 * Owns the active mode, current typing state, and the handoff between data hooks and UI panels.
 */
function App() {
  // App shell setup: URL mode, theme, and the selected practice source.
  const location = useLocation();
  const navigate = useNavigate();
  const appMode = getAppModeFromPathname(location.pathname);
  const [practiceSource, setPracticeSource] = useState<PracticeSource>("featured");
  const { theme, toggleTheme } = useTheme();

  // Feature data sources. These hooks own their own loading, error, and selection state.
  const readerSelection = useReaderSelection();
  const { stats, recordCompletedAttempt, resetStats } = usePracticeStats();
  const featuredLibrary = useFeaturedPassages();
  const bibleLibrary = useVerseLibrary();
  const savedLibrary = useSavedPassages();
  const savedPassageCount = savedLibrary.savedPassages.length;
  const { featuredHomeCategories, savedPassageCategories } = usePassageCategories(featuredLibrary.passages);

  // Practice state is built from whichever source the user is currently typing from.
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

  // Display and save state are derived from the active mode and selected passage.
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

  // Navigation helpers translate app modes into real browser paths.
  const selectAppMode = useCallback(
    (mode: AppMode) => {
      navigate(getPathnameFromAppMode(mode));
    },
    [navigate],
  );

  // App-level effects and actions keep cross-feature behaviour in one place.
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

  // App-level guards keep incomplete data out of the page tree.
  if (isLoading) {
    return (
      <PageShell theme={theme} onToggleTheme={toggleTheme}>
        <AppLoadingState />
      </PageShell>
    );
  }

  if (error || (appMode === "practice" && !currentBatch)) {
    const errorMessage =
      error ?? (practiceSource === "saved" ? "Save a passage first." : "No practice passage found.");

    return (
      <PageShell theme={theme} onToggleTheme={toggleTheme}>
        <AppErrorState message={errorMessage} />
      </PageShell>
    );
  }

  return (
    <PageShell theme={theme} onToggleTheme={toggleTheme}>
      <div key={appMode} className="page-transition grid gap-4">
        <AppHeader
          appMode={appMode}
          canSaveCurrentPassage={Boolean(saveInput)}
          hasSavedPassages={savedPassageCount > 0}
          isCurrentPassageSaved={isCurrentPassageSaved}
          practiceReference={practiceReference}
          practiceSubtitle={practiceSubtitle}
          practiceTitle={practiceTitle}
          saveCategory={saveCategory}
          savedPassageCategories={savedPassageCategories}
          saveTitle={saveTitle}
          showPracticeSave={appMode === "practice" && practiceSource === "featured"}
          onSaveCategoryChange={setSaveCategory}
          onSaveCurrentPassage={saveCurrentPassage}
          onSaveTitleChange={setSaveTitle}
          onSelectMode={selectAppMode}
        />

        <AppPageRoutes
          appActions={appActions}
          bibleLibrary={bibleLibrary}
          batches={batches}
          currentBatch={currentBatch}
          featuredHomeCategories={featuredHomeCategories}
          practiceSession={practiceSession}
          practiceSource={practiceSource}
          practiceTitle={practiceTitle}
          readerSelection={readerSelection}
          resetStats={resetStats}
          savedLibrary={savedLibrary}
          stats={stats}
          translationName={translationName}
        />
      </div>
    </PageShell>
  );
}

export default App;
