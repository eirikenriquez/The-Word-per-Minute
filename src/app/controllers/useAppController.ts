import { useCallback, useMemo, useState } from 'react';
import type { AppHeaderProps } from '../components/AppHeader';
import type { AppRoutesProps } from '../components/AppRoutes';
import { useAuth } from '../../features/auth/context/authContext';
import { useFeaturedPassages } from '../../features/featured-passages/hooks/useFeaturedPassages';
import { usePracticePassage } from '../../features/practice/hooks/usePracticePassage';
import { usePracticeAttempts } from '../../features/practice/hooks/usePracticeAttempts';
import { usePracticeSession } from '../../features/practice/hooks/usePracticeSession';
import { useSavePassageForm } from '../../features/saved-passages/hooks/useSavePassageForm';
import { useSavedPassages } from '../../features/saved-passages/hooks/useSavedPassages';
import { createFeaturedPassageSaveInput } from '../../features/saved-passages/utils/passageSaveInput';
import type { PracticeCompletionResult } from '@/features/practice/types/practice';
import { useAppDisplayState } from '../hooks/useAppDisplayState';
import { useAppModeEffects } from '../hooks/useAppModeEffects';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { usePassageCategories } from '../hooks/usePassageCategories';
import { usePracticeRouteSelection } from '../hooks/usePracticeRouteSelection';
import { createAppActions } from './createAppActions';
import { createPracticePageProps } from './createPageProps';

/**
 * App-level controller for cross-feature state.
 * Page-specific prop wiring is delegated to page controllers below this layer.
 */
export function useAppController() {
  const { appMode, selectAppMode } = useAppNavigation();
  const [completedPracticeAttemptId, setCompletedPracticeAttemptId] = useState<
    string | null
  >(null);
  const authSession = useAuth();

  const featuredLibrary = useFeaturedPassages();
  const savedLibrary = useSavedPassages(authSession.user?.id);
  const practiceAttempts = usePracticeAttempts(authSession.user?.id);
  const {
    saveAttempt: savePracticeAttempt,
    updateReflection: updatePracticeReflection,
  } = practiceAttempts;
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
    enabled: appMode === 'practice',
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

      void savePracticeAttempt({
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
      savePracticeAttempt,
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

  const savePracticeReflection = useCallback(
    async (reflection: string) => {
      if (!completedPracticeAttemptId) return false;

      const updatedAttempt = await updatePracticeReflection(
        completedPracticeAttemptId,
        reflection,
      );
      return Boolean(updatedAttempt);
    },
    [completedPracticeAttemptId, updatePracticeReflection],
  );

  const {
    error,
    headerReference,
    headerSubtitle,
    headerTitle,
    isLoading,
    translationName,
  } = useAppDisplayState({
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
  const saveInput = useMemo(() => {
    if (appMode === 'practice' && practiceSource === 'featured') {
      return createFeaturedPassageSaveInput(
        featuredLibrary.passageResponse,
        savedPassageCategories,
      );
    }

    return null;
  }, [
    appMode,
    featuredLibrary.passageResponse,
    practiceSource,
    savedPassageCategories,
  ]);
  const { isCurrentPassageSaved, saveCurrentPassage } = useSavePassageForm({
    isPassageSaved: savedLibrary.isPassageSaved,
    saveInput,
    savePassage: savedLibrary.savePassage,
  });

  useAppModeEffects({
    featuredSelectedPassageId: featuredLibrary.selectedPassageId,
    practiceSource,
    resetPractice: resetPracticeSession,
    savedSelectedPassageId: savedLibrary.selectedSavedPassageId,
  });
  const appActions = createAppActions({
    featuredPassages: featuredLibrary.passages,
    featuredSelectedPassageId: featuredLibrary.selectedPassageId,
    resetPractice: resetPracticeSession,
    selectPracticeRoute,
    setAppMode: selectAppMode,
  });

  const errorMessage =
    error ??
    (appMode === 'practice' && !practicePassage
      ? practiceSource === 'saved'
        ? 'Save a passage first.'
        : 'No practice passage found.'
      : null);

  const headerProps: AppHeaderProps = {
    headerReference,
    headerSubtitle,
    headerTitle,
  };

  const pageRoutesProps: AppRoutesProps = {
    practicePageProps: createPracticePageProps({
      appActions,
      attemptSaveError: practiceAttempts.attemptSaveError,
      canSaveCurrentPassage: Boolean(saveInput),
      isCurrentPassageSaved,
      isSavingReflection: practiceAttempts.isSavingReflection,
      passage: practicePassage,
      practiceSession,
      practiceSource,
      practiceTitle: headerTitle,
      reflectionError: practiceAttempts.reflectionError,
      savedLibrary,
      canSaveReflection:
        authSession.isSignedIn && Boolean(completedPracticeAttemptId),
      isSignedIn: authSession.isSignedIn,
      translationName,
      onSaveCurrentPassage: saveCurrentPassage,
      onSaveReflection: savePracticeReflection,
    }),
  };

  return {
    appMode,
    errorMessage,
    headerProps,
    isLoading,
    pageRoutesProps,
  };
}
