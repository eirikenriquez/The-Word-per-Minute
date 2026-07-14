import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getErrorMessage } from "../../../shared/utils/errors";
import type {
  PracticeAttempt,
  PracticeAttemptSummary,
  SavePracticeAttemptInput,
} from "../../../shared/types/practice";
import { createSupabasePracticeAttemptStore } from "../stores/supabasePracticeAttemptStore";

const EMPTY_PRACTICE_SUMMARY: PracticeAttemptSummary = {
  averageAccuracy: 0,
  bestWpm: 0,
  completedAttempts: 0,
  reflectionCount: 0,
};

/**
 * Manages cloud practice history for signed-in users.
 * Guest attempts are not persisted yet.
 */
export function usePracticeAttempts(userId?: string | null) {
  const practiceAttemptStore = useMemo(() => {
    return userId ? createSupabasePracticeAttemptStore(userId) : null;
  }, [userId]);
  const [recentAttempts, setRecentAttempts] = useState<PracticeAttempt[]>([]);
  const [summary, setSummary] = useState<PracticeAttemptSummary>(EMPTY_PRACTICE_SUMMARY);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingReflection, setIsSavingReflection] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const summaryRequestIdRef = useRef(0);

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

  const refreshSummary = useCallback(async () => {
    const requestId = ++summaryRequestIdRef.current;

    if (!practiceAttemptStore) {
      setSummary(EMPTY_PRACTICE_SUMMARY);
      setSummaryError(null);
      setIsLoadingSummary(false);
      return;
    }

    setIsLoadingSummary(true);

    try {
      const nextSummary = await practiceAttemptStore.getSummary();
      if (requestId !== summaryRequestIdRef.current) return;

      setSummary(nextSummary);
      setSummaryError(null);
    } catch (caughtError) {
      if (requestId === summaryRequestIdRef.current) {
        setSummaryError(getErrorMessage(caughtError));
      }
    } finally {
      if (requestId === summaryRequestIdRef.current) {
        setIsLoadingSummary(false);
      }
    }
  }, [practiceAttemptStore]);

  useEffect(() => {
    void refreshSummary();

    return () => {
      summaryRequestIdRef.current += 1;
    };
  }, [refreshSummary]);

  const saveAttempt = useCallback(async (input: SavePracticeAttemptInput) => {
    if (!practiceAttemptStore) return null;

    setIsSaving(true);

    try {
      const attempt = await practiceAttemptStore.save(input);
      setRecentAttempts((currentAttempts) => [attempt, ...currentAttempts].slice(0, 20));
      setError(null);
      void refreshSummary();
      return attempt;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [practiceAttemptStore, refreshSummary]);

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
      void refreshSummary();
      return updatedAttempt;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      return null;
    } finally {
      setIsSavingReflection(false);
    }
  }, [practiceAttemptStore, refreshSummary]);

  return {
    error,
    isLoading,
    isLoadingSummary,
    isSaving,
    isSavingReflection,
    recentAttempts,
    saveAttempt,
    summary,
    summaryError,
    updateReflection,
  };
}
