import type { SavedPassage, SavePassageInput, SavedPassageUpdate } from "../../types/savedPassage";
import { DEFAULT_SAVED_CATEGORY } from "./savedPassageCategories";

const SAVED_PASSAGES_STORAGE_KEY = "the-word-per-minute-saved-passages";

type SavedPassageRepository = {
  list: () => SavedPassage[];
  save: (input: SavePassageInput) => SavedPassage;
  update: (passageId: string, update: SavedPassageUpdate) => SavedPassage | null;
  remove: (passageId: string) => void;
};

/**
 * Creates a stable identity for the passage itself, independent of where it is stored.
 * A future database can use the same fields as a unique constraint.
 */
export function getSavedPassageId(passage: SavePassageInput) {
  return [
    passage.translationId,
    passage.bookId,
    passage.chapter,
    passage.selectedVerses?.length ? passage.selectedVerses.join(",") : passage.startVerse,
    passage.selectedVerses?.length ? "selected" : passage.endVerse,
  ].join(":");
}

/**
 * Repository boundary for saved passages.
 * Today this writes to localStorage; later this can become API calls without changing UI code.
 */
export const savedPassageRepository: SavedPassageRepository = {
  list(): SavedPassage[] {
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
  },

  save(input: SavePassageInput): SavedPassage {
    const savedPassage = {
      ...input,
      id: getSavedPassageId(input),
      createdAt: new Date().toISOString(),
    };
    const nextSavedPassages = [
      savedPassage,
      ...this.list().filter((passage) => passage.id !== savedPassage.id),
    ];

    localStorage.setItem(SAVED_PASSAGES_STORAGE_KEY, JSON.stringify(nextSavedPassages));
    return savedPassage;
  },

  update(passageId: string, update: SavedPassageUpdate) {
    const savedPassages = this.list();
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

  remove(passageId: string) {
    const nextSavedPassages = this.list().filter((passage) => passage.id !== passageId);
    localStorage.setItem(SAVED_PASSAGES_STORAGE_KEY, JSON.stringify(nextSavedPassages));
  },
};
