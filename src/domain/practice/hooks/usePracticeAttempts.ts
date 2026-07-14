import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../../../shared/utils/errors";
import type { PracticeAttempt, SavePracticeAttemptInput } from "../../../shared/types/practice";
import { createSupabasePracticeAttemptStore } from "../stores/supabasePracticeAttemptStore";

/**
 * Manages cloud practice history for signed-in users.
 * Guest attempts are not persisted yet.
 */
export function usePracticeAttempts(userId?: string | null) {
  const practiceAttemptStore = useMemo(() => {
    return userId ? createSupabasePracticeAttemptStore(userId) : null;
  }, [userId]);
  const [recentAttempts, setRecentAttempts] = useState<PracticeAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingReflection, setIsSavingReflection] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!practiceAttemptStore) {
      setRecentAttempts([]);
      setError(null);
      return;
    }

    const activePracticeAttemptStore = practiceAttemptStore;
    let isCurrent = true;
    setIsLoading(true);

    async function loadRecentAttempts() {
      try {
        const attempts = await activePracticeAttemptStore.listRecent();
        if (!isCurrent) return;

        setRecentAttempts(attempts);
        setError(null);
      } catch (caughtError) {
        if (isCurrent) setError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadRecentAttempts();

    return () => {
      isCurrent = false;
    };
  }, [practiceAttemptStore]);

  const saveAttempt = useCallback(async (input: SavePracticeAttemptInput) => {
    if (!practiceAttemptStore) return null;

    setIsSaving(true);

    try {
      const attempt = await practiceAttemptStore.save(input);
      setRecentAttempts((currentAttempts) => [attempt, ...currentAttempts].slice(0, 20));
      setError(null);
      return attempt;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [practiceAttemptStore]);

  const updateReflection = useCallback(async (attemptId: string, reflection: string) => {
    if (!practiceAttemptStore) return null;

    setIsSavingReflection(true);

    try {
      const updatedAttempt = await practiceAttemptStore.updateReflection(attemptId, reflection);
      if (!updatedAttempt) return null;

      setRecentAttempts((currentAttempts) =>
        currentAttempts.map((attempt) => (attempt.id === attemptId ? updatedAttempt : attempt)),
      );
      setError(null);
      return updatedAttempt;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      return null;
    } finally {
      setIsSavingReflection(false);
    }
  }, [practiceAttemptStore]);

  return {
    error,
    isLoading,
    isSaving,
    isSavingReflection,
    recentAttempts,
    saveAttempt,
    updateReflection,
  };
}
