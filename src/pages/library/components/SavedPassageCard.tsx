import { Transition } from "@headlessui/react";
import {
  BookOpenIcon,
  BookmarkIcon,
  CheckIcon,
  PencilSquareIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  type ReactNode,
  useState,
} from "react";
import type { SavedPassage, SavedPassageUpdate } from "../../../shared/types/savedPassage";
import { Button } from "../../../shared/ui/Button";

type SavedPassageCardProps = {
  isSelected: boolean;
  passage: SavedPassage;
  savedCategories: string[];
  onReadPassage: (passageId: string) => void;
  onRemovePassage: (passageId: string) => void | Promise<void>;
  onSelectSavedPassage: (passageId: string) => void;
  onUpdatePassage: (passageId: string, update: SavedPassageUpdate) => SavedPassage | null | Promise<SavedPassage | null>;
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
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
  const [draftTitle, setDraftTitle] = useState(passage.title);
  const [draftCategory, setDraftCategory] = useState(passage.category);

  function startEditing() {
    setIsConfirmingRemove(false);
    setDraftTitle(passage.title);
    setDraftCategory(passage.category);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftTitle(passage.title);
    setDraftCategory(passage.category);
    setIsEditing(false);
  }

  function confirmRemove() {
    void onRemovePassage(passage.id);
  }

  async function saveEdits() {
    const updatedPassage = await onUpdatePassage(passage.id, {
      title: draftTitle.trim() || passage.title,
      category: draftCategory || passage.category,
    });

    if (updatedPassage) setIsEditing(false);
  }

  return (
    <article
      className={`rounded-md border p-5 transition ${
        isSelected
          ? "border-accent-line bg-surface ring-1 ring-accent-line"
          : "border-line bg-surface hover:border-line-strong"
      }`}
    >
      <div className="grid gap-5">
        <div className="grid min-h-20 flex-1 gap-3">
          <AnimatedCardState
            className="col-start-1 row-start-1 grid gap-3 sm:grid-cols-[1fr_12rem]"
            show={isEditing}
          >
            <label className="grid gap-1">
              <span className="text-sm font-medium text-ink-muted">Title</span>
              <input
                className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-ink-muted">Category</span>
              <select
                className="rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
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
          </AnimatedCardState>

          <AnimatedCardState
            className="col-start-1 row-start-1"
            show={!isEditing}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-ink">
                    {passage.title}
                  </h3>
                  {isSelected && (
                    <span className="rounded bg-selected px-2 py-1 text-xs font-semibold text-selected-ink">
                      Practicing
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-semibold text-ink-muted">
                  {passage.reference}
                </p>
              </div>
              <p className="text-xs text-ink-subtle">
                {getSavedDateLabel(passage.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-subtle">
              <span>{passage.category}</span>
              <MetadataDivider />
              <span>{passage.translationAbbreviation}</span>
              <MetadataDivider />
              <span>{getSourceLabel(passage)}</span>
            </div>
          </AnimatedCardState>
        </div>

        <div className="grid min-h-14 border-t border-line pt-4">
          <AnimatedCardState
            className="col-start-1 row-start-1 flex flex-wrap gap-2 sm:justify-end"
            show={isEditing}
          >
            <Button
              variant="primary"
              onClick={saveEdits}
            >
              <BookmarkIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
              Save
            </Button>
            <Button
              onClick={cancelEditing}
            >
              Cancel
            </Button>
          </AnimatedCardState>

          <AnimatedCardState
            className="col-start-1 row-start-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end"
            show={!isEditing && isConfirmingRemove}
          >
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              Remove this saved passage?
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setIsConfirmingRemove(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmRemove}
              >
                <TrashIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                Remove
              </Button>
            </div>
          </AnimatedCardState>

          <AnimatedCardState
            className="col-start-1 row-start-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            show={!isEditing && !isConfirmingRemove}
          >
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => onReadPassage(passage.id)}>
                <BookOpenIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                Read in Bible
              </Button>
              <Button
                disabled={isSelected}
                variant="primary"
                onClick={() => onSelectSavedPassage(passage.id)}
              >
                {isSelected ? (
                  <CheckIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                ) : (
                  <PlayIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                )}
                {isSelected ? "Practicing" : "Practice"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                onClick={startEditing}
              >
                <PencilSquareIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => setIsConfirmingRemove(true)}
              >
                <TrashIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                Remove
              </Button>
            </div>
          </AnimatedCardState>
        </div>
      </div>
    </article>
  );
}

function AnimatedCardState({
  children,
  className,
  show,
}: {
  children: ReactNode;
  className: string;
  show: boolean;
}) {
  return (
    <Transition
      as="div"
      className={className}
      enter="transition duration-200 ease-out"
      enterFrom="translate-y-1 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition duration-100 ease-in"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="-translate-y-1 opacity-0"
      show={show}
    >
      {children}
    </Transition>
  );
}

function MetadataDivider() {
  return <span aria-hidden="true">&middot;</span>;
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
