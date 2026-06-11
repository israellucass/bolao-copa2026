-- Run this if you already created the database before auto-import was added
alter table public.matches
  add column if not exists external_fixture_id int unique;

create index if not exists idx_matches_external_fixture
  on public.matches (external_fixture_id);
