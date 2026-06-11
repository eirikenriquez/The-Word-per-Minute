import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { BibleControls } from "./components/BibleControls";
import { BibleReaderSelector } from "./components/BibleReaderSelector";
import { FeaturedPassageControls } from "./components/FeaturedPassageControls";
import { PersonalBests } from "./components/PersonalBests";
import { PracticeBatchDisplay } from "./components/PracticeBatchDisplay";
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

type PracticeMode = "featured" | "bible" | "saved";

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
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("featured");
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
    practiceMode === "featured"
      ? featuredBatches
      : practiceMode === "bible"
        ? bibleBatches
        : savedBatches;

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
    practiceMode === "featured"
      ? featuredLibrary.isLoading
      : practiceMode === "bible"
        ? bibleLibrary.isLoading
        : savedLibrary.isLoading;
  const error =
    practiceMode === "featured"
      ? featuredLibrary.error
      : practiceMode === "bible"
        ? bibleLibrary.error
        : savedLibrary.error;
  const practiceTitle =
    practiceMode === "featured"
      ? featuredLibrary.passageResponse?.passage.title ?? "Featured Passage"
      : practiceMode === "bible"
        ? `${bibleLibrary.selectedBook?.name ?? "Bible"} ${bibleLibrary.selectedChapter}`
        : savedLibrary.selectedSavedPassage?.title ?? "Saved Passage";
  const practiceReference =
    practiceMode === "featured"
      ? featuredLibrary.passageResponse?.reference ?? ""
      : practiceMode === "bible"
        ? bibleLibrary.selectedBook
          ? getBibleReaderReference()
          : ""
        : savedLibrary.selectedSavedPassage?.reference ?? "";
  const practiceSubtitle =
    practiceMode === "featured"
      ? featuredLibrary.passageResponse?.passage.theme ?? "Discovery"
      : practiceMode === "bible"
        ? "Bible reader"
        : "Saved for later practice";
  const translationName =
    practiceMode === "featured"
      ? featuredLibrary.passageResponse?.translation.abbreviation ?? "WEB"
      : practiceMode === "bible"
        ? bibleLibrary.translations.find(
            (translation) => translation.id === bibleLibrary.selectedTranslationId,
          )?.abbreviation ?? bibleLibrary.selectedTranslationId.toUpperCase()
        : savedLibrary.selectedSavedPassage?.translationAbbreviation ?? "WEB";
  const saveInput = useMemo((): SavePassageInput | null => {
    if (practiceMode === "featured" && featuredLibrary.passageResponse) {
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

    if (practiceMode === "bible" && bibleLibrary.chapter && bibleLibrary.selectedBook) {
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
    practiceMode,
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
    if (practiceMode === "saved" && !savedLibrary.savedPassages.length) {
      setPracticeMode("featured");
    }
  }, [practiceMode, savedLibrary.savedPassages.length]);

  // Changing the selected practice source should always restart the typing session.
  useEffect(() => {
    resetPractice();
  }, [
    practiceMode,
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
    setPracticeMode("featured");
    resetPractice();
  }

  function handleTranslationChange(translationId: string) {
    bibleLibrary.selectTranslation(translationId);
    setSelectedVerseNumbers([]);
    setPracticeMode("bible");
    resetPractice();
  }

  function handleBookChange(bookId: string) {
    bibleLibrary.selectBook(bookId);
    setSelectedVerseNumbers([]);
    setPracticeMode("bible");
    resetPractice();
  }

  function handleBibleChapterChange(chapterNumber: number) {
    bibleLibrary.selectChapter(chapterNumber);
    setSelectedVerseNumbers([]);
    setPracticeMode("bible");
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
    setPracticeMode("bible");
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
      practiceMode === "bible"
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
    setPracticeMode("saved");
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

  if (error || (practiceMode !== "bible" && !currentBatch)) {
    return (
      <PageShell>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error ?? (practiceMode === "saved" ? "Save a passage first." : "No practice passage found.")}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="rounded-lg border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{practiceSubtitle}</p>
            <h2 className="text-2xl font-bold">{practiceTitle}</h2>
            {practiceReference && (
              <p className="mt-2 w-fit rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-700">
                {practiceReference}
              </p>
            )}
          </div>
          <div className="flex rounded-md border border-slate-300 p-1 text-sm">
            <button
              className={`rounded px-3 py-1.5 font-medium ${
                practiceMode === "featured" ? "bg-slate-900 text-white" : "text-slate-600"
              }`}
              type="button"
              onClick={() => setPracticeMode("featured")}
            >
              Featured
            </button>
            <button
              className={`rounded px-3 py-1.5 font-medium ${
                practiceMode === "bible" ? "bg-slate-900 text-white" : "text-slate-600"
              }`}
              type="button"
              onClick={() => setPracticeMode("bible")}
            >
              Bible
            </button>
            <button
              className={`rounded px-3 py-1.5 font-medium ${
                practiceMode === "saved" ? "bg-slate-900 text-white" : "text-slate-600"
              } disabled:cursor-not-allowed disabled:text-slate-400`}
              disabled={!savedLibrary.savedPassages.length}
              type="button"
              onClick={() => setPracticeMode("saved")}
            >
              Saved
            </button>
          </div>
        </div>
        {practiceMode === "featured" && (
          <div className="mt-4 flex justify-end border-t border-slate-200 pt-4">
            <button
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={!saveInput || isCurrentPassageSaved}
              type="button"
              onClick={handleSaveCurrentPassage}
            >
              {isCurrentPassageSaved ? "Saved" : "Save Passage"}
            </button>
          </div>
        )}
        {practiceMode === "bible" && (
          <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-600">Saved Title</span>
              <input
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Name this saved passage"
                value={saveTitle}
                onChange={(event) => setSaveTitle(event.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-600">Category</span>
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
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
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={!saveInput || isCurrentPassageSaved}
              type="button"
              onClick={handleSaveCurrentPassage}
            >
              {isCurrentPassageSaved ? "Saved" : "Save Passage"}
            </button>
          </div>
        )}
      </section>

      {practiceMode === "featured" ? (
        <FeaturedPassageControls
          onNextPassage={handleNextFeaturedPassage}
          onReset={resetPractice}
        />
      ) : practiceMode === "bible" ? (
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
          onReset={resetPractice}
          onSelectSavedPassage={handleSelectSavedPassage}
          onUpdatePassage={savedLibrary.updatePassage}
        />
      )}

      {practiceMode !== "bible" && currentBatch && (
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
            completionActionLabel={isPassageComplete && practiceMode === "featured" ? "Next Passage" : undefined}
            completionMessage={
              isPassageComplete
                ? `Complete. You finished ${practiceTitle} at ${wpm} WPM with ${accuracy}% accuracy.`
                : "Batch complete. Moving to the next verses..."
            }
            isComplete={isBatchComplete}
            onCompletionAction={isPassageComplete && practiceMode === "featured" ? handleNextFeaturedPassage : undefined}
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <h1 className="text-xl font-bold">The Word per Minute</h1>
        </div>
      </header>

      <main className="mx-auto grid max-w-4xl gap-4 px-4 py-6">{children}</main>
    </div>
  );
}

export default App;
