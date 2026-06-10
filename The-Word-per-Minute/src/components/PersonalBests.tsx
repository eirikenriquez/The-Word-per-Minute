import type { PracticeStats } from "../types/practice";

type PersonalBestsProps = {
  stats: PracticeStats;
  onResetStats: () => void;
};

/**
 * Displays the simple localStorage stats for this browser.
 */
export function PersonalBests({ stats, onResetStats }: PersonalBestsProps) {
  return (
    <section className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold">Personal bests</h2>
          <p className="text-sm text-slate-500">Saved in this browser.</p>
        </div>
        <button
          className="w-fit rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          type="button"
          onClick={onResetStats}
        >
          Reset Stats
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <BestStat label="Best WPM" value={stats.bestWpm} />
        <BestStat label="Best Accuracy" value={`${stats.bestAccuracy}%`} />
        <BestStat label="Completed" value={stats.completedAttempts} />
      </div>
    </section>
  );
}

type BestStatProps = {
  label: string;
  value: number | string;
};

/**
 * Reusable tile for each saved personal-best value.
 */
function BestStat({ label, value }: BestStatProps) {
  return (
    <div className="rounded-md bg-slate-100 p-3">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
