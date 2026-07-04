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
