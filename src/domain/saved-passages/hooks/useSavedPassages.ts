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
  const [isLoadingSavedPassages, setIsLoadingSavedPassages] = useState(false);
  const [isLoadingSelectedPassage, setIsLoadingSelectedPassage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedPassageError, setSelectedPassageError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const isLoading = isLoadingSavedPassages || isLoadingSelectedPassage;

  const selectedSavedPassage = useMemo(
    () => savedPassages.find((passage) => passage.id === selectedSavedPassageId),
    [savedPassages, selectedSavedPassageId],
  );

  useEffect(() => {
    let isCurrent = true;

    async function loadSavedPassages() {
      setSavedPassages([]);
      setSelectedSavedPassageId("");
      setPassageResponse(null);
      setIsLoadingSavedPassages(true);
      setListError(null);
      setSelectedPassageError(null);
      setMutationError(null);

      try {
        const nextSavedPassages = await savedPassageStore.list();
        if (!isCurrent) return;

        setSavedPassages(nextSavedPassages);
        setSelectedSavedPassageId((currentPassageId) => {
          if (nextSavedPassages.some((passage) => passage.id === currentPassageId)) return currentPassageId;
          return nextSavedPassages[0]?.id ?? "";
        });
      } catch (caughtError) {
        if (isCurrent) setListError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoadingSavedPassages(false);
      }
    }

    loadSavedPassages();

    return () => {
      isCurrent = false;
    };
  }, [savedPassageStore]);

  useEffect(() => {
    const selectedPassageExists = savedPassages.some(
      (passage) => passage.id === selectedSavedPassageId,
    );
    if (selectedPassageExists) return;

    const fallbackPassageId = savedPassages[0]?.id ?? "";
    if (selectedSavedPassageId !== fallbackPassageId) {
      setSelectedSavedPassageId(fallbackPassageId);
    }
  }, [savedPassages, selectedSavedPassageId]);

  useEffect(() => {
    if (!selectedSavedPassage) {
      setPassageResponse(null);
      setIsLoadingSelectedPassage(false);
      setSelectedPassageError(null);
      return;
    }

    let isCurrent = true;
    const passageToLoad = selectedSavedPassage;
    setIsLoadingSelectedPassage(true);
    setSelectedPassageError(null);

    async function loadSavedPassage() {
      try {
        const response = await verseService.getReferencePassage(passageToLoad);
        if (!isCurrent) return;

        setPassageResponse(response);
      } catch (caughtError) {
        if (!isCurrent) return;

        setPassageResponse(null);
        setSelectedPassageError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoadingSelectedPassage(false);
      }
    }

    loadSavedPassage();

    return () => {
      isCurrent = false;
    };
  }, [selectedSavedPassage]);

  async function savePassage(input: SavePassageInput) {
    setIsSaving(true);
    setMutationError(null);

    try {
      const savedPassage = await savedPassageStore.save(input);

      setSavedPassages((currentPassages) => [
        savedPassage,
        ...currentPassages.filter((passage) => passage.id !== savedPassage.id),
      ]);
      setSelectedSavedPassageId(savedPassage.id);
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

      setSavedPassages((currentPassages) => {
        return currentPassages.filter((passage) => passage.id !== passageId);
      });
      setSelectedSavedPassageId((currentPassageId) => {
        if (currentPassageId !== passageId) return currentPassageId;
        return "";
      });
    } catch (caughtError) {
      setMutationError(getErrorMessage(caughtError));
    }
  }

  async function updatePassage(passageId: string, update: SavedPassageUpdate) {
    setMutationError(null);

    try {
      const updatedPassage = await savedPassageStore.update(passageId, update);

      if (!updatedPassage) return null;

      setSavedPassages((currentPassages) => {
        return currentPassages.map((passage) => {
          return passage.id === passageId ? updatedPassage : passage;
        });
      });

      return updatedPassage;
    } catch (caughtError) {
      setMutationError(getErrorMessage(caughtError));
      return null;
    }
  }

  function isPassageSaved(input: SavePassageInput | null) {
    if (!input) return false;

    const passageIdentity = getSavedPassageIdentity(input);
    return savedPassages.some((passage) => getSavedPassageIdentity(passage) === passageIdentity);
  }

  return {
    isLoading,
    isSaving,
    isPassageSaved,
    listError,
    mutationError,
    passageResponse,
    removePassage,
    savePassage,
    savedPassages,
    selectSavedPassage: setSelectedSavedPassageId,
    selectedSavedPassage,
    selectedPassageError,
    selectedSavedPassageId,
    updatePassage,
  };
}
