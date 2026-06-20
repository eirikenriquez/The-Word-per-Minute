import type { PracticeStats } from "../../../types/practice";
import { Button } from "../../../ui/Button";

type PersonalBestsProps = {
  stats: PracticeStats;
  onResetStats: () => void;
};

/**
 * Displays the simple localStorage stats for this browser.
 */
export function PersonalBests({ stats, onResetStats }: PersonalBestsProps) {
  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Personal bests</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Saved in this browser.</p>
        </div>
        <Button
          className="w-fit"
          onClick={onResetStats}
        >
          Reset Stats
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
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
    <div className="rounded-md border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold dark:text-slate-100">{value}</p>
    </div>
  );
}
