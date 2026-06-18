export type SavedPassageSourceFilter = "all" | "featured" | "saved";

type SavedPassageFiltersProps = {
  categories: string[];
  hasSavedPassages: boolean;
  resultSummary: string;
  searchTerm: string;
  selectedCategory: string;
  selectedSource: SavedPassageSourceFilter;
  onSearchTermChange: (searchTerm: string) => void;
  onSelectedCategoryChange: (category: string) => void;
  onSelectedSourceChange: (source: SavedPassageSourceFilter) => void;
};

/**
 * Search and filter toolbar for the saved passage library.
 */
export function SavedPassageFilters({
  categories,
  hasSavedPassages,
  resultSummary,
  searchTerm,
  selectedCategory,
  selectedSource,
  onSearchTermChange,
  onSelectedCategoryChange,
  onSelectedSourceChange,
}: SavedPassageFiltersProps) {
  return (
    <div className="grid gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Search</span>
          <input
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-950 dark:disabled:bg-slate-900/60"
            disabled={!hasSavedPassages}
            placeholder="Search title, reference, category, or book"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
          />
        </label>
        <p className="text-sm font-medium text-slate-500 lg:text-right dark:text-slate-400">
          {resultSummary}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[14rem_14rem]">
        <label className="grid gap-1 sm:w-56">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Category</span>
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950 dark:disabled:bg-slate-900/60"
            disabled={!hasSavedPassages}
            value={selectedCategory}
            onChange={(event) => onSelectedCategoryChange(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 sm:w-56">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Source</span>
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950 dark:disabled:bg-slate-900/60"
            disabled={!hasSavedPassages}
            value={selectedSource}
            onChange={(event) =>
              onSelectedSourceChange(event.target.value as SavedPassageSourceFilter)
            }
          >
            <option value="all">All sources</option>
            <option value="featured">Featured</option>
            <option value="saved">Saved</option>
          </select>
        </label>
      </div>
    </div>
  );
}
