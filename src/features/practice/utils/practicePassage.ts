import type { PracticePassage } from "../../../types/practice";
import type { BibleVerse } from "../../../types/verse";

/**
 * Converts a verse selection into one continuous typing target.
 */
export function buildPracticePassage(
  bookName: string,
  chapterNumber: number,
  verses: BibleVerse[],
): PracticePassage | undefined {
  const firstVerse = verses[0];
  const lastVerse = verses[verses.length - 1] ?? firstVerse;

  if (!firstVerse) return undefined;

  return {
    startVerse: firstVerse.number,
    endVerse: lastVerse.number,
    ref:
      firstVerse.number === lastVerse.number
        ? `${bookName} ${chapterNumber}:${firstVerse.number}`
        : `${bookName} ${chapterNumber}:${firstVerse.number}-${lastVerse.number}`,
    text: verses.map((verse) => verse.text).join(" "),
    verses,
  };
}
