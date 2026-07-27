import { createBrowserRouter, redirect } from 'react-router';
import { AppRouteErrorBoundary } from '../components/AppRouteErrorBoundary';
import { AppLayout } from '../layouts/AppLayout';
import { APP_ROUTE_PATHS } from './appRoutePaths';

/**
 * Browser router created once outside the React render tree.
 *
 * The pathless parent owns the global application layout while each child
 * route composes only the feature state needed by its page.
 */
export const appRouter = createBrowserRouter([
  {
    Component: AppLayout,
    ErrorBoundary: AppRouteErrorBoundary,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomeRoute } = await import('./HomeRoute');

          return { Component: HomeRoute };
        },
      },
      {
        path: APP_ROUTE_PATHS.profile,
        lazy: async () => {
          const { ProfileRoute } = await import('./ProfileRoute');

          return { Component: ProfileRoute };
        },
      },
      {
        path: APP_ROUTE_PATHS.library,
        lazy: async () => {
          const { LibraryRoute } = await import('./LibraryRoute');

          return { Component: LibraryRoute };
        },
      },
      {
        path: APP_ROUTE_PATHS.bible,
        lazy: async () => {
          const { BibleRoute } = await import('./BibleRoute');

          return { Component: BibleRoute };
        },
      },
      {
        path: APP_ROUTE_PATHS.practice,
        lazy: async () => {
          const { PracticeRoute } = await import('./PracticeRoute');

          return { Component: PracticeRoute };
        },
      },
      {
        path: '*',
        loader: () => redirect(APP_ROUTE_PATHS.home),
      },
    ],
  },
]);
