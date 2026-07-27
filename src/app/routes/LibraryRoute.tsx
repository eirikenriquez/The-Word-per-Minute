import { useNavigate } from 'react-router';
import { useAuth } from '../../features/auth/context/authContext';
import { useSavedPassageCollection } from '../../features/saved-passages/hooks/useSavedPassageCollection';
import type { SavedPassage } from '../../features/saved-passages/types/savedPassage';
import { LibraryPage } from '../../pages/library/LibraryPage';
import { AppHeader } from '../components/AppHeader';
import { createBiblePath } from './bibleRouteState';
import { createPracticePath } from './practiceRouteState';

/**
 * Composes saved-passage data and cross-page navigation for the Library page.
 */
export function LibraryRoute() {
  const navigate = useNavigate();
  const authSession = useAuth();
  const savedPassageCollection = useSavedPassageCollection(
    authSession.user?.id,
  );

  function practiceSavedPassage(passageId: string) {
    void navigate(
      createPracticePath({
        passageId,
        source: 'saved',
      }),
    );
  }

  function readSavedPassage(passageId: string) {
    const passage = savedPassageCollection.savedPassages.find(
      (savedPassage) => savedPassage.id === passageId,
    );
    if (!passage) return;

    void navigate(
      createBiblePath({
        bookId: passage.bookId,
        chapter: passage.chapter,
        selectedVerseNumbers: getReaderVerseNumbers(passage),
        translationId: passage.translationId,
      }),
    );
  }

  return (
    <div className="page-transition grid gap-4">
      <AppHeader
        headerReference={`${savedPassageCollection.savedPassages.length} saved`}
        headerSubtitle="Manage your saved passages"
        headerTitle="Saved Library"
      />
      <LibraryPage
        errorMessage={
          savedPassageCollection.listError ??
          savedPassageCollection.mutationError
        }
        savedPassages={savedPassageCollection.savedPassages}
        onPracticeSavedPassage={practiceSavedPassage}
        onReadSavedPassage={readSavedPassage}
        onRemoveSavedPassage={async (passageId) => {
          await savedPassageCollection.removePassage(passageId);
        }}
        onUpdateSavedPassage={savedPassageCollection.updatePassage}
      />
    </div>
  );
}

function getReaderVerseNumbers(passage: SavedPassage) {
  if (passage.selectedVerses?.length) {
    return passage.selectedVerses;
  }

  return passage.source === 'featured'
    ? createVerseRange(passage.startVerse, passage.endVerse)
    : [];
}

function createVerseRange(startVerse: number, endVerse: number) {
  return Array.from(
    { length: endVerse - startVerse + 1 },
    (_, index) => startVerse + index,
  );
}
