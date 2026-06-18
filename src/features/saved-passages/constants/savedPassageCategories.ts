export const DEFAULT_SAVED_CATEGORY = "Memorise";
export const CUSTOM_SAVED_CATEGORY = "Other";

/**
 * Uses a featured theme as the saved category when that theme is available.
 */
export function getDefaultSavedCategory(theme: string, categories: string[]) {
  return categories.includes(theme) ? theme : DEFAULT_SAVED_CATEGORY;
}
