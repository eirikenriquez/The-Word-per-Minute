import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

const supabaseUrl = getRequiredSupabaseEnvValue(
  "VITE_SUPABASE_URL",
  import.meta.env.VITE_SUPABASE_URL,
);
const supabasePublishableKey = getRequiredSupabaseEnvValue(
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

/**
 * Browser-safe Supabase client.
 *
 * The publishable key is intentionally used on the client. User-owned table
 * access must be protected by Supabase Row Level Security policies.
 */
export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);

function getRequiredSupabaseEnvValue(name: string, value: string | undefined) {
  if (value) return value;

  throw new Error(
    `Missing ${name}. Add it to .env.local for local development and to Vercel environment variables for deployment.`,
  );
}
