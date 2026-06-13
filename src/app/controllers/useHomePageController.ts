import type { useAppActions } from "../hooks/useAppActions";
import type { FeaturedHomeCategory, HomePageProps } from "../../pages/HomePage";

type UseHomePageControllerParams = {
  appActions: ReturnType<typeof useAppActions>;
  featuredHomeCategories: FeaturedHomeCategory[];
  savedPassageCount: number;
};

/**
 * Prepares the props for the Home page.
 * The page can stay focused on layout while this controller maps app actions to page actions.
 */
export function useHomePageController({
  appActions,
  featuredHomeCategories,
  savedPassageCount,
}: UseHomePageControllerParams): HomePageProps {
  return {
    featuredHomeCategories,
    savedPassageCount,
    onOpenBible: appActions.openBible,
    onOpenLibrary: appActions.openLibrary,
    onSelectFeaturedCategory: appActions.startFeaturedCategory,
    onStartFeaturedPractice: appActions.startFeaturedPractice,
  };
}
