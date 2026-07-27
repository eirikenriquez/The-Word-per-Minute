import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../features/auth/context/authContext';
import { useFeaturedPassages } from '../../features/featured-passages/hooks/useFeaturedPassages';
import { getRandomFeaturedPassage } from '../../features/featured-passages/utils/featuredPassageSelection';
import { usePracticeAttemptMutations } from '../../features/practice/hooks/usePracticeAttemptMutations';
import { usePracticePassage } from '../../features/practice/hooks/usePracticePassage';
import { usePracticeSession } from '../../features/practice/hooks/usePracticeSession';
import type {
  PracticeCompletionResult,
  PracticeSource,
} from '../../features/practice/types/practice';
import { useSavePassageForm } from '../../features/saved-passages/hooks/useSavePassageForm';
import { useSavedPassages } from '../../features/saved-passages/hooks/useSavedPassages';
import type { SavedPassage } from '../../features/saved-passages/types/savedPassage';
import { createFeaturedPassageSaveInput } from '../../features/saved-passages/utils/passageSaveInput';
import type { PassageResponse } from '../../types/passage';
import { PracticePage } from '../../pages/practice/PracticePage';
import { AppErrorState } from '../components/AppErrorState';
import { AppHeader } from '../components/AppHeader';
import { AppLoadingState } from '../components/AppLoadingState';
import { usePassageCategories } from '../hooks/usePassageCategories';
import { usePracticeRouteSelection } from '../hooks/usePracticeRouteSelection';
import { APP_ROUTE_PATHS } from './appRoutePaths';

/**
 * Composes passage selection, typing state, persistence, and URL state needed
 * only by the Practice page.
 */
