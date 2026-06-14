import type { SavedPassage } from "../../../types/savedPassage";

type SavedPassageSelectProps = {
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onSelectSavedPractice: (passageId: string) => void;
};

/**
 * Dropdown for choosing one saved passage when the Practice source is set to Saved.
 */
export function SavedPassageSelect({
  savedPassages,
  selectedSavedPassageId,
  onSelectSavedPractice,
}: SavedPassageSelectProps) {
  return (
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
  );
}
