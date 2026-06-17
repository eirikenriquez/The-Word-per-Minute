import { useEffect, useRef, useState } from "react";
import type { BibleChapter, BookSummary } from "../../../types/verse";

type BibleReaderSelectorProps = {
  chapter: BibleChapter | null;
  focusSelectedVerseKey: number;
  selectedBook?: BookSummary;
  selectedChapter: number;
  selectedVerseNumbers: number[];
  onClearSelection: () => void;
  onSelectRange: (startVerse: number, endVerse: number) => void;
  onSelectVerse: (verseNumber: number) => void;
};

/**
 * Bible-reader style chapter view.
 * Verse clicks select one verse; dragging across verses selects a contiguous passage range.
 */
export function BibleReaderSelector({
  chapter,
  focusSelectedVerseKey,
  selectedBook,
  selectedChapter,
  selectedVerseNumbers,
  onClearSelection,
  onSelectRange,
  onSelectVerse,
}: BibleReaderSelectorProps) {
  const [dragStartVerse, setDragStartVerse] = useState<number | null>(null);
  const [hasDragged, setHasDragged] = useState(false);
  const shouldSkipNextClear = useRef(false);
  const verseButtonRefs = useRef(new Map<number, HTMLButtonElement>());
  const hasSelectedVerses = selectedVerseNumbers.length > 0;

  useEffect(() => {
    if (!focusSelectedVerseKey || !selectedVerseNumbers.length) return;

    const firstSelectedVerse = selectedVerseNumbers[0];
    verseButtonRefs.current.get(firstSelectedVerse)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [focusSelectedVerseKey, selectedVerseNumbers]);

  if (!chapter || !selectedBook) return null;

  function startVerseSelection(verseNumber: number) {
    setDragStartVerse(verseNumber);
    setHasDragged(false);
  }

  function extendVerseSelection(verseNumber: number) {
    if (dragStartVerse === null || dragStartVerse === verseNumber) return;

    setHasDragged(true);
    onSelectRange(dragStartVerse, verseNumber);
  }

  function finishVerseSelection(verseNumber: number) {
    if (dragStartVerse === null) return;

    if (hasDragged) {
      onSelectRange(dragStartVerse, verseNumber);
      shouldSkipNextClear.current = true;
    } else {
      onSelectVerse(verseNumber);
    }

    setDragStartVerse(null);
    setHasDragged(false);
  }

  function cancelDragState() {
    setDragStartVerse(null);
    setHasDragged(false);
  }

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Read / Select</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-950 dark:text-slate-100">
            {selectedBook.name} {selectedChapter}
          </h2>
        </div>
        <button
          className="w-fit rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-blue-50 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-slate-400 dark:hover:bg-blue-950 dark:hover:text-blue-200 dark:disabled:text-slate-600"
          disabled={!hasSelectedVerses}
          type="button"
          onClick={onClearSelection}
        >
          Clear Selection
        </button>
      </div>

      <div
        className="text-xl leading-10 text-slate-700 sm:text-2xl sm:leading-[3rem] dark:text-slate-300"
        role="presentation"
        onClick={() => {
          if (shouldSkipNextClear.current) {
            shouldSkipNextClear.current = false;
            return;
          }

          onClearSelection();
          cancelDragState();
        }}
        onPointerLeave={cancelDragState}
        onPointerUp={cancelDragState}
      >
        {chapter.verses.map((verse) => {
          const isSelected = selectedVerseNumbers.includes(verse.number);

          return (
            <button
              className={`mr-1 rounded px-1 text-left transition ${
                isSelected
                  ? "bg-blue-900 text-blue-100 ring-1 ring-blue-700"
                  : "text-slate-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-blue-950"
              }`}
              key={verse.number}
              ref={(buttonElement) => {
                if (buttonElement) {
                  verseButtonRefs.current.set(verse.number, buttonElement);
                  return;
                }

                verseButtonRefs.current.delete(verse.number);
              }}
              type="button"
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                startVerseSelection(verse.number);
              }}
              onPointerEnter={() => extendVerseSelection(verse.number)}
              onPointerUp={(event) => {
                event.stopPropagation();
                finishVerseSelection(verse.number);
              }}
            >
              <sup className="mr-1 text-xs font-bold text-slate-400 dark:text-slate-500">{verse.number}</sup>
              {verse.text}
            </button>
          );
        })}
      </div>
    </section>
  );
}
