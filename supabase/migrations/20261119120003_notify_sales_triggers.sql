-- Redesign · 0003 · Instant sales alerts (spec §6.1).
-- After a new enquiry or booking is saved, pg_net calls the notify-sales edge function,
-- which emails the sales inbox (Resend). The call is asynchronous and never blocks or
-- fails the insert. The shared secret lives in Supabase Vault as 'notify_secret'; until
-- it exists, the triggers do nothing. Idempotent.
-- Rollback: supabase/rollback/20261119120003_notify_sales_triggers.down.sql

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_sales()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_secret text;
begin
  begin
    select ds.decrypted_secret into v_secret
    from vault.decrypted_secrets ds
    where ds.name = 'notify_secret'
    limit 1;

    if coalesce(v_secret, '') = '' then
      return new;
    end if;

    perform net.http_post(
      url     := 'https://erdbnkemhezvjdhfqjtq.supabase.co/functions/v1/notify-sales',
      headers := jsonb_build_object('Content-Type', 'application/json', 'x-notify-secret', v_secret),
      body    := jsonb_build_object('table', tg_table_name, 'record', to_jsonb(new))
    );
  exception when others then
    -- An alert must never cost us the lead.
    raise warning 'notify_sales failed: %', sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists trg_inquiries_notify_sales on public.inquiries;
create trigger trg_inquiries_notify_sales
  after insert on public.inquiries
  for each row execute function public.notify_sales();

drop trigger if exists trg_bookings_notify_sales on public.bookings;
create trigger trg_bookings_notify_sales
  after insert on public.bookings
  for each row execute function public.notify_sales();
