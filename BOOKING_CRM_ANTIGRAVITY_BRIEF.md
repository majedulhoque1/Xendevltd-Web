# Antigravity brief — add Booking + Inquiry + Analytics + CRM + Admin to Xen

**Give this whole file to Antigravity** as a project rules/context file. It's the Xen-specific
playbook for consuming the `booking-crm-kit`. Read it, then follow it together with the kit's own
recipe.

- **Kit repo (the source of truth):** https://github.com/majedulhoque1/Booking_CRM.kit
- **This project (the target site):** `Xen-Development-Limited-main` (Vite + React 18 + shadcn/ui +
  Tailwind v3 + react-router-dom v6 + Supabase, built with Bun)
- **Goal:** add a scheduling/booking system, an inquiry form, first-party analytics, a minimal CRM,
  and an **admin panel** — all on Xen's existing Supabase project.

---

## 0. Setup

1. Clone the kit next to this repo so you can read it:
   ```bash
   git clone https://github.com/majedulhoque1/Booking_CRM.kit ../Booking_CRM.kit
   ```
2. In the kit, read **in this order**: `README.md` → `spec/RECIPE.md` → `contract/README.md`
   (data model + RPC API surface) → `notes/theming.md`, `notes/env.md`, `notes/verification.md` →
   `reference/site/` and `reference/admin/` (the code you adapt) → `adapters/antigravity/rules.md`.
   `spec/RECIPE.md` is the generic build flow; **this file overrides it wherever Xen differs.**
3. Use **Bun** in this repo (there's `bun.lock`). Do **not** create or commit `package-lock.json`
   (a stray one already exists — delete it; npm is not used here).

---

## 1. ⚠️ CRITICAL — reconcile the existing Supabase schema BEFORE applying the contract

Xen's Supabase already has objects the kit's contract also defines. The kit migrations are
idempotent (`create table if not exists`, `create or replace function`), which here is a **risk**:
they will silently skip your existing objects and may leave shapes the kit's RLS/RPCs don't expect.
**Diff first, reconcile, then apply — never blind-apply `0001–0008`.**

Inspect `src/integrations/supabase/types.ts` and `supabase/migrations/*.sql`. Known overlaps:

| Already in Xen | Kit defines (migration) | Required action |
|---|---|---|
| `user_roles` table | `0003_roles_and_profiles.sql` | Compare columns. If compatible, **keep Xen's and skip the kit's `user_roles` block**. If not, align them. |
| `has_role(...)` function | `0003` expects `has_role(uuid, app_role) → boolean` | **Confirm the signature.** If Xen's matches, REUSE it (the kit's RLS/RPCs call `has_role(auth.uid(),'admin')`). If it differs, do NOT create a second overload — align to one definition. |
| `app_role` enum | `0001_extensions_and_types.sql` (guarded) | Confirm it contains `'admin'`. Safe to leave as-is. |
| `leads` table (written by `src/components/LeadCapture.tsx`) | kit uses `contacts` + `inquiries` | **Decide with the team:** either (a) point new inquiries at the kit's `inquiries` table and migrate `leads` rows into `contacts`/`inquiries`, or (b) keep `leads` for the existing capture and use the kit tables only for the new booking flow. Document the choice. |
| edge functions `chat-ai`, `webhook-proxy` | kit adds `send-notifications` (+ a new `collect`) | No conflict — additive. |

**Apply order after reconciling:** run the *needed* migrations from `contract/migrations/` against
Xen's Supabase (via the `supabase` CLI — `supabase db push` — or the SQL editor), skipping/merging
the role pieces per the table above, then `contract/seed.sql`. Confirm with `contract/README.md`
that the final tables/columns/RPCs match what the reference code calls.

> Test on a **branch or throwaway Supabase project first** if at all possible. This is a live site.

---

## 2. Architectural adaptation — Xen is a Vite SPA (no server)

The kit's reference site is TanStack Start (has server routes). Xen is a client-only Vite SPA, so:

### Analytics collector → Supabase Edge Function (not `/api/collect`)
- The kit's `reference/site/routes/api.collect.ts` + `reference/site/lib/analytics-collect.ts` are a
  **server** collector. There is no server in this SPA, so port the collector logic into a new
  **Supabase Edge Function** (mirror the style of the existing `supabase/functions/chat-ai`), e.g.
  `supabase/functions/collect/index.ts`. Set `verify_jwt = false` for it in `supabase/config.toml`
  so the browser beacon can reach it unauthenticated.
- It inserts into `analytics_events` with the **service role** (available as an env var inside the
  function) — keeping `analytics_events` deny-all to anon, exactly as the contract intends.
- Adapt the request parsing: Supabase edge functions don't get Cloudflare headers — read the IP from
  `x-forwarded-for`; `country` (was `cf-ipcountry`) will be unavailable, so default it to `null`
  (acceptable — country breakdown just stays "Unknown").
- Vendor `reference/site/lib/analytics.ts` (the client beacon) as-is but point it at the function URL
  (`https://<project-ref>.supabase.co/functions/v1/collect`) instead of `/api/collect`.

### Routing → react-router-dom v6
- `reference/site/routes/book-consultation.tsx` and `contact.tsx` are TanStack file routes. Convert
  them to plain page components under `src/pages/` and register them in `src/App.tsx`'s `<Routes>`
  (e.g. `/book-consultation`, `/contact`), matching the existing pattern there.
- `reference/site/components/BookConsultationButton.tsx` uses TanStack `<Link>` → swap for
  `react-router-dom`'s `<Link to="/book-consultation">`.
- Keep the route paths `/book-consultation` and `/contact` if you can — the `analytics_conversions`
  RPC counts those exact paths as funnel pages. If you rename them, update the paths in
  `contract/migrations/0006_analytics_rpcs.sql` to match.

