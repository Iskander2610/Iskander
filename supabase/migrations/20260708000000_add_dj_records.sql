-- Saves DJ records for each logged-in user.
-- Apply with: npm run db:push

create table if not exists public.dj_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  username text not null,
  title text not null,
  actions jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.dj_records enable row level security;

create policy "read own dj records"
  on public.dj_records for select
  using (auth.uid() = user_id);

create policy "insert own dj records"
  on public.dj_records for insert
  with check (auth.uid() = user_id);

create policy "delete own dj records"
  on public.dj_records for delete
  using (auth.uid() = user_id);
