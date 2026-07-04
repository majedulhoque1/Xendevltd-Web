# Booking + Inquiry + Admin panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a self-hosted site-visit booking calendar, a callback/inquiry form, and a protected `/admin` panel (Bookings/Availability/Submissions/CRM) to the Xen Development Limited marketing site, backed by the `booking-crm-kit` Supabase contract.

**Architecture:** Apply the kit's portable SQL contract (idempotent migrations) to Xen's existing Supabase project, adapting `request_booking`'s intake fields for real estate. Add two new public pages (`/schedule-visit`, `/contact`) reusing Xen's existing shadcn components and animation style. Add an `/admin/*` route tree in the same Vite SPA, gated by Supabase Auth + `has_role('admin')`, with four dependency-light screens (plain tables, no new UI library).

**Tech Stack:** Vite + React 18 + TypeScript + react-router-dom v6 + @tanstack/react-query + shadcn/ui + Tailwind v3 + Supabase (Postgres + Auth) + Bun. Migrations applied via the Supabase Management API (curl) using the PAT already present in `.env` as `SUPABASE_ACCESS_TOKEN`.

**Reference material (read, don't duplicate):** `d:/EXPERIUS/Websites/Booking_CRM.kit/contract/README.md` (data model + RPCs), `docs/superpowers/specs/2026-07-04-booking-admin-design.md` (this repo, the approved design).

**Style token substitutions applied throughout** (the kit's reference code assumes tokens Xen doesn't have; map them when adapting any kit file):
| Kit token | Xen equivalent |
|---|---|
| `bg-surface` | `bg-card` |
| `shadow-card` | `shadow-sm` |
| `text-danger` / `bg-danger` / `border-danger` | `text-destructive` / `bg-destructive` / `border-destructive` |
| `text-accent` / `bg-accent` | unchanged — Xen already has `accent` |

**Note on git:** This directory is not a git repository (verified — no `.git`). Steps below that would say "commit" are replaced with "mark step done" — there is nothing to commit to. If the user initializes git later, these changes can be committed as a single logical history.

---

## Phase 0 — Database access check

### Task 0: Confirm Management API access

**Files:** none (verification only).

- [ ] **Step 1: Confirm the PAT reaches Xen's project**

Run (do not print the token itself in any step beyond this internal use):

```bash
PAT=$(grep SUPABASE_ACCESS_TOKEN "d:/EXPERIUS/Websites/Xen-Development-Limited-main/.env" | sed -E 's/.*="?([^"]+)"?/\1/')
curl -s -H "Authorization: Bearer $PAT" -H "User-Agent: curl/xen-migrate" \
  "https://api.supabase.com/v1/projects/erdbnkemhezvjdhfqjtq" | head -c 200
```

Expected: JSON containing `"name":"Xen"` and `"status":"ACTIVE_HEALTHY"`.

- [ ] **Step 2: Confirm this is a fresh terminal state (already done in this session)** — skip if already verified above.

- [ ] **Step 3: Mark step done.**

---

## Phase 1 — Backend schema (Supabase migrations)

All SQL files go in `supabase/migrations/` in this repo, following the existing naming pattern (the 3 files already there use `YYYYMMDDHHMMSS_uuid.sql`; these new ones use a descriptive suffix so they're identifiable — Supabase applies by filename sort order, so the timestamp prefix is what matters).

Apply each file to Xen's live Supabase via the Management API's SQL endpoint:

```bash
PAT=$(grep SUPABASE_ACCESS_TOKEN "d:/EXPERIUS/Websites/Xen-Development-Limited-main/.env" | sed -E 's/.*="?([^"]+)"?/\1/')
apply_sql() {
  local file="$1"
  local body
  body=$(python3 -c "import json,sys; print(json.dumps(open(sys.argv[1]).read()))" "$file")
  curl -s -X POST -H "Authorization: Bearer $PAT" -H "Content-Type: application/json" \
    -H "User-Agent: curl/xen-migrate" \
    "https://api.supabase.com/v1/projects/erdbnkemhezvjdhfqjtq/database/query" \
    -d "{\"query\": $body}"
}
```

(This shell function is reused by every task below — define it once per terminal session.)

### Task 1: Vendor kit migrations 0001–0004 (extensions, config, roles/profiles, core tables)

**Files:**
- Create: `supabase/migrations/20260704120001_kit_extensions_and_types.sql`
- Create: `supabase/migrations/20260704120002_kit_config.sql`
- Create: `supabase/migrations/20260704120003_kit_roles_and_profiles.sql`
- Create: `supabase/migrations/20260704120004_kit_core_tables.sql`

- [ ] **Step 1: Create `20260704120001_kit_extensions_and_types.sql`** — copy verbatim from `Booking_CRM.kit/contract/migrations/0001_extensions_and_types.sql`:

```sql
-- booking-crm-kit · 0001 · extensions + enum types
-- Idempotent: safe to re-run on a fresh or partially-built database.

create extension if not exists pgcrypto;   -- gen_random_uuid()

-- Role enum used by user_roles + has_role(). Guarded create so re-runs are no-ops.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin');
  end if;
end $$;
```

- [ ] **Step 2: Create `20260704120002_kit_config.sql`** — copy verbatim from `Booking_CRM.kit/contract/migrations/0002_config.sql`:

```sql
-- booking-crm-kit · 0002 · runtime config store + contract version stamp
-- Idempotent.

create table if not exists public.site_settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (key, value) values
  ('timezone', 'UTC'),
  ('notify_staff_phone', '')
on conflict (key) do nothing;

create table if not exists public.kit_meta (
  id               boolean primary key default true check (id),
  contract_version integer not null,
  updated_at       timestamptz not null default now()
);

insert into public.kit_meta (id, contract_version) values (true, 1)
on conflict (id) do update
  set contract_version = excluded.contract_version, updated_at = now();
```

- [ ] **Step 3: Create `20260704120003_kit_roles_and_profiles.sql`** — copy verbatim from `Booking_CRM.kit/contract/migrations/0003_roles_and_profiles.sql`:

```sql
-- booking-crm-kit · 0003 · auth profiles + roles + has_role gate
-- Idempotent.

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  created_at   timestamptz not null default now()
);

create table if not exists public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

- [ ] **Step 4: Create `20260704120004_kit_core_tables.sql`** — copy verbatim from `Booking_CRM.kit/contract/migrations/0004_core_tables.sql`:

```sql
-- booking-crm-kit · 0004 · core domain tables
-- Idempotent.

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create table if not exists public.contacts (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  phone                text,
  email                text,
  branch               text,
  details              jsonb not null default '{}'::jsonb,
  notes                text,
  source_submission_id uuid,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
drop trigger if exists trg_contacts_updated on public.contacts;
create trigger trg_contacts_updated before update on public.contacts
  for each row execute function public.set_updated_at();

create table if not exists public.availability (
  id           uuid primary key default gen_random_uuid(),
  weekday      integer not null check (weekday between 0 and 6),
  start_time   time not null,
  end_time     time not null,
  slot_minutes integer not null default 60 check (slot_minutes > 0),
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.bookings (
  id         uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  date       date not null,
  time       time not null,
  status     text not null default 'pending',
  source     text not null default 'public',
  notes      text,
  details    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists bookings_active_slot_uniq
  on public.bookings (date, time)
  where status in ('pending', 'confirmed');
drop trigger if exists trg_bookings_updated on public.bookings;
create trigger trg_bookings_updated before update on public.bookings
  for each row execute function public.set_updated_at();

create table if not exists public.inquiries (
  id         uuid primary key default gen_random_uuid(),
  type       text not null default 'contact',
  name       text not null,
  email      text,
  phone      text,
  message    text,
  language   text not null default 'en',
  status     text not null default 'new',
  details    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_outbox (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  event      text not null,
  recipient  text not null default 'lead',
  to_phone   text,
  payload    jsonb not null default '{}'::jsonb,
  status     text not null default 'queued',
  created_at timestamptz not null default now(),
  sent_at    timestamptz
);

create table if not exists public.analytics_events (
  id            bigint generated always as identity primary key,
  occurred_at   timestamptz not null default now(),
  event_type    text not null default 'pageview',
  path          text not null,
  referrer_host text,
  visitor_hash  text not null,
  country       text,
  device        text
);
create index if not exists analytics_events_occurred_idx
  on public.analytics_events (occurred_at);
```

- [ ] **Step 5: Apply all four files in order via the Management API** (using the `apply_sql` function defined above):

```bash
apply_sql "supabase/migrations/20260704120001_kit_extensions_and_types.sql"
apply_sql "supabase/migrations/20260704120002_kit_config.sql"
apply_sql "supabase/migrations/20260704120003_kit_roles_and_profiles.sql"
apply_sql "supabase/migrations/20260704120004_kit_core_tables.sql"
```

Expected: each call returns `[]` or a small JSON result array, no `"error"` key.

- [ ] **Step 6: Verify the new tables exist**

```bash
apply_sql <(echo "select table_name from information_schema.tables where table_schema='public' and table_name in ('profiles','user_roles','contacts','availability','bookings','inquiries','notification_outbox','analytics_events','site_settings','kit_meta') order by table_name;")
```

Expected: all 10 table names returned. (Note: `user_roles` already existed before this — confirms the `create table if not exists` was a no-op against the existing compatible shape, not an error.)

- [ ] **Step 7: Re-apply all four files again to confirm idempotency**

Run Step 5 again verbatim. Expected: identical success, no duplicate-object errors.

- [ ] **Step 8: Mark step done.**

### Task 2: Adapted booking RPCs (request_booking signature for real estate)

**Files:**
- Create: `supabase/migrations/20260704120005_kit_booking_rpcs_xen.sql`

This is `Booking_CRM.kit/contract/migrations/0005_booking_rpcs.sql` with `request_booking` adapted: drop `p_child_age` and `p_language` (not applicable — no i18n on Xen), rename `p_branch` → `p_project` and `p_concern` → `p_notes`. `get_available_slots`, `kit_timezone`, and `reschedule_booking` are unchanged from the kit (they don't reference intake fields).

- [ ] **Step 1: Create the file**

```sql
-- booking-crm-kit · 0005 (Xen-adapted) · booking RPCs
-- request_booking's intake fields are adapted for real estate: p_project (which Xen
-- development the visitor wants to see) replaces p_branch; p_notes replaces p_concern;
-- p_child_age and p_language are dropped (not applicable — no i18n on this site).
-- get_available_slots / kit_timezone / reschedule_booking are unchanged from the kit.

create or replace function public.kit_timezone()
returns text
language sql stable security definer set search_path = public as $$
  select coalesce((select value from public.site_settings where key = 'timezone'), 'UTC');
$$;

create or replace function public.get_available_slots(p_from date, p_to date)
returns table(slot_date date, slot_time time)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamp := (now() at time zone public.kit_timezone());
begin
  if p_from is null or p_to is null or p_to < p_from or (p_to - p_from) > 60 then
    return;
  end if;

  return query
  with dates as (
    select g::date as the_date
    from generate_series(p_from, p_to, interval '1 day') as g
  ),
  candidate as (
    select
      dt.the_date,
      (a.start_time + (n.i * make_interval(mins => a.slot_minutes)))::time as the_time
    from dates dt
    join public.availability a
      on a.active
     and a.weekday = extract(dow from dt.the_date)::int
    join lateral generate_series(
      0,
      greatest(0, (floor(extract(epoch from (a.end_time - a.start_time))
                         / (a.slot_minutes * 60)) - 1)::int)
    ) as n(i) on true
  )
  select c.the_date, c.the_time
  from candidate c
  where (c.the_date > v_now::date
         or (c.the_date = v_now::date and c.the_time > v_now::time))
    and not exists (
      select 1 from public.bookings b
      where b.date = c.the_date
        and b.time = c.the_time
        and b.status in ('pending','confirmed')
    )
  order by c.the_date, c.the_time;
end;
$$;

-- p_project / p_notes are Xen's intake fields, stored in contacts.details so the core
-- table schema never changes.
create or replace function public.request_booking(
  p_name text,
  p_phone text,
  p_project text,
  p_notes text,
  p_slot_date date,
  p_slot_time time
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now        timestamp := (now() at time zone public.kit_timezone());
  v_contact_id uuid;
  v_booking_id uuid;
  v_ok         boolean;
begin
  if p_name is null or length(trim(p_name)) = 0 or length(p_name) > 120
     or p_phone is null or length(trim(p_phone)) < 6
     or p_project is null or length(trim(p_project)) = 0 then
    return jsonb_build_object('status','invalid_input');
  end if;

  if p_slot_date < v_now::date
     or (p_slot_date = v_now::date and p_slot_time <= v_now::time) then
    return jsonb_build_object('status','invalid_slot');
  end if;

  select exists (
    select 1 from public.availability a
    where a.active
      and a.weekday = extract(dow from p_slot_date)::int
      and p_slot_time >= a.start_time
      and p_slot_time <  a.end_time
  ) into v_ok;
  if not v_ok then
    return jsonb_build_object('status','invalid_slot');
  end if;

  select id into v_contact_id
  from public.contacts
  where phone = p_phone
  order by created_at asc
  limit 1;

  if v_contact_id is null then
    insert into public.contacts (name, phone, branch, source_submission_id, details)
    values (
      trim(p_name), p_phone, p_project, null,
      jsonb_strip_nulls(jsonb_build_object(
        'notes', nullif(trim(coalesce(p_notes,'')), '')
      ))
    )
    returning id into v_contact_id;
  end if;

  begin
    insert into public.bookings (contact_id, date, time, status, source, details)
    values (
      v_contact_id, p_slot_date, p_slot_time, 'pending', 'public',
      jsonb_strip_nulls(jsonb_build_object('project', p_project))
    )
    returning id into v_booking_id;
  exception when unique_violation then
    return jsonb_build_object('status','slot_taken');
  end;

  return jsonb_build_object('status','ok','booking_id', v_booking_id);
end;
$$;

create or replace function public.reschedule_booking(
  p_booking_id uuid,
  p_slot_date  date,
  p_slot_time  time
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now        timestamp := (now() at time zone public.kit_timezone());
  v_contact_id uuid;
  v_status     text;
  v_phone      text;
  v_name       text;
  v_staff      text;
  v_ok         boolean;
begin
  if not public.has_role(auth.uid(), 'admin') then
    return jsonb_build_object('status','forbidden');
  end if;

  select b.contact_id, b.status into v_contact_id, v_status
  from public.bookings b
  where b.id = p_booking_id;

  if v_contact_id is null or v_status not in ('pending','confirmed') then
    return jsonb_build_object('status','not_found');
  end if;

  if p_slot_date < v_now::date
     or (p_slot_date = v_now::date and p_slot_time <= v_now::time) then
    return jsonb_build_object('status','invalid_slot');
  end if;

  select exists (
    select 1 from public.availability a
    where a.active
      and a.weekday = extract(dow from p_slot_date)::int
      and p_slot_time >= a.start_time
      and p_slot_time <  a.end_time
  ) into v_ok;
  if not v_ok then
    return jsonb_build_object('status','invalid_slot');
  end if;

  if exists (
    select 1 from public.bookings b
    where b.date = p_slot_date
      and b.time = p_slot_time
      and b.status in ('pending','confirmed')
      and b.id <> p_booking_id
  ) then
    return jsonb_build_object('status','slot_taken');
  end if;

  begin
    update public.bookings
    set date = p_slot_date, time = p_slot_time
    where id = p_booking_id;
  exception when unique_violation then
    return jsonb_build_object('status','slot_taken');
  end;

  select c.phone, c.name into v_phone, v_name
  from public.contacts c where c.id = v_contact_id;

  select value into v_staff
  from public.site_settings where key = 'notify_staff_phone';

  if coalesce(v_staff, '') <> '' then
    insert into public.notification_outbox (booking_id, event, recipient, to_phone, payload)
    values (p_booking_id, 'rescheduled', 'staff', v_staff,
            jsonb_build_object('name', v_name, 'date', p_slot_date,
                               'time', p_slot_time, 'status', v_status));
  end if;

  if coalesce(v_phone, '') <> '' then
    insert into public.notification_outbox (booking_id, event, recipient, to_phone, payload)
    values (p_booking_id, 'rescheduled', 'lead', v_phone,
            jsonb_build_object('name', v_name, 'date', p_slot_date,
                               'time', p_slot_time, 'status', v_status));
  end if;

  return jsonb_build_object('status','ok');
end;
$$;

grant execute on function public.get_available_slots(date, date) to anon, authenticated;
grant execute on function public.request_booking(text, text, text, text, date, time) to anon, authenticated;
grant execute on function public.reschedule_booking(uuid, date, time) to authenticated;
```

- [ ] **Step 2: Apply the migration**

```bash
apply_sql "supabase/migrations/20260704120005_kit_booking_rpcs_xen.sql"
```

Expected: success, no error.

- [ ] **Step 3: Verify the RPC round-trips (with a fake availability window and immediate cleanup)**

```bash
apply_sql <(cat <<'SQL'
insert into public.availability (weekday, start_time, end_time, slot_minutes, active)
values (extract(dow from (now() + interval '2 days'))::int, '00:00', '23:59', 60, true)
on conflict do nothing;

select public.request_booking(
  'Test User', '+8801700000000', 'Xen Lakeview Tasmee', 'Verification call',
  (now() + interval '2 days')::date, '10:00'
) as result;
SQL
)
```

Expected: `{"status": "ok", "booking_id": "<uuid>"}`.

- [ ] **Step 4: Clean up the test data**

```bash
apply_sql <(cat <<'SQL'
delete from public.bookings where source = 'public' and notes is null and details->>'project' = 'Xen Lakeview Tasmee';
delete from public.contacts where phone = '+8801700000000';
delete from public.availability where start_time = '00:00' and end_time = '23:59';
SQL
)
```

- [ ] **Step 5: Mark step done.**

### Task 3: Vendor migrations 0006–0008 (analytics RPCs, notifications trigger, RLS)

**Files:**
- Create: `supabase/migrations/20260704120006_kit_analytics_rpcs.sql`
- Create: `supabase/migrations/20260704120007_kit_notifications.sql`
- Create: `supabase/migrations/20260704120008_kit_rls.sql`

These are unused by the v1 admin UI but are part of the fixed contract (kept so `contract_version` tracking and any future Analytics/Settings screen addition needs no new migration).

- [ ] **Step 1: Create `20260704120006_kit_analytics_rpcs.sql`** — copy verbatim from `Booking_CRM.kit/contract/migrations/0006_analytics_rpcs.sql` (functions `analytics_traffic`, `analytics_top_pages`, `analytics_sources`, `analytics_by_country`, `analytics_conversions`, plus the trailing grants — full content in that file, unchanged).

- [ ] **Step 2: Create `20260704120007_kit_notifications.sql`** — copy verbatim from `Booking_CRM.kit/contract/migrations/0007_notifications.sql` (function `enqueue_booking_notification` + trigger `trg_booking_notification`, unchanged).

- [ ] **Step 3: Create `20260704120008_kit_rls.sql`** — copy verbatim from `Booking_CRM.kit/contract/migrations/0008_rls.sql` (all RLS policies + grants, unchanged).

- [ ] **Step 4: Apply all three in order**

```bash
apply_sql "supabase/migrations/20260704120006_kit_analytics_rpcs.sql"
apply_sql "supabase/migrations/20260704120007_kit_notifications.sql"
apply_sql "supabase/migrations/20260704120008_kit_rls.sql"
```

Expected: success on each.

- [ ] **Step 5: Verify RLS is active on the new tables**

```bash
apply_sql <(echo "select relname, relrowsecurity from pg_class where relname in ('contacts','bookings','inquiries','analytics_events','notification_outbox') order by relname;")
```

Expected: `relrowsecurity = true` for every row.

- [ ] **Step 6: Re-apply all three again to confirm idempotency.** Expected: no errors.

- [ ] **Step 7: Mark step done.**

### Task 4: Vendor the kit's default seed

**Files:**
- Create: `supabase/migrations/20260704120009_kit_seed.sql`

Per the earlier `AskUserQuestion` decision, use the kit's default hours as-is (Mon–Fri, 09:00–12:00 & 14:00–17:00, 60-min slots).

- [ ] **Step 1: Create the file** — copy verbatim from `Booking_CRM.kit/contract/seed.sql`:

```sql
-- booking-crm-kit · seed · client-tunable defaults
-- Idempotent: every insert is guarded.

insert into public.site_settings (key, value) values
  ('timezone', 'UTC'),
  ('notify_staff_phone', '')
on conflict (key) do nothing;

insert into public.availability (weekday, start_time, end_time, slot_minutes, active)
select w, t.start_time, t.end_time, 60, true
from (values (1),(2),(3),(4),(5)) as d(w)
cross join (values (time '09:00', time '12:00'),
                   (time '14:00', time '17:00')) as t(start_time, end_time)
where not exists (select 1 from public.availability);
```

- [ ] **Step 2: Apply it**

```bash
apply_sql "supabase/migrations/20260704120009_kit_seed.sql"
```

- [ ] **Step 3: Verify 10 availability rows exist (5 weekdays × 2 windows)**

```bash
apply_sql <(echo "select count(*) from public.availability;")
```

Expected: `10` (assuming no test rows are left over from Task 2 Step 4's cleanup — confirm that cleanup ran first).

- [ ] **Step 4: Mark step done.**

### Task 5: Xen-specific config + leads backfill

**Files:**
- Create: `supabase/migrations/20260704120010_xen_config_and_backfill.sql`

Sets the timezone to `Asia/Dhaka` and copies existing `leads` rows into `inquiries` once. The `leads` table itself is left completely untouched (no drop, no future writes — the frontend change in Phase 2 stops new writes to it).

- [ ] **Step 1: Create the file**

```sql
-- Xen-specific: timezone + one-time leads -> inquiries backfill.
-- Idempotent: the backfill only inserts rows that don't already have a matching
-- (phone, created_at) pair in inquiries, so re-running this file is a no-op.

update public.site_settings set value = 'Asia/Dhaka', updated_at = now()
where key = 'timezone';

insert into public.inquiries (type, name, phone, email, message, created_at, status)
select 'contact', l.full_name, l.phone, l.email, l.message, l.created_at, 'new'
from public.leads l
where not exists (
  select 1 from public.inquiries i
  where i.phone = l.phone and i.created_at = l.created_at
);
```

- [ ] **Step 2: Apply it**

```bash
apply_sql "supabase/migrations/20260704120010_xen_config_and_backfill.sql"
```

- [ ] **Step 3: Verify the backfill and timezone**

```bash
apply_sql <(echo "select (select count(*) from public.leads) as leads_count, (select count(*) from public.inquiries where type='contact') as backfilled_inquiries, (select value from public.site_settings where key='timezone') as tz;")
```

Expected: `backfilled_inquiries` equals `leads_count` (or more, if the site has already collected new inquiries by the time this runs), and `tz` = `Asia/Dhaka`.

- [ ] **Step 4: Re-apply to confirm idempotency (no duplicate rows)**

Run Step 2 again, then Step 3 again — `backfilled_inquiries` must be unchanged.

- [ ] **Step 5: Mark step done.**

### Task 6: Regenerate Supabase TypeScript types

**Files:**
- Modify: `src/integrations/supabase/types.ts`

- [ ] **Step 1: Fetch the generated types via the Management API**

```bash
PAT=$(grep SUPABASE_ACCESS_TOKEN "d:/EXPERIUS/Websites/Xen-Development-Limited-main/.env" | sed -E 's/.*="?([^"]+)"?/\1/')
curl -s -H "Authorization: Bearer $PAT" -H "User-Agent: curl/xen-migrate" \
  "https://api.supabase.com/v1/projects/erdbnkemhezvjdhfqjtq/types/typescript" \
  -o /tmp/xen_types_new.ts
```

- [ ] **Step 2: Replace the file's contents with the fetched output**, keeping the auto-generated-file header comment style Xen already uses (`// This file is automatically generated. Do not edit it directly.`) if the Management API output doesn't already include one.

- [ ] **Step 3: Typecheck**

Run: `bun run build` (this project has no standalone `tsc` script; `vite build` runs the TS compiler as part of the build).
Expected: build succeeds with the new types (no `contacts`/`bookings`/`availability`/`inquiries` type errors anywhere yet, since nothing references them until Phase 2/3).

- [ ] **Step 4: Mark step done.**

---

## Phase 2 — Public site: Contact + Schedule Visit

### Task 7: Retarget the callback form to `inquiries` + add a honeypot

**Files:**
- Modify: `src/components/LeadCapture.tsx`

- [ ] **Step 1: Add the honeypot field to the component state** (after the existing `formData` state, `src/components/LeadCapture.tsx:10-16`):

```tsx
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [trap, setTrap] = useState(""); // honeypot — must stay empty; bots auto-fill every input

  const [isSubmitting, setIsSubmitting] = useState(false);
```

- [ ] **Step 2: Guard the submit handler and swap the insert target** — replace the body of `handleSubmit` (`src/components/LeadCapture.tsx:18-89`) so it starts with the honeypot check and inserts into `inquiries` instead of `leads`:

```tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: a filled trap means a bot — pretend success, write nothing.
    if (trap) {
      toast({
        title: "Thank you for showing interest!",
        description: "We will get back to you shortly.",
      });
      setFormData({ name: "", phone: "", message: "" });
      return;
    }

    // Validate form data
    const validation = leadSchema.safeParse({
      full_name: formData.name,
      phone: formData.phone,
      message: formData.message,
    });

    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validation.error.errors[0].message,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase.from("inquiries").insert({
        type: "contact",
        name: validation.data.full_name,
        phone: validation.data.phone,
        message: validation.data.message || null,
      });

      if (dbError) {
        if (import.meta.env.DEV) {
          console.error("Database error:", dbError);
        }
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "Please try again later.",
        });
        return;
      }

      // Send to Google Sheets via edge function proxy (unchanged)
      await supabase.functions.invoke("webhook-proxy", {
        body: {
          name: validation.data.full_name,
          phone: validation.data.phone,
          message: validation.data.message,
          source: "contact_form",
          submitted_at: new Date().toISOString(),
          status: "New",
        },
      });

      toast({
        title: "Thank you for showing interest!",
        description: "We will get back to you shortly.",
      });
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Form submission error:", error);
      }
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
```

- [ ] **Step 3: Add the hidden honeypot input to the JSX**, immediately inside the `<form onSubmit={handleSubmit} className="space-y-6">` opening tag (`src/components/LeadCapture.tsx:180`):

```tsx
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot: visually hidden, off-screen, not tab-reachable. Leave empty. */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
```

- [ ] **Step 4: Typecheck**

Run: `bun run build`
Expected: green (no type errors — `inquiries` must exist in the regenerated types from Task 6).

- [ ] **Step 5: Manual verification** — start the dev server (`bun run dev`), fill and submit the form on the homepage `#contact` section (still there until Task 12 moves it), confirm a new row lands in `public.inquiries` (not `leads`):

```bash
apply_sql <(echo "select id, name, phone, message, status, created_at from public.inquiries where type='contact' order by created_at desc limit 1;")
```

Expected: the row you just submitted.

- [ ] **Step 6: Mark step done.**

### Task 8: Booking client helper

**Files:**
- Create: `src/lib/booking.ts`

Adapted from `Booking_CRM.kit/reference/site/lib/booking.ts` — field names match the Task 2 RPC signature (`project`/`notes` instead of `branch`/`concern`; no `childAge`/`language`).

- [ ] **Step 1: Write the file**

```ts
import { supabase } from "@/integrations/supabase/client";

// Calls ONLY the security-definer RPCs (supabase/migrations/20260704120005_*). The
// browser never touches the bookings/contacts tables directly.

export interface AvailableSlot {
  slot_date: string; // "YYYY-MM-DD"
  slot_time: string; // "HH:MM:SS"
}

export type RequestBookingResult =
  | { status: "ok"; booking_id: string }
  | { status: "slot_taken" }
  | { status: "invalid_slot" }
  | { status: "invalid_input" };

export interface BookingInput {
  name: string;
  phone: string;
  project: string;
  notes: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM" or "HH:MM:SS"
}

export async function getAvailableSlots(from: string, to: string): Promise<AvailableSlot[]> {
  const { data, error } = await supabase.rpc("get_available_slots", { p_from: from, p_to: to });
  if (error) throw error;
  return (data ?? []) as AvailableSlot[];
}

export async function requestBooking(input: BookingInput): Promise<RequestBookingResult> {
  const { data, error } = await supabase.rpc("request_booking", {
    p_name: input.name,
    p_phone: input.phone,
    p_project: input.project,
    p_notes: input.notes,
    p_slot_date: input.date,
    p_slot_time: input.time,
  });
  if (error) throw error;
  return data as RequestBookingResult;
}
```

- [ ] **Step 2: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 3: Mark step done.**

### Task 9: Schedule Visit page

**Files:**
- Create: `src/pages/ScheduleVisit.tsx`

Two-step booking UI (calendar+times → details form), adapted from `Booking_CRM.kit/reference/site/components/BookingCalendar.tsx`, themed to Xen's existing tokens, English-only (no `useLanguage`), project picked from `public.projects.title`.

- [ ] **Step 1: Write the file**

```tsx
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, ChevronLeft, Clock, CalendarDays } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { getAvailableSlots, requestBooking, type AvailableSlot } from "@/lib/booking";

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
  const [projects, setProjects] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", project: "", notes: "" });
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
      const [slotData, { data: projectRows }] = await Promise.all([
        getAvailableSlots(from, toDateStr(toDate)),
        supabase.from("projects").select("title").order("title"),
      ]);
      setSlots(slotData);
      const titles = (projectRows ?? []).map((p) => p.title);
      setProjects(titles);
      setForm((f) => ({ ...f, project: titles[0] ?? "" }));
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
                    {projects.map((p) => (
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
                    startMonth={new Date()}
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
```

- [ ] **Step 2: Typecheck**

Run: `bun run build`
Expected: green. (If `card-premium`, `label-caps`, `heading-section`, `accent-line`, `container-narrow`, `section-padding`, `btn-primary` classes don't resolve, they already exist in `src/index.css` — confirmed by their use in `src/components/LeadCapture.tsx` and `src/pages/About.tsx`; no new CSS needed.)

- [ ] **Step 3: Mark step done.**

### Task 10: Register `/schedule-visit` route and fix the Hero CTA

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/HeroSection.tsx:163`

- [ ] **Step 1: Register the route** in `src/App.tsx` — add the import and route:

```tsx
import ScheduleVisit from "./pages/ScheduleVisit";
```

```tsx
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/schedule-visit" element={<ScheduleVisit />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
```

- [ ] **Step 2: Fix the Hero CTA** — in `src/components/HeroSection.tsx:162-167`, change the "Book A Visit" link target:

```tsx
            <Link
              to="/schedule-visit"
              className="hero-cta font-sans inline-flex items-center justify-center h-12 px-7 text-sm bg-black/30 backdrop-blur-md border border-white/30 text-white font-medium tracking-wide rounded-full transition-all duration-300 hover:bg-black/40"
            >
              Book A Visit
            </Link>
```

(Only the `to` prop value changes, from `/contact` to `/schedule-visit`.)

- [ ] **Step 3: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 4: Manual verification** — `bun run dev`, click "Book A Visit" on the homepage, confirm it navigates to `/schedule-visit` and the calendar loads with the 10 seeded weekly slots.

- [ ] **Step 5: Mark step done.**

### Task 11: Contact page

**Files:**
- Create: `src/pages/Contact.tsx`

Thin page shell around the now-inquiries-backed `LeadCapture` form (Task 7), giving it its own route and a short intro instead of living inline on the homepage.

- [ ] **Step 1: Write the file**

```tsx
import { useTheme } from "@/contexts/ThemeContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LeadCapture from "@/components/LeadCapture";

const Contact = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation isDark={isDark} onThemeToggle={toggleTheme} />
      <main className="pt-24">
        <LeadCapture />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
```

- [ ] **Step 2: Register the route** in `src/App.tsx`:

```tsx
import Contact from "./pages/Contact";
```

```tsx
            <Route path="/schedule-visit" element={<ScheduleVisit />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
```

- [ ] **Step 3: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 4: Mark step done.**

### Task 12: Slim homepage contact callout

**Files:**
- Create: `src/components/ContactCallout.tsx`
- Modify: `src/pages/Index.tsx`

Replaces the full inline `<LeadCapture />` section on the homepage with a short CTA banner linking to `/contact`, so the homepage keeps a contact prompt without duplicating the whole form.

- [ ] **Step 1: Write `src/components/ContactCallout.tsx`**

```tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ContactCallout = () => (
  <section id="contact" className="section-padding">
    <div className="container-narrow text-center max-w-2xl mx-auto">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="label-caps mb-4 block"
      >
        Get In Touch
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
        transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
        className="heading-section mb-6"
      >
        Have Questions?
      </motion.h2>
      <div className="accent-line mb-8 mx-auto" />
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.15 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="body-large mb-8"
      >
        Whether you're ready to schedule a visit or simply want more information, we're here to
        assist.
      </motion.p>
      <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
        Contact Us <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </section>
);

export default ContactCallout;
```

- [ ] **Step 2: Edit `src/pages/Index.tsx`** — swap the import and usage (`src/pages/Index.tsx:9` and `:37`):

```tsx
import ContactCallout from "@/components/ContactCallout";
```

```tsx
        <ProjectsOverview />
        <ContactCallout />
```

(Remove the `import LeadCapture from "@/components/LeadCapture";` line and the `<LeadCapture />` usage.)

- [ ] **Step 3: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 4: Manual verification** — `bun run dev`, confirm the homepage now shows the slim callout instead of the full form, and clicking "Contact Us" navigates to `/contact` where the full form (still backed by `inquiries`) works.

- [ ] **Step 5: Mark step done.**

---

## Phase 3 — Admin: auth foundation

### Task 13: Auth context

**Files:**
- Create: `src/contexts/AdminAuthContext.tsx`

Named `AdminAuthContext` (not `AuthContext`) to avoid any ambiguity with `ThemeContext` and to make its scope obvious, following the existing `ThemeContext.tsx` file's context/provider/hook pattern.

- [ ] **Step 1: Write the file**

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isActive) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!isActive) return;
      setSession(next);
      setUser(next?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, session, isAuthenticated: Boolean(user), isLoading, signIn, signOut }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
```

- [ ] **Step 2: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 3: Mark step done.**

### Task 14: `useIsAdmin` hook

**Files:**
- Create: `src/hooks/useIsAdmin.ts`

- [ ] **Step 1: Write the file**

```ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Client-side admin check, driven by the user_roles self-read RLS policy: a logged-in
// user can read ONLY their own role rows, so a returned 'admin' row means the caller is
// an admin. The real security boundary is has_role() inside every RPC/RLS policy —
// this only drives UI/routing.
export function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("role", "admin")
        .maybeSingle();
      if (error) return false;
      return Boolean(data);
    },
  });
}
```

- [ ] **Step 2: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 3: Mark step done.**

### Task 15: Protected route + admin layout

**Files:**
- Create: `src/components/admin/ProtectedRoute.tsx`
- Create: `src/components/admin/AdminLayout.tsx`

`AdminLayout` is a simple top-nav shell (not the kit's collapsible sidebar system — Xen's admin has only 4 screens, a top nav is simpler and sufficient).

- [ ] **Step 1: Write `src/components/admin/ProtectedRoute.tsx`**

```tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();

  if (isLoading || (isAuthenticated && roleLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate replace to="/admin/login" />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-sm space-y-2">
          <p className="text-lg font-semibold text-foreground">Not authorized</p>
          <p className="text-sm text-muted-foreground">
            This account isn't an admin yet. Ask an existing admin to grant access.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Write `src/components/admin/AdminLayout.tsx`**

```tsx
import { NavLink, Outlet } from "react-router-dom";
import { CalendarClock, Clock, Inbox, Users, LogOut } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin/bookings", label: "Bookings", icon: CalendarClock },
  { to: "/admin/availability", label: "Availability", icon: Clock },
  { to: "/admin/submissions", label: "Submissions", icon: Inbox },
  { to: "/admin/crm", label: "CRM", icon: Users },
];

export function AdminLayout() {
  const { signOut } = useAdminAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <span className="font-serif text-lg font-semibold text-foreground">Xen Admin</span>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )
                }
              >
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 4: Mark step done.**

### Task 16: Login page

**Files:**
- Create: `src/pages/admin/Login.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const AdminLogin = () => {
  const { signIn, isAuthenticated, isLoading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate replace to="/admin/bookings" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) setError(signInError);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-border bg-card p-8 shadow-sm"
      >
        <div>
          <h1 className="font-serif text-xl font-semibold text-foreground">Xen Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage bookings and inquiries.</p>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
```

- [ ] **Step 2: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 3: Mark step done.**

---

## Phase 4 — Admin: data hooks + screens

### Task 17: Bookings screen

**Files:**
- Create: `src/hooks/useBookings.ts`
- Create: `src/pages/admin/Bookings.tsx`

Reschedule uses a small shadcn `Dialog` with native date/time inputs (simpler than vendoring the kit's drag-and-drop `TimeGridCalendar`, and matches the modest booking volume of a real-estate site-visit calendar vs. a clinic's).

- [ ] **Step 1: Write `src/hooks/useBookings.ts`**

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface BookingRow {
  id: string;
  date: string;
  time: string;
  status: BookingStatus;
  source: string;
  notes: string | null;
  details: { project?: string } | null;
  contact: { name: string; phone: string | null } | null;
}

type RescheduleResult = { status: "ok" | "forbidden" | "not_found" | "invalid_slot" | "slot_taken" };

export function useBookings() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["bookings"] });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id,date,time,status,source,notes,details,contact:contacts(name,phone)")
        .order("date", { ascending: false })
        .order("time");
      if (error) throw error;
      return (data ?? []) as unknown as BookingRow[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
  });

  const reschedule = useMutation({
    mutationFn: async (args: { id: string; date: string; time: string }) => {
      const { data, error } = await supabase.rpc("reschedule_booking", {
        p_booking_id: args.id,
        p_slot_date: args.date,
        p_slot_time: args.time,
      });
      if (error) throw error;
      return data as RescheduleResult;
    },
    onSuccess: inv,
  });

  return {
    bookings,
    isLoading,
    setStatus: setStatus.mutateAsync,
    reschedule: reschedule.mutateAsync,
  };
}
```

- [ ] **Step 2: Write `src/pages/admin/Bookings.tsx`**

```tsx
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
```

- [ ] **Step 3: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 4: Mark step done.**

### Task 18: Availability screen

**Files:**
- Create: `src/lib/slots.ts`
- Create: `src/hooks/useAvailability.ts`
- Create: `src/pages/admin/Availability.tsx`

- [ ] **Step 1: Write `src/lib/slots.ts`** (mirrors `get_available_slots`' per-day slicing, used only for the add-window preview count):

```ts
export function generateDaySlots(startTime: string, endTime: string, slotMinutes: number): string[] {
  if (!startTime || !endTime || slotMinutes <= 0) return [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const slots: string[] = [];
  for (let t = startMin; t + slotMinutes <= endMin; t += slotMinutes) {
    const h = Math.floor(t / 60);
    const m = t % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
}
```

- [ ] **Step 2: Write `src/hooks/useAvailability.ts`**

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AvailabilityWindow {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
  active: boolean;
}
export interface AvailabilityInput {
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
}

export function useAvailability() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["availability"] });

  const { data: windows = [], isLoading } = useQuery({
    queryKey: ["availability"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability")
        .select("id,weekday,start_time,end_time,slot_minutes,active")
        .order("weekday")
        .order("start_time");
      if (error) throw error;
      return (data ?? []) as AvailabilityWindow[];
    },
  });

  const create = useMutation({
    mutationFn: async (input: AvailabilityInput) => {
      const { error } = await supabase.from("availability").insert({ ...input, active: true });
      if (error) throw error;
    },
    onSuccess: inv,
  });
  const toggle = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("availability").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("availability").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
  });

  return { windows, isLoading, create: create.mutateAsync, toggle: toggle.mutateAsync, remove: remove.mutateAsync };
}
```

- [ ] **Step 3: Write `src/pages/admin/Availability.tsx`**

```tsx
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
```

- [ ] **Step 4: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 5: Mark step done.**

### Task 19: Submissions screen

**Files:**
- Create: `src/hooks/useSubmissions.ts`
- Create: `src/pages/admin/Submissions.tsx`

- [ ] **Step 1: Write `src/hooks/useSubmissions.ts`**

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SubmissionStatus = "new" | "contacted" | "closed";

export interface Submission {
  id: string;
  type: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: SubmissionStatus;
  details: Record<string, unknown>;
  created_at: string;
}

export function useSubmissions() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ["submissions"] });

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("id,type,name,email,phone,message,status,details,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Submission[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SubmissionStatus }) => {
      const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: inv,
  });

  const convertToContact = useMutation({
    mutationFn: async (s: Submission) => {
      const { data: existing } = await supabase
        .from("contacts")
        .select("id")
        .eq("source_submission_id", s.id)
        .maybeSingle();
      if (!existing) {
        const { error } = await supabase.from("contacts").insert({
          name: s.name,
          phone: s.phone,
          email: s.email,
          source_submission_id: s.id,
          details: s.details ?? {},
          notes: s.message,
        });
        if (error) throw error;
      }
      await supabase.from("inquiries").update({ status: "closed" }).eq("id", s.id);
    },
    onSuccess: () => {
      inv();
      qc.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return {
    submissions,
    isLoading,
    setStatus: setStatus.mutateAsync,
    remove: remove.mutateAsync,
    convertToContact: convertToContact.mutateAsync,
  };
}
```

- [ ] **Step 2: Write `src/pages/admin/Submissions.tsx`**

```tsx
import { CheckCircle2, MessageCircle, Trash2, UserPlus } from "lucide-react";
import { useSubmissions, type Submission, type SubmissionStatus } from "@/hooks/useSubmissions";
import { Badge } from "@/components/ui/badge";

const TONE: Record<SubmissionStatus, string> = {
  new: "bg-sky-50 text-sky-700",
  contacted: "bg-amber-50 text-amber-700",
  closed: "bg-stone-100 text-stone-600",
};
const digits = (p: string) => p.replace(/[^\d]/g, "");

const AdminSubmissions = () => {
  const { submissions, isLoading, setStatus, remove, convertToContact } = useSubmissions();

  async function onConvert(s: Submission) {
    if (s.status === "closed") return;
    if (confirm(`Add "${s.name}" to the CRM as a contact (and close this inquiry)?`)) await convertToContact(s);
  }
  async function onDelete(s: Submission) {
    if (confirm(`Delete the inquiry from "${s.name}"? This cannot be undone.`)) await remove(s.id);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Submissions</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Incoming inquiries from the website. Review, contact, then add to CRM.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading submissions…</div>
      ) : submissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No submissions yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Message</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {submissions.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.phone ?? "—"}</td>
                  <td className="max-w-[240px] truncate px-4 py-3 text-muted-foreground" title={r.message ?? ""}>
                    {r.message ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={TONE[r.status]}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {r.phone && (
                        <a
                          href={`https://wa.me/${digits(r.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-emerald-600"
                          aria-label="WhatsApp"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {r.status === "new" && (
                        <button
                          type="button"
                          onClick={() => setStatus({ id: r.id, status: "contacted" })}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-amber-600"
                          aria-label="Mark contacted"
                          title="Mark as contacted"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onConvert(r)}
                        disabled={r.status === "closed"}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-primary disabled:opacity-30"
                        aria-label="Add to CRM"
                        title={r.status === "closed" ? "Closed" : "Add to CRM"}
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(r)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
```

- [ ] **Step 3: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 4: Mark step done.**

### Task 20: CRM screen

**Files:**
- Create: `src/hooks/useContacts.ts`
- Create: `src/pages/admin/CRM.tsx`

- [ ] **Step 1: Write `src/hooks/useContacts.ts`**

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  branch: string | null;
  details: Record<string, unknown>;
  notes: string | null;
  created_at: string;
}

export function useContacts() {
  const qc = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("id,name,phone,email,branch,details,notes,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Contact[];
    },
  });

  const saveNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase.from("contacts").update({ notes }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });

  return { contacts, isLoading, saveNotes: saveNotes.mutateAsync };
}
```

- [ ] **Step 2: Write `src/pages/admin/CRM.tsx`**

```tsx
import { useState } from "react";
import { Save } from "lucide-react";
import { useContacts, type Contact } from "@/hooks/useContacts";

function NotesEditor({ contact, onSave }: { contact: Contact; onSave: (notes: string) => Promise<void> }) {
  const [notes, setNotes] = useState(contact.notes ?? "");
  const [saving, setSaving] = useState(false);
  const dirty = notes !== (contact.notes ?? "");
  return (
    <div className="flex items-start gap-2">
      <textarea
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add a note…"
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <button
        type="button"
        disabled={!dirty || saving}
        onClick={async () => {
          setSaving(true);
          await onSave(notes);
          setSaving(false);
        }}
        className="mt-0.5 rounded-md p-2 text-muted-foreground hover:bg-card hover:text-primary disabled:opacity-30"
        aria-label="Save note"
        title="Save note"
      >
        <Save className="h-4 w-4" />
      </button>
    </div>
  );
}

const AdminCRM = () => {
  const { contacts, isLoading, saveNotes } = useContacts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">CRM</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Leads captured from bookings and inquiries. Add private notes.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">Loading contacts…</div>
      ) : contacts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No contacts yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {contacts.map((c) => (
            <div key={c.id} className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold text-foreground">{c.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <ul className="space-y-0.5 text-sm text-muted-foreground">
                {c.phone && <li>Phone: {c.phone}</li>}
                {c.email && <li>Email: {c.email}</li>}
                {c.branch && <li>Interested in: {c.branch}</li>}
                {Object.entries(c.details ?? {}).map(([k, v]) => (
                  <li key={k} className="text-xs">
                    {k}: {String(v)}
                  </li>
                ))}
              </ul>
              <NotesEditor contact={c} onSave={(notes) => saveNotes({ id: c.id, notes })} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCRM;
```

- [ ] **Step 3: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 4: Mark step done.**

### Task 21: Register admin routes

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add imports** to `src/App.tsx`:

```tsx
import { Navigate } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminBookings from "./pages/admin/Bookings";
import AdminAvailability from "./pages/admin/Availability";
import AdminSubmissions from "./pages/admin/Submissions";
import AdminCRM from "./pages/admin/CRM";
```

(Note: `Routes`/`Route` are already imported from `react-router-dom` on the existing line at `src/App.tsx:5` — add `Navigate` to that same import instead of a separate line.)

- [ ] **Step 2: Add the admin route tree**, inside `<Routes>`, above the catch-all `*` route:

```tsx
            <Route path="/contact" element={<Contact />} />

            <Route
              path="/admin/login"
              element={
                <AdminAuthProvider>
                  <AdminLogin />
                </AdminAuthProvider>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminAuthProvider>
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                </AdminAuthProvider>
              }
            >
              <Route index element={<Navigate replace to="/admin/bookings" />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="availability" element={<AdminAvailability />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="crm" element={<AdminCRM />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
```

- [ ] **Step 3: Typecheck**

Run: `bun run build`
Expected: green.

- [ ] **Step 4: Mark step done.**

---

## Phase 5 — Bootstrap + end-to-end verification

### Task 22: Bootstrap the first admin

**Files:** none (data-only).

- [ ] **Step 1: Ask the user to create their staff login.** They sign up an account for themselves via the Supabase Dashboard → Authentication → Users → **Add user** (email + password), using the email they want to use for `/admin/login`. (Avoids ever handling the project's `service_role` key in this session.)

- [ ] **Step 2: Once the user confirms the email used, grant admin** via the Management API (looks up the uid by email — no secret material in this query):

```bash
apply_sql <(cat <<SQL
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = '<the email the user gave you>'
on conflict do nothing;
SQL
)
```

- [ ] **Step 3: Verify**

```bash
apply_sql <(echo "select u.email, r.role from auth.users u join public.user_roles r on r.user_id = u.id where r.role = 'admin';")
```

Expected: the staff email listed with role `admin`.

- [ ] **Step 4: Mark step done.**

### Task 23: End-to-end verification gate

**Files:** none (verification only). Do not report the feature complete until every check below passes.

- [ ] **Step 1: Build**

Run: `bun run build`
Expected: succeeds (already re-verified after every prior task, but re-run once at the end to catch any cross-task regressions).

- [ ] **Step 2: Booking round-trip via the UI**

`bun run dev` → open `/schedule-visit` → pick a free slot → fill in the details form (name, phone, a project from the dropdown, optional notes) → submit. Expected: success screen shown.

Confirm the row landed:
```bash
apply_sql <(echo "select b.date, b.time, b.status, b.details, c.name, c.phone from public.bookings b join public.contacts c on c.id = b.contact_id order by b.created_at desc limit 1;")
```

- [ ] **Step 3: Contact/inquiry round-trip via the UI**

Open `/contact` → submit the form. Expected: success toast shown.

Confirm the row landed:
```bash
apply_sql <(echo "select name, phone, message, status, type from public.inquiries order by created_at desc limit 1;")
```

- [ ] **Step 4: Admin sign-in and all four screens**

Sign in at `/admin/login` with the bootstrapped account. Expected:
- `/admin/bookings` shows the booking from Step 2; Confirm/Cancel/Reschedule all work without console errors.
- `/admin/availability` shows the 10 seeded windows; toggling one off and back on persists after a refresh.
- `/admin/submissions` shows the inquiry from Step 3 (and the backfilled `leads` history from Task 5); "Add to CRM" creates a `contacts` row and closes the submission.
- `/admin/crm` shows the contact created above; adding a note and saving persists after a refresh.

- [ ] **Step 5: RLS holds for a non-admin**

Sign out, sign back in with a second, non-admin Supabase Auth session (or use an incognito window with no session at all) and confirm `/admin/bookings` renders the "Not authorized" (or redirects to login) screen — never booking/contact data.

- [ ] **Step 6: Confirm `leads` is untouched**

```bash
apply_sql <(echo "select count(*) from public.leads;")
```

Expected: same row count as before Task 5's backfill (no rows added, none removed — the table is a frozen archive).

- [ ] **Step 7: Mark the whole plan done.**

---

## Self-review notes (already applied above)

- **Spec coverage:** every section of `docs/superpowers/specs/2026-07-04-booking-admin-design.md` maps to a task — schema (Tasks 1–6), public site (Tasks 7–12), admin (Tasks 13–21), bootstrap + gate (Tasks 22–23).
- **Type consistency:** `BookingInput`/`requestBooking` (Task 8) match the `request_booking` signature from Task 2 exactly (`p_project`/`p_notes`, no `p_child_age`/`p_language`). `useBookings`/`useSubmissions`/`useContacts`/`useAvailability` hook return shapes match what each page component destructures.
- **No placeholders:** every SQL/TS/TSX file above is complete, runnable code — nothing marked TBD.
- **Analytics/Settings:** intentionally out of scope per the approved design; their migrations (Task 3) are still applied since they're part of the fixed contract, just unrouted in the frontend.
