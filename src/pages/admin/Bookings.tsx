import { useState } from "react";
import { Check, X, CalendarClock, Phone, MessageCircle } from "lucide-react";
import { useBookings, type BookingStatus } from "@/hooks/useBookings";
import { Badge } from "@/components/ui/badge";
import { ActionCard, type ActionCardAction } from "@/components/admin/ActionCard";
import { RescheduleDialog } from "@/components/admin/RescheduleDialog";
import { telLink, waLink } from "@/lib/phone";

const TONE: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  confirmed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  cancelled: "bg-stone-100 text-stone-600 dark:bg-stone-500/10 dark:text-stone-400",
};

const AdminBookings = () => {
  const { bookings, isLoading, setStatus, reschedule } = useBookings();
  const [rescheduling, setRescheduling] = useState<string | null>(null);
  const reschedulingBooking = bookings.find((b) => b.id === rescheduling) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Bookings</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Confirm, cancel, or reschedule site-visit bookings.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No bookings yet.
        </div>
      ) : (
        <>
          {/* Phone: card list, thumb-sized actions */}
          <div className="grid gap-3 md:hidden">
            {bookings.map((b) => {
              const dateLabel = new Date(`${b.date}T00:00`).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const primary: ActionCardAction[] = [];
              if (b.status !== "confirmed") {
                primary.push({ label: "Confirm", icon: Check, onClick: () => setStatus({ id: b.id, status: "confirmed" }) });
              }
              if (b.contact?.phone) primary.push({ label: "Call", icon: Phone, href: telLink(b.contact.phone) });

              const secondary: ActionCardAction[] = [
                { label: "Reschedule", icon: CalendarClock, onClick: () => setRescheduling(b.id) },
              ];
              if (b.contact?.phone) secondary.push({ label: "WhatsApp", icon: MessageCircle, href: waLink(b.contact.phone) });
              if (b.status !== "cancelled") {
                secondary.push({
                  label: "Cancel booking",
                  icon: X,
                  variant: "destructive",
                  onClick: () => setStatus({ id: b.id, status: "cancelled" }),
                });
              }

              return (
                <ActionCard
                  key={b.id}
                  title={b.contact?.name ?? "Unknown"}
                  subtitle={`${dateLabel} · ${b.time.slice(0, 5)} · ${b.details?.project ?? "—"}`}
                  badge={{ label: b.status, className: TONE[b.status] }}
                  primaryActions={primary.slice(0, 2)}
                  secondaryActions={secondary}
                />
              );
            })}
          </div>

          {/* Desktop: dense table */}
          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card shadow-sm md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Project</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3 text-foreground">
                      {new Date(`${b.date}T00:00`).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.time.slice(0, 5)}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{b.contact?.name ?? "—"}</span>
                      {b.contact?.phone && (
                        <span className="ml-2 text-xs text-muted-foreground">{b.contact.phone}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.details?.project ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge className={TONE[b.status]} variant="outline">
                        {b.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {b.status !== "confirmed" && (
                          <button
                            type="button"
                            onClick={() => setStatus({ id: b.id, status: "confirmed" })}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-emerald-600"
                            aria-label="Confirm"
                            title="Confirm"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            type="button"
                            onClick={() => setStatus({ id: b.id, status: "cancelled" })}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-destructive"
                            aria-label="Cancel"
                            title="Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setRescheduling(b.id)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-primary"
                          aria-label="Reschedule"
                          title="Reschedule"
                        >
                          <CalendarClock className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <RescheduleDialog
        open={rescheduling !== null}
        initialDate={reschedulingBooking?.date ?? ""}
        initialTime={reschedulingBooking?.time ?? "09:00"}
        onClose={() => setRescheduling(null)}
        onSave={(args) => reschedule({ id: rescheduling!, ...args })}
      />
    </div>
  );
};

export default AdminBookings;
