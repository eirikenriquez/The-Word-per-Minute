import { useMemo } from "react";
import type { AppMode, PracticeSource } from "../../../types/app";
import type { PassageResponse } from "../../../types/featuredPassage";
import type { PracticeBatch } from "../../../types/practice";
import type { BibleChapter, BookSummary } from "../../../types/verse";
import { buildPracticeBatches } from "../utils/practiceBatches";

type UsePracticeBatchesParams = {
  appMode: AppMode;
  bibleChapter: BibleChapter | null;
  featuredPassageResponse: PassageResponse | null;
  practiceSource: PracticeSource;
  savedPassageResponse: PassageResponse | null;
  selectedBook?: BookSummary;
  selectedChapter: number;
  selectedVerseNumbers: number[];
};

/**
 * Converts whichever source is active into the shared practice-batch shape.
 * Keeping this separate lets App choose a mode without knowing how passages are assembled.
 */
export function usePracticeBatches({
  appMode,
  bibleChapter,
  featuredPassageResponse,
  practiceSource,
  savedPassageResponse,
  selectedBook,
  selectedChapter,
  selectedVerseNumbers,
}: UsePracticeBatchesParams) {
  const featuredBatches = useMemo(() => {
    return getBatchesFromPassageResponse(featuredPassageResponse);
  }, [featuredPassageResponse]);

  const bibleBatches = useMemo(() => {
    if (!bibleChapter || !selectedBook) return [];

    const selectedVerseSet = new Set(selectedVerseNumbers);
    const selectedVerses = selectedVerseNumbers.length
      ? bibleChapter.verses.filter((verse) => selectedVerseSet.has(verse.number))
      : bibleChapter.verses;

    return buildPracticeBatches(selectedBook.name, selectedChapter, selectedVerses, 2);
  }, [bibleChapter, selectedBook, selectedChapter, selectedVerseNumbers]);

  const savedBatches = useMemo(() => {
    return getBatchesFromPassageResponse(savedPassageResponse);
  }, [savedPassageResponse]);

  const batches =
    appMode === "practice" && practiceSource === "featured"
      ? featuredBatches
      : appMode === "practice" && practiceSource === "saved"
        ? savedBatches
        : appMode === "bible"
          ? bibleBatches
          : [];

  return { batches, bibleBatches, featuredBatches, savedBatches };
}

function getBatchesFromPassageResponse(response: PassageResponse | null): PracticeBatch[] {
  if (!response) return [];

  return buildPracticeBatches(response.bookName, response.passage.chapter, response.verses, 2);
}
