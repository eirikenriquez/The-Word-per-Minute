import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { AppNavigation } from "./AppNavigation";
import { BackToTopButton } from "./BackToTopButton";
import type { AppMode, Theme } from "../../types/app";
import { Button } from "../../ui/Button";

type PageShellProps = {
  appMode?: AppMode;
  children: ReactNode;
  hasSavedPassages?: boolean;
  theme: Theme;
  onToggleTheme: () => void;
  onSelectMode?: (mode: AppMode) => void;
};

/**
 * App page frame for loading, error, and practice states.
 */
export function PageShell({
  appMode,
  children,
  hasSavedPassages = false,
  theme,
  onToggleTheme,
  onSelectMode,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <h1 className="text-xl font-bold tracking-normal text-slate-950 dark:text-slate-100">The Word per Minute</h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {appMode && onSelectMode && (
              <AppNavigation appMode={appMode} hasSavedPassages={hasSavedPassages} onSelectMode={onSelectMode} />
            )}
            <Button
              className="w-fit gap-2"
              onClick={onToggleTheme}
            >
              {theme === "light" ? (
                <MoonIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
              ) : (
                <SunIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
              )}
              {theme === "light" ? "Dark" : "Light"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      <BackToTopButton isEnabled={appMode === "bible" || appMode === "library"} />
    </div>
  );
}
