import { useMemo, useState } from "react";
import type { SavedPassage, SavedPassageUpdate } from "../../../types/savedPassage";

type SourceFilter = "all" | "featured" | "saved";

type SavedPassageControlsProps = {
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onRemovePassage: (passageId: string) => void;
  onSelectSavedPassage: (passageId: string) => void;
  onUpdatePassage: (passageId: string, update: SavedPassageUpdate) => SavedPassage | null;
};

/**
 * Saved passage library.
 * Groups the user's local passages into a scannable list so Saved can grow beyond a single dropdown.
 */
export function SavedPassageControls({
  savedPassages,
  selectedSavedPassageId,
  onRemovePassage,
  onSelectSavedPassage,
  onUpdatePassage,
}: SavedPassageControlsProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSource, setSelectedSource] = useState<SourceFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const hasSavedPassages = savedPassages.length > 0;
  const categories = useMemo(() => {
    const savedCategories = savedPassages.map((passage) => passage.category || "Other");
    return ["All", ...new Set(savedCategories)];
  }, [savedPassages]);
  const editableCategories = useMemo(() => categories.filter((category) => category !== "All"), [categories]);
  const visiblePassages = useMemo(
    () =>
      savedPassages.filter(
        (passage) =>
          matchesSelectedCategory(passage, selectedCategory) &&
          matchesSelectedSource(passage, selectedSource) &&
          matchesSearchTerm(passage, searchTerm),
      ),
    [savedPassages, searchTerm, selectedCategory, selectedSource],
  );
  const resultSummary = hasSavedPassages
    ? `${visiblePassages.length} of ${savedPassages.length} passage${savedPassages.length === 1 ? "" : "s"}`
    : "0 passages";

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Search</span>
            <input
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-950 dark:disabled:bg-slate-900/60"
              disabled={!hasSavedPassages}
              placeholder="Search title, reference, category, or book"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <p className="text-sm font-medium text-slate-500 lg:text-right dark:text-slate-400">{resultSummary}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[14rem_14rem]">
          <label className="grid gap-1 sm:w-56">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Category</span>
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950 dark:disabled:bg-slate-900/60"
              disabled={!hasSavedPassages}
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
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
              onChange={(event) => setSelectedSource(event.target.value as SourceFilter)}
            >
              <option value="all">All sources</option>
              <option value="featured">Featured</option>
              <option value="saved">Saved</option>
            </select>
          </label>
        </div>
      </div>

      {!hasSavedPassages ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Saved passages will appear here after you save one from Featured or Bible.
        </div>
      ) : visiblePassages.length ? (
        <div className="grid gap-3">
          {visiblePassages.map((passage) => (
            <SavedPassageCard
              isSelected={passage.id === selectedSavedPassageId}
              key={passage.id}
              passage={passage}
              onRemovePassage={onRemovePassage}
              onSelectSavedPassage={onSelectSavedPassage}
              onUpdatePassage={onUpdatePassage}
              savedCategories={editableCategories}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          No saved passages match those filters yet.
        </div>
      )}
    </section>
  );
}

function matchesSelectedCategory(passage: SavedPassage, selectedCategory: string) {
  return selectedCategory === "All" || passage.category === selectedCategory;
}

function matchesSelectedSource(passage: SavedPassage, selectedSource: SourceFilter) {
  if (selectedSource === "all") return true;
  if (selectedSource === "saved") return passage.source !== "featured";

  return passage.source === selectedSource;
}

function matchesSearchTerm(passage: SavedPassage, searchTerm: string) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  if (!normalizedSearchTerm) return true;

  return [passage.title, passage.reference, passage.category, passage.bookName, passage.translationAbbreviation]
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearchTerm);
}

type SavedPassageCardProps = {
  isSelected: boolean;
  passage: SavedPassage;
  onRemovePassage: (passageId: string) => void;
  onSelectSavedPassage: (passageId: string) => void;
  onUpdatePassage: (passageId: string, update: SavedPassageUpdate) => SavedPassage | null;
  savedCategories: string[];
};

/**
 * Compact card for one saved passage, keeping practice and remove actions close to the passage metadata.
 */
function SavedPassageCard({
  isSelected,
  passage,
  onRemovePassage,
  onSelectSavedPassage,
  onUpdatePassage,
  savedCategories,
}: SavedPassageCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(passage.title);
  const [draftCategory, setDraftCategory] = useState(passage.category);

  function startEditing() {
    setDraftTitle(passage.title);
    setDraftCategory(passage.category);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftTitle(passage.title);
    setDraftCategory(passage.category);
    setIsEditing(false);
  }

  function saveEdits() {
    const nextTitle = draftTitle.trim() || passage.title;
    const nextCategory = draftCategory || passage.category;
    const updatedPassage = onUpdatePassage(passage.id, {
      title: nextTitle,
      category: nextCategory,
    });

    if (updatedPassage) setIsEditing(false);
  }

  const sourceLabel = getSourceLabel(passage);
  const savedDateLabel = getSavedDateLabel(passage.createdAt);

  return (
    <article
      className={`rounded-md border p-4 transition ${
        isSelected
          ? "border-blue-700 bg-blue-950/60"
          : "border-slate-200 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
      }`}
    >
      <div className="grid gap-4">
        <div className="grid flex-1 gap-3">
          {isEditing ? (
            <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Title</span>
                <input
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Category</span>
                <select
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  value={draftCategory}
                  onChange={(event) => setDraftCategory(event.target.value)}
                >
                  {savedCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{passage.title}</h3>
                    {isSelected && (
                      <span className="rounded bg-blue-700 px-2 py-1 text-xs font-semibold text-white dark:bg-blue-600">
                        Practicing
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{passage.reference}</p>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{savedDateLabel}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{passage.category}</span>
                <span className="rounded bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {passage.translationAbbreviation}
                </span>
                <span className="rounded bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{sourceLabel}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-3 sm:justify-end dark:border-slate-800">
          {isEditing ? (
            <>
              <button
                className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                type="button"
                onClick={saveEdits}
              >
                Save
              </button>
              <button
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                type="button"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-default disabled:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500 dark:disabled:bg-blue-900"
                disabled={isSelected}
                type="button"
                onClick={() => onSelectSavedPassage(passage.id)}
              >
                Practice
              </button>
              <button
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                type="button"
                onClick={startEditing}
              >
                Edit
              </button>
              <button
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                type="button"
                onClick={() => onRemovePassage(passage.id)}
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function getSourceLabel(passage: SavedPassage) {
  return passage.source === "featured" ? "Featured" : "Saved";
}

function getSavedDateLabel(createdAt: string) {
  const savedDate = new Date(createdAt);
  if (Number.isNaN(savedDate.getTime())) return "Saved";

  return `Saved ${savedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}
