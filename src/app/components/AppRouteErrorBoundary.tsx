import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { APP_ROUTE_PATHS } from '../routes/appRoutePaths';
import { AppErrorState } from './AppErrorState';

/**
 * Last-resort UI for errors thrown while rendering an application route.
 */
export function AppRouteErrorBoundary() {
  const error = useRouteError();

  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-4 py-8 text-ink">
      <div className="grid w-full max-w-xl gap-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
          The Word per Minute
        </p>
        <AppErrorState message={getRouteErrorMessage(error)} />
        <Link
          className="w-fit text-sm font-semibold text-accent-ink transition-colors hover:text-accent-strong"
          to={APP_ROUTE_PATHS.home}
        >
          Return home
        </Link>
      </div>
    </main>
  );
}

function getRouteErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return error.status === 404
      ? 'This page could not be found.'
      : `This page could not be loaded (${error.status}).`;
  }

  return 'Something went wrong while loading this page.';
}
