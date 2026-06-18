import type { BibleVerse } from "./verse";

export type PracticeStats = {
  bestWpm: number;
  bestAccuracy: number;
  completedAttempts: number;
};

export type TypingMetrics = {
  correctCharacters: number;
  progress: number;
  accuracy: number;
  wpm: number;
  isComplete: boolean;
  status: "Ready" | "Typing" | "Complete";
};

export type PracticeBatch = {
  startVerse: number;
  endVerse: number;
  ref: string;
  text: string;
  verses: BibleVerse[];
};
