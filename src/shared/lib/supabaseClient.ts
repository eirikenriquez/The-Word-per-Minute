import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Browser-safe Supabase client.
 *
 * The publishable key is intentionally used on the client. User-owned table
 * access must be protected by Supabase Row Level Security policies.
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
