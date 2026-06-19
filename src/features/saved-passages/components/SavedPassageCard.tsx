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
      className={`rounded-md border p-4 transition ${
        isSelected
          ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/60"
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
                  <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {passage.reference}
                  </p>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {getSavedDateLabel(passage.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <MetadataTag>{passage.category}</MetadataTag>
                <MetadataTag>{passage.translationAbbreviation}</MetadataTag>
                <MetadataTag>{getSourceLabel(passage)}</MetadataTag>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-3 sm:justify-end dark:border-slate-800">
          {isEditing ? (
            <>
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
            </>
          ) : (
            <>
              <Button
                onClick={() => onReadPassage(passage.id)}
              >
                Read in Bible
              </Button>
              <Button
                disabled={isSelected}
                variant="primary"
                onClick={() => onSelectSavedPassage(passage.id)}
              >
                Practice
              </Button>
              <Button
                variant="ghost"
                onClick={startEditing}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                onClick={() => onRemovePassage(passage.id)}
              >
                Remove
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function MetadataTag({ children }: { children: string }) {
  return (
    <span className="rounded bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {children}
    </span>
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
