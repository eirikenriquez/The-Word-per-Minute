import type { useAppActions } from "../hooks/useAppActions";
import type { useReaderSelection } from "../../features/bible-reader/hooks/useReaderSelection";
import type { useVerseLibrary } from "../../features/bible-reader/hooks/useVerseLibrary";
import type { FeaturedHomeCategory } from "../../pages/HomePage";
import { BiblePage } from "../../pages/BiblePage";
import { HomePage } from "../../pages/HomePage";
import { LibraryPage } from "../../pages/LibraryPage";
import { PracticePage } from "../../pages/PracticePage";
import type { PracticeSource } from "../../types/appMode";
import type { PracticeStats } from "../../types/practice";
import type { PracticeBatch } from "../../types/practiceBatch";
import type { usePracticeSession } from "../../features/practice/hooks/usePracticeSession";
import type { useSavedPassages } from "../../features/saved-passages/hooks/useSavedPassages";
import { AppRoutes } from "./AppRoutes";

type AppPageRoutesProps = {
  appActions: ReturnType<typeof useAppActions>;
  bibleLibrary: ReturnType<typeof useVerseLibrary>;
  batches: PracticeBatch[];
  currentBatch: PracticeBatch | undefined;
  featuredHomeCategories: FeaturedHomeCategory[];
  practiceSession: ReturnType<typeof usePracticeSession>;
  practiceSource: PracticeSource;
  practiceTitle: string;
  readerSelection: ReturnType<typeof useReaderSelection>;
  resetStats: () => void;
  savedLibrary: ReturnType<typeof useSavedPassages>;
  stats: PracticeStats;
  translationName: string;
};

/**
 * Builds the route elements for each app page.
 * App owns the state; this component owns the page-to-prop wiring.
 */
export function AppPageRoutes({
  appActions,
  bibleLibrary,
  batches,
  currentBatch,
  featuredHomeCategories,
  practiceSession,
  practiceSource,
  practiceTitle,
  readerSelection,
  resetStats,
  savedLibrary,
  stats,
  translationName,
}: AppPageRoutesProps) {
  return (
    <AppRoutes
      pages={{
        bible: (
          <BiblePage
            bibleBooks={bibleLibrary.books}
            bibleChapter={bibleLibrary.chapter}
            focusSelectedVerseKey={readerSelection.focusSelectedVerseKey}
            selectedBibleBook={bibleLibrary.selectedBook}
            selectedBibleBookId={bibleLibrary.selectedBookId}
            selectedBibleChapter={bibleLibrary.selectedChapter}
            selectedTranslationId={bibleLibrary.selectedTranslationId}
            selectedVerseNumbers={readerSelection.selectedVerseNumbers}
            translations={bibleLibrary.translations}
            onClearBibleSelection={appActions.clearBibleSelection}
            onRandomFeaturedReaderPassage={appActions.randomFeaturedReaderPassage}
            onSelectBibleBook={appActions.selectReaderBook}
            onSelectBibleChapter={appActions.selectReaderChapter}
            onSelectReaderRange={readerSelection.selectRange}
            onSelectReaderVerse={readerSelection.selectVerse}
            onSelectTranslation={appActions.selectReaderTranslation}
          />
        ),
        home: (
          <HomePage
            featuredHomeCategories={featuredHomeCategories}
            savedPassageCount={savedLibrary.savedPassages.length}
            onOpenBible={appActions.openBible}
            onOpenLibrary={appActions.openLibrary}
            onSelectFeaturedCategory={appActions.startFeaturedCategory}
            onStartFeaturedPractice={appActions.startFeaturedPractice}
          />
        ),
        library: (
          <LibraryPage
            savedPassages={savedLibrary.savedPassages}
            selectedSavedPassageId={savedLibrary.selectedSavedPassageId}
            onRemoveSavedPassage={appActions.removeSavedPractice}
            onSelectSavedPassage={appActions.selectSavedPractice}
            onUpdateSavedPassage={savedLibrary.updatePassage}
          />
        ),
        practice: currentBatch ? (
          <PracticePage
            accuracy={practiceSession.accuracy}
            currentBatch={currentBatch}
            currentBatchIndex={practiceSession.currentBatchIndex}
            isBatchComplete={practiceSession.isBatchComplete}
            isPassageComplete={practiceSession.isPassageComplete}
            practiceSource={practiceSource}
            practiceTitle={practiceTitle}
            progress={practiceSession.progress}
            savedPassages={savedLibrary.savedPassages}
            selectedSavedPassageId={savedLibrary.selectedSavedPassageId}
            stats={stats}
            status={practiceSession.status}
            totalBatches={batches.length}
            translationName={translationName}
            typedText={practiceSession.typedText}
            wpm={practiceSession.wpm}
            onNextFeaturedPassage={appActions.nextFeaturedPassage}
            onOpenLibrary={appActions.openLibrary}
            onResetPractice={practiceSession.resetPractice}
            onResetStats={resetStats}
            onSelectFeaturedPractice={appActions.selectFeaturedPractice}
            onSelectSavedPassage={appActions.selectSavedPractice}
            onTypingChange={practiceSession.handleTyping}
          />
        ) : null,
      }}
    />
  );
}
