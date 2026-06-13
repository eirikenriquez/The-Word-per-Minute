import type { useAppActions } from "../hooks/useAppActions";
import type { useReaderSelection } from "../../features/bible-reader/hooks/useReaderSelection";
import type { useVerseLibrary } from "../../features/bible-reader/hooks/useVerseLibrary";
import type { BiblePageProps } from "../../pages/BiblePage";

type UseBiblePageControllerParams = {
  appActions: ReturnType<typeof useAppActions>;
  bibleLibrary: ReturnType<typeof useVerseLibrary>;
  readerSelection: ReturnType<typeof useReaderSelection>;
};

/**
 * Prepares the props for the Bible reader page.
 * Reader selection stays in the reader feature; cross-page actions come from the app layer.
 */
export function useBiblePageController({
  appActions,
  bibleLibrary,
  readerSelection,
}: UseBiblePageControllerParams): BiblePageProps {
  return {
    bibleBooks: bibleLibrary.books,
    bibleChapter: bibleLibrary.chapter,
    focusSelectedVerseKey: readerSelection.focusSelectedVerseKey,
    selectedBibleBook: bibleLibrary.selectedBook,
    selectedBibleBookId: bibleLibrary.selectedBookId,
    selectedBibleChapter: bibleLibrary.selectedChapter,
    selectedTranslationId: bibleLibrary.selectedTranslationId,
    selectedVerseNumbers: readerSelection.selectedVerseNumbers,
    translations: bibleLibrary.translations,
    onClearBibleSelection: appActions.clearBibleSelection,
    onRandomFeaturedReaderPassage: appActions.randomFeaturedReaderPassage,
    onSelectBibleBook: appActions.selectReaderBook,
    onSelectBibleChapter: appActions.selectReaderChapter,
    onSelectReaderRange: readerSelection.selectRange,
    onSelectReaderVerse: readerSelection.selectVerse,
    onSelectTranslation: appActions.selectReaderTranslation,
  };
}
