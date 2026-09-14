import { describe, it, expect } from "vitest";
import { buildFeed, buildCounts } from "./adminFeed";
import type { BookingRow } from "@/hooks/useBookings";
import type { Submission } from "@/hooks/useSubmissions";

const NOW = new Date("2026-09-14T12:00:00");

function booking(overrides: Partial<BookingRow>): BookingRow {
  return {
    id: "b-" + Math.random().toString(36).slice(2),
    date: "2026-09-14",
    time: "10:00:00",
    status: "pending",
    source: "public",
    notes: null,
    details: { project: "Lakeview Tasmee" },
    contact: { name: "Test Contact", phone: "+8801000000000" },
    ...overrides,
  };
}

function submission(overrides: Partial<Submission>): Submission {
  return {
    id: "s-" + Math.random().toString(36).slice(2),
    type: "contact",
    name: "Test Lead",
    email: null,
    phone: "+8801000000000",
    message: "Interested in a unit",
    status: "new",
    details: {},
    created_at: "2026-09-14T09:00:00Z",
    ...overrides,
  };
}

describe("buildCounts", () => {
  it("counts today's visits as pending+confirmed bookings dated today", () => {
    const bookings = [
      booking({ id: "1", date: "2026-09-14", status: "pending" }),
      booking({ id: "2", date: "2026-09-14", status: "confirmed" }),
      booking({ id: "3", date: "2026-09-14", status: "cancelled" }),
      booking({ id: "4", date: "2026-09-15", status: "confirmed" }),
    ];
    const counts = buildCounts(bookings, [], NOW);
    expect(counts.visitsToday).toBe(2);
  });

  it("counts all pending bookings regardless of date as awaiting confirm", () => {
    const bookings = [
      booking({ id: "1", date: "2026-09-14", status: "pending" }),
      booking({ id: "2", date: "2026-09-10", status: "pending" }),
      booking({ id: "3", date: "2026-09-20", status: "confirmed" }),
    ];
    const counts = buildCounts(bookings, [], NOW);
    expect(counts.awaitingConfirm).toBe(2);
  });

  it("flags pending bookings dated before today as stale", () => {
    const bookings = [
      booking({ id: "1", date: "2026-09-10", status: "pending" }),
      booking({ id: "2", date: "2026-09-14", status: "pending" }),
      booking({ id: "3", date: "2026-09-20", status: "pending" }),
    ];
    const counts = buildCounts(bookings, [], NOW);
    expect(counts.stale).toBe(1);
  });

  it("counts new inquiries only", () => {
    const submissions = [
      submission({ id: "1", status: "new" }),
      submission({ id: "2", status: "contacted" }),
      submission({ id: "3", status: "closed" }),
      submission({ id: "4", status: "new" }),
    ];
    const counts = buildCounts([], submissions, NOW);
    expect(counts.newInquiries).toBe(2);
  });
});

describe("buildFeed", () => {
  it("orders items: today's visits, then overdue, then upcoming pending, then new inquiries", () => {
    const bookings = [
      booking({ id: "upcoming", date: "2026-09-20", status: "pending" }),
      booking({ id: "overdue", date: "2026-09-10", status: "pending" }),
      booking({ id: "today", date: "2026-09-14", status: "confirmed" }),
    ];
    const submissions = [submission({ id: "inq" })];
    const feed = buildFeed(bookings, submissions, NOW);
    expect(feed.map((f) => f.id)).toEqual(["today", "overdue", "upcoming", "inq"]);
    expect(feed.map((f) => f.kind)).toEqual([
      "visit-today",
      "booking-overdue",
      "booking-pending",
      "inquiry-new",
    ]);
  });

  it("sorts today's visits by time ascending", () => {
    const bookings = [
      booking({ id: "late", date: "2026-09-14", time: "15:30:00", status: "pending" }),
      booking({ id: "early", date: "2026-09-14", time: "09:00:00", status: "confirmed" }),
    ];
    const feed = buildFeed(bookings, [], NOW);
    expect(feed.map((f) => f.id)).toEqual(["early", "late"]);
  });

  it("treats a booking just after midnight as tomorrow, not today", () => {
    // NOW is 2026-09-14T12:00:00. A booking at 00:30 on 2026-09-15 is tomorrow.
    const bookings = [booking({ id: "past-midnight", date: "2026-09-15", time: "00:30:00", status: "pending" })];
    const feed = buildFeed(bookings, [], NOW);
    expect(feed[0].kind).toBe("booking-pending");
  });

  it("treats a booking late tonight as today", () => {
    const bookings = [booking({ id: "late-tonight", date: "2026-09-14", time: "23:30:00", status: "pending" })];
    const feed = buildFeed(bookings, [], NOW);
    expect(feed[0].kind).toBe("visit-today");
  });

  it("excludes cancelled bookings and non-new inquiries", () => {
    const bookings = [booking({ id: "cancelled", date: "2026-09-14", status: "cancelled" })];
    const submissions = [
      submission({ id: "contacted", status: "contacted" }),
      submission({ id: "closed", status: "closed" }),
    ];
    const feed = buildFeed(bookings, submissions, NOW);
    expect(feed).toHaveLength(0);
  });

  it("does not double-count a pending booking dated today in both today and overdue/upcoming groups", () => {
    const bookings = [booking({ id: "today-pending", date: "2026-09-14", time: "18:00:00", status: "pending" })];
    const feed = buildFeed(bookings, [], NOW);
    expect(feed).toHaveLength(1);
    expect(feed[0].kind).toBe("visit-today");
  });
});
