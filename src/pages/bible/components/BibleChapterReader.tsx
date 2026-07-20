import { useEffect, useRef, useState } from "react";
import type { BibleChapter } from "../../../shared/types/verse";

type BibleChapterReaderProps = {
  chapter: BibleChapter | null;
  focusSelectedVerseKey: number;
  selectedChapter: number;
  selectedVerseNumbers: number[];
  onSelectRange: (startVerse: number, endVerse: number) => void;
  onSelectVerse: (verseNumber: number) => void;
};

/**
 * Bible-reader style chapter view.
 * Verse clicks select one verse; dragging across verses selects a contiguous passage range.
 */
export function BibleChapterReader({
  chapter,
  focusSelectedVerseKey,
  selectedChapter,
  selectedVerseNumbers,
  onSelectRange,
  onSelectVerse,
}: BibleChapterReaderProps) {
  const [dragStartVerse, setDragStartVerse] = useState<number | null>(null);
  const [hasDragged, setHasDragged] = useState(false);
  const verseButtonRefs = useRef(new Map<number, HTMLButtonElement>());

  useEffect(() => {
    if (
      !focusSelectedVerseKey ||
      chapter?.chapter !== selectedChapter ||
      !selectedVerseNumbers.length
    ) {
      return;
    }

    const firstSelectedVerse = selectedVerseNumbers[0];
    const selectedVerseButton = verseButtonRefs.current.get(firstSelectedVerse);
    if (!selectedVerseButton) return;

    selectedVerseButton.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [chapter, focusSelectedVerseKey, selectedChapter, selectedVerseNumbers]);

  if (!chapter) return null;

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
    <div className="mx-auto grid w-full max-w-5xl gap-5">
      <p className="text-sm text-ink-subtle">
        Click a verse to select or deselect it. Drag across verses to select a range.
      </p>

      <div
        className="text-xl leading-10 text-ink-muted sm:text-2xl sm:leading-[3rem]"
        role="presentation"
        onPointerLeave={cancelDragState}
        onPointerUp={cancelDragState}
      >
        {chapter.verses.map((verse) => {
          const isSelected = selectedVerseNumbers.includes(verse.number);

          return (
            <button
              aria-pressed={isSelected}
              className={`mr-1 rounded px-1 text-left transition ${
                isSelected
                  ? "bg-selected text-selected-ink ring-1 ring-accent-line"
                  : "text-ink-muted hover:bg-accent-soft"
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
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;

                event.preventDefault();
                onSelectVerse(verse.number);
              }}
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
              <sup className="mr-1 text-xs font-bold text-ink-subtle">{verse.number}</sup>
              {verse.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
