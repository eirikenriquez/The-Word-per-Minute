import { useState } from "react";
import { PracticeControls } from "./components/PracticeControls";
import { PracticePassageDisplay } from "./components/PracticePassageDisplay";
import { TypingPracticePanel } from "./components/TypingPracticePanel";
import type { PracticeSource } from "../../shared/types/app";
import type { PracticePassage, PracticeStatus } from "../../shared/types/practice";
import type { SavedPassage } from "../../shared/types/savedPassage";

export type PracticePageProps = {
  accuracy: number;
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
  savedPassages: SavedPassage[];
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
  savedPassages,
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
  const [isSetupOpen, setIsSetupOpen] = useState(true);

  return (
    <div className="grid gap-8">
      <PracticeControls
        canSaveCurrentPassage={canSaveCurrentPassage}
        hasSavedPassages={savedPassages.length > 0}
        isCurrentPassageSaved={isCurrentPassageSaved}
        isSetupOpen={isSetupOpen}
        practiceSource={practiceSource}
        savedPassages={savedPassages}
        selectedSavedPassageId={selectedSavedPassageId}
        onNextFeaturedPassage={onNextFeaturedPassage}
        onOpenLibrary={onOpenLibrary}
        onReset={onResetPractice}
        onSaveCurrentPassage={onSaveCurrentPassage}
        onSelectFeaturedPractice={onSelectFeaturedPractice}
        onSelectSavedPractice={onSelectSavedPassage}
        onToggleSetup={() => setIsSetupOpen((currentValue) => !currentValue)}
      />

      <section className="mx-auto grid w-full max-w-5xl gap-8">
        <PracticePassageDisplay
          accuracy={accuracy}
          canSaveReflection={canSaveReflection}
          completionActionLabel={isPassageComplete && practiceSource === "featured" ? "Next Passage" : undefined}
          completionMessage={
            `You finished ${practiceTitle}.`
          }
          isComplete={isPassageComplete}
          isSavingReflection={isSavingReflection}
          isSignedIn={isSignedIn}
          onCompletionAction={isPassageComplete && practiceSource === "featured" ? onNextFeaturedPassage : undefined}
          onSaveReflection={onSaveReflection}
          onTypingChange={onTypingChange}
          passage={passage}
          reflectionError={reflectionError}
          translationName={translationName}
          typedText={typedText}
          wpm={wpm}
        />

        <div className="grid gap-6">
          <TypingPracticePanel
            accuracy={accuracy}
            isComplete={isPassageComplete}
            progress={Math.min(progress, 100)}
            status={status}
            wpm={wpm}
          />
        </div>
      </section>
    </div>
  );
}
