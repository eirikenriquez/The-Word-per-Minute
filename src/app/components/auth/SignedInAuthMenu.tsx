import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import type { AuthSessionState } from "../../../domain/auth/useAuthSession";
import { Button } from "../../../shared/ui/Button";

type SignedInAuthMenuProps = {
  authSession: AuthSessionState;
  onSignedOut: () => void;
};

export function SignedInAuthMenu({ authSession, onSignedOut }: SignedInAuthMenuProps) {
  return (
    <div className="animate-dropdown-in absolute right-0 top-full z-30 mt-2 w-72 rounded-lg border border-line bg-surface p-4 shadow-lg shadow-black/10 dark:shadow-black/30">
      <div className="grid gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
            Signed in as
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-ink">
            {authSession.user?.email ?? "Signed in"}
          </p>
          <p className="mt-2 text-sm text-ink-subtle">
            Saved passages sync to your account.
          </p>
        </div>

        <Button
          disabled={authSession.isLoading}
          variant="ghost"
          onClick={async () => {
            await authSession.signOut();
            onSignedOut();
          }}
        >
          <ArrowRightStartOnRectangleIcon aria-hidden="true" className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
