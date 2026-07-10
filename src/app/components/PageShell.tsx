import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AppFooter } from "./AppFooter";
import { AuthControls, type AuthMenuRequest } from "./AuthControls";
import { AppNavigation } from "./AppNavigation";
import { BackToTopButton } from "./BackToTopButton";
import type { AuthSessionState } from "../../domain/auth/useAuthSession";
import type { AppMode, Theme } from "../../shared/types/app";

type PageShellProps = {
  appMode?: AppMode;
  authMenuRequest?: AuthMenuRequest | null;
  authSession?: AuthSessionState;
  children: ReactNode;
  hasSavedPassages?: boolean;
  theme: Theme;
  onToggleTheme: () => void;
  onAuthMenuRequestHandled?: () => void;
  onSelectMode?: (mode: AppMode) => void;
};

/**
 * App page frame for loading, error, and practice states.
 */
export function PageShell({
  appMode,
  authMenuRequest,
  authSession,
  children,
  hasSavedPassages = false,
  theme,
  onToggleTheme,
  onAuthMenuRequestHandled,
  onSelectMode,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <h1>
            <Link className="inline-flex items-center gap-3" to="/" aria-label="The Word per Minute home">
              <span className="relative h-9 w-8 shrink-0" aria-hidden="true">
                <img
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain dark:hidden"
                  src="/brand/symbol-light.svg"
                />
                <img
                  alt=""
                  className="absolute inset-0 hidden h-full w-full object-contain dark:block"
                  src="/brand/symbol-dark.svg"
                />
              </span>
              <span className="text-xl font-bold tracking-normal text-ink">The Word per Minute</span>
            </Link>
          </h1>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {appMode && onSelectMode && (
              <AppNavigation appMode={appMode} hasSavedPassages={hasSavedPassages} onSelectMode={onSelectMode} />
            )}
            {authSession && (
              <AuthControls
                authSession={authSession}
                menuRequest={authMenuRequest}
                onMenuRequestHandled={onAuthMenuRequestHandled}
              />
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
      <AppFooter />
      <button
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        className="fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-surface/90 text-ink-muted shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-accent-line hover:bg-accent-soft hover:text-accent-ink"
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
