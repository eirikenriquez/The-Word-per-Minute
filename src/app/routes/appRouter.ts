import { createBrowserRouter } from 'react-router';
import App from '../../App';
import { AppRouteErrorBoundary } from '../components/AppRouteErrorBoundary';
import { AppLayout } from '../layouts/AppLayout';

/**
 * Browser router created once outside the React render tree.
 *
 * The pathless parent owns the global application layout. Its wildcard child
 * temporarily preserves the existing AppRoutes while pages move into this
 * route tree incrementally.
 */
export const appRouter = createBrowserRouter([
  {
    Component: AppLayout,
    ErrorBoundary: AppRouteErrorBoundary,
    children: [
      {
        path: '*',
        Component: App,
      },
    ],
  },
]);
