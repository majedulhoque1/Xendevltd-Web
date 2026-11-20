-- Rollback for 20261119120002_inquiries_rate_limit.sql. Run by hand only.
drop trigger if exists trg_inquiries_rate_limit on public.inquiries;
drop function if exists public.inquiries_rate_limit();
drop index if exists public.inquiries_created_at_idx;
