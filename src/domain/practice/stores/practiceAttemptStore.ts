import type {
  PracticeAttempt,
  PracticeAttemptSummary,
  SavePracticeAttemptInput,
} from "../../../shared/types/practice";

export type PracticeAttemptStore = {
  getSummary: () => Promise<PracticeAttemptSummary>;
  listRecent: (limit?: number) => Promise<PracticeAttempt[]>;
  save: (input: SavePracticeAttemptInput) => Promise<PracticeAttempt>;
  updateReflection: (attemptId: string, reflection: string) => Promise<PracticeAttempt | null>;
};
