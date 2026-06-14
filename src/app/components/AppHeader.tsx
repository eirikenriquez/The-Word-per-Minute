import { ModeHeaderPanel } from "./ModeHeaderPanel";
import type { AppMode } from "../../types/appMode";

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
 * Wires app-level display and save state into the visible page title area.
 * Global navigation lives in PageShell so this component can stay focused on page context.
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
  return (
    <ModeHeaderPanel
      appMode={appMode}
      canSaveCurrentPassage={canSaveCurrentPassage}
      isCurrentPassageSaved={isCurrentPassageSaved}
      practiceReference={practiceReference}
      practiceSubtitle={practiceSubtitle}
      practiceTitle={practiceTitle}
      saveCategory={saveCategory}
      savedPassageCategories={savedPassageCategories}
      saveTitle={saveTitle}
      showPracticeSave={showPracticeSave}
      onSaveCategoryChange={onSaveCategoryChange}
      onSaveCurrentPassage={onSaveCurrentPassage}
      onSaveTitleChange={onSaveTitleChange}
    />
  );
}
