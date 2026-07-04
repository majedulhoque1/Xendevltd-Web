import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Client-side admin check, driven by the user_roles self-read RLS policy: a logged-in
// user can read ONLY their own role rows, so a returned 'admin' row means the caller is
// an admin. The real security boundary is has_role() inside every RPC/RLS policy —
// this only drives UI/routing.
export function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("role", "admin")
        .maybeSingle();
      if (error) return false;
      return Boolean(data);
    },
  });
}
