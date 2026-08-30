-- GramConnect schema
-- Run in the Supabase SQL editor, or with: supabase db push

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Farmer',
  phone text unique,
  farm_size_acres numeric not null default 2,
  season text not null default 'Monsoon',
  crops text[] not null default array['Rice','Wheat'],
  location_name text not null default 'Nashik, Maharashtra',
  latitude double precision not null default 19.9975,
  longitude double precision not null default 73.7898,
  monthly_budget numeric not null default 20000,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are self readable" on public.profiles;
create policy "profiles are self readable" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles are self writable" on public.profiles;
create policy "profiles are self writable" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles are self updatable" on public.profiles;
create policy "profiles are self updatable" on public.profiles
  for update using (auth.uid() = id);

-- A profile row is created automatically for every new auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Farmer'),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;

  insert into public.farm_status (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- expenses
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  crop text not null,
  category text not null,
  amount numeric not null check (amount > 0),
  payment_method text not null default 'Cash',
  date date not null default current_date,
  notes text default '',
  created_at timestamptz not null default now()
);

create index if not exists expenses_user_date_idx
  on public.expenses (user_id, date desc);

alter table public.expenses enable row level security;

drop policy if exists "expenses are owner scoped" on public.expenses;
create policy "expenses are owner scoped" on public.expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------- farm_status
create table if not exists public.farm_status (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sprinkler_percent integer not null default 74,
  sprinkler_auto boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.farm_status enable row level security;

drop policy if exists "farm status is owner scoped" on public.farm_status;
create policy "farm status is owner scoped" on public.farm_status
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- --------------------------------------------------------- chat_messages
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

drop policy if exists "chat is owner scoped" on public.chat_messages;
create policy "chat is owner scoped" on public.chat_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------- public reference tables
create table if not exists public.diseases (
  slug text primary key,
  name text not null,
  crop text not null,
  severity text not null check (severity in ('Low','Medium','High','Critical')),
  affected_part text not null,
  symptom text not null,
  description text not null,
  causes text[] not null default '{}',
  treatment text[] not null default '{}',
  prevention text[] not null default '{}',
  season text not null default 'Monsoon'
);

create table if not exists public.msp_prices (
  crop text primary key,
  price numeric not null,
  unit text not null default 'q',
  change numeric not null default 0
);

create table if not exists public.season_crops (
  name text primary key,
  season text not null,
  avg_temp text not null,
  rainfall text not null,
  window_text text not null,
  note text not null,
  emoji text not null default '🌾'
);

create table if not exists public.priorities (
  id text primary key,
  title text not null,
  body text not null,
  tone text not null default 'warning',
  icon text not null default 'bug'
);

-- Reference tables are readable by everyone, writable only by service role.
alter table public.diseases enable row level security;
alter table public.msp_prices enable row level security;
alter table public.season_crops enable row level security;
alter table public.priorities enable row level security;

drop policy if exists "diseases are public" on public.diseases;
create policy "diseases are public" on public.diseases for select using (true);

drop policy if exists "msp is public" on public.msp_prices;
create policy "msp is public" on public.msp_prices for select using (true);

drop policy if exists "season crops are public" on public.season_crops;
create policy "season crops are public" on public.season_crops for select using (true);

drop policy if exists "priorities are public" on public.priorities;
create policy "priorities are public" on public.priorities for select using (true);
