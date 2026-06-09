import { useEffect, useState } from "react";
import { verseService } from "../services/verseService";
import type { Translation, Verse } from "../types/verse";

export function useVerseLibrary() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedTranslationId, setSelectedTranslationId] = useState("");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadTranslations() {
      try {
        const response = await verseService.getTranslations();
        if (!isCurrent) return;

        setTranslations(response.translations);
        setSelectedTranslationId(response.translations[0]?.id ?? "");
      } catch (caughtError) {
        if (isCurrent) setError(getErrorMessage(caughtError));
      }
    }

    loadTranslations();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedTranslationId) {
      setIsLoading(false);
      setVerses([]);
      return;
    }

    let isCurrent = true;
    setIsLoading(true);

    async function loadVerses() {
      try {
        const response = await verseService.getVerses(selectedTranslationId);
        if (!isCurrent) return;

        setVerses(response.verses);
        setError(null);
      } catch (caughtError) {
        if (!isCurrent) return;

        setVerses([]);
        setError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadVerses();

    return () => {
      isCurrent = false;
    };
  }, [selectedTranslationId]);

  return {
    error,
    isLoading,
    selectedTranslationId,
    setSelectedTranslationId,
    translations,
    verses,
  };
}

function getErrorMessage(caughtError: unknown) {
  return caughtError instanceof Error ? caughtError.message : "Something went wrong.";
}
