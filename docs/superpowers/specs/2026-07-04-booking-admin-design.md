# Booking + Inquiry + Admin panel for Xen Development Limited

Status: approved 2026-07-04. Source: `booking-crm-kit` (https://github.com/majedulhoque1/Booking_CRM.kit),
cloned locally to `d:/EXPERIUS/Websites/Booking_CRM.kit` for reference during implementation.
Also see `BOOKING_CRM_ANTIGRAVITY_BRIEF.md` in this repo (earlier brief covering the same reconciliation).

## Goal

Add a self-hosted site-visit booking calendar, a callback/inquiry form, and a protected `/admin`
panel to the existing Xen marketing site (Vite + React 18 + shadcn/ui + Tailwind v3 +
react-router-dom v6 + Supabase, built with Bun). Mirrors the pattern already proven on Angel
Foundation, adapted to Xen's real-estate domain (site visits to a project, not clinic
consultations) and to Xen being a single Vite SPA (admin lives in this same app, not a separate repo).

## Decisions locked in during brainstorming

1. **Data model**: fully adopt the kit's contract (`contacts`, `bookings`, `availability`,
   `inquiries`, `notification_outbox`, `analytics_events`, `site_settings`, `kit_meta`,
   `profiles`) rather than keep the existing `leads` table as the live path. `leads` becomes a
   frozen historical archive; its rows are backfilled once into `inquiries`.
2. **Notifications**: none wired for v1. `notification_outbox` still fills (harmless, unread) via
   the kit's trigger — no `send-notifications` edge function deploy, no `NOTIFY_PROVIDER` secret
   this round. Easy to add later exactly like Angel Foundation did.
3. **Routing**: new dedicated `/schedule-visit` (calendar booking) and `/contact` (callback form)
   pages, replacing the current anchor-scroll-to-homepage-section pattern.
4. **Admin scope v1**: Bookings, Availability, Submissions, CRM. Analytics and Settings screens
   are out of scope for v1 (their backing tables/RPCs still get created since they're part of the
   fixed contract, just no UI yet); `site_settings` values are set directly via SQL instead.

## Backend: schema changes

Apply `Booking_CRM.kit/contract/migrations/0001` through `0008` in order, then a Xen-specific
`0009_xen_backfill.sql`, as new timestamped files under `supabase/migrations/` in **this** repo
(matching the existing naming convention of the 3 files already there). All kit migrations are
idempotent (`create table if not exists`, guarded `do $$` blocks, `create or replace function`).

**Reconciliation with what Xen already has** (verified by reading the existing 3 migrations):
- `app_role` enum already exists with `admin`/`moderator`/`user` — kit's `0001` guards creation
  with `if not exists (select 1 from pg_type ...)`, so it's a no-op. Kit only needs `'admin'` to
  exist, which it does.
- `user_roles` table already exists with the exact shape the kit's `0003` would create
  (`id uuid pk`, `user_id → auth.users`, `role app_role not null`, `created_at`,
  `unique(user_id, role)`) — `create table if not exists` skips it.
- `has_role(uuid, app_role) returns boolean` already exists with an identical body — kit's
  `create or replace function` is a harmless overwrite (same signature, same logic).
- `0003` additionally creates `profiles` (new to Xen) + the `handle_new_user()` trigger on
  `auth.users` — net new, no conflict found.
- `leads`, `chat_logs`, `projects` tables and the `chat-ai`/`webhook-proxy` edge functions are
  untouched — outside the kit's contract, purely additive coexistence.

**`request_booking` signature adapted for real estate** (the kit's own comments say intake
fields are meant to be swapped per client — the core tables never change):

```sql
create or replace function public.request_booking(
  p_name text,
  p_phone text,
  p_project text,       -- was p_branch; a projects.title value (free text, not FK — projects can be renamed)
  p_notes text,          -- was p_concern
  p_slot_date date,
  p_slot_time time
)
returns jsonb
```

Dropped entirely from the reference signature: `p_child_age` (not applicable) and `p_language`
(Xen has no i18n). `p_project`/`p_notes` land in `contacts.details` jsonb exactly like
`child_age`/`concern` did in the reference — no table schema change. Grants updated to the new
signature.

**`0009_xen_backfill.sql`** (new, Xen-only, idempotent via a guard column or one-time marker):
- `insert into public.inquiries (type, name, phone, email, message, created_at) select 'contact',
  full_name, phone, email, message, created_at from public.leads on conflict do nothing` — but
  since `inquiries` has no natural unique key to conflict on, guard the whole backfill with a
  one-row marker in `kit_meta`-adjacent table or a `where not exists (select 1 from public.inquiries
  where inquiries.created_at = leads.created_at and inquiries.phone = leads.phone)` correlation
  instead, so re-running the migration file doesn't duplicate rows.
- `leads` table: no `DROP`, no further writes after the app cutover (enforced by the frontend
  change below, not by revoking DB grants — keep it simple, it's already admin-read-only per the
  existing RLS from migration 2).
- Seed `site_settings`: `update public.site_settings set value = 'Asia/Dhaka' where key =
  'timezone'`. Leave `notify_staff_phone` blank.
- Seed `availability`: keep the kit's default seed (Mon–Fri, 09:00–12:00 & 14:00–17:00,
  60-minute slots) unless the user gives different site-visit hours before I apply it — ask if
  unspecified, don't guess business hours silently.

