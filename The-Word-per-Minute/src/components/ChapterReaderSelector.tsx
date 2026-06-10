import type { BibleChapter, BookSummary } from "../types/verse";

type VerseRange = {
  startVerse: number;
  endVerse: number;
};

type ChapterReaderSelectorProps = {
  chapter: BibleChapter | null;
  selectedBook?: BookSummary;
  selectedChapter: number;
  selectedRange: VerseRange | null;
  onClearSelection: () => void;
  onSelectVerse: (verseNumber: number) => void;
};

/**
 * Bible-reader style chapter view.
 * Verse clicks build one contiguous range that can be saved as a typing passage.
 */
export function ChapterReaderSelector({
  chapter,
  selectedBook,
  selectedChapter,
  selectedRange,
  onClearSelection,
  onSelectVerse,
}: ChapterReaderSelectorProps) {
  if (!chapter || !selectedBook) return null;

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
          disabled={!selectedRange}
          type="button"
          onClick={onClearSelection}
        >
          Clear Selection
        </button>
      </div>

      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-lg leading-9">
        {chapter.verses.map((verse) => {
          const isSelected = Boolean(
            selectedRange &&
              verse.number >= selectedRange.startVerse &&
              verse.number <= selectedRange.endVerse,
          );

          return (
            <button
              className={`mr-1 rounded px-1 text-left transition ${
                isSelected
                  ? "bg-amber-100 text-slate-950 ring-1 ring-amber-300"
                  : "text-slate-700 hover:bg-white"
              }`}
              key={verse.number}
              type="button"
              onClick={() => onSelectVerse(verse.number)}
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
