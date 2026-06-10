import type { FeaturedPassage } from "../types/featuredPassage";

type FeaturedPassageControlsProps = {
  passages: FeaturedPassage[];
  selectedPassageId: string;
  onNextPassage: () => void;
  onReset: () => void;
  onSelectPassage: (passageId: string) => void;
};

export function FeaturedPassageControls({
  passages,
  selectedPassageId,
  onNextPassage,
  onReset,
  onSelectPassage,
}: FeaturedPassageControlsProps) {
  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="grid gap-1 sm:min-w-80">
          <span className="text-sm font-medium text-slate-600">Featured Passage</span>
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            value={selectedPassageId}
            onChange={(event) => onSelectPassage(event.target.value)}
          >
            {passages.map((passage) => (
              <option key={passage.id} value={passage.id}>
                {passage.title} ({passage.theme})
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            type="button"
            onClick={onNextPassage}
          >
            Next Passage
          </button>
          <button
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            type="button"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
