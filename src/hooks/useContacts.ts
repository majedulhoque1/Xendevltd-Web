import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  branch: string | null;
  details: Record<string, unknown>;
  notes: string | null;
  created_at: string;
}

export function useContacts() {
  const qc = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("id,name,phone,email,branch,details,notes,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Contact[];
    },
  });

  const saveNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase.from("contacts").update({ notes }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });

  return { contacts, isLoading, saveNotes: saveNotes.mutateAsync };
}
