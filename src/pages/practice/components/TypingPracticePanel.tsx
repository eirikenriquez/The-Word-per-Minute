import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { PracticeStatus } from "../../../types/practice";
import { Button } from "../../../ui/Button";

type TypingPracticePanelProps = {
  accuracy: number;
  completionActionLabel?: string;
  completionMessage: string;
  isComplete: boolean;
  onCompletionAction?: () => void;
  onTypingChange: (typedText: string) => void;
  progress: number;
  status: PracticeStatus;
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
        <span className="text-base font-semibold text-ink">Type the passage</span>
        <textarea
          className="h-40 resize-none rounded-md border border-line-strong bg-surface p-4 text-ink leading-7 outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft"
          placeholder="Start typing here..."
          value={typedText}
          onChange={(event) => onTypingChange(event.target.value)}
        />
      </label>

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

      {isComplete && (
        <div className="flex flex-col gap-3 border-l-4 border-accent-line bg-accent-soft p-4 text-sm font-medium text-accent-ink sm:flex-row sm:items-center sm:justify-between">
          <p>{completionMessage}</p>
          {completionActionLabel && onCompletionAction && (
            <Button
              className="w-fit"
              variant="primary"
              onClick={onCompletionAction}
            >
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
              {completionActionLabel}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
