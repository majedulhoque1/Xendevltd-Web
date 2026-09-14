import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { RescheduleResult } from "@/hooks/useBookings";

const STATUS_MESSAGE: Record<Exclude<RescheduleResult["status"], "ok">, string> = {
  forbidden: "You're not allowed to reschedule this booking.",
  not_found: "This booking no longer exists.",
  invalid_slot: "That's not a valid slot.",
  slot_taken: "That slot is already taken — pick a different time.",
};

interface RescheduleDialogProps {
  open: boolean;
  initialDate: string;
  /** "HH:MM" or "HH:MM:SS" — either works with <input type="time">. */
  initialTime: string;
  onClose: () => void;
  onSave: (args: { date: string; time: string }) => Promise<RescheduleResult>;
}

export function RescheduleDialog({ open, initialDate, initialTime, onClose, onSave }: RescheduleDialogProps) {
  const { toast } = useToast();
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime.slice(0, 5));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setDate(initialDate);
      setTime(initialTime.slice(0, 5));
    }
  }, [open, initialDate, initialTime]);

  async function handleSave() {
    setSaving(true);
    const res = await onSave({ date, time });
    setSaving(false);
    if (res.status !== "ok") {
      toast({ variant: "destructive", title: "Could not reschedule", description: STATUS_MESSAGE[res.status] });
    } else {
      toast({ title: "Booking rescheduled" });
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">New date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">New time</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>
        <DialogFooter>
          <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving…" : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
