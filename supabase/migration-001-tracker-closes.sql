-- Adds the consultation close date used by the regulatory tracker.
alter table tracker_items add column if not exists closes date;
alter table subscribers add column if not exists prefs jsonb;
