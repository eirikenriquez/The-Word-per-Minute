import { useEffect, useMemo, useState } from "react";
import type { SavedPassage } from "../../../shared/types/savedPassage";

type SavedPassageSelectProps = {
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onSelectSavedPractice: (passageId: string) => void;
};

/**
 * Dropdown pair for choosing a saved-passage category, then a passage inside it.
 * The selected passage still owns the typing session; the category only narrows the list.
 */
export function SavedPassageSelect({
  savedPassages,
  selectedSavedPassageId,
  onSelectSavedPractice,
}: SavedPassageSelectProps) {
  const categories = useMemo(() => {
    const savedCategories = savedPassages.map((passage) => getSavedCategory(passage));
    return ["All", ...Array.from(new Set(savedCategories))];
  }, [savedPassages]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const visiblePassages = useMemo(
    () =>
      selectedCategory === "All"
        ? savedPassages
        : savedPassages.filter((passage) => getSavedCategory(passage) === selectedCategory),
    [savedPassages, selectedCategory],
  );

  useEffect(() => {
    if (!categories.includes(selectedCategory)) setSelectedCategory("All");
  }, [categories, selectedCategory]);

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    const firstPassage = category === "All" ? savedPassages[0] : savedPassages.find((passage) => getSavedCategory(passage) === category);
    if (firstPassage) onSelectSavedPractice(firstPassage.id);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(10rem,14rem)_minmax(16rem,1fr)]">
      <label className="grid gap-1">
        <span className="text-sm font-medium text-ink-muted">Category</span>
        <select
          className="w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
          value={selectedCategory}
          onChange={(event) => handleCategoryChange(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium text-ink-muted">Saved passage</span>
        <select
          className="w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
          value={selectedSavedPassageId}
          onChange={(event) => onSelectSavedPractice(event.target.value)}
        >
          {visiblePassages.map((passage) => (
            <option key={passage.id} value={passage.id}>
              {passage.title}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function getSavedCategory(passage: SavedPassage) {
  return passage.category || "Other";
}
