import { useCallback, useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../../../utils/errors';
import { createSupabasePracticeAttemptStore } from '../stores/supabasePracticeAttemptStore';
import type { SavePracticeAttemptInput } from '../types/practice';

/**
 * Saves completed attempts and reflections without loading Profile history.
 */
export function usePracticeAttemptMutations(userId?: string | null) {
  const practiceAttemptStore = useMemo(() => {
    return userId ? createSupabasePracticeAttemptStore(userId) : null;
  }, [userId]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingReflection, setIsSavingReflection] = useState(false);
  const [attemptSaveError, setAttemptSaveError] = useState<string | null>(null);
  const [reflectionError, setReflectionError] = useState<string | null>(null);

  useEffect(() => {
    setAttemptSaveError(null);
    setReflectionError(null);
    setIsSaving(false);
    setIsSavingReflection(false);
  }, [practiceAttemptStore]);

  const saveAttempt = useCallback(
    async (input: SavePracticeAttemptInput) => {
      if (!practiceAttemptStore) return null;

      setIsSaving(true);
      setAttemptSaveError(null);

      try {
        return await practiceAttemptStore.save(input);
      } catch (caughtError) {
        setAttemptSaveError(getErrorMessage(caughtError));
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [practiceAttemptStore],
  );

  const updateReflection = useCallback(
    async (attemptId: string, reflection: string) => {
      if (!practiceAttemptStore) return null;

      setIsSavingReflection(true);
      setReflectionError(null);

      try {
        return await practiceAttemptStore.updateReflection(
          attemptId,
          reflection,
        );
      } catch (caughtError) {
        setReflectionError(getErrorMessage(caughtError));
        return null;
      } finally {
        setIsSavingReflection(false);
      }
    },
    [practiceAttemptStore],
  );

  return {
    attemptSaveError,
    isSaving,
    isSavingReflection,
    reflectionError,
    saveAttempt,
    updateReflection,
  };
}
