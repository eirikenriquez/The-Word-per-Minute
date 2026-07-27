import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getErrorMessage } from '../../../utils/errors';
import { createSupabasePracticeAttemptStore } from '../stores/supabasePracticeAttemptStore';
import type {
  PracticeAttempt,
  PracticeAttemptSummary,
} from '../types/practice';

const PRACTICE_ATTEMPT_PAGE_SIZE = 20;

const EMPTY_PRACTICE_SUMMARY: PracticeAttemptSummary = {
  averageAccuracy: 0,
  bestWpm: 0,
  completedAttempts: 0,
  reflectionCount: 0,
};

/**
 * Loads paginated practice history and aggregate progress for the Profile page.
 */
export function usePracticeAttemptHistory(userId?: string | null) {
  const practiceAttemptStore = useMemo(() => {
    return userId ? createSupabasePracticeAttemptStore(userId) : null;
  }, [userId]);
  const [recentAttempts, setRecentAttempts] = useState<PracticeAttempt[]>([]);
  const [summary, setSummary] = useState<PracticeAttemptSummary>(
    EMPTY_PRACTICE_SUMMARY,
  );
  const [hasMoreAttempts, setHasMoreAttempts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const summaryRequestIdRef = useRef(0);

  useEffect(() => {
    if (!practiceAttemptStore) {
      setRecentAttempts([]);
      setHasMoreAttempts(false);
      setHistoryError(null);
      setLoadMoreError(null);
      setIsLoading(false);
      setIsLoadingMore(false);
      return;
    }

    const activePracticeAttemptStore = practiceAttemptStore;
    let isCurrent = true;
    setRecentAttempts([]);
    setHasMoreAttempts(false);
    setHistoryError(null);
    setLoadMoreError(null);
    setIsLoading(true);

    async function loadRecentAttempts() {
      try {
        const page = await activePracticeAttemptStore.listPage(
          0,
          PRACTICE_ATTEMPT_PAGE_SIZE,
        );
        if (!isCurrent) return;

        setRecentAttempts(page.attempts);
        setHasMoreAttempts(page.hasMore);
      } catch (caughtError) {
        if (isCurrent) setHistoryError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadRecentAttempts();

    return () => {
      isCurrent = false;
    };
  }, [practiceAttemptStore]);

  const loadMoreAttempts = useCallback(async () => {
    if (!practiceAttemptStore || !hasMoreAttempts || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const page = await practiceAttemptStore.listPage(
        recentAttempts.length,
        PRACTICE_ATTEMPT_PAGE_SIZE,
      );

      setRecentAttempts((currentAttempts) =>
        appendUniqueAttempts(currentAttempts, page.attempts),
      );
      setHasMoreAttempts(page.hasMore);
      setLoadMoreError(null);
    } catch (caughtError) {
      setLoadMoreError(getErrorMessage(caughtError));
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    hasMoreAttempts,
    isLoadingMore,
    practiceAttemptStore,
    recentAttempts.length,
  ]);

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

  return {
    hasMoreAttempts,
    historyError,
    isLoading,
    isLoadingMore,
    isLoadingSummary,
    loadMoreAttempts,
    loadMoreError,
    recentAttempts,
    summary,
    summaryError,
  };
}

function appendUniqueAttempts(
  currentAttempts: PracticeAttempt[],
  nextAttempts: PracticeAttempt[],
) {
  const existingAttemptIds = new Set(
    currentAttempts.map((attempt) => attempt.id),
  );

  return [
    ...currentAttempts,
    ...nextAttempts.filter((attempt) => !existingAttemptIds.has(attempt.id)),
  ];
}
