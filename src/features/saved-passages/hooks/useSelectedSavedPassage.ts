import { useEffect, useMemo, useState } from 'react';
import { verseService } from '../../../lib/bible/verseService';
import type { PassageResponse } from '../../../types/passage';
import { getErrorMessage } from '../../../utils/errors';
import type { SavedPassage } from '../types/savedPassage';

/**
 * Owns the active saved passage and resolves it into Bible text when selected.
 */
export function useSelectedSavedPassage(
  savedPassages: readonly SavedPassage[],
) {
  const [selectedSavedPassageId, setSelectedSavedPassageId] = useState('');
  const [passageResponse, setPassageResponse] =
    useState<PassageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPassageError, setSelectedPassageError] = useState<
    string | null
  >(null);

  const selectedSavedPassage = useMemo(
    () =>
      savedPassages.find((passage) => passage.id === selectedSavedPassageId),
    [savedPassages, selectedSavedPassageId],
  );

  useEffect(() => {
    const selectedPassageExists = savedPassages.some(
      (passage) => passage.id === selectedSavedPassageId,
    );
    if (selectedPassageExists) return;

    const fallbackPassageId = savedPassages[0]?.id ?? '';
    if (selectedSavedPassageId !== fallbackPassageId) {
      setSelectedSavedPassageId(fallbackPassageId);
    }
  }, [savedPassages, selectedSavedPassageId]);

  useEffect(() => {
    if (!selectedSavedPassage) {
      setPassageResponse(null);
      setIsLoading(false);
      setSelectedPassageError(null);
      return;
    }

    let isCurrent = true;
    const passageToLoad = selectedSavedPassage;
    setIsLoading(true);
    setSelectedPassageError(null);

    async function loadSavedPassage() {
      try {
        const response = await verseService.getReferencePassage(passageToLoad);
        if (isCurrent) setPassageResponse(response);
      } catch (caughtError) {
        if (!isCurrent) return;

        setPassageResponse(null);
        setSelectedPassageError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadSavedPassage();

    return () => {
      isCurrent = false;
    };
  }, [selectedSavedPassage]);

  return {
    isLoading,
    passageResponse,
    selectSavedPassage: setSelectedSavedPassageId,
    selectedPassageError,
    selectedSavedPassage,
    selectedSavedPassageId,
  };
}
