-- Rollback for 20261119120003_notify_sales_triggers.sql. Run by hand only.
-- Leaves pg_net installed (other features may use it) and the Vault secret in place.
drop trigger if exists trg_inquiries_notify_sales on public.inquiries;
drop trigger if exists trg_bookings_notify_sales on public.bookings;
drop function if exists public.notify_sales();
