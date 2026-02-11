import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client — respects RLS, used for public reads
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client — bypasses RLS, used for create/update/delete (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
