import { BiblePage } from "../../pages/BiblePage";
import { HomePage, type FeaturedHomeCategory } from "../../pages/HomePage";
import { LibraryPage } from "../../pages/LibraryPage";
import { PracticePage } from "../../pages/PracticePage";
import type { AppMode, PracticeSource } from "../../types/appMode";
import type { PracticeStats, TypingMetrics } from "../../types/practice";
import type { PracticeBatch } from "../../types/practiceBatch";
import type { SavedPassage, SavedPassageUpdate } from "../../types/savedPassage";
import type { BibleChapter, BookSummary, Translation } from "../../types/verse";

type ModeContentProps = {
  accuracy: number;
  appMode: AppMode;
  bibleBooks: BookSummary[];
  bibleChapter: BibleChapter | null;
  currentBatch: PracticeBatch | undefined;
  currentBatchIndex: number;
  featuredHomeCategories: FeaturedHomeCategory[];
  focusSelectedVerseKey: number;
  isBatchComplete: boolean;
  isPassageComplete: boolean;
  practiceSource: PracticeSource;
  practiceTitle: string;
  progress: number;
  savedPassages: SavedPassage[];
  selectedBibleBook?: BookSummary;
  selectedBibleBookId: string;
  selectedBibleChapter: number;
  selectedSavedPassageId: string;
  selectedTranslationId: string;
  selectedVerseNumbers: number[];
  stats: PracticeStats;
  status: TypingMetrics["status"];
  totalBatches: number;
  translations: Translation[];
  translationName: string;
  typedText: string;
  wpm: number;
  onClearBibleSelection: () => void;
  onNextFeaturedPassage: () => void;
  onOpenBible: () => void;
  onOpenLibrary: () => void;
  onRandomFeaturedReaderPassage: () => void;
  onRemoveSavedPassage: (passageId: string) => void;
  onResetPractice: () => void;
  onResetStats: () => void;
  onSelectBibleBook: (bookId: string) => void;
  onSelectBibleChapter: (chapterNumber: number) => void;
  onSelectFeaturedCategory: (category: string) => void;
  onSelectFeaturedPractice: () => void;
  onSelectReaderRange: (startVerse: number, endVerse: number) => void;
  onSelectReaderVerse: (verseNumber: number) => void;
  onSelectSavedPassage: (passageId: string) => void;
  onSelectTranslation: (translationId: string) => void;
  onStartFeaturedPractice: () => void;
  onTypingChange: (typedText: string) => void;
  onUpdateSavedPassage: (passageId: string, update: SavedPassageUpdate) => SavedPassage | null;
};

/**
 * Tiny mode switcher.
 * Each page owns its screen layout, while App still owns cross-page state for now.
 */
export function ModeContent({
  accuracy,
  appMode,
  bibleBooks,
  bibleChapter,
  currentBatch,
  currentBatchIndex,
  featuredHomeCategories,
  focusSelectedVerseKey,
  isBatchComplete,
  isPassageComplete,
  practiceSource,
  practiceTitle,
  progress,
  savedPassages,
  selectedBibleBook,
  selectedBibleBookId,
  selectedBibleChapter,
  selectedSavedPassageId,
  selectedTranslationId,
  selectedVerseNumbers,
  stats,
  status,
  totalBatches,
  translations,
  translationName,
  typedText,
  wpm,
  onClearBibleSelection,
  onNextFeaturedPassage,
  onOpenBible,
  onOpenLibrary,
  onRandomFeaturedReaderPassage,
  onRemoveSavedPassage,
  onResetPractice,
  onResetStats,
  onSelectBibleBook,
  onSelectBibleChapter,
  onSelectFeaturedCategory,
  onSelectFeaturedPractice,
  onSelectReaderRange,
  onSelectReaderVerse,
  onSelectSavedPassage,
  onSelectTranslation,
  onStartFeaturedPractice,
  onTypingChange,
  onUpdateSavedPassage,
}: ModeContentProps) {
  if (appMode === "home") {
    return (
      <HomePage
        featuredHomeCategories={featuredHomeCategories}
        savedPassageCount={savedPassages.length}
        onOpenBible={onOpenBible}
        onOpenLibrary={onOpenLibrary}
        onSelectFeaturedCategory={onSelectFeaturedCategory}
        onStartFeaturedPractice={onStartFeaturedPractice}
      />
    );
  }

  if (appMode === "practice" && currentBatch) {
    return (
      <PracticePage
        accuracy={accuracy}
        currentBatch={currentBatch}
        currentBatchIndex={currentBatchIndex}
        isBatchComplete={isBatchComplete}
        isPassageComplete={isPassageComplete}
        practiceSource={practiceSource}
        practiceTitle={practiceTitle}
        progress={progress}
        savedPassages={savedPassages}
        selectedSavedPassageId={selectedSavedPassageId}
        stats={stats}
        status={status}
        totalBatches={totalBatches}
        translationName={translationName}
        typedText={typedText}
        wpm={wpm}
        onNextFeaturedPassage={onNextFeaturedPassage}
        onOpenLibrary={onOpenLibrary}
        onResetPractice={onResetPractice}
        onResetStats={onResetStats}
        onSelectFeaturedPractice={onSelectFeaturedPractice}
        onSelectSavedPassage={onSelectSavedPassage}
        onTypingChange={onTypingChange}
      />
    );
  }

  if (appMode === "bible") {
    return (
      <BiblePage
        bibleBooks={bibleBooks}
        bibleChapter={bibleChapter}
        focusSelectedVerseKey={focusSelectedVerseKey}
        selectedBibleBook={selectedBibleBook}
        selectedBibleBookId={selectedBibleBookId}
        selectedBibleChapter={selectedBibleChapter}
        selectedTranslationId={selectedTranslationId}
        selectedVerseNumbers={selectedVerseNumbers}
        translations={translations}
        onClearBibleSelection={onClearBibleSelection}
        onRandomFeaturedReaderPassage={onRandomFeaturedReaderPassage}
        onSelectBibleBook={onSelectBibleBook}
        onSelectBibleChapter={onSelectBibleChapter}
        onSelectReaderRange={onSelectReaderRange}
        onSelectReaderVerse={onSelectReaderVerse}
        onSelectTranslation={onSelectTranslation}
      />
    );
  }

  return (
    <LibraryPage
      savedPassages={savedPassages}
      selectedSavedPassageId={selectedSavedPassageId}
      onRemoveSavedPassage={onRemoveSavedPassage}
      onSelectSavedPassage={onSelectSavedPassage}
      onUpdateSavedPassage={onUpdateSavedPassage}
    />
  );
}
