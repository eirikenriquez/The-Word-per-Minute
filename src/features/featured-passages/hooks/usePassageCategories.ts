import { useMemo } from "react";
import {
  CUSTOM_SAVED_CATEGORY,
  DEFAULT_SAVED_CATEGORY,
} from "../../../domain/saved-passages/savedPassageCategories";
import type { FeaturedPassage } from "../../../types/featuredPassage";

/**
 * Builds category lists from featured passage themes.
 * Saved-passage categories reuse the same themes so featured and saved content stay consistent.
 */
export function usePassageCategories(featuredPassages: FeaturedPassage[]) {
  return useMemo(() => {
    const featuredThemes = [...new Set(featuredPassages.map((passage) => passage.theme))];

    return {
      featuredHomeCategories: featuredThemes.map((theme) => ({
        count: featuredPassages.filter((passage) => passage.theme === theme).length,
        label: theme,
      })),
      savedPassageCategories: [DEFAULT_SAVED_CATEGORY, ...featuredThemes, CUSTOM_SAVED_CATEGORY],
    };
  }, [featuredPassages]);
}
