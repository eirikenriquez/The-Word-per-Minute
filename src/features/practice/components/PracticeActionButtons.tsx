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
    <>
      {practiceSource === "featured" ? (
        <button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          type="button"
          onClick={onNextFeaturedPassage}
        >
          Next Passage
        </button>
      ) : (
        <button
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          type="button"
          onClick={onOpenLibrary}
        >
          Manage Library
        </button>
      )}
      <button
        className="rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
        type="button"
        onClick={onReset}
      >
        Reset
      </button>
    </>
  );
}
