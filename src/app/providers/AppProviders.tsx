import type { ReactNode } from 'react';
import { AuthProvider } from '../../features/auth/providers/AuthProvider';

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Composes providers needed by the whole application.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
