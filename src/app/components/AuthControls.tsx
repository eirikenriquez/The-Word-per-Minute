import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import type { FormEvent } from "react";
import { useState } from "react";
import type { AuthSessionState } from "../../domain/auth/useAuthSession";
import { Button } from "../../shared/ui/Button";

type AuthControlsProps = {
  authSession: AuthSessionState;
};

type AuthMode = "signIn" | "signUp";

/**
 * Small app-shell auth control for Supabase email/password authentication.
 */
export function AuthControls({ authSession }: AuthControlsProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formMessage, setFormMessage] = useState<string | null>(null);

  async function submitAuthForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) return;

    if (password.length < 6) {
      setFormMessage("Password must be at least 6 characters.");
      return;
    }

    if (authMode === "signUp") {
      const result = await authSession.signUpWithPassword(trimmedEmail, password);

      if (result === "signedIn") {
        setFormMessage("Account created. You are signed in.");
      }

      if (result === "confirmationRequired") {
        setFormMessage("Account created. Check your email to confirm it, then sign in.");
      }

      return;
    }

    const didSignIn = await authSession.signInWithPassword(trimmedEmail, password);

    if (didSignIn) {
      setFormMessage(null);
    }
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

  const isSignUpMode = authMode === "signUp";
  const canSubmit = Boolean(email.trim()) && password.length >= 6 && !authSession.isLoading;

  return (
    <form className="grid gap-1" onSubmit={submitAuthForm}>
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="auth-email">
          Email address
        </label>
        <input
          className="min-h-9 w-48 rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft"
          id="auth-email"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setFormMessage(null);
          }}
        />
        <label className="sr-only" htmlFor="auth-password">
          Password
        </label>
        <input
          className="min-h-9 w-40 rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft"
          id="auth-password"
          placeholder="Password"
          type="password"
          autoComplete={isSignUpMode ? "new-password" : "current-password"}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setFormMessage(null);
          }}
        />
        <Button
          className="min-h-9"
          disabled={!canSubmit}
          type="submit"
          variant="secondary"
        >
          {isSignUpMode ? (
            <UserPlusIcon aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ArrowRightEndOnRectangleIcon aria-hidden="true" className="h-4 w-4" />
          )}
          {isSignUpMode ? "Create account" : "Sign in"}
        </Button>
        <Button
          className="min-h-9"
          type="button"
          variant="ghost"
          onClick={() => {
            setAuthMode(isSignUpMode ? "signIn" : "signUp");
            setFormMessage(null);
          }}
        >
          {isSignUpMode ? "Use existing account" : "Create account"}
        </Button>
      </div>
      {(formMessage || authSession.error) && (
        <p className={`text-xs ${authSession.error ? "text-red-600 dark:text-red-300" : "text-ink-subtle"}`}>
          {authSession.error ?? formMessage}
        </p>
      )}
    </form>
  );
}
