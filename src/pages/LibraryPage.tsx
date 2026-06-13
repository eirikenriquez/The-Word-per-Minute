import { SavedPassageControls } from "../features/saved-passages/components/SavedPassageControls";
import type { SavedPassage, SavedPassageUpdate } from "../types/savedPassage";

export type LibraryPageProps = {
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onRemoveSavedPassage: (passageId: string) => void;
  onSelectSavedPassage: (passageId: string) => void;
  onUpdateSavedPassage: (passageId: string, update: SavedPassageUpdate) => SavedPassage | null;
};

/**
 * Saved passage library page for editing, deleting, and launching saved practice passages.
 */
export function LibraryPage({
  savedPassages,
  selectedSavedPassageId,
  onRemoveSavedPassage,
  onSelectSavedPassage,
  onUpdateSavedPassage,
}: LibraryPageProps) {
  return (
    <SavedPassageControls
      savedPassages={savedPassages}
      selectedSavedPassageId={selectedSavedPassageId}
      onRemovePassage={onRemoveSavedPassage}
      onSelectSavedPassage={onSelectSavedPassage}
      onUpdatePassage={onUpdateSavedPassage}
    />
  );
}
