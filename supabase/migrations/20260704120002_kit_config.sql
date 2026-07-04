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
