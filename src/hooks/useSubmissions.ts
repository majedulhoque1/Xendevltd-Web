import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SubmissionStatus = "new" | "contacted" | "closed";

export interface Submission {
  id: string;
  type: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: SubmissionStatus;
  details: Record<string, unknown>;
  created_at: string;
}

export function useSubmissions() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["submissions"] });

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("id,type,name,email,phone,message,status,details,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Submission[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SubmissionStatus }) => {
      const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
  });

  const convertToContact = useMutation({
    mutationFn: async (s: Submission) => {
      const { data: existing } = await supabase
        .from("contacts")
        .select("id")
        .eq("source_submission_id", s.id)
        .maybeSingle();
      if (!existing) {
        const { error } = await supabase.from("contacts").insert({
          name: s.name,
          phone: s.phone,
          email: s.email,
          source_submission_id: s.id,
          details: s.details ?? {},
          notes: s.message,
        });
        if (error) throw error;
      }
      await supabase.from("inquiries").update({ status: "closed" }).eq("id", s.id);
    },
    onSuccess: () => {
      inv();
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return {
    submissions,
    isLoading,
    setStatus: setStatus.mutateAsync,
    remove: remove.mutateAsync,
    convertToContact: convertToContact.mutateAsync,
  };
}
