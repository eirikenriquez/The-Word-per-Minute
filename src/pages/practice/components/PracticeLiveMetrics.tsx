import type { PracticeStatus } from "../../../shared/types/practice";

type PracticeLiveMetricsProps = {
  accuracy: number;
  isComplete: boolean;
  progress: number;
  status: PracticeStatus;
  wpm: number;
};

/**
 * Shows the current session metrics while the user is actively typing.
 */
export function PracticeLiveMetrics({
  accuracy,
  isComplete,
  progress,
  status,
  wpm,
}: PracticeLiveMetricsProps) {
  if (isComplete) return null;

  return (
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
  );
}
