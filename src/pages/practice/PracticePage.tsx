import { PracticeControls } from '../../features/practice/components/PracticeControls';
import { PracticeLiveMetrics } from '../../features/practice/components/PracticeLiveMetrics';
import { PracticePassageDisplay } from '../../features/practice/components/PracticePassageDisplay';
import type {
  PracticePassage,
  PracticePassageOption,
  PracticeSource,
  PracticeStatus,
} from '../../features/practice/types/practice';

export type PracticePageProps = {
  accuracy: number;
  attemptSaveError: string | null;
  canSaveReflection: boolean;
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  isPassageComplete: boolean;
  isSavingReflection: boolean;
  isSignedIn: boolean;
  passage: PracticePassage;
  practiceSource: PracticeSource;
  practiceTitle: string;
  progress: number;
  reflectionError: string | null;
  savedPassageOptions: PracticePassageOption[];
  selectedSavedPassageId: string;
  status: PracticeStatus;
  translationName: string;
  typedText: string;
  wpm: number;
  onNextFeaturedPassage: () => void;
  onOpenLibrary: () => void;
  onResetPractice: () => void;
  onSaveCurrentPassage: () => void;
  onSaveReflection: (reflection: string) => Promise<boolean>;
  onSelectFeaturedPractice: () => void;
  onSelectSavedPassage: (passageId: string) => void;
  onTypingChange: (typedText: string) => void;
};

/**
 * Central typing page: source controls, active passage display, typing input, and stats.
 */
export function PracticePage({
  accuracy,
  attemptSaveError,
  canSaveReflection,
  canSaveCurrentPassage,
  isCurrentPassageSaved,
  isPassageComplete,
  isSavingReflection,
  isSignedIn,
  passage,
  practiceSource,
  practiceTitle,
  progress,
  reflectionError,
  savedPassageOptions,
  selectedSavedPassageId,
  status,
  translationName,
  typedText,
  wpm,
  onNextFeaturedPassage,
  onOpenLibrary,
  onResetPractice,
  onSaveCurrentPassage,
  onSaveReflection,
  onSelectFeaturedPractice,
  onSelectSavedPassage,
  onTypingChange,
}: PracticePageProps) {
  return (
    <div className="grid gap-8">
      <PracticeControls
        canSaveCurrentPassage={canSaveCurrentPassage}
        isCurrentPassageSaved={isCurrentPassageSaved}
        practiceSource={practiceSource}
        savedPassageOptions={savedPassageOptions}
        selectedSavedPassageId={selectedSavedPassageId}
        onNextFeaturedPassage={onNextFeaturedPassage}
        onOpenLibrary={onOpenLibrary}
        onReset={onResetPractice}
        onSaveCurrentPassage={onSaveCurrentPassage}
        onSelectFeaturedPractice={onSelectFeaturedPractice}
        onSelectSavedPractice={onSelectSavedPassage}
      />

      <section className="mx-auto grid w-full max-w-5xl gap-8">
        <PracticePassageDisplay
          accuracy={accuracy}
          attemptSaveError={attemptSaveError}
          canSaveReflection={canSaveReflection}
          completionActionLabel={
            isPassageComplete && practiceSource === 'featured'
              ? 'Next Passage'
              : undefined
          }
          completionMessage={`You finished ${practiceTitle}.`}
          isComplete={isPassageComplete}
          isSavingReflection={isSavingReflection}
          isSignedIn={isSignedIn}
          onCompletionAction={
            isPassageComplete && practiceSource === 'featured'
              ? onNextFeaturedPassage
              : undefined
          }
          onSaveReflection={onSaveReflection}
          onTypingChange={onTypingChange}
          passage={passage}
          reflectionError={reflectionError}
          translationName={translationName}
          typedText={typedText}
          wpm={wpm}
        />

        <PracticeLiveMetrics
          accuracy={accuracy}
          isComplete={isPassageComplete}
          progress={Math.min(progress, 100)}
          status={status}
          wpm={wpm}
        />
      </section>
    </div>
  );
}
