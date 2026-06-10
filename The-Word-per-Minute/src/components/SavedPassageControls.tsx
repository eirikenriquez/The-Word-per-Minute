import type { SavedPassage } from "../types/savedPassage";

type SavedPassageControlsProps = {
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onRemovePassage: (passageId: string) => void;
  onReset: () => void;
  onSelectSavedPassage: (passageId: string) => void;
};

/**
 * Controls for choosing and removing passages the user saved locally.
 */
export function SavedPassageControls({
  savedPassages,
  selectedSavedPassageId,
  onRemovePassage,
  onReset,
  onSelectSavedPassage,
}: SavedPassageControlsProps) {
  const hasSavedPassages = savedPassages.length > 0;

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="grid gap-1 sm:min-w-80">
          <span className="text-sm font-medium text-slate-600">Saved Passage</span>
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-500"
            disabled={!hasSavedPassages}
            value={selectedSavedPassageId}
            onChange={(event) => onSelectSavedPassage(event.target.value)}
          >
            {hasSavedPassages ? (
              savedPassages.map((passage) => (
                <option key={passage.id} value={passage.id}>
                  {passage.reference} ({passage.translationAbbreviation})
                </option>
              ))
            ) : (
              <option value="">No saved passages yet</option>
            )}
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
            disabled={!selectedSavedPassageId}
            type="button"
            onClick={() => onRemovePassage(selectedSavedPassageId)}
          >
            Remove
          </button>
          <button
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={!hasSavedPassages}
            type="button"
            onClick={onReset}
          >
            Reset Saved
          </button>
        </div>
      </div>
    </section>
  );
}
