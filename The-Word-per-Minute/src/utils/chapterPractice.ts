import type { PracticeBatch } from "../types/chapterPractice";
import type { BibleVerse } from "../types/verse";

export function buildPracticeBatches(
  bookName: string,
  chapterNumber: number,
  verses: BibleVerse[],
  batchSize = 2,
) {
  const batches: PracticeBatch[] = [];

  for (let index = 0; index < verses.length; index += batchSize) {
    const batchVerses = verses.slice(index, index + batchSize);
    const firstVerse = batchVerses[0];
    const lastVerse = batchVerses[batchVerses.length - 1] ?? firstVerse;

    if (!firstVerse) continue;

    batches.push({
      startVerse: firstVerse.number,
      endVerse: lastVerse.number,
      ref:
        firstVerse.number === lastVerse.number
          ? `${bookName} ${chapterNumber}:${firstVerse.number}`
          : `${bookName} ${chapterNumber}:${firstVerse.number}-${lastVerse.number}`,
      text: batchVerses.map((verse) => verse.text).join(" "),
    });
  }

  return batches;
}
