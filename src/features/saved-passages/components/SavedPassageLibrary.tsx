import { useMemo, useState } from "react";
import type { SavedPassage, SavedPassageUpdate } from "../../../types/savedPassage";
import {
  matchesSavedPassageCategory,
  matchesSavedPassageSearch,
  matchesSavedPassageSource,
  type SavedPassageSourceFilter,
} from "../utils/savedPassageFilters";
import { SavedPassageCard } from "./SavedPassageCard";
import { SavedPassageFilters } from "./SavedPassageFilters";

type SavedPassageLibraryProps = {
  savedPassages: SavedPassage[];
  selectedSavedPassageId: string;
  onRemovePassage: (passageId: string) => void;
  onSelectSavedPassage: (passageId: string) => void;
  onUpdatePassage: (passageId: string, update: SavedPassageUpdate) => SavedPassage | null;
};

/**
 * Coordinates filtering and rendering for the user's saved passage library.
 */
export function SavedPassageLibrary({
  savedPassages,
  selectedSavedPassageId,
  onRemovePassage,
  onSelectSavedPassage,
  onUpdatePassage,
}: SavedPassageLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSource, setSelectedSource] = useState<SavedPassageSourceFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const hasSavedPassages = savedPassages.length > 0;

  const categories = useMemo(() => {
    const savedCategories = savedPassages.map((passage) => passage.category || "Other");
    return ["All", ...new Set(savedCategories)];
  }, [savedPassages]);

  const editableCategories = useMemo(
    () => categories.filter((category) => category !== "All"),
    [categories],
  );

  const visiblePassages = useMemo(
    () =>
      savedPassages.filter(
        (passage) =>
          matchesSavedPassageCategory(passage, selectedCategory) &&
          matchesSavedPassageSource(passage, selectedSource) &&
          matchesSavedPassageSearch(passage, searchTerm),
      ),
    [savedPassages, searchTerm, selectedCategory, selectedSource],
  );

  const resultSummary = hasSavedPassages
    ? `${visiblePassages.length} of ${savedPassages.length} passage${savedPassages.length === 1 ? "" : "s"}`
    : "0 passages";

  return (
    <section className="grid gap-6">
      <SavedPassageFilters
        categories={categories}
        hasSavedPassages={hasSavedPassages}
        resultSummary={resultSummary}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedSource={selectedSource}
        onSearchTermChange={setSearchTerm}
        onSelectedCategoryChange={setSelectedCategory}
        onSelectedSourceChange={setSelectedSource}
      />

      {!hasSavedPassages ? (
        <LibraryMessage>Saved passages will appear here after you save one from Featured or Bible.</LibraryMessage>
      ) : visiblePassages.length ? (
        <div className="grid gap-3">
          {visiblePassages.map((passage) => (
            <SavedPassageCard
              isSelected={passage.id === selectedSavedPassageId}
              key={passage.id}
              passage={passage}
              savedCategories={editableCategories}
              onRemovePassage={onRemovePassage}
              onSelectSavedPassage={onSelectSavedPassage}
              onUpdatePassage={onUpdatePassage}
            />
          ))}
        </div>
      ) : (
        <LibraryMessage>No saved passages match those filters yet.</LibraryMessage>
      )}
    </section>
  );
}

function LibraryMessage({ children }: { children: string }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      {children}
    </div>
  );
}
