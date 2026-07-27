import { createBrowserRouter } from 'react-router';
import App from '../../App';
import { AppRouteErrorBoundary } from '../components/AppRouteErrorBoundary';

/**
 * Browser router created once outside the React render tree.
 *
 * The wildcard root temporarily preserves the existing AppRoutes while pages
 * move into this route tree incrementally.
 */
export const appRouter = createBrowserRouter([
  {
    path: '*',
    Component: App,
    ErrorBoundary: AppRouteErrorBoundary,
  },
]);
