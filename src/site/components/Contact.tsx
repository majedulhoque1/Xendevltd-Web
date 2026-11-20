// Contact list + enquiry form (prototype contactList()/leadForm()), wired for production
// (spec §6.1): saves to `inquiries` (admin Submissions), copies to the Google Sheet via
// webhook-proxy, pushes lead events to GTM. Personal data never goes to the dataLayer.
import { useEffect, useId, useState, type FormEvent } from "react";
import { getSupabase } from "../lib/db";
import { describeError } from "@/lib/describeError";
import { track } from "@/lib/analytics";
import { COMPANY, ENQUIRY_PROJECTS, FEATURED, type Project } from "../data/site";
import { isValidPhone, todayISO } from "../lib/phone";
import { IcMail, IcPhone, IcPin, IcWa } from "./icons";

export function ContactList() {
  return (
    <div className="contact-list">
      <a href={`tel:${COMPANY.phoneTel}`}><span className="ic"><IcPhone /></span><span><small>Hotline</small><b>{COMPANY.phones.join(" · ")}</b></span></a>
      <a href={COMPANY.whatsapp} target="_blank" rel="noopener"><span className="ic"><IcWa /></span><span><small>WhatsApp, for buyers abroad too</small><b>{COMPANY.phones[0]}</b></span></a>
      <a href={`mailto:${COMPANY.email}`}><span className="ic"><IcMail /></span><span><small>Email</small><b>{COMPANY.email}</b></span></a>
      <div><span className="ic"><IcPin /></span><span><small>Corporate office</small><b>{COMPANY.office}</b></span></div>
    </div>
  );
}

const WHEN = ["Now", "In 1–3 months", "In 3–6 months", "Just exploring"];
const WANTS = ["Visit the site", "Get the price", "Get a call back", "Video call (I live abroad)"];
const NOT_SURE = "Not sure yet";
const projectLabel = (p: Project) => `${p.name} · ${p.area}`;

export function LeadForm({ project, source = "enquiry" }: { project?: Project; source?: string }) {
  const id = "lead-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const preselect = project && project.status !== "completed" ? project : FEATURED;
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  // Set after mount: a prerendered page would otherwise keep the build date as the minimum.
  const [minDate, setMinDate] = useState<string>();
  useEffect(() => setMinDate(todayISO()), []);

  const onPhoneInput = (el: HTMLInputElement) => {
    el.setCustomValidity(el.value && !isValidPhone(el.value) ? "Please enter a valid phone number, e.g. 01712-345678 or +44 7700 900123." : "");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const phoneEl = f.elements.namedItem("phone") as HTMLInputElement;
    onPhoneInput(phoneEl);
    if (!f.reportValidity()) return;
    const fd = new FormData(f);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const projectName = String(fd.get("project") ?? "");
    const when = String(fd.get("when") ?? "");
    const wants = fd.getAll("want").map(String);
    const visitDay = String(fd.get("date") ?? "");
    const first = name.split(/\s+/)[0];
    const thanks = `Thank you, ${first}. We will call ${phone} within one working day.`;

    // Honeypot: bots fill every field. Pretend success, write nothing.
    if (String(fd.get("company") ?? "")) { setOk(thanks); setState("done"); return; }

    const message = [
      `Project: ${projectName}`,
      when && `Buying: ${when}`,
      wants.length > 0 && `Wants: ${wants.join(", ")}`,
      visitDay && `Visit day: ${visitDay}`,
    ].filter(Boolean).join(" · ");

    setState("sending"); setErr("");
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.from("inquiries").insert({
        type: "contact",
        name,
        phone,
        message,
        details: { project: projectName, when, wants, visitDay: visitDay || null, page: window.location.pathname, form: source },
      });
      if (error) throw error;
      // Google Sheet copy. A failure here must not lose the lead (it is already saved).
      supabase.functions.invoke("webhook-proxy", {
        body: { name, phone, message, source: "contact_form", submitted_at: new Date().toISOString(), status: "New" },
      }).catch(() => undefined);
      const proj = projectName === NOT_SURE ? "not_sure" : projectName;
      track("generate_lead", { form: source, project: proj });
      track("lead_submit", { form: source, project: proj });
      setOk(thanks);
      setState("done");
    } catch (error) {
      setErr(`${describeError(error)} You can also call us on ${COMPANY.phones[0]}.`);
      setState("idle");
    }
  };

  return (
    <form className="lead" id={id} noValidate onSubmit={onSubmit}>
      <h3>Book a visit or get the price</h3>
      <div className="field"><label htmlFor={`${id}-name`}>Full name</label><input id={`${id}-name`} name="name" autoComplete="name" required minLength={2} maxLength={100} /></div>
      <div className="field"><label htmlFor={`${id}-phone`}>Phone or WhatsApp</label><input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="01XXX-XXXXXX or +country code" required maxLength={20} onInput={(e) => onPhoneInput(e.currentTarget)} /></div>
      <div className="field field--full"><label htmlFor={`${id}-project`}>Project</label>
        <select id={`${id}-project`} name="project" defaultValue={projectLabel(preselect)}>
          {ENQUIRY_PROJECTS.map((p) => <option key={p.slug} value={projectLabel(p)}>{projectLabel(p)}</option>)}
          <option value={NOT_SURE}>{NOT_SURE}</option>
        </select>
      </div>
      <fieldset className="field field--full"><legend>When do you plan to buy?</legend>
        <div className="chips">{WHEN.map((t, i) => <label key={t}><input type="radio" name="when" value={t} defaultChecked={i === 0} /><span>{t}</span></label>)}</div>
      </fieldset>
      <fieldset className="field field--full"><legend>I would like to</legend>
        <div className="chips">{WANTS.map((t, i) => <label key={t}><input type="checkbox" name="want" value={t} defaultChecked={i < 2} /><span>{t}</span></label>)}</div>
      </fieldset>
      <div className="field field--full"><label htmlFor={`${id}-date`}>Preferred visit day <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label><input id={`${id}-date`} name="date" type="date" min={minDate} /></div>
      {/* Honeypot: hidden from people and screen readers. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="form-foot"><small>We call back within one working day. We never share your number.</small><button className="btn btn--green" type="submit" disabled={state !== "idle"}>{state === "sending" ? "Sending…" : "Send request"}</button></div>
      {state === "done" && <p className="form-ok" role="status">{ok}</p>}
      {err && <p className="form-ok" role="alert" style={{ background: "#fbe9e7", color: "#8a1c12" }}>{err}</p>}
    </form>
  );
}

