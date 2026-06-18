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
