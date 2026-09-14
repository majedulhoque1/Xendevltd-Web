import { useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, Check, MessageCircle, Phone, Trash2, UserPlus, X } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { useSubmissions, type Submission } from "@/hooks/useSubmissions";
import { buildCounts, buildFeed, type FeedItem } from "@/lib/adminFeed";
import { telLink, waLink } from "@/lib/phone";
import { TriageTile } from "@/components/admin/TriageTile";
import { ActionCard, type ActionCardAction } from "@/components/admin/ActionCard";
import { RescheduleDialog } from "@/components/admin/RescheduleDialog";
import { ConfirmDialog, type ConfirmDialogState } from "@/components/admin/ConfirmDialog";

type TileKey = "visits-today" | "awaiting-confirm" | "new-inquiries";

function matchesFilter(item: FeedItem, filter: TileKey | null): boolean {
  if (!filter) return true;
  if (filter === "visits-today") return item.kind === "visit-today";
  if (filter === "new-inquiries") return item.kind === "inquiry-new";
  // "awaiting-confirm" mirrors the tile count: every pending booking,
  // whether it falls in the today group, overdue, or upcoming.
  return item.raw.status === "pending";
}

const AdminToday = () => {
  const { bookings, isLoading: bookingsLoading, setStatus: setBookingStatus, reschedule } = useBookings();
  const {
    submissions,
    isLoading: submissionsLoading,
    setStatus: setSubmissionStatus,
    remove: removeSubmission,
    convertToContact,
  } = useSubmissions();

  const [filter, setFilter] = useState<TileKey | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmDialogState | null>(null);

  const now = useMemo(() => new Date(), []);
  const counts = useMemo(() => buildCounts(bookings, submissions, now), [bookings, submissions, now]);
  const feed = useMemo(() => buildFeed(bookings, submissions, now), [bookings, submissions, now]);
  const visibleFeed = useMemo(() => feed.filter((item) => matchesFilter(item, filter)), [feed, filter]);

  const reschedulingBooking = bookings.find((b) => b.id === reschedulingId) ?? null;
  const isLoading = bookingsLoading || submissionsLoading;

  function toggleFilter(key: TileKey) {
    setFilter((current) => (current === key ? null : key));
  }

  function actionsFor(item: FeedItem): { primary: ActionCardAction[]; secondary: ActionCardAction[] } {
    if (item.kind === "inquiry-new") {
      const submission = item.raw as Submission;
      const primary: ActionCardAction[] = [];
      if (submission.phone) primary.push({ label: "WhatsApp", icon: MessageCircle, href: waLink(submission.phone) });
      primary.push({
        label: "Mark contacted",
        icon: Check,
        onClick: () => setSubmissionStatus({ id: submission.id, status: "contacted" }),
      });
      const secondary: ActionCardAction[] = [
        {
          label: "Add to CRM",
          icon: UserPlus,
          onClick: () =>
            setConfirmState({
              title: "Add to CRM",
              description: `Add "${submission.name}" to the CRM as a contact and close this inquiry?`,
              onConfirm: () => convertToContact(submission),
            }),
        },
        {
          label: "Delete",
          icon: Trash2,
          variant: "destructive",
          onClick: () =>
            setConfirmState({
              title: "Delete inquiry",
              description: `Delete the inquiry from "${submission.name}"? This cannot be undone.`,
              confirmLabel: "Delete",
              destructive: true,
              onConfirm: () => removeSubmission(submission.id),
            }),
        },
      ];
      return { primary, secondary };
    }

    // Booking (visit-today, booking-overdue, or booking-pending)
    const isPending = item.raw.status === "pending";
    const primary: ActionCardAction[] = isPending
      ? [{ label: "Confirm", icon: Check, onClick: () => setBookingStatus({ id: item.id, status: "confirmed" }) }]
      : [];
    if (item.phone) primary.push({ label: "Call", icon: Phone, href: telLink(item.phone) });
    if (!isPending && item.phone) primary.push({ label: "WhatsApp", icon: MessageCircle, href: waLink(item.phone) });

    const secondary: ActionCardAction[] = [
      { label: "Reschedule", icon: CalendarClock, onClick: () => setReschedulingId(item.id) },
      {
        label: "Cancel booking",
        icon: X,
        variant: "destructive",
        onClick: () => setBookingStatus({ id: item.id, status: "cancelled" }),
      },
    ];
    if (isPending && item.phone) secondary.push({ label: "WhatsApp", icon: MessageCircle, href: waLink(item.phone) });

    return { primary: primary.slice(0, 2), secondary };
  }

  function badgeFor(item: FeedItem) {
    if (item.kind === "inquiry-new") return { label: "New", className: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400" };
    if (item.kind === "booking-overdue") return { label: "Overdue", className: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" };
    if (item.raw.status === "confirmed") return { label: "Confirmed", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" };
    return { label: "Pending", className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" };
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Today</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {now.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <TriageTile
          count={counts.visitsToday}
          label="Visits today"
          selected={filter === "visits-today"}
          onToggle={() => toggleFilter("visits-today")}
        />
        <TriageTile
          count={counts.awaitingConfirm}
          label="Awaiting confirm"
          tone="amber"
          selected={filter === "awaiting-confirm"}
          onToggle={() => toggleFilter("awaiting-confirm")}
        />
        <TriageTile
          count={counts.newInquiries}
          label="New inquiries"
          tone="sky"
          selected={filter === "new-inquiries"}
          onToggle={() => toggleFilter("new-inquiries")}
        />
      </div>

      {counts.stale > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {counts.stale} past {counts.stale === 1 ? "visit" : "visits"} still unconfirmed
        </div>
      )}

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {filter ? "Filtered" : "Needs attention"}
        </h3>

        {isLoading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>
        ) : visibleFeed.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            {filter ? "Nothing matches this filter." : "All clear — no visits today, nothing waiting."}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {visibleFeed.map((item) => {
              const { primary, secondary } = actionsFor(item);
              return (
                <ActionCard
                  key={`${item.kind}-${item.id}`}
                  title={item.name}
                  subtitle={`${item.when} · ${item.context}`}
                  badge={badgeFor(item)}
                  primaryActions={primary}
                  secondaryActions={secondary}
                />
              );
            })}
          </div>
        )}
      </div>

      <RescheduleDialog
        open={reschedulingId !== null}
        initialDate={reschedulingBooking?.date ?? ""}
        initialTime={reschedulingBooking?.time ?? "09:00"}
        onClose={() => setReschedulingId(null)}
        onSave={(args) => reschedule({ id: reschedulingId!, ...args })}
      />

      <ConfirmDialog state={confirmState} onClose={() => setConfirmState(null)} />
    </div>
  );
};

export default AdminToday;
