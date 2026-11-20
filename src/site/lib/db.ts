// The Supabase client (~150 KB) is only needed when a public page reads floor status or
// sends a form, so it loads on demand instead of in the first-paint bundle.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

let client: Promise<SupabaseClient<Database>> | undefined;
export const getSupabase = () => (client ??= import("@/integrations/supabase/client").then((m) => m.supabase));
