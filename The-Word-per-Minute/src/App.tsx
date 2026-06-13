import { AppErrorState } from "./app/components/AppErrorState";
import { AppHeader } from "./app/components/AppHeader";
import { AppLoadingState } from "./app/components/AppLoadingState";
import { AppPageRoutes } from "./app/components/AppPageRoutes";
import { useAppController } from "./app/controllers/useAppController";
import { PageShell } from "./shared/components/PageShell";

/**
 * Main practice screen.
 * Owns the active mode, current typing state, and the handoff between data hooks and UI panels.
 */
function App() {
  const { appMode, errorMessage, headerProps, isLoading, pageRoutesProps, theme, toggleTheme } =
    useAppController();

  // App-level guards keep incomplete data out of the page tree.
  if (isLoading) {
    return (
      <PageShell theme={theme} onToggleTheme={toggleTheme}>
        <AppLoadingState />
      </PageShell>
    );
  }

  if (errorMessage) {
    return (
      <PageShell theme={theme} onToggleTheme={toggleTheme}>
        <AppErrorState message={errorMessage} />
      </PageShell>
    );
  }

  return (
    <PageShell theme={theme} onToggleTheme={toggleTheme}>
      <div key={appMode} className="page-transition grid gap-4">
        <AppHeader {...headerProps} />

        <AppPageRoutes {...pageRoutesProps} />
      </div>
    </PageShell>
  );
}

export default App;
