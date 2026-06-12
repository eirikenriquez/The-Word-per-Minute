import { useEffect, useMemo, useState } from "react";
import { ModeHeaderPanel } from "./components/ModeHeaderPanel";
import { ModeContent } from "./components/ModeContent";
import { PageShell } from "./components/PageShell";
import { CUSTOM_SAVED_CATEGORY, DEFAULT_SAVED_CATEGORY } from "./constants/savedPassageCategories";
import { useFeaturedPassages } from "./hooks/useFeaturedPassages";
import { usePassageSaveInput } from "./hooks/usePassageSaveInput";
import { usePracticeSession } from "./hooks/usePracticeSession";
import { usePracticeStats } from "./hooks/usePracticeStats";
import { useSavedPassages } from "./hooks/useSavedPassages";
import { useTheme } from "./hooks/useTheme";
import { useVerseLibrary } from "./hooks/useVerseLibrary";
import type { AppMode, PracticeSource } from "./types/appMode";
import { buildPracticeBatches } from "./utils/practiceBatches";
import { formatChapterReference, formatSelectedVerseReference } from "./utils/passageReference";

/**
 * Main practice screen.
 * Owns the active mode, current typing state, and the handoff between data hooks and UI panels.
 */
function App() {
  const [appMode, setAppMode] = useState<AppMode>("home");
  const [practiceSource, setPracticeSource] = useState<PracticeSource>("featured");
  const { theme, toggleTheme } = useTheme();
  const [selectedVerseNumbers, setSelectedVerseNumbers] = useState<number[]>([]);
  const [readerFocusKey, setReaderFocusKey] = useState(0);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveCategory, setSaveCategory] = useState(DEFAULT_SAVED_CATEGORY);
  const { stats, recordCompletedAttempt, resetStats } = usePracticeStats();
  const featuredLibrary = useFeaturedPassages();
  const bibleLibrary = useVerseLibrary();
  const savedLibrary = useSavedPassages();
  const savedPassageCategories = useMemo(() => {
    const featuredThemes = featuredLibrary.passages.map((passage) => passage.theme);
    return [...new Set([DEFAULT_SAVED_CATEGORY, ...featuredThemes, CUSTOM_SAVED_CATEGORY])];
  }, [featuredLibrary.passages]);
  const featuredHomeCategories = useMemo(() => {
    return [...new Set(featuredLibrary.passages.map((passage) => passage.theme))].map((theme) => ({
      count: featuredLibrary.passages.filter((passage) => passage.theme === theme).length,
      label: theme,
    }));
  }, [featuredLibrary.passages]);

  // Convert the selected featured passage into the same batch shape used by typing practice.
  const featuredBatches = useMemo(() => {
    const response = featuredLibrary.passageResponse;
    if (!response) return [];

    return buildPracticeBatches(response.bookName, response.passage.chapter, response.verses, 2);
  }, [featuredLibrary.passageResponse]);

  // Convert the Bible reader selection into short, karaoke-style typing batches.
  const bibleBatches = useMemo(() => {
    if (!bibleLibrary.chapter || !bibleLibrary.selectedBook) return [];
    const selectedVerseSet = new Set(selectedVerseNumbers);
    const selectedVerses = selectedVerseNumbers.length
      ? bibleLibrary.chapter.verses.filter((verse) => selectedVerseSet.has(verse.number))
      : bibleLibrary.chapter.verses;

    return buildPracticeBatches(
      bibleLibrary.selectedBook.name,
      bibleLibrary.selectedChapter,
      selectedVerses,
      2,
    );
  }, [bibleLibrary.chapter, bibleLibrary.selectedBook, bibleLibrary.selectedChapter, selectedVerseNumbers]);

  // Saved passages are stored as references, then resolved back into verse text for practice.
  const savedBatches = useMemo(() => {
    const response = savedLibrary.passageResponse;
    if (!response) return [];

    return buildPracticeBatches(response.bookName, response.passage.chapter, response.verses, 2);
  }, [savedLibrary.passageResponse]);
  const batches =
    appMode === "practice" && practiceSource === "featured"
      ? featuredBatches
      : appMode === "practice" && practiceSource === "saved"
        ? savedBatches
        : appMode === "bible"
        ? bibleBatches
          : [];

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
  const isLoading =
    appMode === "home"
      ? featuredLibrary.isLoading
      : appMode === "practice"
      ? practiceSource === "featured"
        ? featuredLibrary.isLoading
        : savedLibrary.isLoading
      : appMode === "bible"
        ? bibleLibrary.isLoading
        : false;
  const error =
    appMode === "home"
      ? featuredLibrary.error
      : appMode === "practice"
      ? practiceSource === "featured"
        ? featuredLibrary.error
        : savedLibrary.error
      : appMode === "bible"
        ? bibleLibrary.error
        : null;
  const practiceTitle =
    appMode === "home"
      ? "Welcome"
      : appMode === "practice"
      ? practiceSource === "featured"
        ? featuredLibrary.passageResponse?.passage.title ?? "Featured Passage"
        : savedLibrary.selectedSavedPassage?.title ?? "Saved Passage"
      : appMode === "bible"
        ? `${bibleLibrary.selectedBook?.name ?? "Bible"} ${bibleLibrary.selectedChapter}`
        : "Saved Library";
  const practiceReference =
    appMode === "home"
      ? ""
      : appMode === "practice"
      ? practiceSource === "featured"
        ? featuredLibrary.passageResponse?.reference ?? ""
        : savedLibrary.selectedSavedPassage?.reference ?? ""
      : appMode === "bible"
        ? bibleLibrary.selectedBook
          ? getBibleReaderReference()
          : ""
        : `${savedLibrary.savedPassages.length} saved`;
  const practiceSubtitle =
    appMode === "home"
      ? "The Word per Minute"
      : appMode === "practice"
      ? practiceSource === "featured"
        ? `Practice - ${featuredLibrary.passageResponse?.passage.theme ?? "Discovery"}`
        : "Practice - Saved passage"
      : appMode === "bible"
        ? "Bible reader"
        : "Saved library";
  const translationName =
    appMode === "home"
      ? "WEB"
      : appMode === "practice"
      ? practiceSource === "featured"
        ? featuredLibrary.passageResponse?.translation.abbreviation ?? "WEB"
        : savedLibrary.selectedSavedPassage?.translationAbbreviation ?? "WEB"
      : appMode === "bible"
        ? bibleLibrary.translations.find(
            (translation) => translation.id === bibleLibrary.selectedTranslationId,
          )?.abbreviation ?? bibleLibrary.selectedTranslationId.toUpperCase()
        : "WEB";
  const saveInput = usePassageSaveInput({
    appMode,
    bibleChapter: bibleLibrary.chapter,
    featuredPassageResponse: featuredLibrary.passageResponse,
    practiceSource,
    savedPassageCategories,
    selectedBook: bibleLibrary.selectedBook,
    selectedChapter: bibleLibrary.selectedChapter,
    selectedTranslationId: bibleLibrary.selectedTranslationId,
    selectedVerseNumbers,
    translations: bibleLibrary.translations,
  });
  const isCurrentPassageSaved = savedLibrary.isPassageSaved(saveInput);

  useEffect(() => {
    if (!saveInput) return;

    setSaveTitle(saveInput.title);
    setSaveCategory(saveInput.category);
  }, [saveInput]);

  useEffect(() => {
    if (appMode === "library" && !savedLibrary.savedPassages.length) {
      setAppMode("home");
    }
  }, [appMode, savedLibrary.savedPassages.length]);

  useEffect(() => {
    if (practiceSource === "saved" && !savedLibrary.savedPassages.length) {
      setPracticeSource("featured");
    }
  }, [practiceSource, savedLibrary.savedPassages.length]);

  // Changing the selected practice source should always restart the typing session.
  useEffect(() => {
    resetPractice();
  }, [
    appMode,
    practiceSource,
    featuredLibrary.selectedPassageId,
    bibleLibrary.selectedBookId,
    bibleLibrary.selectedChapter,
    resetPractice,
    selectedVerseNumbers,
    savedLibrary.selectedSavedPassageId,
  ]);

  /**
   * Picks a new curated passage and keeps the user in the featured practice flow.
   */
  function handleNextFeaturedPassage() {
    featuredLibrary.selectRandomPassage();
    setPracticeSource("featured");
    setAppMode("practice");
    resetPractice();
  }

  function handleStartFeaturedPractice() {
    featuredLibrary.selectRandomPassage();
    setPracticeSource("featured");
    setAppMode("practice");
    resetPractice();
  }

  function handleStartFeaturedCategory(category: string) {
    const categoryPassages = featuredLibrary.passages.filter((passage) => passage.theme === category);
    const passage = categoryPassages[Math.floor(Math.random() * categoryPassages.length)];
    if (!passage) return;

    featuredLibrary.selectPassage(passage.id);
    setPracticeSource("featured");
    setAppMode("practice");
    resetPractice();
  }

  function handleOpenBible() {
    setAppMode("bible");
    resetPractice();
  }

  function handleOpenLibrary() {
    const selectedPassageStillExists = savedLibrary.savedPassages.some((passage) => {
      return passage.id === savedLibrary.selectedSavedPassageId;
    });

    if (!selectedPassageStillExists && savedLibrary.savedPassages[0]) {
      savedLibrary.selectSavedPassage(savedLibrary.savedPassages[0].id);
    }

    setAppMode("library");
    resetPractice();
  }

  function handleTranslationChange(translationId: string) {
    bibleLibrary.selectTranslation(translationId);
    setSelectedVerseNumbers([]);
    setAppMode("bible");
    resetPractice();
  }

  function handleBookChange(bookId: string) {
    bibleLibrary.selectBook(bookId);
    setSelectedVerseNumbers([]);
    setAppMode("bible");
    resetPractice();
  }

  function handleBibleChapterChange(chapterNumber: number) {
    bibleLibrary.selectChapter(chapterNumber);
    setSelectedVerseNumbers([]);
    setAppMode("bible");
    resetPractice();
  }

  function handleRandomFeaturedReaderPassage() {
    const passage = featuredLibrary.passages[Math.floor(Math.random() * featuredLibrary.passages.length)];
    if (!passage) return;

    bibleLibrary.selectTranslation(passage.translationId);
    bibleLibrary.selectBook(passage.bookId);
    bibleLibrary.selectChapter(passage.chapter);
    setSelectedVerseNumbers(
      Array.from(
        { length: passage.endVerse - passage.startVerse + 1 },
        (_, index) => passage.startVerse + index,
      ),
    );
    setReaderFocusKey((currentKey) => currentKey + 1);
    setAppMode("bible");
    resetPractice();
  }

  function handleClearBibleSelection() {
    setSelectedVerseNumbers([]);
    resetPractice();
  }

  /**
   * Saves the current featured passage or Bible reader selection through the saved-passage hook.
   */
  function handleSaveCurrentPassage() {
    if (!saveInput) return;

    const passageToSave =
      appMode === "bible"
        ? {
            ...saveInput,
            title: saveTitle.trim() || saveInput.title,
            category: saveCategory,
          }
        : saveInput;

    savedLibrary.savePassage(passageToSave);
  }

  function handleSelectSavedPassage(passageId: string) {
    savedLibrary.selectSavedPassage(passageId);
    setPracticeSource("saved");
    setAppMode("practice");
    resetPractice();
  }

  function handleSelectFeaturedPractice() {
    setPracticeSource("featured");
    setAppMode("practice");
    resetPractice();
  }

  function handleRemoveSavedPassage(passageId: string) {
    savedLibrary.removePassage(passageId);
    resetPractice();
  }

  /**
   * Click selection is intentionally single-verse.
   * Drag selection handles multi-verse ranges in the reader component.
   */
  function handleSelectReaderVerse(verseNumber: number) {
    setSelectedVerseNumbers((currentVerseNumbers) => {
      if (currentVerseNumbers.includes(verseNumber)) {
        return currentVerseNumbers.filter((currentVerseNumber) => currentVerseNumber !== verseNumber);
      }

      return [...currentVerseNumbers, verseNumber].sort((firstVerse, secondVerse) => firstVerse - secondVerse);
    });
  }

  function handleSelectReaderRange(startVerse: number, endVerse: number) {
    const firstVerse = Math.min(startVerse, endVerse);
    const lastVerse = Math.max(startVerse, endVerse);
    const verseRange = Array.from(
      { length: lastVerse - firstVerse + 1 },
      (_, index) => firstVerse + index,
    );

    setSelectedVerseNumbers((currentVerseNumbers) => {
      const nextVerseNumbers = new Set([...currentVerseNumbers, ...verseRange]);
      return [...nextVerseNumbers].sort((firstSelectedVerse, secondSelectedVerse) => {
        return firstSelectedVerse - secondSelectedVerse;
      });
    });
  }

  function getBibleReaderReference() {
    if (!bibleLibrary.selectedBook) return "";

    return selectedVerseNumbers.length
      ? formatSelectedVerseReference(
          bibleLibrary.selectedBook.name,
          bibleLibrary.selectedChapter,
          selectedVerseNumbers,
        )
      : formatChapterReference(bibleLibrary.selectedBook.name, bibleLibrary.selectedChapter);
  }

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
          onSaveCurrentPassage={handleSaveCurrentPassage}
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
          focusSelectedVerseKey={readerFocusKey}
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
          selectedVerseNumbers={selectedVerseNumbers}
          stats={stats}
          status={status}
          totalBatches={batches.length}
          translations={bibleLibrary.translations}
          translationName={translationName}
          typedText={typedText}
          wpm={wpm}
          onClearBibleSelection={handleClearBibleSelection}
          onNextFeaturedPassage={handleNextFeaturedPassage}
          onOpenBible={handleOpenBible}
          onOpenLibrary={handleOpenLibrary}
          onRandomFeaturedReaderPassage={handleRandomFeaturedReaderPassage}
          onRemoveSavedPassage={handleRemoveSavedPassage}
          onResetPractice={resetPractice}
          onResetStats={resetStats}
          onSelectBibleBook={handleBookChange}
          onSelectBibleChapter={handleBibleChapterChange}
          onSelectFeaturedCategory={handleStartFeaturedCategory}
          onSelectFeaturedPractice={handleSelectFeaturedPractice}
          onSelectReaderRange={handleSelectReaderRange}
          onSelectReaderVerse={handleSelectReaderVerse}
          onSelectSavedPassage={handleSelectSavedPassage}
          onSelectTranslation={handleTranslationChange}
          onStartFeaturedPractice={handleStartFeaturedPractice}
          onTypingChange={handleTyping}
          onUpdateSavedPassage={savedLibrary.updatePassage}
        />
      </div>
    </PageShell>
  );
}

export default App;
