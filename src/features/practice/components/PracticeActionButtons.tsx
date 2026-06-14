type PracticeSource = "featured" | "saved";

type PracticeActionButtonsProps = {
  practiceSource: PracticeSource;
  onNextFeaturedPassage: () => void;
  onOpenLibrary: () => void;
  onReset: () => void;
};

/**
 * Secondary actions for the active Practice source.
 */
export function PracticeActionButtons({
  practiceSource,
  onNextFeaturedPassage,
  onOpenLibrary,
  onReset,
}: PracticeActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 lg:justify-end">
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
  );
}
