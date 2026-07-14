import {
  ArrowRightEndOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import type { AuthSessionState } from "../../../domain/auth/useAuthSession";
import { Button } from "../../../shared/ui/Button";

export type AuthMode = "signIn" | "signUp";

type SignedOutAuthMenuProps = {
  authSession: AuthSessionState;
  modeRequest?: {
    id: number;
    mode: AuthMode;
  } | null;
  onSignedIn: () => void;
};

export function SignedOutAuthMenu({ authSession, modeRequest, onSignedIn }: SignedOutAuthMenuProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const isSignUpMode = authMode === "signUp";
  const canSubmit = Boolean(email.trim()) && password.length >= 6 && !authSession.isLoading;

  useEffect(() => {
    if (!modeRequest) return;

    setAuthMode(modeRequest.mode);
    setFormMessage(null);
  }, [modeRequest]);

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
      onSignedIn();
    }
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={submitAuthForm}
    >
      <div>
        <p className="text-sm font-semibold text-ink">
          {isSignUpMode ? "Create account" : "Sign in"}
        </p>
        <p className="mt-1 text-sm text-ink-subtle">
          {isSignUpMode
            ? "Start syncing saved passages across sessions."
            : "Save passages to your account."}
        </p>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-1" htmlFor="auth-email">
          <span className="text-sm font-medium text-ink-muted">Email</span>
          <input
            className="min-h-9 rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft"
            id="auth-email"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFormMessage(null);
            }}
          />
        </label>

        <label className="grid gap-1" htmlFor="auth-password">
          <span className="text-sm font-medium text-ink-muted">Password</span>
          <input
            className="min-h-9 rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft"
            id="auth-password"
            placeholder="At least 6 characters"
            type="password"
            autoComplete={isSignUpMode ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setFormMessage(null);
            }}
          />
        </label>
      </div>

      <div className="grid gap-2">
        <Button
          className="w-full"
          disabled={!canSubmit}
          type="submit"
          variant="primary"
        >
          {isSignUpMode ? (
            <UserPlusIcon aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ArrowRightEndOnRectangleIcon aria-hidden="true" className="h-4 w-4" />
          )}
          {isSignUpMode ? "Create account" : "Sign in"}
        </Button>

        <Button
          className="w-full"
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
        <p className={`text-sm ${authSession.error ? "text-red-600 dark:text-red-300" : "text-ink-subtle"}`}>
          {authSession.error ?? formMessage}
        </p>
      )}
    </form>
  );
}
