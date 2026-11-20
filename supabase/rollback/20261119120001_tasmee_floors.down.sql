-- Rollback for 20261119120001_tasmee_floors.sql. Run by hand only; never place in migrations/.
-- Deletes the floor statuses staff have set. The public picker falls back to "Ask".
drop table if exists public.tasmee_floors;
notify pgrst, 'reload schema';
