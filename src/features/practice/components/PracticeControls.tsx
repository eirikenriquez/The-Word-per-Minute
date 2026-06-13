import type { SavedPassage } from "../../../types/savedPassage";

type PracticeSource = "featured" | "saved";

type PracticeControlsProps = {
  hasSavedPassages: boolean;
  practiceSource: PracticeSource;
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onNextFeaturedPassage: () => void;
  onOpenLibrary: () => void;
  onReset: () => void;
  onSelectFeaturedPractice: () => void;
  onSelectSavedPractice: (passageId: string) => void;
};

/**
 * Source controls for the central typing page.
 * Keeps Practice focused while still letting the user switch between curated and saved passages.
 */
export function PracticeControls({
  hasSavedPassages,
  practiceSource,
  savedPassages,
  selectedSavedPassageId,
  onNextFeaturedPassage,
  onOpenLibrary,
  onReset,
  onSelectFeaturedPractice,
  onSelectSavedPractice,
}: PracticeControlsProps) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-3">
          <div className="w-fit rounded-md border border-slate-300 bg-slate-100 p-1 text-sm">
            <button
              className={`rounded px-3 py-1.5 font-medium ${
                practiceSource === "featured"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              type="button"
              onClick={onSelectFeaturedPractice}
            >
              Featured
            </button>
            <button
              className={`rounded px-3 py-1.5 font-medium ${
                practiceSource === "saved"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              } disabled:cursor-not-allowed disabled:text-slate-400`}
              disabled={!hasSavedPassages}
              type="button"
              onClick={() => {
                const passageId = selectedSavedPassageId || savedPassages[0]?.id;
                if (passageId) onSelectSavedPractice(passageId);
              }}
            >
              Saved
            </button>
          </div>

          {practiceSource === "saved" && (
            <label className="grid gap-1 sm:max-w-md">
              <span className="text-sm font-medium text-slate-600">Saved Passage</span>
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                value={selectedSavedPassageId}
                onChange={(event) => onSelectSavedPractice(event.target.value)}
              >
                {savedPassages.map((passage) => (
                  <option key={passage.id} value={passage.id}>
                    {passage.title}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          {practiceSource === "featured" ? (
            <button
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              type="button"
              onClick={onNextFeaturedPassage}
            >
              Next Passage
            </button>
          ) : (
            <button
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              type="button"
              onClick={onOpenLibrary}
            >
              Manage Library
            </button>
          )}
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
