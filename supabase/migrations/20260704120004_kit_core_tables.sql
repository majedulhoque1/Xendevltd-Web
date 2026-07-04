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
