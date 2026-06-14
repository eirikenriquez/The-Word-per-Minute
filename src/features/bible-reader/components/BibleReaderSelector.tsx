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
    <section className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Read / Select</p>
          <h2 className="text-lg font-bold">
            {selectedBook.name} {selectedChapter}
          </h2>
        </div>
        <button
          className="w-fit rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
          disabled={!hasSelectedVerses}
          type="button"
          onClick={onClearSelection}
        >
          Clear Selection
        </button>
      </div>

      <div
        className="rounded-md border border-slate-200 bg-slate-50 p-4 text-lg leading-9"
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
                  ? "bg-slate-200 text-slate-950 ring-1 ring-slate-300"
                  : "text-slate-700 hover:bg-white"
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
              <sup className="mr-1 text-xs font-bold text-slate-400">{verse.number}</sup>
              {verse.text}
            </button>
          );
        })}
      </div>
    </section>
  );
}
