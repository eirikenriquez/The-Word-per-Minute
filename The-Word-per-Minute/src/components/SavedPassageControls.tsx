import { useMemo, useState } from "react";
import type { SavedPassage, SavedPassageUpdate } from "../types/savedPassage";

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
  const hasSavedPassages = savedPassages.length > 0;
  const categories = useMemo(() => {
    const savedCategories = savedPassages.map((passage) => passage.category || "Other");
    return ["All", ...new Set(savedCategories)];
  }, [savedPassages]);
  const editableCategories = useMemo(() => categories.filter((category) => category !== "All"), [categories]);
  const visiblePassages =
    selectedCategory === "All"
      ? savedPassages
      : savedPassages.filter((passage) => passage.category === selectedCategory);

  return (
    <section className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="grid gap-1 sm:w-56">
            <span className="text-sm font-medium text-slate-600">Category</span>
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-500"
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
        </div>

        {!hasSavedPassages ? (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
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
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No saved passages in this category yet.
          </div>
        )}
      </div>
    </section>
  );
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

  return (
    <article
      className={`rounded-md border p-4 transition ${
        isSelected ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="grid flex-1 gap-3">
          {isEditing ? (
            <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-600">Title</span>
                <input
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-600">Category</span>
                <select
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
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
              <div>
                <h3 className="font-semibold text-slate-900">{passage.title}</h3>
                <p className="mt-1 text-sm font-medium text-slate-600">{passage.reference}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">{passage.category}</span>
                <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">
                  {passage.translationAbbreviation}
                </span>
                <span className="rounded bg-slate-100 px-2 py-1 text-slate-700">
                  {passage.source === "featured" ? "Featured" : "Bible"}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <button
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                type="button"
                onClick={saveEdits}
              >
                Save
              </button>
              <button
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                type="button"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                type="button"
                onClick={() => onSelectSavedPassage(passage.id)}
              >
                {isSelected ? "Practicing" : "Practice"}
              </button>
              <button
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                type="button"
                onClick={startEditing}
              >
                Edit
              </button>
              <button
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
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
