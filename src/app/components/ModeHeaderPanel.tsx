import type { AppMode } from "../../types/appMode";

type ModeHeaderPanelProps = {
  appMode: AppMode;
  canSaveCurrentPassage: boolean;
  hasSavedPassages: boolean;
  isCurrentPassageSaved: boolean;
  practiceReference: string;
  practiceSubtitle: string;
  practiceTitle: string;
  saveCategory: string;
  savedPassageCategories: string[];
  saveTitle: string;
  showPracticeSave: boolean;
  onSaveCategoryChange: (category: string) => void;
  onSaveCurrentPassage: () => void;
  onSaveTitleChange: (title: string) => void;
  onSelectMode: (mode: AppMode) => void;
};

/**
 * Top mode summary, navigation, and contextual save controls.
 * Keeping this outside App makes the main coordinator easier to scan.
 */
export function ModeHeaderPanel({
  appMode,
  canSaveCurrentPassage,
  hasSavedPassages,
  isCurrentPassageSaved,
  practiceReference,
  practiceSubtitle,
  practiceTitle,
  saveCategory,
  savedPassageCategories,
  saveTitle,
  showPracticeSave,
  onSaveCategoryChange,
  onSaveCurrentPassage,
  onSaveTitleChange,
  onSelectMode,
}: ModeHeaderPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase text-slate-500">{practiceSubtitle}</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">{practiceTitle}</h2>
          {practiceReference && (
            <p className="mt-2 w-fit rounded-md bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-900 ring-1 ring-amber-200">
              {practiceReference}
            </p>
          )}
        </div>

        <div className="grid grid-cols-4 rounded-md border border-slate-300 bg-slate-100 p-1 text-sm sm:flex">
          <ModeButton isSelected={appMode === "home"} label="Home" onSelect={() => onSelectMode("home")} />
          <ModeButton
            isSelected={appMode === "practice"}
            label="Practice"
            onSelect={() => onSelectMode("practice")}
          />
          <ModeButton isSelected={appMode === "bible"} label="Bible" onSelect={() => onSelectMode("bible")} />
          <ModeButton
            disabled={!hasSavedPassages}
            isSelected={appMode === "library"}
            label="Library"
            onSelect={() => onSelectMode("library")}
          />
        </div>
      </div>

      {showPracticeSave && (
        <div className="mt-4 flex justify-end border-t border-slate-200 pt-4">
          <SaveButton
            disabled={!canSaveCurrentPassage || isCurrentPassageSaved}
            isSaved={isCurrentPassageSaved}
            onSave={onSaveCurrentPassage}
          />
        </div>
      )}

      {appMode === "bible" && (
        <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">Saved Title</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="Name this saved passage"
              value={saveTitle}
              onChange={(event) => onSaveTitleChange(event.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-600">Category</span>
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
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
          <SaveButton
            disabled={!canSaveCurrentPassage || isCurrentPassageSaved}
            isSaved={isCurrentPassageSaved}
            onSave={onSaveCurrentPassage}
          />
        </div>
      )}
    </section>
  );
}

type ModeButtonProps = {
  disabled?: boolean;
  isSelected: boolean;
  label: string;
  onSelect: () => void;
};

function ModeButton({ disabled = false, isSelected, label, onSelect }: ModeButtonProps) {
  return (
    <button
      className={`rounded px-3 py-1.5 font-medium ${
        isSelected ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
      } disabled:cursor-not-allowed disabled:text-slate-400`}
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      {label}
    </button>
  );
}

type SaveButtonProps = {
  disabled: boolean;
  isSaved: boolean;
  onSave: () => void;
};

function SaveButton({ disabled, isSaved, onSave }: SaveButtonProps) {
  return (
    <button
      className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      disabled={disabled}
      type="button"
      onClick={onSave}
    >
      {isSaved ? "Saved" : "Save Passage"}
    </button>
  );
}
