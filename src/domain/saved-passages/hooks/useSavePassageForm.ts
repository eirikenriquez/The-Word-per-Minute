import { useEffect, useState } from "react";
import { DEFAULT_SAVED_CATEGORY } from "../savedPassageCategories";
import type { AppMode } from "../../../shared/types/app";
import type { SavedPassage, SavePassageInput } from "../../../shared/types/savedPassage";

type UseSavePassageFormParams = {
  appMode: AppMode;
  isPassageSaved: (input: SavePassageInput | null) => boolean;
  saveInput: SavePassageInput | null;
  savePassage: (input: SavePassageInput) => SavedPassage | null | Promise<SavedPassage | null>;
};

/**
 * Manages title/category form state for saving the current passage.
 * Featured passages keep their curated metadata; Bible selections can be renamed before saving.
 */
export function useSavePassageForm({
  appMode,
  isPassageSaved,
  saveInput,
  savePassage,
}: UseSavePassageFormParams) {
  const [saveTitle, setSaveTitle] = useState("");
  const [saveCategory, setSaveCategory] = useState(DEFAULT_SAVED_CATEGORY);
  const isCurrentPassageSaved = isPassageSaved(saveInput);

  useEffect(() => {
    if (!saveInput) return;

    setSaveTitle(saveInput.title);
    setSaveCategory(saveInput.category);
  }, [saveInput]);

  async function saveCurrentPassage() {
    if (!saveInput) return;

    const passageToSave =
      appMode === "bible"
        ? {
            ...saveInput,
            category: saveCategory,
            title: saveTitle.trim() || saveInput.title,
          }
        : saveInput;

    await savePassage(passageToSave);
  }

  return {
    isCurrentPassageSaved,
    saveCategory,
    saveCurrentPassage,
    saveTitle,
    setSaveCategory,
    setSaveTitle,
  };
}
