import { AppErrorState } from "./app/components/AppErrorState";
import { AppHeader } from "./app/components/AppHeader";
import { AppLoadingState } from "./app/components/AppLoadingState";
import { AppRoutes } from "./app/components/AppRoutes";
import { PageShell } from "./app/components/PageShell";
import { useAppController } from "./app/controllers/useAppController";

/**
 * Root application shell.
 * Renders global loading/error states, navigation, contextual headers, and URL routes.
 */
function App() {
  const {
    appMode,
    errorMessage,
    hasSavedPassages,
    headerProps,
    isLoading,
    onSelectMode,
    pageRoutesProps,
    theme,
    toggleTheme,
  } =
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
    <PageShell
      appMode={appMode}
      hasSavedPassages={hasSavedPassages}
      theme={theme}
      onSelectMode={onSelectMode}
      onToggleTheme={toggleTheme}
    >
      <div key={appMode} className="page-transition grid gap-4">
        {appMode !== "home" && <AppHeader {...headerProps} />}

        <AppRoutes {...pageRoutesProps} />
      </div>
    </PageShell>
  );
}

export default App;
