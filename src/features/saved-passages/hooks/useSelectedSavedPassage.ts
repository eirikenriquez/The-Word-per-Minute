import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [reloadVersion, setReloadVersion] = useState(0);
  const [loadState, setLoadState] = useState<{
    error: string | null;
    isLoading: boolean;
    passageId: string;
    reloadVersion: number;
    response: PassageResponse | null;
  }>({
    error: null,
    isLoading: false,
    passageId: '',
    reloadVersion: 0,
    response: null,
  });

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
      setLoadState({
        error: null,
        isLoading: false,
        passageId: '',
        reloadVersion,
        response: null,
      });
      return;
    }

    let isCurrent = true;
    const passageToLoad = selectedSavedPassage;
    const passageId = passageToLoad.id;
    setLoadState({
      error: null,
      isLoading: true,
      passageId,
      reloadVersion,
      response: null,
    });

    async function loadSavedPassage() {
      try {
        const response = await verseService.getReferencePassage(passageToLoad);
        if (isCurrent) {
          setLoadState({
            error: null,
            isLoading: false,
            passageId,
            reloadVersion,
            response,
          });
        }
      } catch (caughtError) {
        if (!isCurrent) return;

        setLoadState({
          error: getErrorMessage(caughtError),
          isLoading: false,
          passageId,
          reloadVersion,
          response: null,
        });
      }
    }

    void loadSavedPassage();

    return () => {
      isCurrent = false;
    };
  }, [reloadVersion, selectedSavedPassage]);

  const reloadPassage = useCallback(() => {
    setReloadVersion((currentVersion) => currentVersion + 1);
  }, []);
  const hasCurrentLoadState =
    loadState.passageId === selectedSavedPassageId &&
    loadState.reloadVersion === reloadVersion;

  return {
    isLoading:
      Boolean(selectedSavedPassage) &&
      (!hasCurrentLoadState || loadState.isLoading),
    passageResponse: hasCurrentLoadState ? loadState.response : null,
    reloadPassage,
    selectSavedPassage: setSelectedSavedPassageId,
    selectedPassageError: hasCurrentLoadState ? loadState.error : null,
    selectedSavedPassage,
    selectedSavedPassageId,
  };
}
