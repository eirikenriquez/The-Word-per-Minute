import { useState } from "react";
import type { SavedPassage, SavedPassageUpdate } from "../../../types/savedPassage";
import { Button } from "../../../ui/Button";

type SavedPassageCardProps = {
  isSelected: boolean;
  passage: SavedPassage;
  savedCategories: string[];
  onReadPassage: (passageId: string) => void;
  onRemovePassage: (passageId: string) => void;
  onSelectSavedPassage: (passageId: string) => void;
  onUpdatePassage: (passageId: string, update: SavedPassageUpdate) => SavedPassage | null;
};

/**
 * Displays one saved passage and owns its local edit form state.
 */
export function SavedPassageCard({
  isSelected,
  passage,
  savedCategories,
  onReadPassage,
  onRemovePassage,
  onSelectSavedPassage,
  onUpdatePassage,
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
    const updatedPassage = onUpdatePassage(passage.id, {
      title: draftTitle.trim() || passage.title,
      category: draftCategory || passage.category,
    });

    if (updatedPassage) setIsEditing(false);
  }

  return (
    <article
      className={`rounded-md border p-5 transition ${
        isSelected
          ? "border-blue-300 bg-blue-50/50 ring-1 ring-blue-100 dark:border-blue-700 dark:bg-blue-950/30 dark:ring-blue-900"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
      }`}
    >
      <div className="grid gap-5">
        <div className="grid flex-1 gap-3">
          {isEditing ? (
            <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Title</span>
                <input
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Category</span>
                <select
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950"
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
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">
                      {passage.title}
                    </h3>
                    {isSelected && (
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Practicing
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {passage.reference}
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {getSavedDateLabel(passage.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span>{passage.category}</span>
                <MetadataDivider />
                <span>{passage.translationAbbreviation}</span>
                <MetadataDivider />
                <span>{getSourceLabel(passage)}</span>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          {isEditing ? (
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Button
                variant="primary"
                onClick={saveEdits}
              >
                Save
              </Button>
              <Button
                onClick={cancelEditing}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => onReadPassage(passage.id)}>Read in Bible</Button>
                <Button
                  disabled={isSelected}
                  variant="primary"
                  onClick={() => onSelectSavedPassage(passage.id)}
                >
                  {isSelected ? "Practicing" : "Practice"}
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="ghost"
                  onClick={startEditing}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onRemovePassage(passage.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function MetadataDivider() {
  return <span aria-hidden="true">·</span>;
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
