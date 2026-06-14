import type { TypingMetrics } from "../../../types/practice";

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
 * Typing input plus live result cards.
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
    <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">Type the passage</span>
        <textarea
          className="min-h-36 resize-y rounded-md border border-slate-300 bg-stone-50 p-3 leading-7 outline-none transition focus:border-slate-500 focus:bg-white focus:ring-2 focus:ring-slate-200"
          placeholder="Start typing here..."
          value={typedText}
          onChange={(event) => onTypingChange(event.target.value)}
        />
      </label>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="WPM" value={wpm} />
        <MetricCard label="Accuracy" value={`${accuracy}%`} />
        <MetricCard label="Progress" value={`${progress}%`} />
        <MetricCard label="Status" value={status} valueClassName="text-lg" />
      </div>

      {isComplete && (
        <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <p>{completionMessage}</p>
          {completionActionLabel && onCompletionAction && (
            <button
              className="w-fit rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              type="button"
              onClick={onCompletionAction}
            >
              {completionActionLabel}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

type MetricCardProps = {
  label: string;
  value: number | string;
  valueClassName?: string;
};

/**
 * Small reusable stat tile for the live typing metrics.
 */
function MetricCard({ label, value, valueClassName = "text-2xl" }: MetricCardProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className={`${valueClassName} font-bold text-slate-950`}>{value}</p>
    </div>
  );
}
