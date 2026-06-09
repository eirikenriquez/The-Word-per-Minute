import { useEffect, useMemo, useRef, useState } from "react";
import { PersonalBests } from "./components/PersonalBests";
import { TypingPracticePanel } from "./components/TypingPracticePanel";
import { VerseControls } from "./components/VerseControls";
import { VerseDisplay } from "./components/VerseDisplay";
import { usePracticeStats } from "./hooks/usePracticeStats";
import { useVerseLibrary } from "./hooks/useVerseLibrary";
import { calculateTypingMetrics, countCorrectCharacters } from "./utils/typingMetrics";

function App() {
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
    practiceVerse,
    selectBook,
    selectChapter,
    selectRandomVerse,
    selectedTranslationId,
    selectTranslation,
    selectVerse,
    selectedBook,
    selectedBookId,
    selectedChapter,
    selectedVerse,
    translations,
  } = useVerseLibrary();

  const targetText = practiceVerse?.text ?? "";
  const metrics = useMemo(
    () => calculateTypingMetrics({ targetText, typedText, startedAt, finishedAt }),
    [finishedAt, startedAt, targetText, typedText],
  );

  useEffect(() => {
    if (!metrics.isComplete || !finishedAt || savedFinishAt.current === finishedAt) return;

    savedFinishAt.current = finishedAt;
    recordCompletedAttempt(metrics.wpm, metrics.accuracy);
  }, [finishedAt, metrics.accuracy, metrics.isComplete, metrics.wpm, recordCompletedAttempt]);

  function resetPractice() {
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

  function handleVerseChange(verseNumber: number) {
    selectVerse(verseNumber);
    resetPractice();
  }

  function handleRandomVerse() {
    selectRandomVerse();
    resetPractice();
  }

  function handleTyping(nextTypedText: string) {
    const limitedText = nextTypedText.slice(0, targetText.length);

    if (!startedAt && limitedText.length > 0) {
      setStartedAt(Date.now());
    }

    setTypedText(limitedText);

    const isFinished =
      targetText.length > 0 &&
      limitedText.length === targetText.length &&
      countCorrectCharacters(targetText, limitedText) === targetText.length;

    if (isFinished) {
      setFinishedAt((currentFinishedAt) => currentFinishedAt ?? Date.now());
      return;
    }

    setFinishedAt(null);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-xl border bg-white p-4 text-slate-600 shadow-sm">
          Loading verses...
        </div>
      </div>
    );
  }

  if (error || !practiceVerse) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          {error ?? "No verses found."}
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
        <VerseControls
          books={books}
          chapter={chapter}
          selectedBook={selectedBook}
          selectedBookId={selectedBookId}
          selectedChapter={selectedChapter}
          selectedTranslationId={selectedTranslationId}
          selectedVerse={selectedVerse}
          translations={translations}
          onSelectBook={handleBookChange}
          onSelectChapter={handleChapterChange}
          onSelectTranslation={handleTranslationChange}
          onSelectVerse={handleVerseChange}
          onRandomVerse={handleRandomVerse}
          onReset={resetPractice}
        />

        <VerseDisplay verse={practiceVerse} typedText={typedText} />

        <TypingPracticePanel
          accuracy={metrics.accuracy}
          isComplete={metrics.isComplete}
          progress={metrics.progress}
          status={metrics.status}
          typedText={typedText}
          wpm={metrics.wpm}
          onTypingChange={handleTyping}
        />

        <PersonalBests stats={stats} onResetStats={resetStats} />
      </main>
    </div>
  );
}

export default App;
