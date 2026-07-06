import type { SavePassageInput } from "../../shared/types/savedPassage";

/**
 * Creates a stable identity for the Bible passage itself.
 * This is separate from the database row id, which may be a UUID.
 */
export function getSavedPassageIdentity(passage: SavePassageInput) {
  return [
    passage.translationId,
    passage.bookId,
    passage.chapter,
    passage.selectedVerses?.length ? passage.selectedVerses.join(",") : passage.startVerse,
    passage.selectedVerses?.length ? "selected" : passage.endVerse,
  ].join(":");
}
