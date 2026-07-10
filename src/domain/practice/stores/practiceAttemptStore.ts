import type { PracticeAttempt, SavePracticeAttemptInput } from "../../../shared/types/practice";

export type PracticeAttemptStore = {
  listRecent: (limit?: number) => Promise<PracticeAttempt[]>;
  save: (input: SavePracticeAttemptInput) => Promise<PracticeAttempt>;
  updateReflection: (attemptId: string, reflection: string) => Promise<PracticeAttempt | null>;
};
