import { useState } from "react";
import { Plus, Trash2, Check, X } from "lucide-react";
import { useAvailability, type AvailabilityInput } from "@/hooks/useAvailability";
import { generateDaySlots } from "@/lib/slots";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function AddWindowDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (input: AvailabilityInput) => Promise<void>;
}) {
  const [weekday, setWeekday] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotMinutes, setSlotMinutes] = useState(60);
  const [saving, setSaving] = useState(false);
  const preview = generateDaySlots(startTime, endTime, slotMinutes);

  async function handleSave() {
    setSaving(true);
    await onSave({ weekday, start_time: startTime, end_time: endTime, slot_minutes: slotMinutes });
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add availability window</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Day of week</span>
            <select
              value={weekday}
              onChange={(e) => setWeekday(Number(e.target.value))}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none"
            >
              {WEEKDAYS.map((d, i) => (
                <option key={i} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Start</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">End</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Slot length (minutes)</span>
            <input
              type="number"
              min={5}
              max={480}
              step={5}
              value={slotMinutes}
              onChange={(e) => setSlotMinutes(Number(e.target.value))}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none"
            />
          </label>
          <div className="rounded-lg border border-border bg-background p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Preview — {preview.length} slot{preview.length === 1 ? "" : "s"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {preview.length === 0 ? (
                <span className="text-xs text-muted-foreground">No slots — widen the window.</span>
              ) : (
                preview.map((t) => (
                  <span key={t} className="rounded bg-card px-2 py-1 text-xs text-foreground">
                    {t}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Add window"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const AdminAvailability = () => {
  const { windows, isLoading, create, toggle, remove } = useAvailability();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Availability</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Define the weekly windows visitors can book site visits in.
          </p>
        </div>
        <button type="button" onClick={() => setDialogOpen(true)} className="btn-primary inline-flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add window
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading availability…</div>
      ) : windows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No availability yet. Add a window so visitors can book.
        </div>
      ) : (
        <div className="space-y-6">
          {WEEKDAYS.map((dayName, day) => {
            const dayWindows = windows.filter((w) => w.weekday === day);
            if (dayWindows.length === 0) return null;
            return (
              <div key={day} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-foreground">{dayName}</h3>
                <ul className="space-y-2">
                  {dayWindows.map((w) => (
                    <li
                      key={w.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2"
                    >
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-medium text-foreground">
                          {w.start_time.slice(0, 5)} – {w.end_time.slice(0, 5)}
                        </span>
                        <span className="text-muted-foreground">{w.slot_minutes} min slots</span>
                        <Badge
                          variant="outline"
                          className={w.active ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"}
                        >
                          {w.active ? "Active" : "Off"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggle({ id: w.id, active: !w.active })}
                          className={cn(
                            "rounded-md p-1.5 transition-colors hover:bg-card",
                            w.active ? "text-muted-foreground hover:text-destructive" : "text-muted-foreground hover:text-emerald-600",
                          )}
                          aria-label={w.active ? "Disable" : "Enable"}
                        >
                          {w.active ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(w.id)}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-destructive"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      <AddWindowDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={create} />
    </div>
  );
};

export default AdminAvailability;
