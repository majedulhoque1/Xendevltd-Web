-- Xen-specific fixup: close two RLS gaps found in code review of 20260704120008_kit_rls.sql
-- 1. inquiries had grant delete to authenticated but no matching DELETE policy (silent no-op).
-- 2. profiles/user_roles/site_settings were missing the same "revoke all from anon" defense-in-depth
--    treatment that contacts/bookings/notification_outbox/analytics_events already got.
-- Idempotent.

drop policy if exists inquiries_admin_delete on public.inquiries;
create policy inquiries_admin_delete on public.inquiries
  for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

revoke all on public.profiles from anon;
revoke all on public.user_roles from anon;
revoke all on public.site_settings from anon;
