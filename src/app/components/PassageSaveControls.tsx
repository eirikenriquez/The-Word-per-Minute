import { Button } from "../../ui/Button";

type PassageSaveControlsProps = {
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  saveCategory: string;
  savedPassageCategories: string[];
  saveTitle: string;
  showFields: boolean;
  onSaveCategoryChange: (category: string) => void;
  onSaveCurrentPassage: () => void;
  onSaveTitleChange: (title: string) => void;
};

/**
 * Header controls for saving the current featured or Bible-selected passage.
 */
export function PassageSaveControls({
  canSaveCurrentPassage,
  isCurrentPassageSaved,
  saveCategory,
  savedPassageCategories,
  saveTitle,
  showFields,
  onSaveCategoryChange,
  onSaveCurrentPassage,
  onSaveTitleChange,
}: PassageSaveControlsProps) {
  if (!showFields) {
    return (
      <div className="mt-4 flex justify-end border-t border-slate-200 pt-4 dark:border-slate-800">
        <SaveButton
          disabled={!canSaveCurrentPassage || isCurrentPassageSaved}
          isSaved={isCurrentPassageSaved}
          onSave={onSaveCurrentPassage}
        />
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-[1fr_12rem_auto] sm:items-end dark:border-slate-800">
      <label className="grid gap-1">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Saved Title</span>
        <input
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950"
          placeholder="Name this saved passage"
          value={saveTitle}
          onChange={(event) => onSaveTitleChange(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Category</span>
        <select
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950"
          value={saveCategory}
          onChange={(event) => onSaveCategoryChange(event.target.value)}
        >
          {savedPassageCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <SaveButton
        disabled={!canSaveCurrentPassage || isCurrentPassageSaved}
        isSaved={isCurrentPassageSaved}
        onSave={onSaveCurrentPassage}
      />
    </div>
  );
}

type SaveButtonProps = {
  disabled: boolean;
  isSaved: boolean;
  onSave: () => void;
};

function SaveButton({ disabled, isSaved, onSave }: SaveButtonProps) {
  return (
    <Button
      disabled={disabled}
      variant="primary"
      onClick={onSave}
    >
      {isSaved ? "Saved" : "Save Passage"}
    </Button>
  );
}
