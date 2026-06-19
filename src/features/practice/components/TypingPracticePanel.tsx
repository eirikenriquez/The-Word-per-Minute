import type { TypingMetrics } from "../../../types/practice";
import { Button } from "../../../ui/Button";

type TypingPracticePanelProps = {
  accuracy: number;
  completionActionLabel?: string;
  completionMessage: string;
  isComplete: boolean;
  onCompletionAction?: () => void;
  onTypingChange: (typedText: string) => void;
  progress: number;
  status: TypingMetrics["status"];
  typedText: string;
  wpm: number;
};

/**
 * Typing input plus a quiet live-results summary.
 * This component is presentational; the parent owns timing, scoring, and selected text.
 */
export function TypingPracticePanel({
  accuracy,
  completionActionLabel,
  completionMessage,
  isComplete,
  onCompletionAction,
  onTypingChange,
  progress,
  status,
  typedText,
  wpm,
}: TypingPracticePanelProps) {
  return (
    <section className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-base font-semibold text-slate-950 dark:text-slate-100">Type the passage</span>
        <textarea
          className="min-h-40 resize-y rounded-md border border-slate-300 bg-white p-4 leading-7 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-950"
          placeholder="Start typing here..."
          value={typedText}
          onChange={(event) => onTypingChange(event.target.value)}
        />
      </label>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-base text-slate-600 dark:text-slate-300">
        <p>
          <strong className="font-semibold text-slate-950 dark:text-slate-100">{wpm}</strong> WPM
        </p>
        <p>
          <strong className="font-semibold text-slate-950 dark:text-slate-100">{accuracy}%</strong>{" "}
          accuracy
        </p>
        <p>
          <strong className="font-semibold text-slate-950 dark:text-slate-100">{progress}%</strong>{" "}
          complete
        </p>
        <p className="font-medium text-slate-500 sm:ml-auto dark:text-slate-400">{status}</p>
      </div>

      {isComplete && (
        <div className="flex flex-col gap-3 border-l-4 border-slate-300 bg-slate-50 p-4 text-sm font-medium text-slate-700 sm:flex-row sm:items-center sm:justify-between dark:border-blue-900 dark:bg-slate-900 dark:text-slate-300">
          <p>{completionMessage}</p>
          {completionActionLabel && onCompletionAction && (
            <Button
              className="w-fit"
              variant="primary"
              onClick={onCompletionAction}
            >
              {completionActionLabel}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