---

## 3. What drops in with light edits

- `reference/site/lib/booking.ts` — uses `@/integrations/supabase/client`; Xen already has that
  client, so it resolves to Xen's existing one (don't overwrite Xen's client).
- `reference/site/components/BookingCalendar.tsx`, `ConsultationForm.tsx` — Xen already has the
  shadcn `calendar`, `form`, `dialog`, `button`, `table` in `src/components/ui/`.
- `useLanguage` (`@/lib/language`): Xen has no i18n (only `ThemeContext`). **Stub it** to return
  `{ lang: "en" }` and drop the Bengali strings, OR add a trivial language hook. Don't pull in a
  full i18n system.
- **Theming:** Xen is **Tailwind v3** (config-based shadcn), not the v4 `@theme` the kit's
  `notes/theming.md` assumes. **Reuse Xen's existing shadcn tokens** in
  `tailwind.config.ts` / `src/index.css` — the kit components reference standard tokens
  (`primary`, `secondary`, `accent`, `border`, `card`-style surfaces). Map the kit's
  `--color-supporting` / `.btn-accent` / `.card-soft` to Xen's existing equivalents (or add them
  once). No re-theming beyond matching tokens.

---

## 4. Admin panel — build it INSIDE this app as a protected `/admin` section

Because Xen already has `user_roles` + `has_role` and the full dep set (react-query, recharts,
react-hook-form, zod, shadcn table/dialog/form), the simplest path is to add the admin **as routes
in this same Vite app** rather than a separate repo.

- Vendor `reference/admin/` (it's React + react-router + react-query — same stack):
  - `context/AuthContext.tsx`, `components/ProtectedRoute.tsx` (gates on session **and**
    `has_role` admin), `hooks/useIsAdmin.ts` + the 6 data hooks, `lib/slots.ts`, and the screens in
    `pages/` (Availability, Submissions, CRM, Bookings, Settings, Analytics).
  - Wrap the app (or the `/admin` subtree) in `AuthProvider` and a react-query `QueryClientProvider`
    (Xen already depends on react-query).
  - Register `/admin/*` routes behind `ProtectedRoute` in `App.tsx`.
- The admin's `lib/supabase.ts` from the kit can be replaced by Xen's existing
  `@/integrations/supabase/client` — use one client.
- **Bootstrap the first admin** (per `notes/env.md`): after a teammate signs up, run once in the SQL
  editor: `insert into public.user_roles (user_id, role) values ('<their-auth-uid>', 'admin') on conflict do nothing;`

---

## 5. Notifications

Deploy `contract/edge-functions/send-notifications` as a Supabase Edge Function. Pick a provider via
`NOTIFY_PROVIDER` (`sms_bd` | `twilio` | `whatsapp` | `webhook`) and set its secret + optional
`NOTIFY_BRAND="Xen Development"` (see the matrix in `notes/env.md`). Invoke it via a DB webhook on
insert into `notification_outbox`, or a per-minute cron.

---

## 6. Env (set in Supabase + the app)

Per `notes/env.md`, adapted for Xen:
- App (already set for Xen's Supabase): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- `collect` edge function: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANALYTICS_SALT`,
  `ANALYTICS_TZ` (set to your business timezone, e.g. `Asia/Dhaka`; must equal `site_settings.timezone`).
- `send-notifications` edge function: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NOTIFY_PROVIDER`
  + provider secret(s) + optional `NOTIFY_BRAND`.

---

## 7. Verify before calling it done (the gate)

Run `notes/verification.md`. Concretely for Xen:
1. Migrations applied cleanly (and re-apply is a no-op) — and your existing `leads`/`user_roles` are
   intact.
2. `bun run build` is green.
3. Booking round-trips through the UI: a free slot can be picked → `request_booking` returns `ok` →
   booking appears in the admin → confirming it enqueues a `notification_outbox` row.
4. The inquiry form inserts a row into `inquiries` (anon INSERT + honeypot), visible in admin Submissions.
5. After a pageview, an `analytics_events` row lands (via the `collect` edge function) and shows in
   admin Analytics.
6. The bootstrapped admin can sign in and read every screen; a non-admin sees nothing (RLS holds).

**Do not report success until these pass.** Don't claim a check you didn't actually run.

---

## 8. Guardrails

- This is a **live site on a live Supabase** — diff/reconcile before applying; prefer a branch or
  throwaway project for the first apply; back up before destructive changes.
- Keep `analytics_events` deny-all (server/service-role writes only) and `inquiries` anon-INSERT-only
  with the honeypot — these are the security model, don't loosen them.
- Match `contract/README.md` names exactly; don't fork the contract to fit the UI — adapt the UI.
- Commit in logical steps; use Bun; never commit `package-lock.json`.

---

## Feature → where it comes from (quick map)

| Feature | Backend (apply to Supabase) | Site (this app) | Admin (`/admin`) |
|---|---|---|---|
| **Schedule/booking** | `availability`, `bookings`, `get_available_slots`/`request_booking`/`reschedule_booking` | `BookingCalendar` + `/book-consultation` | `Bookings` + `Availability` |
| **Inquiry** | `inquiries` (anon INSERT + honeypot) | `ConsultationForm` + `/contact` | `Submissions` |
| **Analytics** | `analytics_events` + 5 `analytics_*` RPCs | beacon → `collect` edge fn | `Analytics` |
| **CRM** | `contacts` (+ notes) | leads flow in from booking/inquiry | `CRM` |
| **Admin panel** | reuse existing `user_roles` + `has_role` | — | auth + `ProtectedRoute` + all screens |
