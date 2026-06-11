import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { BibleControls } from "./components/BibleControls";
import { BibleReaderSelector } from "./components/BibleReaderSelector";
import { HomeCategoryPicker } from "./components/HomeCategoryPicker";
import { PersonalBests } from "./components/PersonalBests";
import { PracticeBatchDisplay } from "./components/PracticeBatchDisplay";
import { PracticeControls } from "./components/PracticeControls";
import { SavedPassageControls } from "./components/SavedPassageControls";
import { TypingPracticePanel } from "./components/TypingPracticePanel";
import { useFeaturedPassages } from "./hooks/useFeaturedPassages";
import { usePracticeStats } from "./hooks/usePracticeStats";
import { useSavedPassages } from "./hooks/useSavedPassages";
import { useVerseLibrary } from "./hooks/useVerseLibrary";
import type { SavePassageInput } from "./types/savedPassage";
import { buildPracticeBatches } from "./utils/practiceBatches";
import {
  formatChapterReference,
  formatPassageReference,
  formatSelectedVerseReference,
} from "./utils/passageReference";
import { calculatePracticeSessionMetrics, countCorrectCharacters } from "./utils/typingMetrics";

type AppMode = "home" | "practice" | "bible" | "library";
type PracticeSource = "featured" | "saved";

const DEFAULT_SAVED_CATEGORY = "Memorise";
const CUSTOM_SAVED_CATEGORY = "Other";

function getDefaultSavedCategory(theme: string, categories: string[]) {
  return categories.includes(theme) ? theme : DEFAULT_SAVED_CATEGORY;
}

/**
 * Main practice screen.
 * Owns the active mode, current typing state, and the handoff between data hooks and UI panels.
 */
