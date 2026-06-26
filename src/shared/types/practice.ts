import type { BibleVerse } from "./verse";

export type PracticeStats = {
  bestWpm: number;
  bestAccuracy: number;
  completedAttempts: number;
};

export type PracticeStatus = "Ready" | "Typing" | "Complete";

export type PracticePassage = {
  startVerse: number;
  endVerse: number;
  ref: string;
  text: string;
  verses: BibleVerse[];
};
