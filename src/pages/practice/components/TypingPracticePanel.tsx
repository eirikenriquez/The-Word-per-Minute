import type { PracticeStatus } from "../../../shared/types/practice";

type TypingPracticePanelProps = {
  accuracy: number;
  isComplete: boolean;
  progress: number;
  status: PracticeStatus;
  wpm: number;
};

/**
 * Typing input plus a quiet live-results summary.
 * This component is presentational; the parent owns timing, scoring, and selected text.
 */
export function TypingPracticePanel({
  accuracy,
  isComplete,
  progress,
  status,
  wpm,
}: TypingPracticePanelProps) {
  return (
    <section className="grid gap-4">
      {!isComplete && (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-base text-ink-muted">
          <p>
            <strong className="font-semibold text-ink">{wpm}</strong> WPM
          </p>
          <p>
            <strong className="font-semibold text-ink">{accuracy}%</strong>{" "}
            accuracy
          </p>
          <p>
            <strong className="font-semibold text-ink">{progress}%</strong>{" "}
            complete
          </p>
          <p className="font-medium text-ink-subtle sm:ml-auto">{status}</p>
        </div>
      )}
    </section>
  );
}
