import type { PracticeBatch } from "../../../types/practice";
import { areCharactersEquivalent } from "../utils/typingMetrics";

type PracticeBatchDisplayProps = {
  batch: PracticeBatch;
  batchNumber: number;
  totalBatches: number;
  translationName: string;
  typedText: string;
};

type DisplayPart =
  | {
      key: string;
      kind: "verseNumber";
      verseNumber: number;
    }
  | {
      character: string;
      key: string;
      kind: "character";
      textIndex: number;
    };

/**
 * Chooses the highlight class for each displayed character.
 * It uses typing normalization so curly quotes and straight quotes score consistently.
 */
function getCharacterClass(targetCharacter: string, typedCharacter: string | undefined, isCurrent: boolean) {
  if (typedCharacter === undefined) {
    return isCurrent ? "bg-blue-100 text-slate-950 dark:bg-blue-900 dark:text-blue-100" : "text-slate-500 dark:text-slate-400";
  }

  return areCharactersEquivalent(targetCharacter, typedCharacter)
    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
    : "bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-100";
}

/**
 * Builds visible verse-number markers around the actual text characters.
 * Only text characters receive typing indexes, so verse numbers never need to be typed.
 */
function getDisplayParts(batch: PracticeBatch) {
  let textIndex = 0;

  return batch.verses.flatMap((verse, verseIndex) => {
    const parts: DisplayPart[] = [
      {
        key: `verse-${verse.number}`,
        kind: "verseNumber" as const,
        verseNumber: verse.number,
      },
    ];

    if (verseIndex > 0) {
      parts.push({
        key: `space-before-${verse.number}`,
        kind: "character" as const,
        character: " ",
        textIndex: textIndex++,
      });
    }

    verse.text.split("").forEach((character) => {
      parts.push({
        key: `${verse.number}-${textIndex}`,
        kind: "character" as const,
        character,
        textIndex: textIndex++,
      });
    });

    return parts;
  });
}

/**
 * Shows the current passage batch with per-character feedback.
 */
export function PracticeBatchDisplay({
  batch,
  batchNumber,
  totalBatches,
  translationName,
  typedText,
}: PracticeBatchDisplayProps) {
  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {batch.ref} <span className="text-slate-500 dark:text-slate-400">({translationName})</span>
        </p>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Batch {batchNumber} of {totalBatches}
        </p>
      </div>

      <p className="max-w-5xl text-xl leading-10 text-slate-700 sm:text-2xl sm:leading-[3rem] dark:text-slate-300">
        {getDisplayParts(batch).map((part) =>
          part.kind === "verseNumber" ? (
            <sup className="mr-1 text-sm font-bold text-slate-400 dark:text-slate-500" key={part.key}>
              {part.verseNumber}
            </sup>
          ) : (
            <span
              className={getCharacterClass(
                part.character,
                typedText[part.textIndex],
                part.textIndex === typedText.length,
              )}
              key={part.key}
            >
              {part.character}
            </span>
          ),
        )}
      </p>
    </section>
  );
}
