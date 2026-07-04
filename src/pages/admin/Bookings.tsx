import { useState } from "react";
import { Check, X, CalendarClock } from "lucide-react";
import { useBookings, type BookingStatus } from "@/hooks/useBookings";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const TONE: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-stone-100 text-stone-600",
};

const AdminBookings = () => {
  const { bookings, isLoading, setStatus, reschedule } = useBookings();
  const { toast } = useToast();
  const [rescheduling, setRescheduling] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  async function onReschedule() {
    if (!rescheduling || !newDate || !newTime) return;
    const res = await reschedule({ id: rescheduling, date: newDate, time: newTime });
    if (res.status !== "ok") {
      toast({ variant: "destructive", title: "Could not reschedule", description: res.status });
    } else {
      toast({ title: "Booking rescheduled" });
      setRescheduling(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Bookings</h2>
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
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
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
                <tr key={b.id} className="border-b border-border/60 last:border-0">
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
                        onClick={() => {
                          setRescheduling(b.id);
                          setNewDate(b.date);
                          setNewTime(b.time.slice(0, 5));
                        }}
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
      )}

      <Dialog open={rescheduling !== null} onOpenChange={(open) => !open && setRescheduling(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">New date</span>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">New time</span>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={onReschedule}
              className="btn-primary"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
