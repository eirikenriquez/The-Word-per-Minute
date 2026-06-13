import { PersonalBests } from "../features/practice/components/PersonalBests";
import { PracticeBatchDisplay } from "../features/practice/components/PracticeBatchDisplay";
import { PracticeControls } from "../features/practice/components/PracticeControls";
import { TypingPracticePanel } from "../features/practice/components/TypingPracticePanel";
import type { PracticeSource } from "../types/appMode";
import type { PracticeStats, TypingMetrics } from "../types/practice";
import type { PracticeBatch } from "../types/practiceBatch";
import type { SavedPassage } from "../types/savedPassage";

export type PracticePageProps = {
  accuracy: number;
  currentBatch: PracticeBatch;
  currentBatchIndex: number;
  isBatchComplete: boolean;
  isPassageComplete: boolean;
  practiceSource: PracticeSource;
  practiceTitle: string;
  progress: number;
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  stats: PracticeStats;
  status: TypingMetrics["status"];
  totalBatches: number;
  translationName: string;
  typedText: string;
  wpm: number;
  onNextFeaturedPassage: () => void;
  onOpenLibrary: () => void;
  onResetPractice: () => void;
  onResetStats: () => void;
  onSelectFeaturedPractice: () => void;
  onSelectSavedPassage: (passageId: string) => void;
  onTypingChange: (typedText: string) => void;
};

/**
 * Central typing page: source controls, active passage display, typing input, and stats.
 */
export function PracticePage({
  accuracy,
  currentBatch,
  currentBatchIndex,
  isBatchComplete,
  isPassageComplete,
  practiceSource,
  practiceTitle,
  progress,
  savedPassages,
  selectedSavedPassageId,
  stats,
  status,
  totalBatches,
  translationName,
  typedText,
  wpm,
  onNextFeaturedPassage,
  onOpenLibrary,
  onResetPractice,
  onResetStats,
  onSelectFeaturedPractice,
  onSelectSavedPassage,
  onTypingChange,
}: PracticePageProps) {
  return (
    <>
      <PracticeControls
        hasSavedPassages={savedPassages.length > 0}
        practiceSource={practiceSource}
        savedPassages={savedPassages}
        selectedSavedPassageId={selectedSavedPassageId}
        onNextFeaturedPassage={onNextFeaturedPassage}
        onOpenLibrary={onOpenLibrary}
        onReset={onResetPractice}
        onSelectFeaturedPractice={onSelectFeaturedPractice}
        onSelectSavedPractice={onSelectSavedPassage}
      />

      <PracticeBatchDisplay
        batch={currentBatch}
        batchNumber={currentBatchIndex + 1}
        totalBatches={totalBatches}
        translationName={translationName}
        typedText={typedText}
      />

      <TypingPracticePanel
        accuracy={accuracy}
        completionActionLabel={isPassageComplete && practiceSource === "featured" ? "Next Passage" : undefined}
        completionMessage={
          isPassageComplete
            ? `Complete. You finished ${practiceTitle} at ${wpm} WPM with ${accuracy}% accuracy.`
            : "Batch complete. Moving to the next verses..."
        }
        isComplete={isBatchComplete}
        onCompletionAction={isPassageComplete && practiceSource === "featured" ? onNextFeaturedPassage : undefined}
        progress={Math.min(progress, 100)}
        status={status}
        typedText={typedText}
        wpm={wpm}
        onTypingChange={onTypingChange}
      />

      <PersonalBests stats={stats} onResetStats={onResetStats} />
    </>
  );
}
