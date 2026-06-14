import type { ReactNode } from "react";
import { AppNavigation } from "./AppNavigation";
import type { AppMode } from "../../types/appMode";
import type { Theme } from "../../types/theme";

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
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <h1 className="text-xl font-bold tracking-normal text-slate-950">The Word per Minute</h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {appMode && onSelectMode && (
              <AppNavigation appMode={appMode} hasSavedPassages={hasSavedPassages} onSelectMode={onSelectMode} />
            )}
            <button
              className="w-fit rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              type="button"
              onClick={onToggleTheme}
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
