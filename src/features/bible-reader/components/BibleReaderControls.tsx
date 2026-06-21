import type { ReactNode } from "react";
import type { BookSummary, Translation } from "../../../types/verse";
import { Button } from "../../../ui/Button";

type BibleReaderControlsProps = {
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
export function BibleReaderControls({
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
}: BibleReaderControlsProps) {
  return (
    <section>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="grid gap-3 sm:grid-cols-3">
          <PickerLabel label="Translation">
            <select
              className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950"
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
              className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950"
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
              className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950"
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
          <Button onClick={onRandomFeaturedPassage}>
            Random Featured Passage
          </Button>
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
      <span className="text-sm font-medium text-ink-muted">{label}</span>
      {children}
    </label>
  );
}
