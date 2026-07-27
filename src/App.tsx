import { AppErrorState } from './app/components/AppErrorState';
import { AppHeader } from './app/components/AppHeader';
import { AppLoadingState } from './app/components/AppLoadingState';
import { AppRoutes } from './app/components/AppRoutes';
import { useAppController } from './app/controllers/useAppController';

/**
 * Temporary coordinator for routes that have not moved into the data router.
 */
function App() {
  const { appMode, errorMessage, headerProps, isLoading, pageRoutesProps } =
    useAppController();

  // App-level guards keep incomplete data out of the page tree.
  if (isLoading) {
    return <AppLoadingState />;
  }

  if (errorMessage) {
    return <AppErrorState message={errorMessage} />;
  }

  return (
    <div key={appMode} className="page-transition grid gap-4">
      {appMode !== 'home' && appMode !== 'profile' && (
        <AppHeader {...headerProps} />
      )}

      <AppRoutes {...pageRoutesProps} />
    </div>
  );
}

export default App;
