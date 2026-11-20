-- Redesign · 0002 · Enquiry spam limit (spec §6.1: honeypot + rate limiting).
-- Rejects a 4th enquiry from the same phone number (digits only) within one hour.
-- The site shows: "You've already sent a few requests…" (src/lib/describeError.ts).
-- Admin inserts are not limited. Idempotent.
-- Rollback: supabase/rollback/20261119120002_inquiries_rate_limit.down.sql

create or replace function public.inquiries_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_digits text;
  v_recent integer;
begin
  if new.phone is null or public.has_role(auth.uid(), 'admin') then
    return new;
  end if;

  v_digits := regexp_replace(new.phone, '\D', '', 'g');
  if length(v_digits) < 6 then
    return new;
  end if;

  select count(*) into v_recent
  from public.inquiries q
  where regexp_replace(coalesce(q.phone, ''), '\D', '', 'g') = v_digits
    and q.created_at > now() - interval '1 hour';

  if v_recent >= 3 then
    raise exception 'rate_limited'
      using errcode = 'P0001',
            hint = 'Too many requests from this number. Please try again in an hour or call us.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_inquiries_rate_limit on public.inquiries;
create trigger trg_inquiries_rate_limit
  before insert on public.inquiries
  for each row execute function public.inquiries_rate_limit();

-- Keeps the count fast as the table grows.
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
