import { differenceInCalendarDays, isToday, format, formatDistanceToNow } from "date-fns";
import type { BookingRow } from "@/hooks/useBookings";
import type { Submission } from "@/hooks/useSubmissions";

export type FeedKind = "visit-today" | "booking-overdue" | "booking-pending" | "inquiry-new";

export interface FeedItem {
  id: string;
  kind: FeedKind;
  name: string;
  phone: string | null;
  /** Short human label for when this happens/happened, e.g. "10:00" or "2h ago". */
  when: string;
  /** Project name for a booking, or a message excerpt for an inquiry. */
  context: string;
  raw: BookingRow | Submission;
}

export interface FeedCounts {
  visitsToday: number;
  awaitingConfirm: number;
  newInquiries: number;
  /** Pending bookings whose date has already passed — nothing auto-closes these. */
  stale: number;
}

function bookingDate(b: BookingRow): Date {
  return new Date(`${b.date}T${b.time}`);
}

function isFutureOrToday(b: BookingRow, now: Date): boolean {
  return differenceInCalendarDays(bookingDate(b), now) >= 0;
}

function isOverdue(b: BookingRow, now: Date): boolean {
  return differenceInCalendarDays(bookingDate(b), now) < 0;
}

export function buildCounts(bookings: BookingRow[], submissions: Submission[], now: Date): FeedCounts {
  const visitsToday = bookings.filter(
    (b) => (b.status === "pending" || b.status === "confirmed") && isToday(bookingDate(b)),
  ).length;
  const pending = bookings.filter((b) => b.status === "pending");
  const awaitingConfirm = pending.length;
  const stale = pending.filter((b) => isOverdue(b, now)).length;
  const newInquiries = submissions.filter((s) => s.status === "new").length;
  return { visitsToday, awaitingConfirm, newInquiries, stale };
}

/**
 * One priority-ordered feed instead of separate sections to triage between:
 * 1. Today's visits (time ascending)
 * 2. Overdue pending bookings (nothing ever auto-closes these — oldest first)
 * 3. Upcoming pending bookings (soonest first)
 * 4. New inquiries (newest first)
 */
export function buildFeed(bookings: BookingRow[], submissions: Submission[], now: Date): FeedItem[] {
  const visitsToday: FeedItem[] = bookings
    .filter((b) => (b.status === "pending" || b.status === "confirmed") && isToday(bookingDate(b)))
    .sort((a, b) => bookingDate(a).getTime() - bookingDate(b).getTime())
    .map((b) => bookingToFeedItem(b, "visit-today"));

  const pending = bookings.filter((b) => b.status === "pending" && !isToday(bookingDate(b)));

  const overdue: FeedItem[] = pending
    .filter((b) => isOverdue(b, now))
    .sort((a, b) => bookingDate(a).getTime() - bookingDate(b).getTime())
    .map((b) => bookingToFeedItem(b, "booking-overdue"));

  const upcoming: FeedItem[] = pending
    .filter((b) => isFutureOrToday(b, now))
    .sort((a, b) => bookingDate(a).getTime() - bookingDate(b).getTime())
    .map((b) => bookingToFeedItem(b, "booking-pending"));

  const inquiries: FeedItem[] = submissions
    .filter((s) => s.status === "new")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((s) => submissionToFeedItem(s));

  return [...visitsToday, ...overdue, ...upcoming, ...inquiries];
}

function bookingToFeedItem(b: BookingRow, kind: Exclude<FeedKind, "inquiry-new">): FeedItem {
  const d = bookingDate(b);
  const when = kind === "visit-today" ? b.time.slice(0, 5) : `${format(d, "EEE d MMM")} · ${b.time.slice(0, 5)}`;
  return {
    id: b.id,
    kind,
    name: b.contact?.name ?? "Unknown",
    phone: b.contact?.phone ?? null,
    when,
    context: b.details?.project ?? "—",
    raw: b,
  };
}

function submissionToFeedItem(s: Submission): FeedItem {
  return {
    id: s.id,
    kind: "inquiry-new",
    name: s.name,
    phone: s.phone,
    when: formatDistanceToNow(new Date(s.created_at), { addSuffix: true }),
    context: s.message ?? "—",
    raw: s,
  };
}
