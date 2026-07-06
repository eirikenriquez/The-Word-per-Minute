import { DEFAULT_SAVED_CATEGORY } from "../savedPassageCategories";
import { getSavedPassageIdentity } from "../savedPassageIdentity";
import type { SavedPassage, SavePassageInput, SavedPassageUpdate } from "../../../shared/types/savedPassage";
import type { SavedPassageStore } from "./savedPassageStore";

const SAVED_PASSAGES_STORAGE_KEY = "the-word-per-minute-saved-passages";

/**
 * Browser-only saved passage storage for signed-out users.
 */
export const localSavedPassageStore: SavedPassageStore = {
  async list() {
    return listLocalSavedPassages();
  },

  async save(input: SavePassageInput) {
    const savedPassage = {
      ...input,
      id: getSavedPassageIdentity(input),
      createdAt: new Date().toISOString(),
    };
    const nextSavedPassages = [
      savedPassage,
      ...listLocalSavedPassages().filter((passage) => passage.id !== savedPassage.id),
    ];

    localStorage.setItem(SAVED_PASSAGES_STORAGE_KEY, JSON.stringify(nextSavedPassages));
    return savedPassage;
  },

  async update(passageId: string, update: SavedPassageUpdate) {
    const savedPassages = listLocalSavedPassages();
    const passageToUpdate = savedPassages.find((passage) => passage.id === passageId);

    if (!passageToUpdate) return null;

    const updatedPassage = {
      ...passageToUpdate,
      title: update.title,
      category: update.category,
    };
    const nextSavedPassages = savedPassages.map((passage) => {
      return passage.id === passageId ? updatedPassage : passage;
    });

    localStorage.setItem(SAVED_PASSAGES_STORAGE_KEY, JSON.stringify(nextSavedPassages));
    return updatedPassage;
  },

  async remove(passageId: string) {
    const nextSavedPassages = listLocalSavedPassages().filter((passage) => passage.id !== passageId);
    localStorage.setItem(SAVED_PASSAGES_STORAGE_KEY, JSON.stringify(nextSavedPassages));
  },
};

function listLocalSavedPassages(): SavedPassage[] {
  const savedPassages = localStorage.getItem(SAVED_PASSAGES_STORAGE_KEY);
  if (!savedPassages) return [];

  try {
    const parsedPassages = JSON.parse(savedPassages) as SavedPassage[];
    return parsedPassages.map((passage) => ({
      ...passage,
      category: passage.category ?? passage.theme ?? DEFAULT_SAVED_CATEGORY,
    }));
  } catch {
    return [];
  }
}
