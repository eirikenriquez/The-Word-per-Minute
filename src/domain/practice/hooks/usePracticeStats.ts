import { useCallback, useState } from "react";
import type { PracticeStats } from "../../../shared/types/practice";

const STATS_STORAGE_KEY = "the-word-per-minute-stats";

export const emptyStats: PracticeStats = {
  bestWpm: 0,
  bestAccuracy: 0,
  completedAttempts: 0,
};

function loadStats() {
  const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
  if (!savedStats) return emptyStats;

  try {
    return { ...emptyStats, ...JSON.parse(savedStats) } as PracticeStats;
  } catch {
    return emptyStats;
  }
}

function saveStats(stats: PracticeStats) {
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
}

/**
 * Stores simple personal bests locally for the current browser.
 * This is intentionally small until user accounts or cloud sync become real features.
 */
export function usePracticeStats() {
  const [stats, setStats] = useState(loadStats);

  const recordCompletedAttempt = useCallback((wpm: number, accuracy: number) => {
    setStats((currentStats) => {
      const nextStats = {
        bestWpm: Math.max(currentStats.bestWpm, wpm),
        bestAccuracy: Math.max(currentStats.bestAccuracy, accuracy),
        completedAttempts: currentStats.completedAttempts + 1,
      };

      saveStats(nextStats);
      return nextStats;
    });
  }, []);

  const resetStats = useCallback(() => {
    saveStats(emptyStats);
    setStats(emptyStats);
  }, []);

  return {
    stats,
    recordCompletedAttempt,
    resetStats,
  };
}
