import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Client-side admin check. Scoped to the caller's OWN user_id: an admin can read
// every user_roles row (the "Admins can read user_roles" policy), so an unscoped
// `.eq("role","admin")` returns one row per admin and .maybeSingle() then errors
// once a second admin exists. Filtering by user_id keeps the result to at most one
// row (unique(user_id, role)). The real security boundary is has_role() inside every
// RPC/RLS policy — this only drives UI/routing.
//
// `enabled` gates the query on an authenticated session: anon has no grant on
// user_roles (revoked), so firing this logged-out would only ever return a
// guaranteed 401. Callers pass their auth state so the request is skipped entirely.
export function useIsAdmin(enabled = true) {
  return useQuery({
    queryKey: ["is-admin"],
    enabled,
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (error) return false;
      return Boolean(data);
    },
  });
}
