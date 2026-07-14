import type { BibleVerse } from "./verse";

export type PracticeStatus = "Ready" | "Typing" | "Complete";

export type PracticeCompletionResult = {
  accuracy: number;
  durationSeconds: number;
  mistakeCount: number;
  typedCharacterCount: number;
  wpm: number;
};

export type PracticePassage = {
  startVerse: number;
  endVerse: number;
  ref: string;
  text: string;
  verses: BibleVerse[];
};

export type PracticeAttempt = {
  id: string;
  featuredPassageId?: string;
  savedPassageId?: string;
  passageReference: string;
  translationId: string;
  bookId: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  selectedVerses?: number[];
  durationSeconds: number;
  mistakeCount: number;
  typedCharacterCount: number;
  wpm: number;
  accuracy: number;
  reflection?: string;
  completedAt: string;
};

export type SavePracticeAttemptInput = Omit<PracticeAttempt, "completedAt" | "id"> & {
  featuredPassageId?: string | null;
  savedPassageId?: string | null;
};
