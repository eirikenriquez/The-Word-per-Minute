import { useMemo } from 'react';
import type { PracticeSource } from '@/features/practice/types/practice';
import type { PassageResponse } from '../../types/passage';
import type { SavedPassage } from '../../features/saved-passages/types/savedPassage';

type UseAppDisplayStateParams = {
  featuredError: string | null;
  featuredIsLoading: boolean;
  featuredPassageResponse: PassageResponse | null;
  practiceSource: PracticeSource;
  savedPassageError: string | null;
  savedIsLoading: boolean;
  savedPassageResponse: PassageResponse | null;
  selectedSavedPassage?: SavedPassage;
};

/**
 * Derives display state for the final page still using the legacy controller.
 */
export function useAppDisplayState({
  featuredError,
  featuredIsLoading,
  featuredPassageResponse,
  practiceSource,
  savedPassageError,
  savedIsLoading,
  savedPassageResponse,
  selectedSavedPassage,
}: UseAppDisplayStateParams) {
  return useMemo(() => {
    const isFeaturedPractice = practiceSource === 'featured';

    return {
      error: isFeaturedPractice ? featuredError : savedPassageError,
      isLoading: isFeaturedPractice
        ? featuredIsLoading && !featuredPassageResponse
        : savedIsLoading && !savedPassageResponse,
      headerReference: isFeaturedPractice
        ? (featuredPassageResponse?.reference ?? '')
        : (selectedSavedPassage?.reference ?? ''),
      headerSubtitle: isFeaturedPractice
        ? `Practice - ${featuredPassageResponse?.passage.theme ?? 'Discovery'}`
        : 'Practice - Saved passage',
      headerTitle: isFeaturedPractice
        ? (featuredPassageResponse?.passage.title ?? 'Featured Passage')
        : (selectedSavedPassage?.title ?? 'Saved Passage'),
      translationName: isFeaturedPractice
        ? (featuredPassageResponse?.translation.abbreviation ?? 'WEB')
        : (selectedSavedPassage?.translationAbbreviation ?? 'WEB'),
    };
  }, [
    featuredError,
    featuredIsLoading,
    featuredPassageResponse,
    practiceSource,
    savedPassageError,
    savedIsLoading,
    savedPassageResponse,
    selectedSavedPassage,
  ]);
}
