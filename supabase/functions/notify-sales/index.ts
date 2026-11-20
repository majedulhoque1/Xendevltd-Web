// notify-sales — emails Xen's sales inbox the moment an enquiry or booking is saved
// (redesign spec §6.1: "speed of reply drives site visits").
// Called by the pg_net triggers in migration 20261119120003, never by browsers.
//
// Secrets (supabase secrets set …):
//   NOTIFY_SECRET   shared with the DB trigger (Vault secret 'notify_secret'); required
//   RESEND_API_KEY  Resend API key; required
//   SALES_EMAIL     one or more recipients, comma-separated; required
//   NOTIFY_FROM     sender, e.g. "Xen Website <leads@xendevltd.com>" (domain must be
//                   verified in Resend). Default onboarding@resend.dev can only send to
//                   the Resend account owner.
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected by Supabase.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.0";

type Row = Record<string, unknown>;
interface Payload { table?: string; record?: Row }

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const esc = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const str = (v: unknown) => (v === null || v === undefined ? "" : String(v)).trim();

/** BD mobile 01XXXXXXXXX → 8801XXXXXXXXX for wa.me; otherwise digits as given. */
const waDigits = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  if (/^01\d{9}$/.test(d)) return "88" + d;
  if (/^8801\d{9}$/.test(d)) return d;
  return d;
};

const dhakaTime = (iso: string) => {
  const d = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(d);
};

const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h)) return t;
  return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

function emailHtml(heading: string, rows: [string, string][], phone: string, adminPath: string) {
  const wa = phone ? `https://wa.me/${waDigits(phone)}` : "";
  const tr = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5b665e;font:13px Arial;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;color:#17201a;font:15px Arial">${esc(v)}</td></tr>`)
    .join("");
  const btn = (href: string, label: string, bg: string) =>
    `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;border-radius:999px;background:${bg};color:#fff;text-decoration:none;font:bold 14px Arial">${esc(label)}</a>`;
  return `<!doctype html><html><body style="margin:0;background:#f5f6f2;padding:24px">
  <div style="max-width:560px;margin:auto;background:#fff;border-radius:16px;padding:24px;border:1px solid #d6dbd2">
    <p style="margin:0 0 4px;font:600 11px Arial;letter-spacing:.12em;text-transform:uppercase;color:#0f4d2f">Xen website</p>
    <h1 style="margin:0 0 16px;font:normal 22px Georgia;color:#0f4d2f">${esc(heading)}</h1>
    <table style="border-collapse:collapse;width:100%">${tr}</table>
    <div style="margin-top:20px">
      ${phone ? btn(`tel:${phone.replace(/[^\d+]/g, "")}`, "Call now", "#0f4d2f") : ""}
      ${wa ? btn(wa, "WhatsApp", "#15803d") : ""}
      ${btn(`https://xendevltd.com${adminPath}`, "Open in admin", "#5b665e")}
    </div>
  </div></body></html>`;
}

serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const secret = Deno.env.get("NOTIFY_SECRET");
  if (!secret || req.headers.get("x-notify-secret") !== secret) return json({ error: "Unauthorized" }, 401);

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const to = (Deno.env.get("SALES_EMAIL") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const from = Deno.env.get("NOTIFY_FROM") || "Xen Website <onboarding@resend.dev>";
  if (!apiKey || to.length === 0) {
    console.error("notify-sales: RESEND_API_KEY or SALES_EMAIL not set");
    return json({ ok: false, error: "not configured" });
  }

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Bad JSON" }, 400);
  }
  const rec = payload.record ?? {};

  let subject = "";
  let html = "";
  let text = "";

  try {
    if (payload.table === "inquiries") {
      const d = (rec.details ?? {}) as Row;
      const name = str(rec.name), phone = str(rec.phone);
      const project = str(d.project) || "General";
      const wants = Array.isArray(d.wants) ? (d.wants as unknown[]).map(str).join(", ") : "";
      const rows: [string, string][] = [
        ["Name", name], ["Phone", phone], ["Project", project], ["Buying", str(d.when)], ["Wants", wants],
        ["Visit day", str(d.visitDay)], ["Message", str(rec.message)], ["Page", str(d.page)], ["Received", dhakaTime(str(rec.created_at))],
      ];
      subject = `New enquiry: ${name} · ${project}`;
      html = emailHtml("New enquiry from the website", rows, phone, "/admin/submissions");
      text = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n") + "\n\nAdmin: https://xendevltd.com/admin/submissions";
    } else if (payload.table === "bookings") {
      const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
      const { data: contact, error } = await sb.from("contacts").select("name, phone, details").eq("id", str(rec.contact_id)).maybeSingle();
      if (error) console.error("notify-sales: contact lookup failed:", error.message);
      const d = (rec.details ?? {}) as Row;
      const cd = (contact?.details ?? {}) as Row;
      const name = str(contact?.name) || "Unknown", phone = str(contact?.phone);
      const when = `${str(rec.date)} ${fmtTime(str(rec.time))}`;
      const rows: [string, string][] = [
        ["Name", name], ["Phone", phone], ["Project", str(d.project) || str(cd.project)], ["Visit", when],
        ["Status", str(rec.status)], ["Notes", str(rec.notes) || str(cd.notes)], ["Received", dhakaTime(str(rec.created_at))],
      ];
      subject = `New site visit request: ${name} · ${when}`;
      html = emailHtml("New site visit request", rows, phone, "/admin/bookings");
      text = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n") + "\n\nAdmin: https://xendevltd.com/admin/bookings";
    } else {
      return json({ error: "Unknown table" }, 400);
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html, text }),
    });
    if (!res.ok) {
      console.error("notify-sales: Resend error", res.status, await res.text());
      return json({ ok: false, status: res.status });
    }
    return json({ ok: true });
  } catch (err) {
    console.error("notify-sales: failed:", err instanceof Error ? err.message : String(err));
    return json({ ok: false });
  }
});
