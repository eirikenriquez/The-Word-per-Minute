import type { Verse } from "../types/verse";

type VerseDisplayProps = {
  verse: Verse;
  typedText: string;
};

function getCharacterClass(targetCharacter: string, typedCharacter: string | undefined, isCurrent: boolean) {
  if (typedCharacter === undefined) {
    return isCurrent ? "bg-amber-100 text-slate-900" : "text-slate-500";
  }

  return typedCharacter === targetCharacter
    ? "bg-emerald-100 text-emerald-900"
    : "bg-rose-100 text-rose-900";
}

export function VerseDisplay({ verse, typedText }: VerseDisplayProps) {
  return (
    <section className="rounded-lg border bg-white p-5 shadow-sm">
      <p className="mb-3 text-sm font-medium text-slate-500">{verse.ref}</p>
      <p className="text-lg leading-9">
        {verse.text.split("").map((character, index) => (
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
