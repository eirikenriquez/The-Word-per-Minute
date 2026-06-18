import { useEffect, useMemo, useState } from "react";
import { verseService } from "../../../services/verseService";
import type { FeaturedPassage, PassageResponse } from "../../../types/featuredPassage";
import { getErrorMessage } from "../../../utils/errors";

/**
 * Loads the curated featured-passage list and resolves the selected prompt
 * into real Bible text through the verse service.
 */
export function useFeaturedPassages() {
  const [passages, setPassages] = useState<FeaturedPassage[]>([]);
  const [selectedPassageId, setSelectedPassageId] = useState("");
  const [passageResponse, setPassageResponse] = useState<PassageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedPassage = useMemo(
    () => passages.find((passage) => passage.id === selectedPassageId),
    [passages, selectedPassageId],
  );

  useEffect(() => {
    let isCurrent = true;

    async function loadPassages() {
      try {
        const response = await verseService.getFeaturedPassages();
        if (!isCurrent) return;

        setPassages(response.passages);
        setSelectedPassageId(getRandomPassageId(response.passages, ""));
      } catch (caughtError) {
        if (isCurrent) setError(getErrorMessage(caughtError));
      }
    }

    loadPassages();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPassageId) return;

    let isCurrent = true;
    setIsLoading(true);

    async function loadPassage() {
      try {
        const response = await verseService.getPassage(selectedPassageId);
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

    loadPassage();

    return () => {
      isCurrent = false;
    };
  }, [selectedPassageId]);

  function selectPassage(passageId: string) {
    setSelectedPassageId(passageId);
  }

  function selectRandomPassage() {
    setSelectedPassageId(getRandomPassageId(passages, selectedPassageId));
  }

  return {
    error,
    isLoading,
    passageResponse,
    passages,
    selectPassage,
    selectRandomPassage,
    selectedPassage,
    selectedPassageId,
  };
}

function getRandomPassageId(passages: FeaturedPassage[], currentPassageId: string) {
  if (!passages.length) return "";
  if (passages.length === 1) return passages[0].id;

  let nextPassageId = currentPassageId;
  while (nextPassageId === currentPassageId) {
    nextPassageId = passages[Math.floor(Math.random() * passages.length)].id;
  }

  return nextPassageId;
}
