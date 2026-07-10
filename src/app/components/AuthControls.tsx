import { useEffect, useRef, useState } from "react";
import type { AuthSessionState } from "../../domain/auth/useAuthSession";
import { AuthMenuButton } from "./auth/AuthMenuButton";
import { SignedInAuthMenu } from "./auth/SignedInAuthMenu";
import { SignedOutAuthMenu, type AuthMode } from "./auth/SignedOutAuthMenu";

export type AuthMenuRequest = {
  id: number;
  mode: AuthMode;
};

type AuthControlsProps = {
  authSession: AuthSessionState;
  menuRequest?: AuthMenuRequest | null;
};

/**
 * Small app-shell auth control for Supabase email/password authentication.
 */
export function AuthControls({ authSession, menuRequest }: AuthControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRequest) return;
    setIsOpen(true);
  }, [menuRequest]);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  if (authSession.isSignedIn) {
    return (
      <div ref={containerRef} className="relative">
        <AuthMenuButton
          isOpen={isOpen}
          label="Account"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
        />

        {isOpen && (
          <SignedInAuthMenu authSession={authSession} onClose={() => setIsOpen(false)} />
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <AuthMenuButton
        isOpen={isOpen}
        label="Sign in"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      />

      {isOpen && (
        <SignedOutAuthMenu
          authSession={authSession}
          modeRequest={menuRequest}
          onSignedIn={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
