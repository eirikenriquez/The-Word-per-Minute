import { BibleChapterReader } from "../features/bible-reader/components/BibleChapterReader";
import { BibleReaderControls } from "../features/bible-reader/components/BibleReaderControls";
import type { BibleChapter, BookSummary, Translation } from "../types/verse";

export type BiblePageProps = {
  bibleBooks: BookSummary[];
  bibleChapter: BibleChapter | null;
  focusSelectedVerseKey: number;
  selectedBibleBook?: BookSummary;
  selectedBibleBookId: string;
  selectedBibleChapter: number;
  selectedTranslationId: string;
  selectedVerseNumbers: number[];
  translations: Translation[];
  onClearBibleSelection: () => void;
  onRandomFeaturedReaderPassage: () => void;
  onSelectBibleBook: (bookId: string) => void;
  onSelectBibleChapter: (chapterNumber: number) => void;
  onSelectReaderRange: (startVerse: number, endVerse: number) => void;
  onSelectReaderVerse: (verseNumber: number) => void;
  onSelectTranslation: (translationId: string) => void;
};

/**
 * Bible reading and verse-selection page.
 * Selected verses can later be saved as a typing passage.
 */
export function BiblePage({
  bibleBooks,
  bibleChapter,
  focusSelectedVerseKey,
  selectedBibleBook,
  selectedBibleBookId,
  selectedBibleChapter,
  selectedTranslationId,
  selectedVerseNumbers,
  translations,
  onClearBibleSelection,
  onRandomFeaturedReaderPassage,
  onSelectBibleBook,
  onSelectBibleChapter,
  onSelectReaderRange,
  onSelectReaderVerse,
  onSelectTranslation,
}: BiblePageProps) {
  return (
    <div className="grid gap-8">
      <BibleReaderControls
        books={bibleBooks}
        selectedBook={selectedBibleBook}
        selectedBookId={selectedBibleBookId}
        selectedChapter={selectedBibleChapter}
        selectedTranslationId={selectedTranslationId}
        translations={translations}
        onRandomFeaturedPassage={onRandomFeaturedReaderPassage}
        onSelectBook={onSelectBibleBook}
        onSelectChapter={onSelectBibleChapter}
        onSelectTranslation={onSelectTranslation}
      />
      <BibleChapterReader
        chapter={bibleChapter}
        focusSelectedVerseKey={focusSelectedVerseKey}
        selectedBook={selectedBibleBook}
        selectedChapter={selectedBibleChapter}
        selectedVerseNumbers={selectedVerseNumbers}
        onClearSelection={onClearBibleSelection}
        onSelectRange={onSelectReaderRange}
        onSelectVerse={onSelectReaderVerse}
      />
    </div>
  );
}
