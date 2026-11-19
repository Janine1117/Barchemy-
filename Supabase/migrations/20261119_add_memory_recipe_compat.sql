-- Run once in the connected Barchemy Supabase project after verifying the project ID.
-- Additive and non-destructive: keep legacy note/notes fields for older clients.
begin;
alter table public.memories add column if not exists recipe text;
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'memories' and column_name = 'notes'
  ) then
    execute 'update public.memories set recipe = notes where recipe is null and notes is not null';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'memories' and column_name = 'note'
  ) then
    execute 'update public.memories set recipe = note where recipe is null and note is not null';
  end if;
end
$$;
alter table public.memories enable row level security;
commit;

-- IMPORTANT: This migration does not replace or certify existing RLS policies.
-- Check the Security Advisor and test authenticated cross-account isolation afterward.
