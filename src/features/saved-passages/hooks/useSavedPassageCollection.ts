import { useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../../../utils/errors';
import { localSavedPassageStore } from '../stores/localSavedPassageStore';
import { createSupabaseSavedPassageStore } from '../stores/supabaseSavedPassageStore';
import type {
  SavedPassage,
  SavePassageInput,
  SavedPassageUpdate,
} from '../types/savedPassage';
import { getSavedPassageIdentity } from '../utils/savedPassageIdentity';

/**
 * Owns the saved-passage collection and its guest or cloud persistence.
 */
export function useSavedPassageCollection(userId?: string | null) {
  const savedPassageStore = useMemo(() => {
    return userId
      ? createSupabaseSavedPassageStore(userId)
      : localSavedPassageStore;
  }, [userId]);
  const [savedPassages, setSavedPassages] = useState<SavedPassage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadSavedPassages() {
      setSavedPassages([]);
      setIsLoading(true);
      setListError(null);
      setMutationError(null);

      try {
        const nextSavedPassages = await savedPassageStore.list();
        if (isCurrent) setSavedPassages(nextSavedPassages);
      } catch (caughtError) {
        if (isCurrent) setListError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadSavedPassages();

    return () => {
      isCurrent = false;
    };
  }, [savedPassageStore]);

  async function savePassage(input: SavePassageInput) {
    setIsSaving(true);
    setMutationError(null);

    try {
      const savedPassage = await savedPassageStore.save(input);

      setSavedPassages((currentPassages) => [
        savedPassage,
        ...currentPassages.filter((passage) => passage.id !== savedPassage.id),
      ]);
      return savedPassage;
    } catch (caughtError) {
      setMutationError(getErrorMessage(caughtError));
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function removePassage(passageId: string) {
    setMutationError(null);

    try {
      await savedPassageStore.remove(passageId);
      setSavedPassages((currentPassages) =>
        currentPassages.filter((passage) => passage.id !== passageId),
      );
      return true;
    } catch (caughtError) {
      setMutationError(getErrorMessage(caughtError));
      return false;
    }
  }

  async function updatePassage(passageId: string, update: SavedPassageUpdate) {
    setMutationError(null);

    try {
      const updatedPassage = await savedPassageStore.update(passageId, update);
      if (!updatedPassage) return null;

      setSavedPassages((currentPassages) =>
        currentPassages.map((passage) =>
          passage.id === passageId ? updatedPassage : passage,
        ),
      );
      return updatedPassage;
    } catch (caughtError) {
      setMutationError(getErrorMessage(caughtError));
      return null;
    }
  }

  function isPassageSaved(input: SavePassageInput | null) {
    if (!input) return false;

    const passageIdentity = getSavedPassageIdentity(input);
    return savedPassages.some(
      (passage) => getSavedPassageIdentity(passage) === passageIdentity,
    );
  }

  return {
    isLoading,
    isPassageSaved,
    isSaving,
    listError,
    mutationError,
    removePassage,
    savePassage,
    savedPassages,
    updatePassage,
  };
}
