import { PersonalBests } from "./components/PersonalBests";
import { PracticeControls } from "./components/PracticeControls";
import { PracticePassageDisplay } from "./components/PracticePassageDisplay";
import { TypingPracticePanel } from "./components/TypingPracticePanel";
import type { PracticeSource } from "../../shared/types/app";
import type { PracticePassage, PracticeStats, PracticeStatus } from "../../shared/types/practice";
import type { SavedPassage } from "../../shared/types/savedPassage";

export type PracticePageProps = {
  accuracy: number;
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  isPassageComplete: boolean;
  passage: PracticePassage;
  practiceSource: PracticeSource;
  practiceTitle: string;
  progress: number;
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  stats: PracticeStats;
  status: PracticeStatus;
  translationName: string;
  typedText: string;
  wpm: number;
  onNextFeaturedPassage: () => void;
  onOpenLibrary: () => void;
  onResetPractice: () => void;
  onResetStats: () => void;
  onSaveCurrentPassage: () => void;
  onSelectFeaturedPractice: () => void;
  onSelectSavedPassage: (passageId: string) => void;
  onTypingChange: (typedText: string) => void;
};

/**
 * Central typing page: source controls, active passage display, typing input, and stats.
 */
export function PracticePage({
  accuracy,
  canSaveCurrentPassage,
  isCurrentPassageSaved,
  isPassageComplete,
  passage,
  practiceSource,
  practiceTitle,
  progress,
  savedPassages,
  selectedSavedPassageId,
  stats,
  status,
  translationName,
  typedText,
  wpm,
  onNextFeaturedPassage,
  onOpenLibrary,
  onResetPractice,
  onResetStats,
  onSaveCurrentPassage,
  onSelectFeaturedPractice,
  onSelectSavedPassage,
  onTypingChange,
}: PracticePageProps) {
  return (
    <div className="grid gap-8">
      <PracticeControls
        canSaveCurrentPassage={canSaveCurrentPassage}
        hasSavedPassages={savedPassages.length > 0}
        isCurrentPassageSaved={isCurrentPassageSaved}
        practiceSource={practiceSource}
        savedPassages={savedPassages}
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
          passage={passage}
          translationName={translationName}
          typedText={typedText}
        />

        <div className="grid gap-6">
          <TypingPracticePanel
            accuracy={accuracy}
            completionActionLabel={isPassageComplete && practiceSource === "featured" ? "Next Passage" : undefined}
            completionMessage={
              `Complete. You finished ${practiceTitle} at ${wpm} WPM with ${accuracy}% accuracy.`
            }
            isComplete={isPassageComplete}
            onCompletionAction={isPassageComplete && practiceSource === "featured" ? onNextFeaturedPassage : undefined}
            progress={Math.min(progress, 100)}
            status={status}
            typedText={typedText}
            wpm={wpm}
            onTypingChange={onTypingChange}
          />
        </div>
      </section>

      <PersonalBests stats={stats} onResetStats={onResetStats} />
    </div>
  );
}
