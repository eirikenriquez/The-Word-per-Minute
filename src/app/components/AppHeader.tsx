import type { AppMode } from "../../types/appMode";
import { PassageSaveControls } from "./PassageSaveControls";

export type AppHeaderProps = {
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
 * Displays the current page title and contextual passage-save controls.
 */
export function AppHeader({
  appMode,
  canSaveCurrentPassage,
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
}: AppHeaderProps) {
  const showSaveControls = showPracticeSave || appMode === "bible";

  return (
    <section className="border-b border-slate-200 pb-5 dark:border-slate-800">
      <div className="min-w-0">
        <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
          {practiceSubtitle}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-slate-100">
          {practiceTitle}
        </h2>
        {practiceReference && (
          <p className="mt-2 w-fit rounded-md bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-800 ring-1 ring-blue-100 dark:bg-blue-950 dark:text-blue-200 dark:ring-blue-900">
            {practiceReference}
          </p>
        )}
      </div>

      {showSaveControls && (
        <PassageSaveControls
          canSaveCurrentPassage={canSaveCurrentPassage}
          isCurrentPassageSaved={isCurrentPassageSaved}
          saveCategory={saveCategory}
          savedPassageCategories={savedPassageCategories}
          saveTitle={saveTitle}
          showFields={appMode === "bible"}
          onSaveCategoryChange={onSaveCategoryChange}
          onSaveCurrentPassage={onSaveCurrentPassage}
          onSaveTitleChange={onSaveTitleChange}
        />
      )}
    </section>
  );
}
