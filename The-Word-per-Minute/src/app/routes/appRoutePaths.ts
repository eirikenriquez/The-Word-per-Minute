import type { AppMode } from "../../types/appMode";

/**
 * Single source of truth for the app's URL paths.
 * Keeping path strings here prevents App, navigation actions, and route setup from drifting apart.
 */
export const APP_ROUTE_PATHS: Record<AppMode, string> = {
  bible: "/bible",
  home: "/",
  library: "/library",
  practice: "/practice",
};

/**
 * Converts the current browser path into the matching app mode.
 */
export function getAppModeFromPathname(pathname: string): AppMode {
  if (pathname.startsWith(APP_ROUTE_PATHS.practice)) return "practice";
  if (pathname.startsWith(APP_ROUTE_PATHS.bible)) return "bible";
  if (pathname.startsWith(APP_ROUTE_PATHS.library)) return "library";
  return "home";
}

/**
 * Converts an app mode into the URL used by React Router.
 */
export function getPathnameFromAppMode(mode: AppMode) {
  return APP_ROUTE_PATHS[mode];
}
