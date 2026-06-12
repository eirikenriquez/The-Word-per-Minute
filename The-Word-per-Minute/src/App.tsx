import { useState } from "react";
import { ModeHeaderPanel } from "./components/ModeHeaderPanel";
import { ModeContent } from "./components/ModeContent";
import { PageShell } from "./components/PageShell";
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
import { useAppActions } from "./hooks/useAppActions";
import { useAppDisplayState } from "./hooks/useAppDisplayState";
import { useAppModeEffects } from "./hooks/useAppModeEffects";
import { useTheme } from "./hooks/useTheme";
import type { AppMode, PracticeSource } from "./types/appMode";

/**
 * Main practice screen.
 * Owns the active mode, current typing state, and the handoff between data hooks and UI panels.
 */
function App() {
  const [appMode, setAppMode] = useState<AppMode>("home");
  const [practiceSource, setPracticeSource] = useState<PracticeSource>("featured");
  const { theme, toggleTheme } = useTheme();
  const readerSelection = useReaderSelection();
  const { stats, recordCompletedAttempt, resetStats } = usePracticeStats();
  const featuredLibrary = useFeaturedPassages();
  const bibleLibrary = useVerseLibrary();
  const savedLibrary = useSavedPassages();
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

  const {
    accuracy,
    currentBatch,
    currentBatchIndex,
    handleTyping,
    isBatchComplete,
    isPassageComplete,
    progress,
    resetPractice,
    status,
    typedText,
    wpm,
  } = usePracticeSession({
    batches,
    onCompletedAttempt: recordCompletedAttempt,
  });
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
      savedPassageCount: savedLibrary.savedPassages.length,
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
    savedPassageCount: savedLibrary.savedPassages.length,
    savedSelectedPassageId: savedLibrary.selectedSavedPassageId,
    selectedVerseNumbers: readerSelection.selectedVerseNumbers,
    setAppMode,
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
    setAppMode,
    setPracticeSource,
    setSelectedVerseNumbers: readerSelection.setSelectedVerseNumbers,
  });

  if (isLoading) {
    return (
      <PageShell theme={theme} onToggleTheme={toggleTheme}>
        <div className="rounded-xl border bg-white p-4 text-slate-600 shadow-sm">
          Loading practice passage...
        </div>
      </PageShell>
    );
  }

  if (error || (appMode === "practice" && !currentBatch)) {
    return (
      <PageShell theme={theme} onToggleTheme={toggleTheme}>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error ?? (practiceSource === "saved" ? "Save a passage first." : "No practice passage found.")}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell theme={theme} onToggleTheme={toggleTheme}>
      <div key={appMode} className="page-transition grid gap-4">
        <ModeHeaderPanel
          appMode={appMode}
          canSaveCurrentPassage={Boolean(saveInput)}
          hasSavedPassages={savedLibrary.savedPassages.length > 0}
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
          onSelectMode={setAppMode}
        />

        <ModeContent
          accuracy={accuracy}
          appMode={appMode}
          bibleBooks={bibleLibrary.books}
          bibleChapter={bibleLibrary.chapter}
          currentBatch={currentBatch}
          currentBatchIndex={currentBatchIndex}
          featuredHomeCategories={featuredHomeCategories}
          focusSelectedVerseKey={readerSelection.focusSelectedVerseKey}
          isBatchComplete={isBatchComplete}
          isPassageComplete={isPassageComplete}
          practiceSource={practiceSource}
          practiceTitle={practiceTitle}
          progress={progress}
          savedPassages={savedLibrary.savedPassages}
          selectedBibleBook={bibleLibrary.selectedBook}
          selectedBibleBookId={bibleLibrary.selectedBookId}
          selectedBibleChapter={bibleLibrary.selectedChapter}
          selectedSavedPassageId={savedLibrary.selectedSavedPassageId}
          selectedTranslationId={bibleLibrary.selectedTranslationId}
          selectedVerseNumbers={readerSelection.selectedVerseNumbers}
          stats={stats}
          status={status}
          totalBatches={batches.length}
          translations={bibleLibrary.translations}
          translationName={translationName}
          typedText={typedText}
          wpm={wpm}
          onClearBibleSelection={appActions.clearBibleSelection}
          onNextFeaturedPassage={appActions.nextFeaturedPassage}
          onOpenBible={appActions.openBible}
          onOpenLibrary={appActions.openLibrary}
          onRandomFeaturedReaderPassage={appActions.randomFeaturedReaderPassage}
          onRemoveSavedPassage={appActions.removeSavedPractice}
          onResetPractice={resetPractice}
          onResetStats={resetStats}
          onSelectBibleBook={appActions.selectReaderBook}
          onSelectBibleChapter={appActions.selectReaderChapter}
          onSelectFeaturedCategory={appActions.startFeaturedCategory}
          onSelectFeaturedPractice={appActions.selectFeaturedPractice}
          onSelectReaderRange={readerSelection.selectRange}
          onSelectReaderVerse={readerSelection.selectVerse}
          onSelectSavedPassage={appActions.selectSavedPractice}
          onSelectTranslation={appActions.selectReaderTranslation}
          onStartFeaturedPractice={appActions.startFeaturedPractice}
          onTypingChange={handleTyping}
          onUpdateSavedPassage={savedLibrary.updatePassage}
        />
      </div>
    </PageShell>
  );
}

export default App;
