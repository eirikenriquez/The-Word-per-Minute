import { createContext, useContext } from 'react';

export type AuthMenuRequest = {
  id: number;
  mode: 'signUp';
};

export type AuthMenuContextValue = {
  clearMenuRequest: () => void;
  menuRequest: AuthMenuRequest | null;
  openSignUpMenu: () => void;
};

export const AuthMenuContext = createContext<AuthMenuContextValue | null>(null);

/**
 * Coordinates auth-menu requests between page content and the app header.
 */
export function useAuthMenu(): AuthMenuContextValue {
  const authMenu = useContext(AuthMenuContext);

  if (!authMenu) {
    throw new Error('useAuthMenu must be used within AuthMenuProvider.');
  }

  return authMenu;
}
