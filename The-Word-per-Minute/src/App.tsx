import { useMemo, useState } from "react";
import versesData from "./data/verses.json";
import type { Verse } from "./types/verse";

const verses = versesData.verses as Verse[];

function getRandomVerseIndex(currentIndex: number) {
  if (verses.length <= 1) return 0;

  let nextIndex = currentIndex;
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * verses.length);
  }

  return nextIndex;
}

function App() {
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);

  const verse = verses[selectedVerseIndex];
  const targetText = verse?.text ?? "";

  const correctCharacters = useMemo(() => {
    return typedText
      .split("")
      .filter((character, index) => character === targetText[index]).length;
  }, [targetText, typedText]);

  const progress = targetText.length
    ? Math.round((typedText.length / targetText.length) * 100)
    : 0;
  const accuracy = typedText.length
    ? Math.round((correctCharacters / typedText.length) * 100)
    : 100;
  const elapsedMs = startedAt ? (finishedAt ?? Date.now()) - startedAt : 0;
  const elapsedMinutes = elapsedMs / 1000 / 60;
  const wpm = elapsedMinutes > 0 ? Math.round(correctCharacters / 5 / elapsedMinutes) : 0;
  const isComplete = Boolean(
    targetText && typedText.length === targetText.length && correctCharacters === targetText.length,
  );

  function resetPractice(nextVerseIndex = selectedVerseIndex) {
    setSelectedVerseIndex(nextVerseIndex);
    setTypedText("");
    setStartedAt(null);
    setFinishedAt(null);
  }

  function handleTyping(nextTypedText: string) {
    const limitedText = nextTypedText.slice(0, targetText.length);

    if (!startedAt && limitedText.length > 0) {
      setStartedAt(Date.now());
    }

    setTypedText(limitedText);

    const nextCorrectCharacters = limitedText
      .split("")
      .filter((character, index) => character === targetText[index]).length;

    if (
      targetText.length > 0 &&
      limitedText.length === targetText.length &&
      nextCorrectCharacters === targetText.length
    ) {
      setFinishedAt((currentFinishedAt) => currentFinishedAt ?? Date.now());
    } else {
      setFinishedAt(null);
    }
  }

  if (!verse) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          No verses found.
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
        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-600">Verse</span>
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                value={selectedVerseIndex}
                onChange={(event) => resetPractice(Number(event.target.value))}
              >
                {verses.map((availableVerse, index) => (
                  <option key={availableVerse.id} value={index}>
                    {availableVerse.ref}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                type="button"
                onClick={() => resetPractice(getRandomVerseIndex(selectedVerseIndex))}
              >
                Random Verse
              </button>
              <button
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                type="button"
                onClick={() => resetPractice()}
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-medium text-slate-500">{verse.ref}</p>
          <p className="text-lg leading-9">
            {targetText.split("").map((character, index) => {
              const typedCharacter = typedText[index];
              const isCurrentCharacter = index === typedText.length;
              const characterClass =
                typedCharacter === undefined
                  ? isCurrentCharacter
                    ? "bg-amber-100 text-slate-900"
                    : "text-slate-500"
                  : typedCharacter === character
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-rose-100 text-rose-900";

              return (
                <span className={characterClass} key={`${character}-${index}`}>
                  {character}
                </span>
              );
            })}
          </p>
        </section>

        <section className="grid gap-4 rounded-lg border bg-white p-5 shadow-sm">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-600">Type the verse</span>
            <textarea
              className="min-h-32 resize-y rounded-md border border-slate-300 p-3 leading-7 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Start typing here..."
              value={typedText}
              onChange={(event) => handleTyping(event.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-md bg-slate-100 p-3">
              <p className="text-xs font-medium uppercase text-slate-500">WPM</p>
              <p className="text-2xl font-bold">{wpm}</p>
            </div>
            <div className="rounded-md bg-slate-100 p-3">
              <p className="text-xs font-medium uppercase text-slate-500">Accuracy</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </div>
            <div className="rounded-md bg-slate-100 p-3">
              <p className="text-xs font-medium uppercase text-slate-500">Progress</p>
              <p className="text-2xl font-bold">{Math.min(progress, 100)}%</p>
            </div>
            <div className="rounded-md bg-slate-100 p-3">
              <p className="text-xs font-medium uppercase text-slate-500">Status</p>
              <p className="text-lg font-bold">{isComplete ? "Complete" : startedAt ? "Typing" : "Ready"}</p>
            </div>
          </div>

          {isComplete && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
              Nice work. You finished this verse at {wpm} WPM with {accuracy}% accuracy.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
