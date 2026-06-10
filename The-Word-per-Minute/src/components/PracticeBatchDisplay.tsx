import type { PracticeBatch } from "../types/chapterPractice";
import { areCharactersEquivalent } from "../utils/typingMetrics";

type PracticeBatchDisplayProps = {
  batch: PracticeBatch;
  batchNumber: number;
  totalBatches: number;
  translationName: string;
  typedText: string;
};

function getCharacterClass(targetCharacter: string, typedCharacter: string | undefined, isCurrent: boolean) {
  if (typedCharacter === undefined) {
    return isCurrent ? "bg-amber-100 text-slate-900" : "text-slate-500";
  }

  return areCharactersEquivalent(targetCharacter, typedCharacter)
    ? "bg-emerald-100 text-emerald-900"
    : "bg-rose-100 text-rose-900";
}

export function PracticeBatchDisplay({
  batch,
  batchNumber,
  totalBatches,
  translationName,
  typedText,
}: PracticeBatchDisplayProps) {
  return (
    <section className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">
          {batch.ref} <span className="text-slate-400">({translationName})</span>
        </p>
        <p className="text-sm text-slate-500">
          Batch {batchNumber} of {totalBatches}
        </p>
      </div>

      <p className="text-lg leading-9">
        {batch.text.split("").map((character, index) => (
          <span
            className={getCharacterClass(character, typedText[index], index === typedText.length)}
            key={`${character}-${index}`}
          >
            {character}
          </span>
        ))}
      </p>
    </section>
  );
}
