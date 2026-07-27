import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AuthMenuContext,
  type AuthMenuRequest,
} from '../context/authMenuContext';

type AuthMenuProviderProps = {
  children: ReactNode;
};

/**
 * Owns transient requests to open a specific auth-menu view.
 */
export function AuthMenuProvider({ children }: AuthMenuProviderProps) {
  const [menuRequest, setMenuRequest] = useState<AuthMenuRequest | null>(null);
  const nextRequestId = useRef(0);

  const clearMenuRequest = useCallback(() => {
    setMenuRequest(null);
  }, []);

  const openSignUpMenu = useCallback(() => {
    nextRequestId.current += 1;
    setMenuRequest({
      id: nextRequestId.current,
      mode: 'signUp',
    });
  }, []);

  const value = useMemo(
    () => ({
      clearMenuRequest,
      menuRequest,
      openSignUpMenu,
    }),
    [clearMenuRequest, menuRequest, openSignUpMenu],
  );

  return (
    <AuthMenuContext.Provider value={value}>
      {children}
    </AuthMenuContext.Provider>
  );
}
