import type { ReactNode } from 'react';
import { AuthMenuProvider } from '../../features/auth/providers/AuthMenuProvider';
import { AuthProvider } from '../../features/auth/providers/AuthProvider';

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Composes providers needed by the whole application.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <AuthMenuProvider>{children}</AuthMenuProvider>
    </AuthProvider>
  );
}
