// Real site-visit booking (DEVIATIONS.md B1) in the prototype's form-card style.
// Same data path as the old /schedule-visit page: open slots come from admin "Hours"
// (get_available_slots), requests land in admin "Visits" (request_booking).
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getAvailableSlots, requestBooking, type AvailableSlot } from "@/lib/booking";
import { describeError } from "@/lib/describeError";
import { track } from "@/lib/analytics";
import { COMPANY, ENQUIRY_PROJECTS, FEATURED, waLink } from "../data/site";
import { isValidPhone } from "../lib/phone";

const WINDOW_DAYS = 45;
const MAX_DAYS_SHOWN = 12;

const toDateStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmtDay = (s: string) => new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" }).format(new Date(s + "T00:00:00"));
const fmtFullDay = (s: string) => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date(s + "T00:00:00"));
const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d);
};

export function VisitBooking({ onQuickRequest }: { onQuickRequest?: () => void }) {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function load() {
    setLoading(true); setLoadError(false);
    try {
      const to = new Date(); to.setDate(to.getDate() + WINDOW_DAYS);
      setSlots(await getAvailableSlots(toDateStr(new Date()), toDateStr(to)));
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { void load(); }, []);

  const byDate = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const s of slots) { if (!m.has(s.slot_date)) m.set(s.slot_date, []); m.get(s.slot_date)!.push(s.slot_time); }
    return m;
  }, [slots]);
  const days = useMemo(() => [...byDate.keys()].sort().slice(0, MAX_DAYS_SHOWN), [byDate]);
  const times = day ? [...(byDate.get(day) ?? [])].sort() : [];

  const onPhoneInput = (el: HTMLInputElement) =>
    el.setCustomValidity(el.value && !isValidPhone(el.value) ? "Please enter a valid phone number, e.g. 01712-345678 or +44 7700 900123." : "");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    onPhoneInput(f.elements.namedItem("phone") as HTMLInputElement);
    if (!day || !time) { setMessage("Please pick a day and a time first."); return; }
    if (!f.reportValidity()) return;
    const fd = new FormData(f);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const project = String(fd.get("project") ?? "");
    const notes = String(fd.get("notes") ?? "").trim();
    setSending(true); setMessage(null);
    try {
      const res = await requestBooking({ name, phone, project, notes, date: day, time });
      if (res.status === "ok") {
        track("generate_lead", { form: "site_visit", project });
        track("lead_submit", { form: "site_visit", project });
        setDone(`Thank you, ${name.split(/\s+/)[0]}. Your visit on ${fmtFullDay(day)} at ${fmtTime(time)} is requested. We will call ${phone} to confirm.`);
      } else if (res.status === "slot_taken" || res.status === "invalid_slot") {
        setMessage("Sorry, that time was just taken. Please pick another.");
        setTime(null);
        await load();
      } else {
        setMessage("Please check your name and phone number and try again.");
      }
    } catch (error) {
      setMessage(`${describeError(error)} You can also call us on ${COMPANY.phones[0]}.`);
    } finally {
      setSending(false);
    }
  }

  const fallback = (text: string) => (
    <div className="lead" style={{ display: "grid", gap: 14 }}>
      <h3>Book a site visit</h3>
      <p style={{ color: "var(--muted)" }}>{text}</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a className="btn btn--green" href={waLink("Hi, I'd like to book a site visit to Xen Lakeview Tasmee.")} target="_blank" rel="noopener">Book on WhatsApp</a>
        {onQuickRequest && <button type="button" className="btn btn--ghost" style={{ color: "var(--forest)" }} onClick={onQuickRequest}>Send a quick request</button>}
      </div>
    </div>
  );

  if (loading) return <div className="lead" aria-busy="true" style={{ display: "grid", gap: 14 }}><h3>Book a site visit</h3><p style={{ color: "var(--muted)" }}>Loading open visit times…</p></div>;
  if (loadError) return fallback("We couldn't load the visit times just now. Message us on WhatsApp and we'll fix a time with you.");
  if (days.length === 0) return fallback("All visit times are taken for now. Message us on WhatsApp and we'll fit you in.");

  return (
    <form className="lead" noValidate onSubmit={submit} aria-label="Book a site visit">
      <h3>Book a site visit</h3>
      <fieldset className="field field--full"><legend>Pick a day</legend>
        <div className="chips">
          {days.map((d) => (
            <label key={d}><input type="radio" name="day" value={d} checked={day === d} onChange={() => { setDay(d); setTime(null); setMessage(null); }} /><span>{fmtDay(d)}</span></label>
          ))}
        </div>
      </fieldset>
      <fieldset className="field field--full"><legend>Pick a time {day && <span style={{ color: "var(--muted)", fontWeight: 400 }}>· {fmtFullDay(day)}, Bangladesh time</span>}</legend>
        {day ? (
          <div className="chips">
            {times.map((t) => (
              <label key={t}><input type="radio" name="time" value={t} checked={time === t} onChange={() => { setTime(t); setMessage(null); }} /><span>{fmtTime(t)}</span></label>
            ))}
          </div>
        ) : (
          <small style={{ color: "var(--muted)" }}>Choose a day to see the open times.</small>
        )}
      </fieldset>
      <div className="field"><label htmlFor="visit-name">Full name</label><input id="visit-name" name="name" autoComplete="name" required minLength={2} maxLength={100} /></div>
      <div className="field"><label htmlFor="visit-phone">Phone or WhatsApp</label><input id="visit-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="01XXX-XXXXXX or +country code" required maxLength={20} onInput={(e) => onPhoneInput(e.currentTarget)} /></div>
      <div className="field field--full"><label htmlFor="visit-project">Project</label>
        <select id="visit-project" name="project" defaultValue={FEATURED.name}>
          {ENQUIRY_PROJECTS.map((p) => <option key={p.slug} value={p.name}>{p.name} · {p.area}</option>)}
        </select>
      </div>
      <div className="field field--full"><label htmlFor="visit-notes">Anything we should know? <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label><textarea id="visit-notes" name="notes" rows={2} maxLength={1000} placeholder="e.g. coming from Gulshan, prefer a call first" /></div>
      <div className="form-foot">
        <small>We call to confirm your visit. We never share your number.</small>
        <button className="btn btn--green" type="submit" disabled={sending || !!done}>{sending ? "Sending…" : "Request visit"}</button>
      </div>
      {message && <p className="form-ok" role="alert" style={{ background: "#fbe9e7", color: "#8a1c12" }}>{message}</p>}
      {done && <p className="form-ok" role="status">{done}</p>}
      {onQuickRequest && !done && (
        <p className="field--full" style={{ fontSize: ".92rem" }}>
          <button type="button" className="link-arrow" style={{ background: "none", border: 0, padding: 0, cursor: "pointer", font: "inherit", fontWeight: 700 }} onClick={onQuickRequest}>Only want the price? Send a quick request</button>
        </p>
      )}
    </form>
  );
}
