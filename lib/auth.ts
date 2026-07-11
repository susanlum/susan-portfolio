import type { SupabaseClient } from "@supabase/supabase-js";

// Returns the authenticated user or null. Write API routes call this and
// return 403 for anonymous requests (RLS enforces the same rule at the DB).
export async function getSessionUser(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
