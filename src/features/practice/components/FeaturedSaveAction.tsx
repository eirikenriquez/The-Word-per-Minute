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
      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
      disabled={!canSaveCurrentPassage || isCurrentPassageSaved}
      type="button"
      onClick={onSaveCurrentPassage}
    >
      {isCurrentPassageSaved ? "Saved" : "Save Passage"}
    </button>
  );
}
