import type { usePracticeSession } from '../../features/practice/hooks/usePracticeSession';
import type { useSavedPassages } from '../../features/saved-passages/hooks/useSavedPassages';
import type { PracticePageProps } from '../../pages/practice/PracticePage';
import type {
  PracticePassage,
  PracticeSource,
} from '@/features/practice/types/practice';
import type { createAppActions } from './createAppActions';

type AppActions = ReturnType<typeof createAppActions>;

export function createPracticePageProps({
  appActions,
  attemptSaveError,
  canSaveReflection,
  canSaveCurrentPassage,
  isCurrentPassageSaved,
  isSavingReflection,
  isSignedIn,
  passage,
  practiceSession,
  practiceSource,
  practiceTitle,
  reflectionError,
  savedLibrary,
  translationName,
  onSaveCurrentPassage,
  onSaveReflection,
}: {
  appActions: AppActions;
  attemptSaveError: string | null;
  canSaveReflection: boolean;
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  isSavingReflection: boolean;
  isSignedIn: boolean;
  passage: PracticePassage | undefined;
  practiceSession: ReturnType<typeof usePracticeSession>;
  practiceSource: PracticeSource;
  practiceTitle: string;
  reflectionError: string | null;
  savedLibrary: ReturnType<typeof useSavedPassages>;
  translationName: string;
  onSaveCurrentPassage: () => void;
  onSaveReflection: (reflection: string) => Promise<boolean>;
}): PracticePageProps | null {
  if (!passage) return null;

  return {
    accuracy: practiceSession.accuracy,
    attemptSaveError,
    canSaveReflection,
    canSaveCurrentPassage,
    isCurrentPassageSaved,
    isPassageComplete: practiceSession.isPassageComplete,
    isSavingReflection,
    isSignedIn,
    passage,
    practiceSource,
    practiceTitle,
    progress: practiceSession.progress,
    reflectionError,
    savedPassageOptions: savedLibrary.savedPassages.map(
      ({ category, id, title }) => ({
        category,
        id,
        title,
      }),
    ),
    selectedSavedPassageId: savedLibrary.selectedSavedPassageId,
    status: practiceSession.status,
    translationName,
    typedText: practiceSession.typedText,
    wpm: practiceSession.wpm,
    onNextFeaturedPassage: appActions.nextFeaturedPassage,
    onOpenLibrary: appActions.openLibrary,
    onResetPractice: practiceSession.resetPractice,
    onSaveCurrentPassage,
    onSaveReflection,
    onSelectFeaturedPractice: appActions.selectFeaturedPractice,
    onSelectSavedPassage: appActions.selectSavedPractice,
    onTypingChange: practiceSession.handleTyping,
  };
}
