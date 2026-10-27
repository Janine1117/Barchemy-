-- Staged for review; do not apply to production until AI rollout is approved.
create table if not exists public.jbink_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null,
  message_count integer not null default 0 check (message_count between 0 and 10),
  primary key (user_id, usage_day)
);
alter table public.jbink_daily_usage enable row level security;
revoke all on public.jbink_daily_usage from anon, authenticated;

-- Atomic reservation: concurrent requests cannot exceed ten daily requests.
-- Security definer is narrowly scoped; user identity comes only from verified auth context.
create or replace function public.reserve_jbink_message()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  reserved integer;
begin
  if (select auth.uid()) is null then
    return false;
  end if;
  insert into public.jbink_daily_usage(user_id, usage_day, message_count)
  values ((select auth.uid()), (now() at time zone 'utc')::date, 1)
  on conflict (user_id, usage_day) do update
    set message_count = public.jbink_daily_usage.message_count + 1
    where public.jbink_daily_usage.message_count < 10
  returning message_count into reserved;
  return reserved is not null;
end;
$$;
revoke all on function public.reserve_jbink_message() from public, anon;
grant execute on function public.reserve_jbink_message() to authenticated;
