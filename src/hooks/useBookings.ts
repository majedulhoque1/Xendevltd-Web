import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { describeError } from "@/lib/describeError";
import { useToast } from "@/hooks/use-toast";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface BookingRow {
  id: string;
  date: string;
  time: string;
  status: BookingStatus;
  source: string;
  notes: string | null;
  details: { project?: string } | null;
  contact: { name: string; phone: string | null } | null;
}

export type RescheduleResult = { status: "ok" | "forbidden" | "not_found" | "invalid_slot" | "slot_taken" };

export function useBookings() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const inv = () => qc.invalidateQueries({ queryKey: ["bookings"] });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id,date,time,status,source,notes,details,contact:contacts(name,phone)")
        .order("date", { ascending: false })
        .order("time");
      if (error) throw error;
      return (data ?? []) as unknown as BookingRow[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
    onError: (error) => {
      toast({ variant: "destructive", title: "Could not update booking", description: describeError(error) });
    },
  });

  const reschedule = useMutation({
    mutationFn: async (args: { id: string; date: string; time: string }) => {
      const { data, error } = await supabase.rpc("reschedule_booking", {
        p_booking_id: args.id,
        p_slot_date: args.date,
        p_slot_time: args.time,
      });
      if (error) throw error;
      return data as RescheduleResult;
    },
    onSuccess: inv,
  });

  return {
    bookings,
    isLoading,
    setStatus: setStatus.mutateAsync,
    reschedule: reschedule.mutateAsync,
  };
}
