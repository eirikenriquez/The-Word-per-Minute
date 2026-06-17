type FeaturedSaveActionProps = {
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  onSaveCurrentPassage: () => void;
};

/**
 * Saves the currently displayed featured passage into the user's local library.
 */
export function FeaturedSaveAction({
  canSaveCurrentPassage,
  isCurrentPassageSaved,
  onSaveCurrentPassage,
}: FeaturedSaveActionProps) {
  return (
    <button
      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950 dark:hover:text-blue-200 dark:disabled:border-slate-800 dark:disabled:text-slate-600"
      disabled={!canSaveCurrentPassage || isCurrentPassageSaved}
      type="button"
      onClick={onSaveCurrentPassage}
    >
      {isCurrentPassageSaved ? "Saved" : "Save Passage"}
    </button>
  );
}
