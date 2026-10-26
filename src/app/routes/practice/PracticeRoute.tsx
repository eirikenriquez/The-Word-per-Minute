import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router';
import { AppErrorState } from '../../components/AppErrorState';
import { AppHeader } from '../../components/AppHeader';
import { AppLoadingState } from '../../components/AppLoadingState';
import { usePassageCategories } from '../../hooks/usePassageCategories';
import { useAuth } from '../../../features/auth/context/authContext';
import { useFeaturedPassageCatalog } from '../../../features/featured-passages/hooks/useFeaturedPassageCatalog';
import { useSelectedFeaturedPassage } from '../../../features/featured-passages/hooks/useSelectedFeaturedPassage';
import { getRandomFeaturedPassage } from '../../../features/featured-passages/utils/featuredPassageSelection';
import { usePracticeAttemptMutations } from '../../../features/practice/hooks/usePracticeAttemptMutations';
import { usePracticePassage } from '../../../features/practice/hooks/usePracticePassage';
import { usePracticeSession } from '../../../features/practice/hooks/usePracticeSession';
import type { PracticeCompletionResult } from '../../../features/practice/types/practice';
import { createPracticeAttemptInput } from '../../../features/practice/utils/practiceAttemptInput';
import { useSavePassageForm } from '../../../features/saved-passages/hooks/useSavePassageForm';
import { useSavedPassages } from '../../../features/saved-passages/hooks/useSavedPassages';
import { createFeaturedPassageSaveInput } from '../../../features/saved-passages/utils/passageSaveInput';
import { APP_ROUTE_PATHS } from '../appRoutePaths';
import { PracticePage } from './PracticePage';
import {
  initialPracticePassageTransition,
  practicePassageTransitionReducer,
  type PracticePassageSnapshot,
} from './practicePassageTransition';
import { usePracticeRouteSelection } from './usePracticeRouteSelection';

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
  const [attemptSaveError, setAttemptSaveError] = useState<string | null>(null);
  const attemptVersionRef = useRef(0);
  const [focusRequestId, setFocusRequestId] = useState(0);
  const initialFocusRequestedRef = useRef(false);
  const pendingNextFocusKeyRef = useRef<string | null>(null);
  const [transition, dispatchTransition] = useReducer(
    practicePassageTransitionReducer,
    initialPracticePassageTransition,
  );
  const featuredCatalog = useFeaturedPassageCatalog();
  const selectedFeaturedPassage = useSelectedFeaturedPassage(
    featuredCatalog.passages,
  );
  const savedLibrary = useSavedPassages(authSession.user?.id);
  const { isSavingReflection, reflectionError, saveAttempt, updateReflection } =
    usePracticeAttemptMutations(authSession.user?.id);
  const { savedPassageCategories } = usePassageCategories(
    featuredCatalog.passages,
  );
  const { practiceSource, requestedPassageId, selectPracticeRoute } =
    usePracticeRouteSelection({
      featuredPassages: featuredCatalog.passages,
      isSavedPassageListLoading: savedLibrary.isLoadingSavedPassages,
      savedPassages: savedLibrary.savedPassages,
      selectedFeaturedPassageId: selectedFeaturedPassage.selectedPassageId,
      selectedSavedPassageId: savedLibrary.selectedSavedPassageId,
      selectFeaturedPassage: selectedFeaturedPassage.selectPassage,
      selectSavedPassage: savedLibrary.selectSavedPassage,
    });
  const ownerId = authSession.user?.id ?? null;
  const requestKey = JSON.stringify([
    ownerId,
    practiceSource,
    requestedPassageId,
  ]);
  const selectedPassageId =
    practiceSource === 'featured'
      ? selectedFeaturedPassage.selectedPassageId
      : savedLibrary.selectedSavedPassageId;
  const response =
    practiceSource === 'featured'
      ? selectedFeaturedPassage.passageResponse
      : savedLibrary.passageResponse;
  const requestIsLoading =
    selectedPassageId !== (requestedPassageId ?? '') ||
    (practiceSource === 'featured'
      ? featuredCatalog.isLoading || selectedFeaturedPassage.isLoading
      : savedLibrary.isLoading);
  const requestError =
    practiceSource === 'featured'
      ? (featuredCatalog.error ?? selectedFeaturedPassage.error)
      : (savedLibrary.selectedPassageError ?? savedLibrary.listError);
  const readySnapshot = useMemo<PracticePassageSnapshot | null>(() => {
    if (requestIsLoading || requestError || !response || !requestedPassageId)
      return null;
    const savedPassage = savedLibrary.selectedSavedPassage;
    if (practiceSource === 'saved' && savedPassage?.id !== requestedPassageId)
      return null;

    return {
      key: requestKey,
      ownerId,
      passageId: requestedPassageId,
      source: practiceSource,
      response,
      headerTitle:
        practiceSource === 'featured'
          ? response.passage.title
          : savedPassage!.title,
      headerSubtitle:
        practiceSource === 'featured'
          ? `Practice - ${response.passage.theme}`
          : 'Practice - Saved passage',
      headerReference: response.reference,
      translationName: response.translation.abbreviation,
    };
  }, [
    ownerId,
    practiceSource,
    requestError,
    requestIsLoading,
    requestKey,
    requestedPassageId,
    response,
    savedLibrary.selectedSavedPassage,
  ]);
  const displayed =
    transition.displayed?.ownerId === ownerId ? transition.displayed : null;
  const passageLoadError = requestIsLoading
    ? null
    : (requestError ??
      (transition.requestKey === requestKey ? transition.error : null));
  const isPassageUnavailable =
    !displayed ||
    displayed.key !== requestKey ||
    requestIsLoading ||
    transition.isLoading ||
    Boolean(passageLoadError);
  const practicePassage = usePracticePassage({
    enabled: Boolean(displayed),
    featuredPassageResponse:
      displayed?.source === 'featured' ? displayed.response : null,
    practiceSource: displayed?.source ?? practiceSource,
    savedPassageResponse:
      displayed?.source === 'saved' ? displayed.response : null,
  });

  const handleCompletedPracticeAttempt = useCallback(
    (result: PracticeCompletionResult) => {
      if (!displayed) return;
      setCompletedPracticeAttemptId(null);
      setAttemptSaveError(null);
      const attemptVersion = attemptVersionRef.current;
      const attemptInput = createPracticeAttemptInput({
        completionResult: result,
        featuredPassageId:
          displayed.source === 'featured' ? displayed.passageId : '',
        passageResponse: displayed.response,
        practiceSource: displayed.source,
        savedPassageId: displayed.source === 'saved' ? displayed.passageId : '',
      });
      if (!attemptInput) return;

      void saveAttempt(attemptInput).then((savedAttempt) => {
        // A late save must not attach reflection controls to a newer attempt.
        if (attemptVersionRef.current !== attemptVersion) return;
        if (savedAttempt) setCompletedPracticeAttemptId(savedAttempt.id);
        else if (ownerId)
          setAttemptSaveError('This attempt could not be saved.');
      });
    },
    [displayed, ownerId, saveAttempt],
  );
  const practiceSession = usePracticeSession({
    passage: practicePassage,
    onCompletedAttempt: handleCompletedPracticeAttempt,
  });
  const { resetPractice } = practiceSession;
  const resetPracticeSession = useCallback(() => {
    attemptVersionRef.current += 1;
    resetPractice();
    setCompletedPracticeAttemptId(null);
    setAttemptSaveError(null);
  }, [resetPractice]);

  const restartPractice = useCallback(() => {
    if (isPassageUnavailable) return;
    // Library navigation also resets the session, so request focus separately.
    resetPracticeSession();
    setFocusRequestId((id) => id + 1);
  }, [isPassageUnavailable, resetPracticeSession]);

  useEffect(() => {
    if (pendingNextFocusKeyRef.current !== requestKey) {
      pendingNextFocusKeyRef.current = null;
    }
    if (requestIsLoading || transition.requestKey !== requestKey) {
      dispatchTransition({ type: 'requested', key: requestKey });
    }
  }, [requestIsLoading, requestKey, transition.requestKey]);

  useEffect(() => {
    if (requestIsLoading) return;
    if (requestError) {
      dispatchTransition({
        type: 'failed',
        key: requestKey,
        error: requestError,
      });
    } else if (readySnapshot) {
      // Reset the attempt and replace the full displayed selection in one batch.
      if (displayed?.key !== readySnapshot.key) {
        resetPracticeSession();
        if (
          !initialFocusRequestedRef.current ||
          pendingNextFocusKeyRef.current === readySnapshot.key
        ) {
          setFocusRequestId((id) => id + 1);
        }
        initialFocusRequestedRef.current = true;
      }
      pendingNextFocusKeyRef.current = null;
      dispatchTransition({
        type: 'loaded',
        key: requestKey,
        snapshot: readySnapshot,
      });
    }
  }, [
    displayed?.key,
    readySnapshot,
    requestError,
    requestIsLoading,
    requestKey,
    resetPracticeSession,
  ]);

  const saveInput = useMemo(() => {
    if (displayed?.source !== 'featured') return null;

    return createFeaturedPassageSaveInput(
      displayed.response,
      savedPassageCategories,
    );
  }, [displayed, savedPassageCategories]);
  const { isCurrentPassageSaved, saveCurrentPassage } = useSavePassageForm({
    isPassageSaved: savedLibrary.isPassageSaved,
    saveInput,
    savePassage: savedLibrary.savePassage,
  });

  const savePracticeReflection = useCallback(
    async (reflection: string) => {
      if (isPassageUnavailable || !completedPracticeAttemptId) return false;

      const updatedAttempt = await updateReflection(
        completedPracticeAttemptId,
        reflection,
      );
      return Boolean(updatedAttempt);
    },
    [completedPracticeAttemptId, isPassageUnavailable, updateReflection],
  );

  const openLibrary = useCallback(() => {
    resetPracticeSession();
    void navigate(APP_ROUTE_PATHS.library);
  }, [navigate, resetPracticeSession]);

  const nextFeaturedPassage = useCallback(() => {
    if (isPassageUnavailable) return;
    const passage = getRandomFeaturedPassage(
      featuredCatalog.passages,
      selectedFeaturedPassage.selectedPassageId,
    );
    if (!passage) return;
    const nextKey = JSON.stringify([ownerId, 'featured', passage.id]);
    if (nextKey === displayed?.key) {
      restartPractice();
      return;
    }
    pendingNextFocusKeyRef.current = nextKey;
    selectPracticeRoute({
      passageId: passage.id,
      source: 'featured',
    });
  }, [
    featuredCatalog.passages,
    isPassageUnavailable,
    displayed?.key,
    ownerId,
    restartPractice,
    selectedFeaturedPassage.selectedPassageId,
    selectPracticeRoute,
  ]);

  const selectFeaturedPractice = useCallback(() => {
    if (isPassageUnavailable) return;
    selectPracticeRoute({
      passageId: selectedFeaturedPassage.selectedPassageId || null,
      source: 'featured',
    });
  }, [
    isPassageUnavailable,
    selectedFeaturedPassage.selectedPassageId,
    selectPracticeRoute,
  ]);

  const selectSavedPractice = useCallback(
    (passageId: string) => {
      if (isPassageUnavailable) return;
      selectPracticeRoute({
        passageId,
        source: 'saved',
      });
    },
    [isPassageUnavailable, selectPracticeRoute],
  );

  const retryPassage = () => {
    if (practiceSource === 'featured') selectedFeaturedPassage.reloadPassage();
    else savedLibrary.reloadPassage();
  };

  if (!displayed && passageLoadError) {
    return <AppErrorState message={passageLoadError} />;
  }

  if (!displayed && (requestIsLoading || readySnapshot || requestedPassageId)) {
    return <AppLoadingState />;
  }

  if (!displayed || !practicePassage) {
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
        headerReference={displayed.headerReference}
        headerSubtitle={displayed.headerSubtitle}
        headerTitle={displayed.headerTitle}
      />
      <PracticePage
        focusRequestId={focusRequestId}
        accuracy={practiceSession.accuracy}
        attemptSaveError={attemptSaveError}
        canSaveCurrentPassage={!isPassageUnavailable && Boolean(saveInput)}
        canSaveReflection={
          !isPassageUnavailable &&
          authSession.isSignedIn &&
          Boolean(completedPracticeAttemptId)
        }
        isCurrentPassageSaved={isCurrentPassageSaved}
        isPassageComplete={practiceSession.isPassageComplete}
        isSavingReflection={isSavingReflection}
        isSignedIn={authSession.isSignedIn}
        isPassageLoading={isPassageUnavailable && !passageLoadError}
        passageLoadError={passageLoadError}
        onRetryPassage={retryPassage}
        passage={practicePassage}
        practiceSource={displayed.source}
        practiceTitle={displayed.headerTitle}
        progress={practiceSession.progress}
        reflectionError={reflectionError}
        savedPassageOptions={savedLibrary.savedPassages.map(
          ({ category, id, title }) => ({
            category,
            id,
            title,
          }),
        )}
        selectedSavedPassageId={
          displayed.source === 'saved'
            ? displayed.passageId
            : savedLibrary.selectedSavedPassageId
        }
        status={practiceSession.status}
        translationName={displayed.translationName}
        typedText={practiceSession.typedText}
        wpm={practiceSession.wpm}
        onNextFeaturedPassage={nextFeaturedPassage}
        onOpenLibrary={openLibrary}
        onResetPractice={restartPractice}
        onSaveCurrentPassage={() => {
          if (!isPassageUnavailable) void saveCurrentPassage();
        }}
        onSaveReflection={savePracticeReflection}
        onSelectFeaturedPractice={selectFeaturedPractice}
        onSelectSavedPassage={selectSavedPractice}
        onTypingChange={(text) => {
          if (!isPassageUnavailable) practiceSession.handleTyping(text);
        }}
      />
    </div>
  );
}
