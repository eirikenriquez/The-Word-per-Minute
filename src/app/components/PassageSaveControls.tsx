import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../../shared/ui/Button";

type PassageSaveControlsProps = {
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  isSavingCurrentPassage: boolean;
  saveError: string | null;
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
  isSavingCurrentPassage,
  saveError,
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
      <div className="mt-4 flex justify-end border-t border-line pt-4">
        <SaveButton
          disabled={!canSaveCurrentPassage || isCurrentPassageSaved || isSavingCurrentPassage}
          isSaved={isCurrentPassageSaved}
          isSaving={isSavingCurrentPassage}
          onSave={onSaveCurrentPassage}
        />
        {saveError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-300">
            {saveError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
      <label className="grid gap-1">
        <span className="text-sm font-medium text-ink-muted">Saved Title</span>
        <input
          className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft"
          placeholder="Name this saved passage"
          value={saveTitle}
          onChange={(event) => onSaveTitleChange(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span className="text-sm font-medium text-ink-muted">Category</span>
        <select
          className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
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
        disabled={!canSaveCurrentPassage || isCurrentPassageSaved || isSavingCurrentPassage}
        isSaved={isCurrentPassageSaved}
        isSaving={isSavingCurrentPassage}
        onSave={onSaveCurrentPassage}
      />
      {saveError && (
        <p className="text-sm text-red-600 dark:text-red-300 sm:col-span-3">
          {saveError}
        </p>
      )}
    </div>
  );
}

type SaveButtonProps = {
  disabled: boolean;
  isSaved: boolean;
  isSaving: boolean;
  onSave: () => void | Promise<void>;
};

function SaveButton({ disabled, isSaved, isSaving, onSave }: SaveButtonProps) {
  return (
    <Button
      disabled={disabled}
      variant="primary"
      onClick={() => {
        void onSave();
      }}
    >
      <BookmarkIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
      {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Passage"}
    </Button>
  );
}
