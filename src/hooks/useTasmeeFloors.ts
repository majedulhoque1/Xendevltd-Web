// Admin read/write for Lakeview Tasmee floor statuses (table tasmee_floors,
// migration 20261119120001). The public picker reads the same table
// (src/site/components/FloorTower.tsx) with the query key ["tasmee_floors"].
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { describeError } from "@/lib/describeError";
import { useToast } from "@/hooks/use-toast";

export type FloorStatus = "open" | "held" | "sold" | "unknown";
export interface TasmeeFloor { level: number; status: FloorStatus; updated_at: string }

const KEY = ["admin", "tasmee_floors"];

export function useTasmeeFloorsAdmin() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: floors = [], isLoading, error } = useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from("tasmee_floors").select("level,status,updated_at").order("level", { ascending: false });
      if (error) throw error;
      return (data ?? []) as TasmeeFloor[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ level, status }: { level: number; status: FloorStatus }) => {
      const { data, error } = await supabase.from("tasmee_floors").update({ status }).eq("level", level).select("level");
      if (error) throw error;
      // RLS silently filters an UPDATE the user isn't allowed to make; surface it.
      if (!data || data.length === 0) throw new Error("Not saved: your account can't edit floors.");
    },
    onMutate: async ({ level, status }) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<TasmeeFloor[]>(KEY);
      qc.setQueryData<TasmeeFloor[]>(KEY, (old = []) => old.map((f) => (f.level === level ? { ...f, status } : f)));
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY, ctx.prev);
      toast({ variant: "destructive", title: "Could not update floor", description: describeError(err) });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["tasmee_floors"] });
    },
  });

  return { floors, isLoading, error, setStatus };
}
