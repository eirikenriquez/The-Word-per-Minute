import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../../utils/errors';
import { featuredPassageService } from '../api/featuredPassageService';
import type { FeaturedPassage } from '../types/featuredPassage';

/**
 * Loads the curated featured-passage catalogue without resolving Bible text.
 */
export function useFeaturedPassageCatalog() {
  const [passages, setPassages] = useState<FeaturedPassage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadPassages() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await featuredPassageService.getFeaturedPassages();
        if (isCurrent) setPassages(response.passages);
      } catch (caughtError) {
        if (isCurrent) setError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadPassages();

    return () => {
      isCurrent = false;
    };
  }, []);

  return {
    error,
    isLoading,
    passages,
  };
}
