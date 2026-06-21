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
    <div className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">Find a passage</h2>
        <p className="mt-1 text-sm text-ink-subtle">
          Search or narrow your saved library.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <label className="grid gap-1">
          <span className="text-sm font-medium text-ink-muted">Search</span>
          <input
            className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-subtle focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-surface-muted disabled:text-ink-subtle dark:focus:ring-blue-950"
            disabled={!hasSavedPassages}
            placeholder="Search title, reference, category, or book"
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
          />
        </label>
        <p className="text-sm font-medium text-ink-subtle lg:text-right">
          {resultSummary}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[14rem_14rem]">
        <label className="grid gap-1 sm:w-56">
          <span className="text-sm font-medium text-ink-muted">Category</span>
          <select
            className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-surface-muted disabled:text-ink-subtle dark:focus:ring-blue-950"
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
          <span className="text-sm font-medium text-ink-muted">Source</span>
          <select
            className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-surface-muted disabled:text-ink-subtle dark:focus:ring-blue-950"
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
