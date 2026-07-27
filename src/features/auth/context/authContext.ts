import { createContext, useContext } from 'react';
import type { AuthSessionState } from '../hooks/useAuthSession';

export const AuthContext = createContext<AuthSessionState | null>(null);

/**
 * Returns the shared Supabase Auth session.
 *
 * Auth consumers must render within AuthProvider so the app creates only one
 * session subscription.
 */
export function useAuth(): AuthSessionState {
  const authSession = useContext(AuthContext);

  if (!authSession) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return authSession;
}
