import type { ReactNode } from "react";
import type { Theme } from "../types/theme";

type PageShellProps = {
  children: ReactNode;
  theme: Theme;
  onToggleTheme: () => void;
};

/**
 * Shared page frame for loading, error, and practice states.
 */
export function PageShell({ children, theme, onToggleTheme }: PageShellProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
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

      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-6">{children}</main>
    </div>
  );
}
