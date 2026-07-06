import { useEffect, useMemo, useState } from "react";
import { getSavedPassageIdentity } from "../savedPassageIdentity";
import { localSavedPassageStore } from "../stores/localSavedPassageStore";
import { createSupabaseSavedPassageStore } from "../stores/supabaseSavedPassageStore";
import { verseService } from "../../bible/verseService";
import type { PassageResponse } from "../../../shared/types/featuredPassage";
import type { SavedPassage, SavePassageInput, SavedPassageUpdate } from "../../../shared/types/savedPassage";
import { getErrorMessage } from "../../../shared/utils/errors";

/**
 * Manages saved passages through a repository boundary.
 * Guests use localStorage. Signed-in users use Supabase.
 */
export function useSavedPassages(userId?: string | null) {
  const savedPassageStore = useMemo(() => {
    return userId ? createSupabaseSavedPassageStore(userId) : localSavedPassageStore;
  }, [userId]);
  const [savedPassages, setSavedPassages] = useState<SavedPassage[]>([]);
  const [selectedSavedPassageId, setSelectedSavedPassageId] = useState("");
  const [passageResponse, setPassageResponse] = useState<PassageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSavedPassage = useMemo(
    () => savedPassages.find((passage) => passage.id === selectedSavedPassageId),
    [savedPassages, selectedSavedPassageId],
  );

  useEffect(() => {
    let isCurrent = true;

    async function loadSavedPassages() {
      setIsLoading(true);

      try {
        const nextSavedPassages = await savedPassageStore.list();
        if (!isCurrent) return;

        setSavedPassages(nextSavedPassages);
        setSelectedSavedPassageId((currentPassageId) => {
          if (nextSavedPassages.some((passage) => passage.id === currentPassageId)) return currentPassageId;
          return nextSavedPassages[0]?.id ?? "";
        });
        setError(null);
      } catch (caughtError) {
        if (isCurrent) setError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadSavedPassages();

    return () => {
      isCurrent = false;
    };
  }, [savedPassageStore]);

  useEffect(() => {
    if (selectedSavedPassageId || !savedPassages.length) return;
    setSelectedSavedPassageId(savedPassages[0].id);
  }, [savedPassages, selectedSavedPassageId]);

  useEffect(() => {
    if (!selectedSavedPassage) {
      setPassageResponse(null);
      setIsLoading(false);
      return;
    }

    let isCurrent = true;
    const passageToLoad = selectedSavedPassage;
    setIsLoading(true);

    async function loadSavedPassage() {
      try {
        const response = await verseService.getReferencePassage(passageToLoad);
        if (!isCurrent) return;

        setPassageResponse(response);
        setError(null);
      } catch (caughtError) {
        if (!isCurrent) return;

        setPassageResponse(null);
        setError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadSavedPassage();

    return () => {
      isCurrent = false;
    };
  }, [selectedSavedPassage]);

  async function savePassage(input: SavePassageInput) {
    setIsSaving(true);

    try {
      const savedPassage = await savedPassageStore.save(input);
      const nextSavedPassages = [
        savedPassage,
        ...savedPassages.filter((passage) => passage.id !== savedPassage.id),
      ];

      setSavedPassages(nextSavedPassages);
      setSelectedSavedPassageId(savedPassage.id);
      setError(null);
      return savedPassage;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  async function removePassage(passageId: string) {
    try {
      await savedPassageStore.remove(passageId);

      const nextSavedPassages = savedPassages.filter((passage) => passage.id !== passageId);

      setSavedPassages(nextSavedPassages);
      setSelectedSavedPassageId((currentPassageId) => {
        if (currentPassageId !== passageId) return currentPassageId;
        return nextSavedPassages[0]?.id ?? "";
      });
      setError(null);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    }
  }

  async function updatePassage(passageId: string, update: SavedPassageUpdate) {
    try {
      const updatedPassage = await savedPassageStore.update(passageId, update);

      if (!updatedPassage) return null;

      const nextSavedPassages = savedPassages.map((passage) => {
        return passage.id === passageId ? updatedPassage : passage;
      });

      setSavedPassages(nextSavedPassages);
      setError(null);
      return updatedPassage;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      return null;
    }
  }

  function isPassageSaved(input: SavePassageInput | null) {
    if (!input) return false;

    const passageIdentity = getSavedPassageIdentity(input);
    return savedPassages.some((passage) => getSavedPassageIdentity(passage) === passageIdentity);
  }

  return {
    error,
    isLoading,
    isSaving,
    isPassageSaved,
    passageResponse,
    removePassage,
    savePassage,
    savedPassages,
    selectSavedPassage: setSelectedSavedPassageId,
    selectedSavedPassage,
    selectedSavedPassageId,
    updatePassage,
  };
}
