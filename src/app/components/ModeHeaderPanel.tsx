import { HeaderTitleBlock } from "./HeaderTitleBlock";
import { PassageSaveControls } from "./PassageSaveControls";
import type { AppMode } from "../../types/appMode";

type ModeHeaderPanelProps = {
  appMode: AppMode;
  canSaveCurrentPassage: boolean;
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
};

/**
 * Open page title area with contextual save controls.
 * Navigation lives in the global shell so this section does not feel like a floating card.
 */
export function ModeHeaderPanel({
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
}: ModeHeaderPanelProps) {
  return (
    <section className="border-b border-slate-200 pb-5">
      <HeaderTitleBlock reference={practiceReference} subtitle={practiceSubtitle} title={practiceTitle} />

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
