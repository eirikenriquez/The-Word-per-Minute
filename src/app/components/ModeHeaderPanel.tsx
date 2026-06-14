import { AppNavigation } from "./AppNavigation";
import { HeaderTitleBlock } from "./HeaderTitleBlock";
import { PassageSaveControls } from "./PassageSaveControls";
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
        <HeaderTitleBlock reference={practiceReference} subtitle={practiceSubtitle} title={practiceTitle} />

        <AppNavigation appMode={appMode} hasSavedPassages={hasSavedPassages} onSelectMode={onSelectMode} />
      </div>

      {showPracticeSave && (
        <PassageSaveControls
          canSaveCurrentPassage={canSaveCurrentPassage}
          isCurrentPassageSaved={isCurrentPassageSaved}
          saveCategory={saveCategory}
          savedPassageCategories={savedPassageCategories}
          saveTitle={saveTitle}
          showFields={false}
          onSaveCategoryChange={onSaveCategoryChange}
          onSaveCurrentPassage={onSaveCurrentPassage}
          onSaveTitleChange={onSaveTitleChange}
        />
      )}

      {appMode === "bible" && (
        <PassageSaveControls
          canSaveCurrentPassage={canSaveCurrentPassage}
          isCurrentPassageSaved={isCurrentPassageSaved}
          saveCategory={saveCategory}
          savedPassageCategories={savedPassageCategories}
          saveTitle={saveTitle}
          showFields
          onSaveCategoryChange={onSaveCategoryChange}
          onSaveCurrentPassage={onSaveCurrentPassage}
          onSaveTitleChange={onSaveTitleChange}
        />
      )}
    </section>
  );
}
