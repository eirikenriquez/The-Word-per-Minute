import type { Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../shared/lib/supabaseClient";
import { getErrorMessage } from "../../shared/utils/errors";

export type AuthSessionState = {
  error: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  session: Session | null;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: User | null;
};

/**
 * Tracks the current Supabase Auth session.
 *
 * This hook only observes auth state. It does not render UI, sign users in, or
 * replace guest localStorage behaviour.
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

  const signInWithEmail = useCallback(async (email: string) => {
    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signInError) throw signInError;

      setError(null);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
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
    signInWithEmail,
    signOut,
    user: session?.user ?? null,
  };
}