export function PracticeRoute() {
  const navigate = useNavigate();
  const authSession = useAuth();
  const [completedPracticeAttemptId, setCompletedPracticeAttemptId] = useState<
    string | null
  >(null);
  const featuredLibrary = useFeaturedPassages();
  const savedLibrary = useSavedPassages(authSession.user?.id);
  const {
    attemptSaveError,
    isSavingReflection,
    reflectionError,
    saveAttempt,
    updateReflection,
  } = usePracticeAttemptMutations(authSession.user?.id);
  const { savedPassageCategories } = usePassageCategories(
    featuredLibrary.passages,
  );
  const { practiceSource, selectPracticeRoute } = usePracticeRouteSelection({
    featuredPassages: featuredLibrary.passages,
    isSavedPassageListLoading: savedLibrary.isLoadingSavedPassages,
    savedPassages: savedLibrary.savedPassages,
    selectedFeaturedPassageId: featuredLibrary.selectedPassageId,
    selectedSavedPassageId: savedLibrary.selectedSavedPassageId,
    selectFeaturedPassage: featuredLibrary.selectPassage,
    selectSavedPassage: savedLibrary.selectSavedPassage,
  });
  const practicePassage = usePracticePassage({
    enabled: true,
    featuredPassageResponse: featuredLibrary.passageResponse,
    practiceSource,
    savedPassageResponse: savedLibrary.passageResponse,
  });

  const handleCompletedPracticeAttempt = useCallback(
    (result: PracticeCompletionResult) => {
      setCompletedPracticeAttemptId(null);

      const activePassageResponse =
        practiceSource === 'featured'
          ? featuredLibrary.passageResponse
          : savedLibrary.passageResponse;

      if (!activePassageResponse) return;

      void saveAttempt({
        accuracy: result.accuracy,
        bookId: activePassageResponse.passage.bookId,
        chapter: activePassageResponse.passage.chapter,
        durationSeconds: result.durationSeconds,
        endVerse: activePassageResponse.passage.endVerse,
        featuredPassageId:
          practiceSource === 'featured'
            ? featuredLibrary.selectedPassageId
            : undefined,
        mistakeCount: result.mistakeCount,
        passageReference: activePassageResponse.reference,
        savedPassageId:
          practiceSource === 'saved'
            ? savedLibrary.selectedSavedPassageId
            : undefined,
        selectedVerses: activePassageResponse.passage.selectedVerses,
        startVerse: activePassageResponse.passage.startVerse,
        translationId: activePassageResponse.translation.id,
        typedCharacterCount: result.typedCharacterCount,
        wpm: result.wpm,
      }).then((savedAttempt) => {
        if (savedAttempt) setCompletedPracticeAttemptId(savedAttempt.id);
      });
    },
    [
      featuredLibrary.passageResponse,
      featuredLibrary.selectedPassageId,
      practiceSource,
      saveAttempt,
      savedLibrary.passageResponse,
      savedLibrary.selectedSavedPassageId,
    ],
  );
  const practiceSession = usePracticeSession({
    passage: practicePassage,
    onCompletedAttempt: handleCompletedPracticeAttempt,
  });
  const { resetPractice } = practiceSession;
  const resetPracticeSession = useCallback(() => {
    resetPractice();
    setCompletedPracticeAttemptId(null);
  }, [resetPractice]);

  useEffect(() => {
    resetPracticeSession();
  }, [
    featuredLibrary.selectedPassageId,
    practiceSource,
    resetPracticeSession,
    savedLibrary.selectedSavedPassageId,
  ]);

  const saveInput = useMemo(() => {
    if (practiceSource !== 'featured') return null;

    return createFeaturedPassageSaveInput(
      featuredLibrary.passageResponse,
      savedPassageCategories,
    );
  }, [featuredLibrary.passageResponse, practiceSource, savedPassageCategories]);
  const { isCurrentPassageSaved, saveCurrentPassage } = useSavePassageForm({
    isPassageSaved: savedLibrary.isPassageSaved,
    saveInput,
    savePassage: savedLibrary.savePassage,
  });
  const displayState = getPracticeDisplayState({
    featuredError: featuredLibrary.error,
    featuredIsLoading: featuredLibrary.isLoading,
    featuredPassageResponse: featuredLibrary.passageResponse,
    practiceSource,
    savedPassageError:
      savedLibrary.selectedPassageError ?? savedLibrary.listError,
    savedIsLoading: savedLibrary.isLoading,
    savedPassageResponse: savedLibrary.passageResponse,
    selectedSavedPassage: savedLibrary.selectedSavedPassage,
  });

  const savePracticeReflection = useCallback(
    async (reflection: string) => {
      if (!completedPracticeAttemptId) return false;

      const updatedAttempt = await updateReflection(
        completedPracticeAttemptId,
        reflection,
      );
      return Boolean(updatedAttempt);
    },
    [completedPracticeAttemptId, updateReflection],
  );

  const openLibrary = useCallback(() => {
    resetPracticeSession();
    void navigate(APP_ROUTE_PATHS.library);
  }, [navigate, resetPracticeSession]);

  const nextFeaturedPassage = useCallback(() => {
    const passage = getRandomFeaturedPassage(
      featuredLibrary.passages,
      featuredLibrary.selectedPassageId,
    );
    selectPracticeRoute({
      passageId: passage?.id ?? null,
      source: 'featured',
    });
    resetPracticeSession();
  }, [
    featuredLibrary.passages,
    featuredLibrary.selectedPassageId,
    resetPracticeSession,
    selectPracticeRoute,
  ]);

  const selectFeaturedPractice = useCallback(() => {
    selectPracticeRoute({
      passageId: featuredLibrary.selectedPassageId || null,
      source: 'featured',
    });
    resetPracticeSession();
  }, [
    featuredLibrary.selectedPassageId,
    resetPracticeSession,
    selectPracticeRoute,
  ]);

  const selectSavedPractice = useCallback(
    (passageId: string) => {
      selectPracticeRoute({
        passageId,
        source: 'saved',
      });
      resetPracticeSession();
    },
    [resetPracticeSession, selectPracticeRoute],
  );

  if (displayState.isLoading) {
    return <AppLoadingState />;
  }

  if (displayState.error) {
    return <AppErrorState message={displayState.error} />;
  }

  if (!practicePassage) {
    return (
      <AppErrorState
        message={
          practiceSource === 'saved'
            ? 'Save a passage first.'
            : 'No practice passage found.'
        }
      />
    );
  }

  return (
    <div className="page-transition grid gap-4">
      <AppHeader
        headerReference={displayState.headerReference}
        headerSubtitle={displayState.headerSubtitle}
        headerTitle={displayState.headerTitle}
      />
      <PracticePage
        accuracy={practiceSession.accuracy}
        attemptSaveError={attemptSaveError}
        canSaveCurrentPassage={Boolean(saveInput)}
        canSaveReflection={
          authSession.isSignedIn && Boolean(completedPracticeAttemptId)
        }
        isCurrentPassageSaved={isCurrentPassageSaved}
        isPassageComplete={practiceSession.isPassageComplete}
        isSavingReflection={isSavingReflection}
        isSignedIn={authSession.isSignedIn}
        passage={practicePassage}
        practiceSource={practiceSource}
        practiceTitle={displayState.headerTitle}
        progress={practiceSession.progress}
        reflectionError={reflectionError}
        savedPassageOptions={savedLibrary.savedPassages.map(
          ({ category, id, title }) => ({
            category,
            id,
            title,
          }),
        )}
        selectedSavedPassageId={savedLibrary.selectedSavedPassageId}
        status={practiceSession.status}
        translationName={displayState.translationName}
        typedText={practiceSession.typedText}
        wpm={practiceSession.wpm}
        onNextFeaturedPassage={nextFeaturedPassage}
        onOpenLibrary={openLibrary}
        onResetPractice={resetPracticeSession}
        onSaveCurrentPassage={saveCurrentPassage}
        onSaveReflection={savePracticeReflection}
        onSelectFeaturedPractice={selectFeaturedPractice}
        onSelectSavedPassage={selectSavedPractice}
        onTypingChange={practiceSession.handleTyping}
      />
    </div>
  );
}

function getPracticeDisplayState({
  featuredError,
  featuredIsLoading,
  featuredPassageResponse,
  practiceSource,
  savedPassageError,
  savedIsLoading,
  savedPassageResponse,
  selectedSavedPassage,
}: {
  featuredError: string | null;
  featuredIsLoading: boolean;
  featuredPassageResponse: PassageResponse | null;
  practiceSource: PracticeSource;
  savedPassageError: string | null;
  savedIsLoading: boolean;
  savedPassageResponse: PassageResponse | null;
  selectedSavedPassage?: SavedPassage;
}) {
  const isFeaturedPractice = practiceSource === 'featured';

  return {
    error: isFeaturedPractice ? featuredError : savedPassageError,
    isLoading: isFeaturedPractice
      ? featuredIsLoading && !featuredPassageResponse
      : savedIsLoading && !savedPassageResponse,
    headerReference: isFeaturedPractice
      ? (featuredPassageResponse?.reference ?? '')
      : (selectedSavedPassage?.reference ?? ''),
    headerSubtitle: isFeaturedPractice
      ? `Practice - ${featuredPassageResponse?.passage.theme ?? 'Discovery'}`
      : 'Practice - Saved passage',
    headerTitle: isFeaturedPractice
      ? (featuredPassageResponse?.passage.title ?? 'Featured Passage')
      : (selectedSavedPassage?.title ?? 'Saved Passage'),
    translationName: isFeaturedPractice
      ? (featuredPassageResponse?.translation.abbreviation ?? 'WEB')
      : (selectedSavedPassage?.translationAbbreviation ?? 'WEB'),
  };
}
