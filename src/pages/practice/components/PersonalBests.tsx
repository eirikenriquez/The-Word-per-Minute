import { ArrowPathIcon } from "@heroicons/react/24/outline";
import type { PracticeStats } from "../../../types/practice";
import { Button } from "../../../shared/ui/Button";

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
          <h2 className="text-lg font-semibold text-ink">Personal bests</h2>
          <p className="mt-1 text-sm text-ink-subtle">Saved in this browser.</p>
        </div>
        <Button
          className="w-fit"
          onClick={onResetStats}
        >
          <ArrowPathIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
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
    <div className="rounded-md border border-line bg-surface p-3">
      <p className="text-xs font-medium uppercase text-ink-subtle">{label}</p>
      <p className="text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}
