import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import {
  AuthControls,
  type AuthMenuRequest,
} from '../../features/auth/components/AuthControls';
import type { AppMode, Theme } from '../../types/app';
import { APP_ROUTE_PATHS } from '../routes/appRoutePaths';
import { AppFooter } from './AppFooter';
import { AppNavigation } from './AppNavigation';
import { BackToTopButton } from './BackToTopButton';

type PageShellProps = {
  appMode?: AppMode;
  authMenuRequest?: AuthMenuRequest | null;
  children: ReactNode;
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
  children,
  theme,
  onToggleTheme,
  onAuthMenuRequestHandled,
  onSelectMode,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link
              className="inline-flex items-center gap-3"
              to="/"
              aria-label="The Word per Minute home"
            >
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
              <span className="text-xl font-bold tracking-normal text-ink">
                The Word per Minute
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {appMode && onSelectMode && (
              <AppNavigation appMode={appMode} onSelectMode={onSelectMode} />
            )}
            <AuthControls
              menuRequest={authMenuRequest}
              onMenuRequestHandled={onAuthMenuRequestHandled}
              profilePath={APP_ROUTE_PATHS.profile}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 content-start gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
      <AppFooter />
      <button
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        className="fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-surface/90 text-ink-muted shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-accent-line hover:bg-accent-soft hover:text-accent-ink"
        type="button"
        onClick={onToggleTheme}
      >
        {theme === 'light' ? (
          <MoonIcon aria-hidden="true" className="h-5 w-5" />
        ) : (
          <SunIcon aria-hidden="true" className="h-5 w-5" />
        )}
      </button>
      <BackToTopButton
        isEnabled={appMode === 'bible' || appMode === 'library'}
      />
    </div>
  );
}
