import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/authContext';
import { type AuthMenuRequest, useAuthMenu } from '../context/authMenuContext';
import type { AuthSessionState } from '../hooks/useAuthSession';
import { AuthMenuButton } from './AuthMenuButton';
import { SignedInAuthMenu } from './SignedInAuthMenu';
import { SignedOutAuthMenu } from './SignedOutAuthMenu';

type AuthControlsProps = {
  profilePath: string;
};

/**
 * Small app-shell auth control for Supabase email/password authentication.
 */
export function AuthControls({ profilePath }: AuthControlsProps) {
  const authSession = useAuth();
  const { clearMenuRequest, menuRequest } = useAuthMenu();

  return (
    <Popover className="relative">
      {({ close, open }) => (
        <AuthPopoverContent
          authSession={authSession}
          closePopover={close}
          isOpen={open}
          menuRequest={menuRequest}
          onMenuRequestHandled={clearMenuRequest}
          profilePath={profilePath}
        />
      )}
    </Popover>
  );
}

type AuthPopoverContentProps = {
  authSession: AuthSessionState;
  closePopover: () => void;
  isOpen: boolean;
  menuRequest: AuthMenuRequest | null;
  onMenuRequestHandled: () => void;
  profilePath: string;
};

function AuthPopoverContent({
  authSession,
  closePopover,
  isOpen,
  menuRequest,
  onMenuRequestHandled,
  profilePath,
}: AuthPopoverContentProps) {
  const [activeMenuRequest, setActiveMenuRequest] =
    useState<AuthMenuRequest | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuRequest || authSession.isSignedIn) return;

    setActiveMenuRequest(menuRequest);
    if (!isOpen) {
      buttonRef.current?.click();
    }

    onMenuRequestHandled?.();
  }, [authSession.isSignedIn, isOpen, menuRequest, onMenuRequestHandled]);

  const panelWidthClassName = authSession.isSignedIn
    ? 'w-72'
    : 'w-[22rem] max-w-[calc(100vw-2rem)]';

  return (
    <>
      <PopoverButton
        as={AuthMenuButton}
        isOpen={isOpen}
        label={authSession.isSignedIn ? 'Account' : 'Sign in'}
        ref={buttonRef}
      />

      <PopoverPanel
        transition
        className={`absolute right-0 top-full z-30 mt-2 rounded-lg border border-line bg-surface p-4 shadow-lg shadow-black/10 transition duration-150 ease-out data-closed:translate-y-1 data-closed:scale-[0.98] data-closed:opacity-0 data-enter:duration-150 data-leave:duration-100 data-leave:ease-in dark:shadow-black/30 motion-reduce:transform-none motion-reduce:transition-none ${panelWidthClassName}`}
      >
        {authSession.isSignedIn ? (
          <SignedInAuthMenu
            authSession={authSession}
            onClose={closePopover}
            profilePath={profilePath}
          />
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
