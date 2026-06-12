import { HomeCategoryPicker } from "../components/HomeCategoryPicker";

export type FeaturedHomeCategory = {
  count: number;
  label: string;
};

type HomePageProps = {
  featuredHomeCategories: FeaturedHomeCategory[];
  savedPassageCount: number;
  onOpenBible: () => void;
  onOpenLibrary: () => void;
  onSelectFeaturedCategory: (category: string) => void;
  onStartFeaturedPractice: () => void;
};

/**
 * Home page entry point for choosing a practice source or opening the reader/library.
 */
export function HomePage({
  featuredHomeCategories,
  savedPassageCount,
  onOpenBible,
  onOpenLibrary,
  onSelectFeaturedCategory,
  onStartFeaturedPractice,
}: HomePageProps) {
  return (
    <HomeCategoryPicker
      featuredCategories={featuredHomeCategories}
      hasSavedPassages={savedPassageCount > 0}
      savedPassageCount={savedPassageCount}
      onOpenBible={onOpenBible}
      onOpenLibrary={onOpenLibrary}
      onStartFeatured={onStartFeaturedPractice}
      onStartFeaturedCategory={onSelectFeaturedCategory}
    />
  );
}
