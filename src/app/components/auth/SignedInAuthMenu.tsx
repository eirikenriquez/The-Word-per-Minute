import {
  ArrowRightStartOnRectangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import type { AuthSessionState } from "../../../domain/auth/useAuthSession";
import { Button } from "../../../shared/ui/Button";
import { APP_ROUTE_PATHS } from "../../routes/appRoutePaths";

type SignedInAuthMenuProps = {
  authSession: AuthSessionState;
  onClose: () => void;
};

export function SignedInAuthMenu({ authSession, onClose }: SignedInAuthMenuProps) {
  return (
    <div className="grid gap-4">
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

      <Link
        className="inline-flex min-h-9 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        to={APP_ROUTE_PATHS.profile}
        onClick={onClose}
      >
        <ChartBarIcon aria-hidden="true" className="h-4 w-4" />
        Profile and progress
      </Link>

      <Button
        disabled={authSession.isLoading}
        variant="ghost"
        onClick={async () => {
          await authSession.signOut();
          onClose();
        }}
      >
        <ArrowRightStartOnRectangleIcon aria-hidden="true" className="h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
}
