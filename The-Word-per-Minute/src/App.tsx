import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChapterControls } from "./components/ChapterControls";
import { FeaturedPassageControls } from "./components/FeaturedPassageControls";
import { PersonalBests } from "./components/PersonalBests";
import { PracticeBatchDisplay } from "./components/PracticeBatchDisplay";
import { TypingPracticePanel } from "./components/TypingPracticePanel";
import { useFeaturedPassages } from "./hooks/useFeaturedPassages";
import { usePracticeStats } from "./hooks/usePracticeStats";
import { useVerseLibrary } from "./hooks/useVerseLibrary";
import { buildPracticeBatches } from "./utils/chapterPractice";
import { formatChapterReference } from "./utils/passageReference";
import { calculatePracticeSessionMetrics, countCorrectCharacters } from "./utils/typingMetrics";

type PracticeMode = "featured" | "chapter";

/**
 * Main practice screen.
 * Owns the active mode, current typing state, and the handoff between data hooks and UI panels.
 */
function App() {
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("featured");
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const savedFinishAt = useRef<number | null>(null);
  const { stats, recordCompletedAttempt, resetStats } = usePracticeStats();
  const featuredLibrary = useFeaturedPassages();
  const chapterLibrary = useVerseLibrary();

  // Convert the selected featured passage into the same batch shape used by chapter practice.
  const featuredBatches = useMemo(() => {
    const response = featuredLibrary.passageResponse;
    if (!response) return [];

    return buildPracticeBatches(response.bookName, response.passage.chapter, response.verses, 2);
  }, [featuredLibrary.passageResponse]);

  // Convert a selected chapter into short, karaoke-style typing batches.
  const chapterBatches = useMemo(() => {
    if (!chapterLibrary.chapter || !chapterLibrary.selectedBook) return [];

    return buildPracticeBatches(
      chapterLibrary.selectedBook.name,
      chapterLibrary.selectedChapter,
      chapterLibrary.chapter.verses,
      2,
    );
  }, [chapterLibrary.chapter, chapterLibrary.selectedBook, chapterLibrary.selectedChapter]);
  const batches = practiceMode === "featured" ? featuredBatches : chapterBatches;

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
    practiceMode === "featured" ? featuredLibrary.isLoading : chapterLibrary.isLoading;
  const error = practiceMode === "featured" ? featuredLibrary.error : chapterLibrary.error;
  const practiceTitle =
    practiceMode === "featured"
      ? featuredLibrary.passageResponse?.passage.title ?? "Featured Passage"
      : `${chapterLibrary.selectedBook?.name ?? "Chapter"} ${chapterLibrary.selectedChapter}`;
  const practiceReference =
    practiceMode === "featured"
      ? featuredLibrary.passageResponse?.reference ?? ""
      : chapterLibrary.selectedBook
        ? formatChapterReference(chapterLibrary.selectedBook.name, chapterLibrary.selectedChapter)
        : "";
  const practiceSubtitle =
    practiceMode === "featured"
      ? featuredLibrary.passageResponse?.passage.theme ?? "Discovery"
      : "Manual chapter practice";
  const translationName =
    practiceMode === "featured"
      ? featuredLibrary.passageResponse?.translation.abbreviation ?? "WEB"
      : chapterLibrary.translations.find(
          (translation) => translation.id === chapterLibrary.selectedTranslationId,
        )?.abbreviation ?? chapterLibrary.selectedTranslationId.toUpperCase();

  // Changing the selected practice source should always restart the typing session.
  useEffect(() => {
    resetPractice();
  }, [practiceMode, featuredLibrary.selectedPassageId, chapterLibrary.selectedBookId, chapterLibrary.selectedChapter]);

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
   * Clears the current attempt while keeping the selected passage or chapter.
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

  function handleSelectFeaturedPassage(passageId: string) {
    featuredLibrary.selectPassage(passageId);
    setPracticeMode("featured");
    resetPractice();
  }

  function handleTranslationChange(translationId: string) {
    chapterLibrary.selectTranslation(translationId);
    setPracticeMode("chapter");
    resetPractice();
  }

  function handleBookChange(bookId: string) {
    chapterLibrary.selectBook(bookId);
    setPracticeMode("chapter");
    resetPractice();
  }

  function handleChapterChange(chapterNumber: number) {
    chapterLibrary.selectChapter(chapterNumber);
    setPracticeMode("chapter");
    resetPractice();
  }

  function handleRandomChapter() {
    chapterLibrary.selectRandomChapter();
    setPracticeMode("chapter");
    resetPractice();
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

  if (error || !currentBatch) {
    return (
      <PageShell>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error ?? "No practice passage found."}
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
                practiceMode === "chapter" ? "bg-slate-900 text-white" : "text-slate-600"
              }`}
              type="button"
              onClick={() => setPracticeMode("chapter")}
            >
              Chapter
            </button>
          </div>
        </div>
      </section>

      {practiceMode === "featured" ? (
        <FeaturedPassageControls
          passages={featuredLibrary.passages}
          selectedPassageId={featuredLibrary.selectedPassageId}
          onNextPassage={handleNextFeaturedPassage}
          onReset={resetPractice}
          onSelectPassage={handleSelectFeaturedPassage}
        />
      ) : (
        <ChapterControls
          books={chapterLibrary.books}
          selectedBook={chapterLibrary.selectedBook}
          selectedBookId={chapterLibrary.selectedBookId}
          selectedChapter={chapterLibrary.selectedChapter}
          selectedTranslationId={chapterLibrary.selectedTranslationId}
          translations={chapterLibrary.translations}
          onSelectBook={handleBookChange}
          onSelectChapter={handleChapterChange}
          onSelectTranslation={handleTranslationChange}
          onRandomChapter={handleRandomChapter}
          onReset={resetPractice}
        />
      )}

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
