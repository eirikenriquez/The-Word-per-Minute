import type {
  PracticeAttempt,
  PracticeAttemptPage,
  PracticeAttemptSummary,
  SavePracticeAttemptInput,
} from "../../../shared/types/practice";

export type PracticeAttemptStore = {
  getSummary: () => Promise<PracticeAttemptSummary>;
  listPage: (offset?: number, limit?: number) => Promise<PracticeAttemptPage>;
  save: (input: SavePracticeAttemptInput) => Promise<PracticeAttempt>;
  updateReflection: (attemptId: string, reflection: string) => Promise<PracticeAttempt | null>;
};
