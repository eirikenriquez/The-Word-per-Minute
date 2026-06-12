import type { ReactNode } from "react";
import type { AppMode } from "../../types/appMode";

type AppRoutesProps = {
  appMode: AppMode;
  pages: Record<AppMode, ReactNode>;
};

/**
 * Small app-level router for the current state-based navigation.
 * Each page is built before it gets here, so this component only chooses which page to show.
 */
export function AppRoutes({ appMode, pages }: AppRoutesProps) {
  return pages[appMode];
}
