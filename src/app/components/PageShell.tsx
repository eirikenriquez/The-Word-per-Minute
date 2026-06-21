import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { AppNavigation } from "./AppNavigation";
import { BackToTopButton } from "./BackToTopButton";
import type { AppMode, Theme } from "../../types/app";

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
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <h1 className="text-xl font-bold tracking-normal text-ink">The Word per Minute</h1>

          {appMode && onSelectMode && (
            <AppNavigation appMode={appMode} hasSavedPassages={hasSavedPassages} onSelectMode={onSelectMode} />
          )}
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      <button
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        className="fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-surface/90 text-ink-muted shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 dark:hover:border-blue-800 dark:hover:bg-blue-950 dark:hover:text-blue-200"
        type="button"
        onClick={onToggleTheme}
      >
        {theme === "light" ? (
          <MoonIcon aria-hidden="true" className="h-5 w-5" />
        ) : (
          <SunIcon aria-hidden="true" className="h-5 w-5" />
        )}
      </button>
      <BackToTopButton isEnabled={appMode === "bible" || appMode === "library"} />
    </div>
  );
}
