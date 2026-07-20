import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { Button } from "../../../shared/ui/Button";

export type BibleSaveFormProps = {
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  isSavingCurrentPassage: boolean;
  saveError: string | null;
  saveCategory: string;
  savedPassageCategories: string[];
  saveTitle: string;
  onSaveCategoryChange: (category: string) => void;
  onSaveCurrentPassage: () => Promise<boolean>;
  onSaveTitleChange: (title: string) => void;
};

type BibleSaveDockProps = BibleSaveFormProps & {
  passageReference: string;
  selectedVerseCount: number;
  onClearSelection: () => void;
};

/**
 * Keeps the current Bible save target and actions available while reading.
 */
export function BibleSaveDock({
  canSaveCurrentPassage,
  isCurrentPassageSaved,
  isSavingCurrentPassage,
  passageReference,
  saveError,
  saveCategory,
  savedPassageCategories,
  saveTitle,
  selectedVerseCount,
  onClearSelection,
  onSaveCategoryChange,
  onSaveCurrentPassage,
  onSaveTitleChange,
}: BibleSaveDockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const hasSelectedVerses = selectedVerseCount > 0;
  const saveActionLabel = hasSelectedVerses ? "Save Selection" : "Save Chapter";

  async function savePassage() {
    const didSave = await onSaveCurrentPassage();
    if (didSave) setIsOpen(false);
  }

  return (
    <section
      aria-label="Bible passage save actions"
      className="sticky top-[11.4rem] z-30 bg-canvas sm:top-[8.4rem] lg:top-[4.8rem]"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 border-y border-line py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-ink">{passageReference}</h2>
          <p aria-live="polite" className="mt-0.5 text-sm text-ink-subtle">
            {hasSelectedVerses
              ? `${selectedVerseCount} ${selectedVerseCount === 1 ? "verse" : "verses"} selected`
              : "Whole chapter"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasSelectedVerses && (
            <Button variant="ghost" onClick={onClearSelection}>
              Clear Selection
            </Button>
          )}
          <SaveButton
            disabled={!canSaveCurrentPassage || isCurrentPassageSaved || isSavingCurrentPassage}
            isSaved={isCurrentPassageSaved}
            isSaving={isSavingCurrentPassage}
            label={saveActionLabel}
            onSave={() => setIsOpen(true)}
          />
        </div>
      </div>

      <Dialog
        className="fixed inset-0 z-50 grid place-items-center px-4 py-6"
        initialFocus={titleInputRef}
        open={isOpen}
        onClose={setIsOpen}
      >
        <DialogPanel
          transition
          className="grid w-full max-w-lg gap-5 rounded-xl border border-line bg-surface p-5 text-left shadow-2xl transition duration-150 ease-out data-closed:translate-y-1 data-closed:scale-[0.98] data-closed:opacity-0 data-enter:duration-150 data-leave:duration-100 data-leave:ease-in motion-reduce:transform-none motion-reduce:transition-none"
        >
          <div className="grid gap-1">
            <DialogTitle className="text-lg font-semibold text-ink">
              {hasSelectedVerses ? "Save selected verses" : "Save Bible chapter"}
            </DialogTitle>
            <p className="text-sm text-ink-muted">
              Review the title and category before adding this passage to your library.
            </p>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-ink-muted">Saved Title</span>
              <input
                className="rounded-md border border-line-strong bg-canvas px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft"
                placeholder="Name this saved passage"
                ref={titleInputRef}
                value={saveTitle}
                onChange={(event) => onSaveTitleChange(event.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-ink-muted">Category</span>
              <select
                className="rounded-md border border-line-strong bg-canvas px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
                value={saveCategory}
                onChange={(event) => onSaveCategoryChange(event.target.value)}
              >
                {savedPassageCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {saveError && (
            <p className="text-sm text-red-700 dark:text-red-300" role="alert">
              {saveError}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <SaveButton
              disabled={!canSaveCurrentPassage || isCurrentPassageSaved || isSavingCurrentPassage}
              isSaved={isCurrentPassageSaved}
              isSaving={isSavingCurrentPassage}
              label={saveActionLabel}
              onSave={savePassage}
            />
          </div>
        </DialogPanel>
      </Dialog>
    </section>
  );
}

type SaveButtonProps = {
  disabled: boolean;
  isSaved: boolean;
  isSaving: boolean;
  label: string;
  onSave: () => void | Promise<void>;
};

function SaveButton({ disabled, isSaved, isSaving, label, onSave }: SaveButtonProps) {
  return (
    <Button
      disabled={disabled}
      variant="primary"
      onClick={() => {
        void onSave();
      }}
    >
      <BookmarkIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
      {isSaving ? "Saving..." : isSaved ? "Saved" : label}
    </Button>
  );
}