function App() {
  const [appMode, setAppMode] = useState<AppMode>("home");
  const [practiceSource, setPracticeSource] = useState<PracticeSource>("featured");
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [selectedVerseNumbers, setSelectedVerseNumbers] = useState<number[]>([]);
  const [readerFocusKey, setReaderFocusKey] = useState(0);
  const [saveTitle, setSaveTitle] = useState("");
  const [saveCategory, setSaveCategory] = useState(DEFAULT_SAVED_CATEGORY);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const savedFinishAt = useRef<number | null>(null);
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

  // Session metrics are calculated from all completed batches, not only the visible one.
  const {
    accuracy,
    currentBatch,
    isBatchComplete,
    isPassageComplete,
    progress,
    status,
    targetText,
    wpm,
  } = calculatePracticeSessionMetrics({
    batches,
    currentBatchIndex,
    typedText,
    startedAt,
    finishedAt,
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
  const saveInput = useMemo((): SavePassageInput | null => {
    if (appMode === "practice" && practiceSource === "featured" && featuredLibrary.passageResponse) {
      const { passage, reference, translation, bookName } = featuredLibrary.passageResponse;

      return {
        title: passage.title,
        theme: passage.theme,
        category: getDefaultSavedCategory(passage.theme, savedPassageCategories),
        reference,
        translationId: passage.translationId,
        translationAbbreviation: translation.abbreviation,
        bookId: passage.bookId,
        bookName,
        chapter: passage.chapter,
        startVerse: passage.startVerse,
        endVerse: passage.endVerse,
        source: "featured",
      };
    }

    if (appMode === "bible" && bibleLibrary.chapter && bibleLibrary.selectedBook) {
      const translation = bibleLibrary.translations.find(
        (availableTranslation) => availableTranslation.id === bibleLibrary.selectedTranslationId,
      );
      const lastVerse = bibleLibrary.chapter.verses[bibleLibrary.chapter.verses.length - 1];

      if (!lastVerse) return null;

      const startVerse = selectedVerseNumbers[0] ?? 1;
      const endVerse = selectedVerseNumbers[selectedVerseNumbers.length - 1] ?? lastVerse.number;
      const reference = selectedVerseNumbers.length
        ? formatSelectedVerseReference(
            bibleLibrary.selectedBook.name,
            bibleLibrary.selectedChapter,
            selectedVerseNumbers,
          )
        : formatPassageReference(
            bibleLibrary.selectedBook.name,
            bibleLibrary.selectedChapter,
            startVerse,
            endVerse,
          );

      return {
        title: reference,
        category: DEFAULT_SAVED_CATEGORY,
        theme: selectedVerseNumbers.length ? "Selected verses" : "Bible reader",
        reference,
        translationId: bibleLibrary.selectedTranslationId,
        translationAbbreviation: translation?.abbreviation ?? bibleLibrary.selectedTranslationId.toUpperCase(),
        bookId: bibleLibrary.selectedBook.id,
        bookName: bibleLibrary.selectedBook.name,
        chapter: bibleLibrary.selectedChapter,
        startVerse,
        endVerse,
        selectedVerses: selectedVerseNumbers.length ? selectedVerseNumbers : undefined,
        source: "bible",
      };
    }

    return null;
  }, [
    bibleLibrary.chapter,
    bibleLibrary.selectedBook,
    bibleLibrary.selectedChapter,
    bibleLibrary.selectedTranslationId,
    bibleLibrary.translations,
    featuredLibrary.passageResponse,
    appMode,
    practiceSource,
    savedPassageCategories,
    selectedVerseNumbers,
  ]);
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
    selectedVerseNumbers,
    savedLibrary.selectedSavedPassageId,
  ]);

  useEffect(() => {
    if (!isBatchComplete || isPassageComplete) return;

    // Pause briefly so the user can see the completed batch before auto-advancing.
    const advanceTimer = window.setTimeout(() => {
      setCurrentBatchIndex((index) => index + 1);
      setTypedText("");
    }, 500);

    return () => window.clearTimeout(advanceTimer);
  }, [isBatchComplete, isPassageComplete]);

  useEffect(() => {
    if (!isPassageComplete || !finishedAt || savedFinishAt.current === finishedAt) return;

    // Store stats once per completed passage, even if React re-renders the result.
    savedFinishAt.current = finishedAt;
    recordCompletedAttempt(wpm, accuracy);
  }, [accuracy, finishedAt, isPassageComplete, recordCompletedAttempt, wpm]);

  /**
   * Clears the current attempt while keeping the selected passage or Bible reader location.
   */
  function resetPractice() {
    setCurrentBatchIndex(0);
    setTypedText("");
    setStartedAt(null);
    setFinishedAt(null);
    savedFinishAt.current = null;
  }

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

  /**
   * Starts the timer on the first typed character and locks the finish time at completion.
   */
  function handleTyping(nextTypedText: string) {
    const limitedText = nextTypedText.slice(0, targetText.length);

    if (!startedAt && limitedText.length > 0) {
      setStartedAt(Date.now());
    }

    setTypedText(limitedText);

    const nextCorrectCharacters = countCorrectCharacters(targetText, limitedText);
    const nextBatchComplete =
      targetText.length > 0 &&
      limitedText.length === targetText.length &&
      nextCorrectCharacters === targetText.length;
    const nextPassageComplete = nextBatchComplete && currentBatchIndex === batches.length - 1;

    if (nextPassageComplete) {
      setFinishedAt((currentFinishedAt) => currentFinishedAt ?? Date.now());
      return;
    }

    setFinishedAt(null);
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="rounded-xl border bg-white p-4 text-slate-600 shadow-sm">
          Loading practice passage...
        </div>
      </PageShell>
    );
  }

  if (error || (appMode === "practice" && !currentBatch)) {
    return (
      <PageShell>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error ?? (practiceSource === "saved" ? "Save a passage first." : "No practice passage found.")}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase text-slate-500">{practiceSubtitle}</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">{practiceTitle}</h2>
            {practiceReference && (
              <p className="mt-2 w-fit rounded-md bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-900 ring-1 ring-amber-200">
                {practiceReference}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 rounded-md border border-slate-300 bg-slate-100 p-1 text-sm sm:flex">
            <button
              className={`rounded px-3 py-1.5 font-medium ${
                appMode === "home" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
              type="button"
              onClick={() => setAppMode("home")}
            >
              Home
            </button>
            <button
              className={`rounded px-3 py-1.5 font-medium ${
                appMode === "practice" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
              type="button"
              onClick={() => setAppMode("practice")}
            >
              Practice
            </button>
            <button
              className={`rounded px-3 py-1.5 font-medium ${
                appMode === "bible" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
              type="button"
              onClick={() => setAppMode("bible")}
            >
              Bible
            </button>
            <button
              className={`rounded px-3 py-1.5 font-medium ${
                appMode === "library" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
              } disabled:cursor-not-allowed disabled:text-slate-400`}
              disabled={!savedLibrary.savedPassages.length}
              type="button"
              onClick={() => setAppMode("library")}
            >
              Library
            </button>
          </div>
        </div>
        {appMode === "practice" && practiceSource === "featured" && (
          <div className="mt-4 flex justify-end border-t border-slate-200 pt-4">
            <button
              className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={!saveInput || isCurrentPassageSaved}
              type="button"
              onClick={handleSaveCurrentPassage}
            >
              {isCurrentPassageSaved ? "Saved" : "Save Passage"}
            </button>
          </div>
        )}
        {appMode === "bible" && (
          <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-600">Saved Title</span>
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="Name this saved passage"
                value={saveTitle}
                onChange={(event) => setSaveTitle(event.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-600">Category</span>
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                value={saveCategory}
                onChange={(event) => setSaveCategory(event.target.value)}
              >
                {savedPassageCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={!saveInput || isCurrentPassageSaved}
              type="button"
              onClick={handleSaveCurrentPassage}
            >
              {isCurrentPassageSaved ? "Saved" : "Save Passage"}
            </button>
          </div>
        )}
      </section>

      {appMode === "home" ? (
        <HomeCategoryPicker
          featuredCategories={featuredHomeCategories}
          hasSavedPassages={savedLibrary.savedPassages.length > 0}
          savedPassageCount={savedLibrary.savedPassages.length}
          onOpenBible={handleOpenBible}
          onOpenLibrary={handleOpenLibrary}
          onStartFeatured={handleStartFeaturedPractice}
          onStartFeaturedCategory={handleStartFeaturedCategory}
        />
      ) : appMode === "practice" ? (
        <PracticeControls
          hasSavedPassages={savedLibrary.savedPassages.length > 0}
          practiceSource={practiceSource}
          savedPassages={savedLibrary.savedPassages}
          selectedSavedPassageId={savedLibrary.selectedSavedPassageId}
          onNextFeaturedPassage={handleNextFeaturedPassage}
          onOpenLibrary={handleOpenLibrary}
          onReset={resetPractice}
          onSelectFeaturedPractice={handleSelectFeaturedPractice}
          onSelectSavedPractice={handleSelectSavedPassage}
        />
      ) : appMode === "bible" ? (
        <>
          <BibleControls
            books={bibleLibrary.books}
            selectedBook={bibleLibrary.selectedBook}
            selectedBookId={bibleLibrary.selectedBookId}
            selectedChapter={bibleLibrary.selectedChapter}
            selectedTranslationId={bibleLibrary.selectedTranslationId}
            translations={bibleLibrary.translations}
            onSelectBook={handleBookChange}
            onSelectChapter={handleBibleChapterChange}
            onSelectTranslation={handleTranslationChange}
            onRandomFeaturedPassage={handleRandomFeaturedReaderPassage}
          />
          <BibleReaderSelector
            chapter={bibleLibrary.chapter}
            selectedBook={bibleLibrary.selectedBook}
            selectedChapter={bibleLibrary.selectedChapter}
            selectedVerseNumbers={selectedVerseNumbers}
            focusSelectedVerseKey={readerFocusKey}
            onClearSelection={handleClearBibleSelection}
            onSelectRange={handleSelectReaderRange}
            onSelectVerse={handleSelectReaderVerse}
          />
        </>
      ) : (
        <SavedPassageControls
          savedPassages={savedLibrary.savedPassages}
          selectedSavedPassageId={savedLibrary.selectedSavedPassageId}
          onRemovePassage={handleRemoveSavedPassage}
          onSelectSavedPassage={handleSelectSavedPassage}
          onUpdatePassage={savedLibrary.updatePassage}
        />
      )}

      {appMode === "practice" && currentBatch && (
        <>
          <PracticeBatchDisplay
            batch={currentBatch}
            batchNumber={currentBatchIndex + 1}
            totalBatches={batches.length}
            translationName={translationName}
            typedText={typedText}
          />

          <TypingPracticePanel
            accuracy={accuracy}
            completionActionLabel={
              isPassageComplete && practiceSource === "featured" ? "Next Passage" : undefined
            }
            completionMessage={
              isPassageComplete
                ? `Complete. You finished ${practiceTitle} at ${wpm} WPM with ${accuracy}% accuracy.`
                : "Batch complete. Moving to the next verses..."
            }
            isComplete={isBatchComplete}
            onCompletionAction={
              isPassageComplete && practiceSource === "featured" ? handleNextFeaturedPassage : undefined
            }
            progress={Math.min(progress, 100)}
            status={status}
            typedText={typedText}
            wpm={wpm}
            onTypingChange={handleTyping}
          />

          <PersonalBests stats={stats} onResetStats={resetStats} />
        </>
      )}
    </PageShell>
  );
}

type PageShellProps = {
  children: ReactNode;
};

/**
 * Shared page frame for loading, error, and practice states.
 */
function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <h1 className="text-xl font-bold tracking-normal text-slate-950">The Word per Minute</h1>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-6">{children}</main>
    </div>
  );
}

export default App;
