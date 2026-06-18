import { useEffect, useState } from "react";
import { DEFAULT_SAVED_CATEGORY } from "../constants/savedPassageCategories";
import type { AppMode } from "../../../types/app";
import type { SavePassageInput } from "../../../types/savedPassage";

type UseSavePassageFormParams = {
  appMode: AppMode;
  isPassageSaved: (input: SavePassageInput | null) => boolean;
  saveInput: SavePassageInput | null;
  savePassage: (input: SavePassageInput) => unknown;
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

  function saveCurrentPassage() {
    if (!saveInput) return;

    const passageToSave =
      appMode === "bible"
        ? {
            ...saveInput,
            category: saveCategory,
            title: saveTitle.trim() || saveInput.title,
          }
        : saveInput;

    savePassage(passageToSave);
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
