-- Xen-specific: timezone + one-time leads -> inquiries backfill.
-- Idempotent: the backfill only inserts rows that don't already have a matching
-- (phone, created_at) pair in inquiries, so re-running this file is a no-op.
-- The guard uses `is not distinct from` so it stays null-safe even if a legacy
-- lead row has a null phone (NULL = NULL would otherwise re-insert every re-run).

update public.site_settings set value = 'Asia/Dhaka', updated_at = now()
where key = 'timezone';

insert into public.inquiries (type, name, phone, email, message, created_at, status)
select 'contact', l.full_name, l.phone, l.email, l.message, l.created_at, 'new'
from public.leads l
where not exists (
  select 1 from public.inquiries i
  where i.phone is not distinct from l.phone
    and i.created_at is not distinct from l.created_at
);
