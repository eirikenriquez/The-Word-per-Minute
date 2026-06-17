import type { ReactNode } from "react";
import type { BookSummary, Translation } from "../../../types/verse";

type BibleControlsProps = {
  books: BookSummary[];
  selectedBook?: BookSummary;
  selectedBookId: string;
  selectedChapter: number;
  selectedTranslationId: string;
  translations: Translation[];
  onRandomFeaturedPassage: () => void;
  onSelectBook: (bookId: string) => void;
  onSelectChapter: (chapter: number) => void;
  onSelectTranslation: (translationId: string) => void;
};

/**
 * Manual Bible reader controls for translation, book, and chapter selection.
 */
export function BibleControls({
  books,
  selectedBook,
  selectedBookId,
  selectedChapter,
  selectedTranslationId,
  translations,
  onRandomFeaturedPassage,
  onSelectBook,
  onSelectChapter,
  onSelectTranslation,
}: BibleControlsProps) {
  return (
    <section className="border-b border-slate-200 pb-5 dark:border-slate-800">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="grid gap-3 sm:grid-cols-3">
          <PickerLabel label="Translation">
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950"
              value={selectedTranslationId}
              onChange={(event) => onSelectTranslation(event.target.value)}
            >
              {translations.map((translation) => (
                <option key={translation.id} value={translation.id}>
                  {translation.abbreviation} - {translation.name}
                </option>
              ))}
            </select>
          </PickerLabel>

          <PickerLabel label="Book">
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950"
              value={selectedBookId}
              onChange={(event) => onSelectBook(event.target.value)}
            >
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.name}
                </option>
              ))}
            </select>
          </PickerLabel>

          <PickerLabel label="Chapter">
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950"
              value={selectedChapter}
              onChange={(event) => onSelectChapter(Number(event.target.value))}
            >
              {Array.from({ length: selectedBook?.chapterCount ?? 0 }, (_, index) => index + 1).map(
                (chapterNumber) => (
                  <option key={chapterNumber} value={chapterNumber}>
                    {chapterNumber}
                  </option>
                ),
              )}
            </select>
          </PickerLabel>
        </div>

        <div className="lg:flex lg:justify-end">
          <button
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950 dark:hover:text-blue-200"
            type="button"
            onClick={onRandomFeaturedPassage}
          >
            Random Featured Passage
          </button>
        </div>
      </div>
    </section>
  );
}

type PickerLabelProps = {
  children: ReactNode;
  label: string;
};

/**
 * Keeps picker labels and spacing consistent across the Bible controls.
 */
function PickerLabel({ children, label }: PickerLabelProps) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      {children}
    </label>
  );
}
