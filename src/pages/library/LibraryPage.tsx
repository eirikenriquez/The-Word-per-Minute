import { SavedPassageLibrary } from "./components/SavedPassageLibrary";
import type { SavedPassage, SavedPassageUpdate } from "../../shared/types/savedPassage";

export type LibraryPageProps = {
  errorMessage: string | null;
  savedPassages: SavedPassage[];
  onPracticeSavedPassage: (passageId: string) => void;
  onReadSavedPassage: (passageId: string) => void;
  onRemoveSavedPassage: (passageId: string) => void | Promise<void>;
  onUpdateSavedPassage: (passageId: string, update: SavedPassageUpdate) => SavedPassage | null | Promise<SavedPassage | null>;
};

/**
 * Saved passage library page for editing, deleting, and launching saved practice passages.
 */
export function LibraryPage({
  errorMessage,
  savedPassages,
  onPracticeSavedPassage,
  onReadSavedPassage,
  onRemoveSavedPassage,
  onUpdateSavedPassage,
}: LibraryPageProps) {
  return (
    <div className="grid gap-4">
      {errorMessage && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {errorMessage}
        </p>
      )}

      <SavedPassageLibrary
        savedPassages={savedPassages}
        onPracticePassage={onPracticeSavedPassage}
        onReadPassage={onReadSavedPassage}
        onRemovePassage={onRemoveSavedPassage}
        onUpdatePassage={onUpdateSavedPassage}
      />
    </div>
  );
}
