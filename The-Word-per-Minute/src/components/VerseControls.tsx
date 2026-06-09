import type { Translation, Verse } from "../types/verse";

type VerseControlsProps = {
  selectedVerseIndex: number;
  selectedTranslationId: string;
  translations: Translation[];
  verses: Verse[];
  onSelectVerse: (verseIndex: number) => void;
  onSelectTranslation: (translationId: string) => void;
  onRandomVerse: () => void;
  onReset: () => void;
};

export function VerseControls({
  selectedVerseIndex,
  selectedTranslationId,
  translations,
  verses,
  onSelectVerse,
  onSelectTranslation,
  onRandomVerse,
  onReset,
}: VerseControlsProps) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">Translation</span>
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              value={selectedTranslationId}
              onChange={(event) => onSelectTranslation(event.target.value)}
            >
              {translations.map((translation) => (
                <option key={translation.id} value={translation.id}>
                  {translation.abbreviation} - {translation.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">Verse</span>
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              value={selectedVerseIndex}
              onChange={(event) => onSelectVerse(Number(event.target.value))}
            >
              {verses.map((verse, index) => (
                <option key={verse.id} value={index}>
                  {verse.ref}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            type="button"
            onClick={onRandomVerse}
          >
            Random Verse
          </button>
          <button
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            type="button"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
