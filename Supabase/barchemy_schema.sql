create extension if not exists "pgcrypto";

create table if not exists public.ingredients (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 name text not null, category text not null, quantity numeric, unit text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.memories (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, note text, created_at timestamptz not null default now()
);
alter table public.ingredients enable row level security;
alter table public.memories enable row level security;
create policy "Users can view their own ingredients" on public.ingredients for select to authenticated using (auth.uid()=user_id);
create policy "Users can add their own ingredients" on public.ingredients for insert to authenticated with check (auth.uid()=user_id);
create policy "Users can update their own ingredients" on public.ingredients for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Users can delete their own ingredients" on public.ingredients for delete to authenticated using (auth.uid()=user_id);
create policy "Users can view their own memories" on public.memories for select to authenticated using (auth.uid()=user_id);
create policy "Users can save their own memories" on public.memories for insert to authenticated with check (auth.uid()=user_id);
create policy "Users can update their own memories" on public.memories for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Users can delete their own memories" on public.memories for delete to authenticated using (auth.uid()=user_id);
