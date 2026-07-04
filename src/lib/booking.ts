import { supabase } from "@/integrations/supabase/client";

// Calls ONLY the security-definer RPCs (supabase/migrations/20260704120005_*). The
// browser never touches the bookings/contacts tables directly.

export interface AvailableSlot {
  slot_date: string; // "YYYY-MM-DD"
  slot_time: string; // "HH:MM:SS"
}

export type RequestBookingResult =
  | { status: "ok"; booking_id: string }
  | { status: "slot_taken" }
  | { status: "invalid_slot" }
  | { status: "invalid_input" };

export interface BookingInput {
  name: string;
  phone: string;
  project: string;
  notes: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM" or "HH:MM:SS"
}

export async function getAvailableSlots(from: string, to: string): Promise<AvailableSlot[]> {
  const { data, error } = await supabase.rpc("get_available_slots", { p_from: from, p_to: to });
  if (error) throw error;
  return (data ?? []) as AvailableSlot[];
}

export async function requestBooking(input: BookingInput): Promise<RequestBookingResult> {
  const { data, error } = await supabase.rpc("request_booking", {
    p_name: input.name,
    p_phone: input.phone,
    p_project: input.project,
    p_notes: input.notes,
    p_slot_date: input.date,
    p_slot_time: input.time,
  });
  if (error) throw error;
  return data as RequestBookingResult;
}
