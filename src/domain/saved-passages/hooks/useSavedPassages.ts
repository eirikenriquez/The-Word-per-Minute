import { useEffect, useMemo, useState } from "react";
import {
  getSavedPassageId,
  savedPassageRepository,
} from "../savedPassageRepository";
import { verseService } from "../../bible/verseService";
import type { PassageResponse } from "../../../shared/types/featuredPassage";
import type { SavedPassage, SavePassageInput, SavedPassageUpdate } from "../../../shared/types/savedPassage";
import { getErrorMessage } from "../../../shared/utils/errors";

/**
 * Manages saved passages through a repository boundary.
 * The hook stays the same if localStorage is replaced by a backend later.
 */
export function useSavedPassages() {
  const [savedPassages, setSavedPassages] = useState<SavedPassage[]>(() => savedPassageRepository.list());
  const [selectedSavedPassageId, setSelectedSavedPassageId] = useState(savedPassages[0]?.id ?? "");
  const [passageResponse, setPassageResponse] = useState<PassageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSavedPassage = useMemo(
    () => savedPassages.find((passage) => passage.id === selectedSavedPassageId),
    [savedPassages, selectedSavedPassageId],
  );

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

  function savePassage(input: SavePassageInput) {
    const savedPassage = savedPassageRepository.save(input);
    setSavedPassages(savedPassageRepository.list());
    setSelectedSavedPassageId(savedPassage.id);
    return savedPassage;
  }

  function removePassage(passageId: string) {
    savedPassageRepository.remove(passageId);
    const nextSavedPassages = savedPassageRepository.list();

    setSavedPassages(nextSavedPassages);
    setSelectedSavedPassageId((currentPassageId) => {
      if (currentPassageId !== passageId) return currentPassageId;
      return nextSavedPassages[0]?.id ?? "";
    });
  }

  function updatePassage(passageId: string, update: SavedPassageUpdate) {
    const updatedPassage = savedPassageRepository.update(passageId, update);
    if (!updatedPassage) return null;

    setSavedPassages(savedPassageRepository.list());
    return updatedPassage;
  }

  function isPassageSaved(input: SavePassageInput | null) {
    if (!input) return false;

    const passageId = getSavedPassageId(input);
    return savedPassages.some((passage) => passage.id === passageId);
  }

  return {
    error,
    isLoading,
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
