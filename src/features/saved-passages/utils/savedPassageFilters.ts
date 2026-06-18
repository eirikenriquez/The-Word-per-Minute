import type { SavedPassage } from "../../../types/savedPassage";

export type SavedPassageSourceFilter = "all" | "featured" | "saved";

export function matchesSavedPassageCategory(passage: SavedPassage, selectedCategory: string) {
  return selectedCategory === "All" || passage.category === selectedCategory;
}

export function matchesSavedPassageSource(
  passage: SavedPassage,
  selectedSource: SavedPassageSourceFilter,
) {
  if (selectedSource === "all") return true;
  if (selectedSource === "saved") return passage.source !== "featured";

  return passage.source === selectedSource;
}

export function matchesSavedPassageSearch(passage: SavedPassage, searchTerm: string) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  if (!normalizedSearchTerm) return true;

  return [
    passage.title,
    passage.reference,
    passage.category,
    passage.bookName,
    passage.translationAbbreviation,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearchTerm);
}
