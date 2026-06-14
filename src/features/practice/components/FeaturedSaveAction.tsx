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
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={!canSaveCurrentPassage || isCurrentPassageSaved}
        type="button"
        onClick={onSaveCurrentPassage}
      >
        {isCurrentPassageSaved ? "Saved" : "Save Passage"}
      </button>
      <span className="text-xs text-slate-500">
        {isCurrentPassageSaved ? "This featured passage is in your library." : "Add this passage to your library."}
      </span>
    </div>
  );
}
