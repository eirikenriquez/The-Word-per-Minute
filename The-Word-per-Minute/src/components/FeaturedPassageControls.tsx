type FeaturedPassageControlsProps = {
  isSavedPractice: boolean;
  onNextPassage: () => void;
  onReset: () => void;
};

/**
 * Controls for the default TypeRacer-style flow.
 * The user gets a curated prompt without seeing the small source list.
 */
export function FeaturedPassageControls({
  isSavedPractice,
  onNextPassage,
  onReset,
}: FeaturedPassageControlsProps) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {!isSavedPractice && (
          <button
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            type="button"
            onClick={onNextPassage}
          >
            Next Passage
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
    </section>
  );
}
