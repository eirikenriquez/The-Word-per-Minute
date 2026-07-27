import type { ReactNode } from 'react';
import { AuthContext } from '../context/authContext';
import { useAuthSession } from '../hooks/useAuthSession';

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Owns the app's single Supabase Auth session subscription.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const authSession = useAuthSession();

  return (
    <AuthContext.Provider value={authSession}>{children}</AuthContext.Provider>
  );
}
