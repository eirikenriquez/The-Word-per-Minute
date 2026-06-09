import type { TypingMetrics } from "../types/practice";

type TypingPracticePanelProps = {
  accuracy: number;
  isComplete: boolean;
  onTypingChange: (typedText: string) => void;
  progress: number;
  status: TypingMetrics["status"];
  typedText: string;
  wpm: number;
};

export function TypingPracticePanel({
  accuracy,
  isComplete,
  onTypingChange,
  progress,
  status,
  typedText,
  wpm,
}: TypingPracticePanelProps) {
  return (
    <section className="grid gap-4 rounded-lg border bg-white p-5 shadow-sm">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-600">Type the verse</span>
        <textarea
          className="min-h-32 resize-y rounded-md border border-slate-300 p-3 leading-7 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          Nice work. You finished this verse at {wpm} WPM with {accuracy}% accuracy.
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

function MetricCard({ label, value, valueClassName = "text-2xl" }: MetricCardProps) {
  return (
    <div className="rounded-md bg-slate-100 p-3">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className={`${valueClassName} font-bold`}>{value}</p>
    </div>
  );
}
