import { useMemo } from 'react';
import { useAuth } from '../../features/auth/context/authContext';
import { useReaderSelection } from '../../features/bible-reader/hooks/useReaderSelection';
import { useVerseLibrary } from '../../features/bible-reader/hooks/useVerseLibrary';
import { useFeaturedPassageCatalog } from '../../features/featured-passages/hooks/useFeaturedPassageCatalog';
import { getRandomFeaturedPassage } from '../../features/featured-passages/utils/featuredPassageSelection';
import { useSavePassageForm } from '../../features/saved-passages/hooks/useSavePassageForm';
import { useSavedPassageCollection } from '../../features/saved-passages/hooks/useSavedPassageCollection';
import { createBiblePassageSaveInput } from '../../features/saved-passages/utils/passageSaveInput';
import { BiblePage } from '../../pages/bible/BiblePage';
import { AppErrorState } from '../components/AppErrorState';
import { AppHeader } from '../components/AppHeader';
import { AppLoadingState } from '../components/AppLoadingState';
import { useBibleRouteSelection } from '../hooks/useBibleRouteSelection';
import { usePassageCategories } from '../hooks/usePassageCategories';

/**
 * Composes reader, saving, and URL state needed only by the Bible page.
 */
export function BibleRoute() {
  const authSession = useAuth();
  const readerSelection = useReaderSelection();
  const featuredCatalog = useFeaturedPassageCatalog();
  const bibleLibrary = useVerseLibrary();
  const savedPassageCollection = useSavedPassageCollection(
    authSession.user?.id,
  );
  const { savedPassageCategories } = usePassageCategories(
    featuredCatalog.passages,
  );
  const bibleRouteSelection = useBibleRouteSelection({
    books: bibleLibrary.books,
    focusSelectedVerses: readerSelection.focusSelectedVerses,
    selectedBookId: bibleLibrary.selectedBookId,
    selectedChapter: bibleLibrary.selectedChapter,
    selectedTranslationId: bibleLibrary.selectedTranslationId,
    selectedVerseNumbers: readerSelection.selectedVerseNumbers,
    selectBook: bibleLibrary.selectBook,
    selectChapter: bibleLibrary.selectChapter,
    selectTranslation: bibleLibrary.selectTranslation,
    setSelectedVerseNumbers: readerSelection.setSelectedVerseNumbers,
    translations: bibleLibrary.translations,
  });
  const saveInput = useMemo(
    () =>
      createBiblePassageSaveInput({
        bibleChapter: bibleLibrary.chapter,
        selectedBook: bibleLibrary.selectedBook,
        selectedChapter: bibleLibrary.selectedChapter,
        selectedTranslationId: bibleLibrary.selectedTranslationId,
        selectedVerseNumbers: readerSelection.selectedVerseNumbers,
        translations: bibleLibrary.translations,
      }),
    [
      bibleLibrary.chapter,
      bibleLibrary.selectedBook,
      bibleLibrary.selectedChapter,
      bibleLibrary.selectedTranslationId,
      bibleLibrary.translations,
      readerSelection.selectedVerseNumbers,
    ],
  );
  const {
    isCurrentPassageSaved,
    saveCategory,
    saveCurrentPassage,
    saveTitle,
    setSaveCategory,
    setSaveTitle,
  } = useSavePassageForm({
    isPassageSaved: savedPassageCollection.isPassageSaved,
    saveInput,
    savePassage: savedPassageCollection.savePassage,
  });

  if (bibleLibrary.isLoading) {
    return <AppLoadingState message="Loading Bible passage..." />;
  }

  if (bibleLibrary.error) {
    return <AppErrorState message={bibleLibrary.error} />;
  }

  function openRandomFeaturedPassage() {
    const passage = getRandomFeaturedPassage(featuredCatalog.passages);
    if (!passage) return;

    bibleRouteSelection.selectBibleRoute({
      bookId: passage.bookId,
      chapter: passage.chapter,
      selectedVerseNumbers: createVerseRange(
        passage.startVerse,
        passage.endVerse,
      ),
      translationId: passage.translationId,
    });
  }

  return (
    <div className="page-transition grid gap-4">
      <AppHeader
        headerReference=""
        headerSubtitle="Read and save scripture"
        headerTitle="Bible Reader"
      />
      <BiblePage
        bibleBooks={bibleLibrary.books}
        bibleChapter={bibleLibrary.chapter}
        focusSelectedVerseKey={readerSelection.focusSelectedVerseKey}
        selectedBibleBook={bibleLibrary.selectedBook}
        selectedBibleBookId={bibleLibrary.selectedBookId}
        selectedBibleChapter={bibleLibrary.selectedChapter}
        selectedTranslationId={bibleLibrary.selectedTranslationId}
        selectedVerseNumbers={readerSelection.selectedVerseNumbers}
        saveControls={{
          canSaveCurrentPassage: Boolean(saveInput),
          isCurrentPassageSaved,
          isSavingCurrentPassage: savedPassageCollection.isSaving,
          saveError: savedPassageCollection.mutationError,
          saveCategory,
          savedPassageCategories,
          saveTitle,
          onSaveCategoryChange: setSaveCategory,
          onSaveCurrentPassage: saveCurrentPassage,
          onSaveTitleChange: setSaveTitle,
        }}
        translations={bibleLibrary.translations}
        onClearBibleSelection={bibleRouteSelection.clearReaderSelection}
        onRandomFeaturedReaderPassage={openRandomFeaturedPassage}
        onSelectBibleBook={bibleRouteSelection.selectReaderBook}
        onSelectBibleChapter={bibleRouteSelection.selectReaderChapter}
        onSelectReaderRange={bibleRouteSelection.selectReaderRange}
        onSelectReaderVerse={bibleRouteSelection.selectReaderVerse}
        onSelectTranslation={bibleRouteSelection.selectReaderTranslation}
      />
    </div>
  );
}

function createVerseRange(startVerse: number, endVerse: number) {
  return Array.from(
    { length: endVerse - startVerse + 1 },
    (_, index) => startVerse + index,
  );
}
