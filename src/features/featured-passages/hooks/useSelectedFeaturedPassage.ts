import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PassageResponse } from '../../../types/passage';
import { getErrorMessage } from '../../../utils/errors';
import { featuredPassageService } from '../api/featuredPassageService';
import type { FeaturedPassage } from '../types/featuredPassage';
import { getRandomFeaturedPassage } from '../utils/featuredPassageSelection';

type PassageLoadState = {
  error: string | null;
  isLoading: boolean;
  passageId: string;
  response: PassageResponse | null;
};

const EMPTY_LOAD_STATE: PassageLoadState = {
  error: null,
  isLoading: false,
  passageId: '',
  response: null,
};

/**
 * Owns the active featured-passage selection and resolves it into Bible text.
 */
export function useSelectedFeaturedPassage(
  passages: readonly FeaturedPassage[],
) {
  const [requestedPassageId, setRequestedPassageId] = useState('');
  const fallbackPassageId = useMemo(
    () => getRandomFeaturedPassage(passages)?.id ?? '',
    [passages],
  );
  const selectedPassageId = passages.some(
    (passage) => passage.id === requestedPassageId,
  )
    ? requestedPassageId
    : fallbackPassageId;
  const [loadState, setLoadState] =
    useState<PassageLoadState>(EMPTY_LOAD_STATE);

  useEffect(() => {
    if (!selectedPassageId) {
      setLoadState(EMPTY_LOAD_STATE);
      return;
    }

    let isCurrent = true;
    const passageId = selectedPassageId;
    setLoadState({
      error: null,
      isLoading: true,
      passageId,
      response: null,
    });

    async function loadPassage() {
      try {
        const response = await featuredPassageService.getPassage(passageId);
        if (!isCurrent) return;

        setLoadState({
          error: null,
          isLoading: false,
          passageId,
          response,
        });
      } catch (caughtError) {
        if (!isCurrent) return;

        setLoadState({
          error: getErrorMessage(caughtError),
          isLoading: false,
          passageId,
          response: null,
        });
      }
    }

    void loadPassage();

    return () => {
      isCurrent = false;
    };
  }, [selectedPassageId]);

  const selectPassage = useCallback((passageId: string) => {
    setRequestedPassageId(passageId);
  }, []);
  const isCurrentSelectionLoaded = loadState.passageId === selectedPassageId;

  return {
    error: isCurrentSelectionLoaded ? loadState.error : null,
    isLoading:
      Boolean(selectedPassageId) &&
      (!isCurrentSelectionLoaded || loadState.isLoading),
    passageResponse: isCurrentSelectionLoaded ? loadState.response : null,
    selectPassage,
    selectedPassageId,
  };
}
