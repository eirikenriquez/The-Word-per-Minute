import type { ReactNode } from "react";
import type { Theme } from "../../types/theme";

type PageShellProps = {
  children: ReactNode;
  theme: Theme;
  onToggleTheme: () => void;
};

/**
 * App page frame for loading, error, and practice states.
 */
export function PageShell({ children, theme, onToggleTheme }: PageShellProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold tracking-normal text-slate-950">The Word per Minute</h1>
          <button
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            type="button"
            onClick={onToggleTheme}
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
