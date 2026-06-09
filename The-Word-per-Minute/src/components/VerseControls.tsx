import type { ReactNode } from "react";
import type { BibleChapter, BookSummary, Translation } from "../types/verse";

type VerseControlsProps = {
  books: BookSummary[];
  chapter: BibleChapter | null;
  selectedBook?: BookSummary;
  selectedBookId: string;
  selectedChapter: number;
  selectedTranslationId: string;
  selectedVerse: number;
  translations: Translation[];
  onRandomVerse: () => void;
  onReset: () => void;
  onSelectBook: (bookId: string) => void;
  onSelectChapter: (chapter: number) => void;
  onSelectTranslation: (translationId: string) => void;
  onSelectVerse: (verse: number) => void;
};

export function VerseControls({
  books,
  chapter,
  selectedBook,
  selectedBookId,
  selectedChapter,
  selectedTranslationId,
  selectedVerse,
  translations,
  onRandomVerse,
  onReset,
  onSelectBook,
  onSelectChapter,
  onSelectTranslation,
  onSelectVerse,
}: VerseControlsProps) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <PickerLabel label="Translation">
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
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
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
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
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
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

          <PickerLabel label="Verse">
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              value={selectedVerse}
              onChange={(event) => onSelectVerse(Number(event.target.value))}
            >
              {(chapter?.verses ?? []).map((verse) => (
                <option key={verse.number} value={verse.number}>
                  {verse.number}
                </option>
              ))}
            </select>
          </PickerLabel>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            type="button"
            onClick={onRandomVerse}
          >
            Random Verse
          </button>
          <button
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            type="button"
            onClick={onReset}
          >
            Reset
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

function PickerLabel({ children, label }: PickerLabelProps) {
  return (
    <label className="grid gap-1">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
