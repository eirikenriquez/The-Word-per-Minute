import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      setIsOpen(false);
    }
  }

  if (authSession.isSignedIn) {
    return (
      <div ref={containerRef} className="relative">
        <AuthMenuButton
          isOpen={isOpen}
          label="Account"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
        />

        {isOpen && (
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
                  setIsOpen(false);
                }}
              >
                <ArrowRightStartOnRectangleIcon aria-hidden="true" className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const isSignUpMode = authMode === "signUp";
  const canSubmit = Boolean(email.trim()) && password.length >= 6 && !authSession.isLoading;

  return (
    <div ref={containerRef} className="relative">
      <AuthMenuButton
        isOpen={isOpen}
        label="Sign in"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      />

      {isOpen && (
        <form
          className="animate-dropdown-in absolute right-0 top-full z-30 mt-2 w-80 rounded-lg border border-line bg-surface p-4 shadow-lg shadow-black/10 dark:shadow-black/30"
          onSubmit={submitAuthForm}
        >
          <div className="grid gap-4">
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
          </div>
        </form>
      )}
    </div>
  );
}

type AuthMenuButtonProps = {
  isOpen: boolean;
  label: string;
  onClick: () => void;
};

function AuthMenuButton({ isOpen, label, onClick }: AuthMenuButtonProps) {
  return (
    <button
      aria-label={label}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      type="button"
      onClick={onClick}
    >
      <UserCircleIcon aria-hidden="true" className="h-6 w-6 shrink-0" />
      <ChevronDownIcon
        aria-hidden="true"
        className={`absolute h-3 w-3 translate-x-3 translate-y-3 rounded-full bg-surface text-ink-subtle transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}
