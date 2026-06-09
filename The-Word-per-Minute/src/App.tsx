import { useEffect, useMemo, useRef, useState } from "react";
import { ChapterControls } from "./components/ChapterControls";
import { PersonalBests } from "./components/PersonalBests";
import { PracticeBatchDisplay } from "./components/PracticeBatchDisplay";
import { TypingPracticePanel } from "./components/TypingPracticePanel";
import { usePracticeStats } from "./hooks/usePracticeStats";
import { useVerseLibrary } from "./hooks/useVerseLibrary";
import { buildPracticeBatches } from "./utils/chapterPractice";
import { countCorrectCharacters } from "./utils/typingMetrics";

function App() {
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const savedFinishAt = useRef<number | null>(null);
  const { stats, recordCompletedAttempt, resetStats } = usePracticeStats();
  const {
    books,
    chapter,
    error,
    isLoading,
    selectBook,
    selectChapter,
    selectRandomChapter,
    selectedTranslationId,
    selectTranslation,
    selectedBook,
    selectedBookId,
    selectedChapter,
    translations,
  } = useVerseLibrary();

  const selectedTranslation = translations.find(
    (translation) => translation.id === selectedTranslationId,
  );
  const batches = useMemo(() => {
    if (!chapter || !selectedBook) return [];
    return buildPracticeBatches(selectedBook.name, selectedChapter, chapter.verses, 2);
  }, [chapter, selectedBook, selectedChapter]);
  const currentBatch = batches[currentBatchIndex];
  const targetText = currentBatch?.text ?? "";
  const currentCorrectCharacters = countCorrectCharacters(targetText, typedText);
  const completedCharacterCount = batches
    .slice(0, currentBatchIndex)
    .reduce((total, batch) => total + batch.text.length, 0);
  const totalCharacterCount = batches.reduce((total, batch) => total + batch.text.length, 0);
  const totalCorrectCharacters = completedCharacterCount + currentCorrectCharacters;
  const totalTypedCharacters = completedCharacterCount + typedText.length;
  const progress = totalCharacterCount
    ? Math.round((totalTypedCharacters / totalCharacterCount) * 100)
    : 0;
  const accuracy = totalTypedCharacters
    ? Math.round((totalCorrectCharacters / totalTypedCharacters) * 100)
    : 100;
  const elapsedMs = startedAt ? (finishedAt ?? Date.now()) - startedAt : 0;
  const elapsedMinutes = elapsedMs / 1000 / 60;
  const wpm = elapsedMinutes > 0 ? Math.round(totalCorrectCharacters / 5 / elapsedMinutes) : 0;
  const isBatchComplete = Boolean(
    targetText && typedText.length === targetText.length && currentCorrectCharacters === targetText.length,
  );
  const isChapterComplete = isBatchComplete && currentBatchIndex === batches.length - 1;
  const status = isChapterComplete ? "Complete" : startedAt ? "Typing" : "Ready";

  useEffect(() => {
    if (!isBatchComplete || isChapterComplete) return;

    const advanceTimer = window.setTimeout(() => {
      setCurrentBatchIndex((index) => index + 1);
      setTypedText("");
    }, 500);

    return () => window.clearTimeout(advanceTimer);
  }, [isBatchComplete, isChapterComplete]);

  useEffect(() => {
    if (!isChapterComplete || !finishedAt || savedFinishAt.current === finishedAt) return;

    savedFinishAt.current = finishedAt;
    recordCompletedAttempt(wpm, accuracy);
  }, [accuracy, finishedAt, isChapterComplete, recordCompletedAttempt, wpm]);

  function resetPractice() {
    setCurrentBatchIndex(0);
    setTypedText("");
    setStartedAt(null);
    setFinishedAt(null);
    savedFinishAt.current = null;
  }

  function handleTranslationChange(translationId: string) {
    selectTranslation(translationId);
    resetPractice();
  }

  function handleBookChange(bookId: string) {
    selectBook(bookId);
    resetPractice();
  }

  function handleChapterChange(chapterNumber: number) {
    selectChapter(chapterNumber);
    resetPractice();
  }

  function handleRandomChapter() {
    selectRandomChapter();
    resetPractice();
  }

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
    const nextChapterComplete = nextBatchComplete && currentBatchIndex === batches.length - 1;

    if (nextChapterComplete) {
      setFinishedAt((currentFinishedAt) => currentFinishedAt ?? Date.now());
      return;
    }

    setFinishedAt(null);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-xl border bg-white p-4 text-slate-600 shadow-sm">
          Loading chapter...
        </div>
      </div>
    );
  }

  if (error || !currentBatch || !selectedBook) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error ?? "No chapter found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <h1 className="text-xl font-bold">The Word per Minute</h1>
        </div>
      </header>

      <main className="mx-auto grid max-w-4xl gap-4 px-4 py-6">
        <ChapterControls
          books={books}
          selectedBook={selectedBook}
          selectedBookId={selectedBookId}
          selectedChapter={selectedChapter}
          selectedTranslationId={selectedTranslationId}
          translations={translations}
          onSelectBook={handleBookChange}
          onSelectChapter={handleChapterChange}
          onSelectTranslation={handleTranslationChange}
          onRandomChapter={handleRandomChapter}
          onReset={resetPractice}
        />

        <PracticeBatchDisplay
          batch={currentBatch}
          batchNumber={currentBatchIndex + 1}
          totalBatches={batches.length}
          translationName={selectedTranslation?.abbreviation ?? selectedTranslationId.toUpperCase()}
          typedText={typedText}
        />

        <TypingPracticePanel
          accuracy={accuracy}
          completionMessage={
            isChapterComplete
              ? `Chapter complete. You finished ${selectedBook.name} ${selectedChapter} at ${wpm} WPM with ${accuracy}% accuracy.`
              : "Batch complete. Moving to the next verses..."
          }
          isComplete={isBatchComplete}
          progress={Math.min(progress, 100)}
          status={status}
          typedText={typedText}
          wpm={wpm}
          onTypingChange={handleTyping}
        />

        <PersonalBests stats={stats} onResetStats={resetStats} />
      </main>
    </div>
  );
}

export default App;
