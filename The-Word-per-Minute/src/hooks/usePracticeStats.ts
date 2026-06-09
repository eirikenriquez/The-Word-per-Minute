import { useCallback, useState } from "react";
import type { PracticeStats } from "../types/practice";

const statsStorageKey = "the-word-per-minute-stats";

export const emptyStats: PracticeStats = {
  bestWpm: 0,
  bestAccuracy: 0,
  completedAttempts: 0,
};

function loadStats() {
  const savedStats = localStorage.getItem(statsStorageKey);
  if (!savedStats) return emptyStats;

  try {
    return { ...emptyStats, ...JSON.parse(savedStats) } as PracticeStats;
  } catch {
    return emptyStats;
  }
}

function saveStats(stats: PracticeStats) {
  localStorage.setItem(statsStorageKey, JSON.stringify(stats));
}

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
