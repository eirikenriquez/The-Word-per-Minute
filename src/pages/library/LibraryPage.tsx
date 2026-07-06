import { SavedPassageLibrary } from "./components/SavedPassageLibrary";
import type { SavedPassage, SavedPassageUpdate } from "../../shared/types/savedPassage";

export type LibraryPageProps = {
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onReadSavedPassage: (passageId: string) => void;
  onRemoveSavedPassage: (passageId: string) => void | Promise<void>;
  onSelectSavedPassage: (passageId: string) => void;
  onUpdateSavedPassage: (passageId: string, update: SavedPassageUpdate) => SavedPassage | null | Promise<SavedPassage | null>;
};

/**
 * Saved passage library page for editing, deleting, and launching saved practice passages.
 */
export function LibraryPage({
  savedPassages,
  selectedSavedPassageId,
  onReadSavedPassage,
  onRemoveSavedPassage,
  onSelectSavedPassage,
  onUpdateSavedPassage,
}: LibraryPageProps) {
  return (
    <SavedPassageLibrary
      savedPassages={savedPassages}
      selectedSavedPassageId={selectedSavedPassageId}
      onReadPassage={onReadSavedPassage}
      onRemovePassage={onRemoveSavedPassage}
      onSelectSavedPassage={onSelectSavedPassage}
      onUpdatePassage={onUpdateSavedPassage}
    />
  );
}
