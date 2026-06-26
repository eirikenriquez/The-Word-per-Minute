import type { AppMode } from "../../shared/types/app";
import { PassageSaveControls } from "./PassageSaveControls";

export type AppHeaderProps = {
  appMode: AppMode;
  canSaveCurrentPassage: boolean;
  isCurrentPassageSaved: boolean;
  headerReference: string;
  headerSubtitle: string;
  headerTitle: string;
  saveCategory: string;
  savedPassageCategories: string[];
  saveTitle: string;
  onSaveCategoryChange: (category: string) => void;
  onSaveCurrentPassage: () => void;
  onSaveTitleChange: (title: string) => void;
};

/**
 * Displays the current page title and contextual passage-save controls.
 */
export function AppHeader({
  appMode,
  canSaveCurrentPassage,
  headerReference,
  headerSubtitle,
  headerTitle,
  isCurrentPassageSaved,
  saveCategory,
  savedPassageCategories,
  saveTitle,
  onSaveCategoryChange,
  onSaveCurrentPassage,
  onSaveTitleChange,
}: AppHeaderProps) {
  const showSaveControls = appMode === "bible";

  return (
    <section className="border-b border-line pb-5">
      <div className="min-w-0">
        <p className="text-sm font-semibold uppercase text-ink-subtle">
          {headerSubtitle}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-ink">
          {headerTitle}
        </h2>
        {headerReference && (
          <p className="mt-2 w-fit rounded-md bg-accent-soft px-2.5 py-1 text-sm font-semibold text-accent-ink ring-1 ring-accent-line">
            {headerReference}
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
