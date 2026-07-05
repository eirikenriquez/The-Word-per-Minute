import type { Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../shared/lib/supabaseClient";
import { getErrorMessage } from "../../shared/utils/errors";

export type AuthSessionState = {
  error: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  session: Session | null;
  signInWithPassword: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  signUpWithPassword: (email: string, password: string) => Promise<SignUpResult>;
  user: User | null;
};

export type SignUpResult = "confirmationRequired" | "error" | "signedIn";

/**
 * Tracks the current Supabase Auth session.
 *
 * This hook owns Supabase Auth calls. It does not render UI or replace guest
 * localStorage behaviour.
 */
export function useAuthSession(): AuthSessionState {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadSession() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!isCurrent) return;

        if (sessionError) throw sessionError;

        setSession(data.session);
        setError(null);
      } catch (caughtError) {
        if (isCurrent) setError(getErrorMessage(caughtError));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setError(null);
      setIsLoading(false);
    });

    return () => {
      isCurrent = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      setSession(data.session);
      setError(null);
      return true;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUpWithPassword = useCallback(async (email: string, password: string): Promise<SignUpResult> => {
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) throw signUpError;

      setSession(data.session);
      setError(null);

      return data.session ? "signedIn" : "confirmationRequired";
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      return "error";
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);

    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      setSession(null);
      setError(null);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    error,
    isLoading,
    isSignedIn: Boolean(session),
    session,
    signInWithPassword,
    signOut,
    signUpWithPassword,
    user: session?.user ?? null,
  };
}
