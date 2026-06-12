import { BibleControls } from "./BibleControls";
import { BibleReaderSelector } from "./BibleReaderSelector";
import { HomeCategoryPicker } from "./HomeCategoryPicker";
import { PersonalBests } from "./PersonalBests";
import { PracticeBatchDisplay } from "./PracticeBatchDisplay";
import { PracticeControls } from "./PracticeControls";
import { SavedPassageControls } from "./SavedPassageControls";
import { TypingPracticePanel } from "./TypingPracticePanel";
import type { AppMode, PracticeSource } from "../types/appMode";
import type { PracticeStats, TypingMetrics } from "../types/practice";
import type { PracticeBatch } from "../types/practiceBatch";
import type { SavedPassage, SavedPassageUpdate } from "../types/savedPassage";
import type { BibleChapter, BookSummary, Translation } from "../types/verse";

type FeaturedHomeCategory = {
  count: number;
  label: string;
};

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
  onRandomFeaturedReaderPassage: () => void;
};

/**
 * Renders the mode-specific body below the shared mode header.
 * App still owns state; this component keeps the view branching out of App.
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
  onRandomFeaturedReaderPassage,
}: ModeContentProps) {
  return (
    <>
      {appMode === "home" ? (
        <HomeCategoryPicker
          featuredCategories={featuredHomeCategories}
          hasSavedPassages={savedPassages.length > 0}
          savedPassageCount={savedPassages.length}
          onOpenBible={onOpenBible}
          onOpenLibrary={onOpenLibrary}
          onStartFeatured={onStartFeaturedPractice}
          onStartFeaturedCategory={onSelectFeaturedCategory}
        />
      ) : appMode === "practice" ? (
        <PracticeControls
          hasSavedPassages={savedPassages.length > 0}
          practiceSource={practiceSource}
          savedPassages={savedPassages}
          selectedSavedPassageId={selectedSavedPassageId}
          onNextFeaturedPassage={onNextFeaturedPassage}
          onOpenLibrary={onOpenLibrary}
          onReset={onResetPractice}
          onSelectFeaturedPractice={onSelectFeaturedPractice}
          onSelectSavedPractice={onSelectSavedPassage}
        />
      ) : appMode === "bible" ? (
        <>
          <BibleControls
            books={bibleBooks}
            selectedBook={selectedBibleBook}
            selectedBookId={selectedBibleBookId}
            selectedChapter={selectedBibleChapter}
            selectedTranslationId={selectedTranslationId}
            translations={translations}
            onSelectBook={onSelectBibleBook}
            onSelectChapter={onSelectBibleChapter}
            onSelectTranslation={onSelectTranslation}
            onRandomFeaturedPassage={onRandomFeaturedReaderPassage}
          />
          <BibleReaderSelector
            chapter={bibleChapter}
            selectedBook={selectedBibleBook}
            selectedChapter={selectedBibleChapter}
            selectedVerseNumbers={selectedVerseNumbers}
            focusSelectedVerseKey={focusSelectedVerseKey}
            onClearSelection={onClearBibleSelection}
            onSelectRange={onSelectReaderRange}
            onSelectVerse={onSelectReaderVerse}
          />
        </>
      ) : (
        <SavedPassageControls
          savedPassages={savedPassages}
          selectedSavedPassageId={selectedSavedPassageId}
          onRemovePassage={onRemoveSavedPassage}
          onSelectSavedPassage={onSelectSavedPassage}
          onUpdatePassage={onUpdateSavedPassage}
        />
      )}

      {appMode === "practice" && currentBatch && (
        <>
          <PracticeBatchDisplay
            batch={currentBatch}
            batchNumber={currentBatchIndex + 1}
            totalBatches={totalBatches}
            translationName={translationName}
            typedText={typedText}
          />

          <TypingPracticePanel
            accuracy={accuracy}
            completionActionLabel={
              isPassageComplete && practiceSource === "featured" ? "Next Passage" : undefined
            }
            completionMessage={
              isPassageComplete
                ? `Complete. You finished ${practiceTitle} at ${wpm} WPM with ${accuracy}% accuracy.`
                : "Batch complete. Moving to the next verses..."
            }
            isComplete={isBatchComplete}
            onCompletionAction={
              isPassageComplete && practiceSource === "featured" ? onNextFeaturedPassage : undefined
            }
            progress={Math.min(progress, 100)}
            status={status}
            typedText={typedText}
            wpm={wpm}
            onTypingChange={onTypingChange}
          />

          <PersonalBests stats={stats} onResetStats={onResetStats} />
        </>
      )}
    </>
  );
}
