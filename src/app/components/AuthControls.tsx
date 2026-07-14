import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
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
  onMenuRequestHandled?: () => void;
};

/**
 * Small app-shell auth control for Supabase email/password authentication.
 */
export function AuthControls({
  authSession,
  menuRequest,
  onMenuRequestHandled,
}: AuthControlsProps) {
  return (
    <Popover className="relative">
      {({ close, open }) => (
        <AuthPopoverContent
          authSession={authSession}
          closePopover={close}
          isOpen={open}
          menuRequest={menuRequest}
          onMenuRequestHandled={onMenuRequestHandled}
        />
      )}
    </Popover>
  );
}

type AuthPopoverContentProps = AuthControlsProps & {
  closePopover: () => void;
  isOpen: boolean;
};

function AuthPopoverContent({
  authSession,
  closePopover,
  isOpen,
  menuRequest,
  onMenuRequestHandled,
}: AuthPopoverContentProps) {
  const [activeMenuRequest, setActiveMenuRequest] = useState<AuthMenuRequest | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuRequest || authSession.isSignedIn) return;

    setActiveMenuRequest(menuRequest);
    if (!isOpen) {
      buttonRef.current?.click();
    }

    onMenuRequestHandled?.();
  }, [authSession.isSignedIn, isOpen, menuRequest, onMenuRequestHandled]);

  const panelWidthClassName = authSession.isSignedIn ? "w-72" : "w-80";

  return (
    <>
      <PopoverButton
        as={AuthMenuButton}
        isOpen={isOpen}
        label={authSession.isSignedIn ? "Account" : "Sign in"}
        ref={buttonRef}
      />

      <PopoverPanel
        transition
        className={`absolute right-0 top-full z-30 mt-2 rounded-lg border border-line bg-surface p-4 shadow-lg shadow-black/10 transition duration-150 ease-out data-closed:translate-y-1 data-closed:scale-[0.98] data-closed:opacity-0 data-enter:duration-150 data-leave:duration-100 data-leave:ease-in dark:shadow-black/30 motion-reduce:transform-none motion-reduce:transition-none ${panelWidthClassName}`}
      >
        {authSession.isSignedIn ? (
          <SignedInAuthMenu authSession={authSession} onClose={closePopover} />
        ) : (
          <SignedOutAuthMenu
            authSession={authSession}
            modeRequest={activeMenuRequest}
            onSignedIn={closePopover}
          />
        )}
      </PopoverPanel>
    </>
  );
}
