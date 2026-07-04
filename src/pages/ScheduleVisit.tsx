import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, ChevronLeft, Clock, CalendarDays } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar } from "@/components/ui/calendar";
import { getAvailableSlots, requestBooking, type AvailableSlot } from "@/lib/booking";
import { BOOKABLE_PROJECTS } from "@/data/bookableProjects";

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";
const WINDOW_DAYS = 45;

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d);
}

function fmtFullDate(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(d);
}

type Step = "select" | "details";

const ScheduleVisit = () => {
  const { isDark, toggleTheme } = useTheme();
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [step, setStep] = useState<Step>("select");
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    project: BOOKABLE_PROJECTS[0] ?? "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      const from = toDateStr(new Date());
      const toDate = new Date();
      toDate.setDate(toDate.getDate() + WINDOW_DAYS);
      const slotData = await getAvailableSlots(from, toDateStr(toDate));
      setSlots(slotData);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const byDate = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of slots) {
      if (!map.has(s.slot_date)) map.set(s.slot_date, []);
      map.get(s.slot_date)!.push(s.slot_time);
    }
    return map;
  }, [slots]);

  const availableDays = useMemo(() => new Set(byDate.keys()), [byDate]);
  const selectedDateStr = selectedDay ? toDateStr(selectedDay) : null;
  const times = selectedDateStr ? (byDate.get(selectedDateStr) ?? []) : [];

  function chooseTime(t: string) {
    setSelectedTime(t);
    setMessage(null);
    setStep("details");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDateStr || !selectedTime) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await requestBooking({
        name: form.name,
        phone: form.phone,
        project: form.project,
        notes: form.notes,
        date: selectedDateStr,
        time: selectedTime,
      });
      if (res.status === "ok") {
        setDone(true);
      } else if (res.status === "slot_taken" || res.status === "invalid_slot") {
        setMessage("Sorry, that slot was just taken. Please pick another.");
        setSelectedTime(null);
        setStep("select");
        await load();
      } else {
        setMessage("Couldn't submit your request. Please try again.");
      }
    } catch {
      setMessage("Couldn't submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />
      <main className="section-padding pt-32">
        <div className="container-narrow max-w-2xl mx-auto">
          <span className="label-caps mb-4 block">Site Visit</span>
          <h1 className="heading-section mb-6">Schedule a Visit</h1>
          <div className="accent-line mb-8" />

          {done ? (
            <div className="card-premium p-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 text-primary" size={42} />
              <p className="text-foreground font-medium">
                Thank you! We've received your request. Our team will call shortly to confirm.
              </p>
            </div>
          ) : loading ? (
            <div className="card-premium p-10 flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin" size={18} />
            </div>
          ) : loadError ? (
            <div className="card-premium p-8 text-center text-destructive">
              Couldn't load the schedule. Please try again later.
            </div>
          ) : availableDays.size === 0 ? (
            <div className="card-premium p-8 text-center text-muted-foreground">
              No free slots are available right now. Please check back later.
            </div>
          ) : step === "details" && selectedDay && selectedTime ? (
            <div className="card-premium p-6 sm:p-8">
              <button
                type="button"
                onClick={() => {
                  setStep("select");
                  setSelectedTime(null);
                }}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition mb-4"
              >
                <ChevronLeft size={16} /> Back
              </button>

              <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4 mb-6 space-y-1.5">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CalendarDays size={16} className="text-primary" /> {fmtFullDate(selectedDay)}
                </p>
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock size={16} className="text-primary" /> {fmtTime(selectedTime)}
                </p>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Your details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-sm font-semibold text-foreground mb-1.5">Your Name</span>
                    <input
                      required
                      type="text"
                      className={inputCls}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-semibold text-foreground mb-1.5">Phone Number</span>
                    <input
                      required
                      type="tel"
                      className={inputCls}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="block text-sm font-semibold text-foreground mb-1.5">Which development?</span>
                  <select
                    required
                    className={inputCls}
                    value={form.project}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                  >
                    {BOOKABLE_PROJECTS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold text-foreground mb-1.5">Notes (optional)</span>
                  <textarea
                    rows={3}
                    className={inputCls}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </label>
                {message && <p className="text-sm text-destructive">{message}</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : "Request Visit"}
                </button>
              </form>
            </div>
          ) : (
            <div className="card-premium p-4 sm:p-6">
              {message && <p className="mb-4 text-sm text-destructive">{message}</p>}
              <div className="grid gap-6 md:grid-cols-[auto_1fr]">
                <div className="flex justify-center md:border-r md:border-border md:pr-6">
                  <Calendar
                    mode="single"
                    selected={selectedDay}
                    onSelect={(d) => {
                      setSelectedDay(d ?? undefined);
                      setSelectedTime(null);
                    }}
                    fromDate={new Date()}
                    disabled={(day) => !availableDays.has(toDateStr(day))}
                    className="p-0"
                  />
                </div>
                <div className="min-w-0">
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      {selectedDay ? fmtFullDate(selectedDay) : "Pick a date"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">All times are shown in local time</p>
                  </div>
                  {!selectedDay ? (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground text-center px-4">
                      Select a date to see available times.
                    </div>
                  ) : times.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No free times on this day.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                      {times.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => chooseTime(t)}
                          className="rounded-lg border border-primary/40 bg-background px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition"
                        >
                          {fmtTime(t)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScheduleVisit;
