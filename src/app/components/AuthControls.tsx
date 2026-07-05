import { ArrowRightEndOnRectangleIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import type { FormEvent } from "react";
import { useState } from "react";
import type { AuthSessionState } from "../../domain/auth/useAuthSession";
import { Button } from "../../shared/ui/Button";

type AuthControlsProps = {
  authSession: AuthSessionState;
};

/**
 * Small app-shell auth control for Supabase magic-link sign-in.
 */
export function AuthControls({ authSession }: AuthControlsProps) {
  const [email, setEmail] = useState("");
  const [hasSentLink, setHasSentLink] = useState(false);

  async function submitSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    await authSession.signInWithEmail(trimmedEmail);
    setHasSentLink(true);
  }

  if (authSession.isSignedIn) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="max-w-48 truncate text-ink-subtle">
          {authSession.user?.email ?? "Signed in"}
        </span>
        <Button
          className="min-h-8 px-2 py-1"
          disabled={authSession.isLoading}
          variant="ghost"
          onClick={authSession.signOut}
        >
          <ArrowRightStartOnRectangleIcon aria-hidden="true" className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <form className="grid gap-1" onSubmit={submitSignIn}>
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="auth-email">
          Email address
        </label>
        <input
          className="min-h-9 w-48 rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft"
          id="auth-email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setHasSentLink(false);
          }}
        />
        <Button
          className="min-h-9"
          disabled={authSession.isLoading || !email.trim()}
          type="submit"
          variant="secondary"
        >
          <ArrowRightEndOnRectangleIcon aria-hidden="true" className="h-4 w-4" />
          Send link
        </Button>
      </div>
      {(hasSentLink || authSession.error) && (
        <p className={`text-xs ${authSession.error ? "text-red-600 dark:text-red-300" : "text-ink-subtle"}`}>
          {authSession.error ?? "Check your email for a sign-in link."}
        </p>
      )}
    </form>
  );
}
