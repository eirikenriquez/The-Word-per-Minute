import { useMemo } from "react";
import type { AppMode, PracticeSource } from "../../../types/app";
import type { PassageResponse } from "../../../types/featuredPassage";
import type { PracticePassage } from "../../../types/practice";
import type { BibleChapter, BookSummary } from "../../../types/verse";
import { buildPracticePassage } from "../utils/practicePassage";

type UsePracticePassageParams = {
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
 * Converts whichever source is active into one continuous practice passage.
 * Keeping this separate lets App choose a mode without knowing how passages are assembled.
 */
export function usePracticePassage({
  appMode,
  bibleChapter,
  featuredPassageResponse,
  practiceSource,
  savedPassageResponse,
  selectedBook,
  selectedChapter,
  selectedVerseNumbers,
}: UsePracticePassageParams) {
  const featuredPassage = useMemo(() => {
    return getPracticePassageFromResponse(featuredPassageResponse);
  }, [featuredPassageResponse]);

  const biblePassage = useMemo(() => {
    if (!bibleChapter || !selectedBook) return undefined;

    const selectedVerseSet = new Set(selectedVerseNumbers);
    const selectedVerses = selectedVerseNumbers.length
      ? bibleChapter.verses.filter((verse) => selectedVerseSet.has(verse.number))
      : bibleChapter.verses;

    return buildPracticePassage(selectedBook.name, selectedChapter, selectedVerses);
  }, [bibleChapter, selectedBook, selectedChapter, selectedVerseNumbers]);

  const savedPassage = useMemo(() => {
    return getPracticePassageFromResponse(savedPassageResponse);
  }, [savedPassageResponse]);

  const passage =
    appMode === "practice" && practiceSource === "featured"
      ? featuredPassage
      : appMode === "practice" && practiceSource === "saved"
        ? savedPassage
        : appMode === "bible"
          ? biblePassage
          : undefined;

  return passage;
}

function getPracticePassageFromResponse(response: PassageResponse | null): PracticePassage | undefined {
  if (!response) return undefined;

  return buildPracticePassage(response.bookName, response.passage.chapter, response.verses);
}