## Public site changes

- **`src/pages/ScheduleVisit.tsx`** (new) at route `/schedule-visit`: two-step booking UI adapted
  from `Booking_CRM.kit/reference/site/components/BookingCalendar.tsx` — calendar/slot picker,
  then a details step (name, phone, project select sourced from `public.projects.title`, notes).
  Calls `get_available_slots` then `request_booking`. Uses Xen's existing shadcn `calendar`,
  `form`, `dialog`, `button` components and existing Tailwind tokens (`primary`, `secondary`,
  `card`) — no new theme tokens needed, this is Tailwind v3 config-based shadcn already.
- **`src/pages/Contact.tsx`** (new) at route `/contact`: houses the callback form, adapted from
  the current `src/components/LeadCapture.tsx` (same visual design/copy/animation, kept as-is)
  but insert target changes from `leads` to `inquiries` (`type: 'contact'`), plus an added
  honeypot field (required by the kit's anon-insert RLS model — `inquiries_anon_insert` policy
  has no rate-limit, honeypot is the abuse guard). The existing `webhook-proxy` invoke (Google
  Sheets forwarding) is preserved unchanged after the DB insert.
- **`src/components/HeroSection.tsx`**: "Book A Visit" link target changes from `/contact` to
  `/schedule-visit` (line ~163 today).
- **`src/pages/Index.tsx`**: drop the full `<LeadCapture />` section; replace with a slim
  "Have Questions? Contact Us" callout section linking to `/contact`, so the homepage keeps a
  contact CTA without duplicating the full form.
- **`src/App.tsx`**: register `/schedule-visit` and `/contact` routes.

## Admin panel (`/admin/*`, inside this same Vite app)

Vendor from `Booking_CRM.kit/reference/admin/`, themed to Xen's existing tokens (no new design
system — reuse `primary`/`secondary`/`card` etc. already in `tailwind.config.ts`):

- Foundation: `AppShell`, `PageHeader`, `EmptyState`, `StatCard`, `StatusBadge`,
  `PageErrorBoundary`, `ToastProvider`/`useToast`.
- Auth/data layer (contract-bound, copied near-verbatim): `AuthContext`, `ProtectedRoute`
  (gates on session **and** `has_role('admin')`), `useIsAdmin`, `useAvailability`, `useBookings`,
  `useContacts`, `useSubmissions`. (`useAnalytics`, `useSettings`, and their pages are **not**
  wired into routes for v1 per the locked scope — files can still be vendored for a fast v2 add,
  just not routed.)
- Screens routed: `/admin/login`, `/admin` (redirects to `/admin/bookings`), `/admin/bookings`
  (confirm/cancel + `TimeGridCalendar` + `reschedule_booking` RPC), `/admin/availability`
  (weekly CRUD), `/admin/submissions` (inquiries triage: new → contacted → closed, plus
  convert-to-contact/promote-to-booking), `/admin/crm` (contacts list + inline notes).
- Xen's existing `@/integrations/supabase/client` is reused as the one Supabase client — the
  kit's own `reference/admin/lib/supabase.ts` is not needed as a second client.
- Bootstrap: after a staff member signs up via `/admin/login`'s sign-up path (or Supabase Auth
  directly), run once: `insert into public.user_roles (user_id, role) values ('<uid>', 'admin')
  on conflict do nothing;`.

## Env

No new client env vars — Xen's `.env` already has `VITE_SUPABASE_URL` /
`VITE_SUPABASE_PUBLISHABLE_KEY` (kit's admin reference also accepts `_PUBLISHABLE_KEY` as an
alias for the anon key, so no rename needed). No edge function env vars needed this round since
notifications aren't wired.

## Out of scope for this pass

- `send-notifications` edge function / any `NOTIFY_PROVIDER`.
- Admin Analytics and Settings screens (backing RPCs/tables still exist from the contract, just
  unused).
- Dropping or migrating the `leads` table beyond the one-time backfill copy.
- Re-theming beyond mapping existing Xen tokens (no new design tokens from `notes/theming.md`
  needed — Xen already has shadcn's standard token set).

## Verification gate (do not report done until all pass)

1. New migrations apply cleanly against Xen's Supabase; re-applying is a no-op (idempotency).
2. `bun run build` is green.
3. A site-visit books end-to-end: free slot list loads on `/schedule-visit` → `request_booking`
   returns `ok` → the booking appears in `/admin/bookings` → confirming it does not error (and
   enqueues a `notification_outbox` row, even though nothing drains it yet).
4. The `/contact` form inserts an `inquiries` row (anon insert + honeypot) and it's visible in
   `/admin/submissions`.
5. Existing `leads` rows appear (post-backfill) in `/admin/submissions` via the `inquiries` copy,
   and the `leads` table itself is untouched/unchanged.
6. The bootstrapped admin signs in and reads all four screens; a non-admin session sees nothing
   (RLS holds — verified by checking a logged-out or non-admin request returns empty/forbidden).

## Availability hours (confirmed)

Use the kit's default seed as-is: Mon–Fri, 09:00–12:00 & 14:00–17:00, 60-minute slots. Adjustable
later from `/admin/availability` without a code change.
