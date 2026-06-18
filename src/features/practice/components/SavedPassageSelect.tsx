import { useEffect, useMemo, useState } from "react";
import type { SavedPassage } from "../../../types/savedPassage";

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Category</span>
        <select
          className="h-9 min-w-40 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950"
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

      <label className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Saved passage</span>
        <select
          className="h-9 min-w-52 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950"
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
