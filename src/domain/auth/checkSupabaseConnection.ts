import { supabase } from "../../shared/lib/supabaseClient";

export type SupabaseConnectionCheck = {
  hasSession: boolean;
};

/**
 * Checks whether the browser Supabase client can reach Supabase Auth.
 *
 * This does not sign a user in and does not require database tables. A missing
 * session is still a successful connection check for a guest user.
 */
export async function checkSupabaseConnection(): Promise<SupabaseConnectionCheck> {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return {
    hasSession: Boolean(data.session),
  };
}
