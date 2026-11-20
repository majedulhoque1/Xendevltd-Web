-- Redesign · 0001 · Lakeview Tasmee floor availability (spec §6.3).
-- Staff set each level in admin → Floors; the public floor picker reads it.
-- 'unknown' = not set yet: the site shows "Ask" (WhatsApp) instead of a status.
-- Idempotent. Rollback: supabase/rollback/20261119120001_tasmee_floors.down.sql

create table if not exists public.tasmee_floors (
  level      integer primary key check (level between 1 and 8),
  status     text not null default 'unknown' check (status in ('open', 'held', 'sold', 'unknown')),
  updated_at timestamptz not null default now()
);

insert into public.tasmee_floors (level)
select g from generate_series(1, 8) as g
on conflict (level) do nothing;

drop trigger if exists trg_tasmee_floors_updated on public.tasmee_floors;
create trigger trg_tasmee_floors_updated before update on public.tasmee_floors
  for each row execute function public.set_updated_at();

alter table public.tasmee_floors enable row level security;
revoke all on public.tasmee_floors from anon;
grant select on public.tasmee_floors to anon, authenticated;
grant update on public.tasmee_floors to authenticated;
grant all on public.tasmee_floors to service_role;

drop policy if exists tasmee_floors_public_read on public.tasmee_floors;
create policy tasmee_floors_public_read on public.tasmee_floors
  for select to anon, authenticated using (true);

drop policy if exists tasmee_floors_admin_update on public.tasmee_floors;
create policy tasmee_floors_admin_update on public.tasmee_floors
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

notify pgrst, 'reload schema';
