-- The Word per Minute initial Supabase schema.
--
-- Run this in the Supabase SQL Editor after creating the project.
-- It creates user-owned app tables and protects them with Row Level Security.

create extension if not exists pgcrypto;

-- Keeps updated_at columns fresh without requiring the app to send timestamps.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Public profile row owned by a Supabase Auth user.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Creates a matching profile row whenever Supabase Auth creates a user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Saved passages are user-owned cloud copies of the current localStorage shape.
create table if not exists public.saved_passages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  theme text not null,
  reference text not null,
  translation_id text not null,
  translation_abbreviation text not null,
  book_id text not null,
  book_name text not null,
  chapter integer not null check (chapter > 0),
  start_verse integer not null check (start_verse > 0),
  end_verse integer not null check (end_verse >= start_verse),
  selected_verses integer[] not null default '{}',
  source text not null check (source in ('featured', 'bible')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (
    user_id,
    translation_id,
    book_id,
    chapter,
    start_verse,
    end_verse,
    selected_verses
  )
);

create index if not exists saved_passages_user_created_at_idx
on public.saved_passages (user_id, created_at desc);

create index if not exists saved_passages_user_category_idx
on public.saved_passages (user_id, category);

drop trigger if exists set_saved_passages_updated_at on public.saved_passages;
create trigger set_saved_passages_updated_at
before update on public.saved_passages
for each row
execute function public.set_updated_at();

-- Practice attempts record completed typing sessions for future progress views.
create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  saved_passage_id uuid references public.saved_passages(id) on delete set null,
  featured_passage_id text,
  passage_reference text not null,
  translation_id text not null,
  book_id text not null,
  chapter integer not null check (chapter > 0),
  start_verse integer not null check (start_verse > 0),
  end_verse integer not null check (end_verse >= start_verse),
  selected_verses integer[] not null default '{}',
  wpm integer not null check (wpm >= 0),
  accuracy integer not null check (accuracy >= 0 and accuracy <= 100),
  completed_at timestamptz not null default now(),
  check (
    saved_passage_id is not null
    or featured_passage_id is not null
  )
);

create index if not exists practice_attempts_user_completed_at_idx
on public.practice_attempts (user_id, completed_at desc);

create index if not exists practice_attempts_saved_passage_idx
on public.practice_attempts (saved_passage_id);

-- Row Level Security keeps browser-accessible tables scoped to the signed-in user.
alter table public.profiles enable row level security;
alter table public.saved_passages enable row level security;
alter table public.practice_attempts enable row level security;

-- Profiles: users can see and edit only their own profile row.
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Saved passages: users can fully manage only their own saved passages.
drop policy if exists "Users can read their own saved passages" on public.saved_passages;
create policy "Users can read their own saved passages"
on public.saved_passages
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own saved passages" on public.saved_passages;
create policy "Users can insert their own saved passages"
on public.saved_passages
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own saved passages" on public.saved_passages;
create policy "Users can update their own saved passages"
on public.saved_passages
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own saved passages" on public.saved_passages;
create policy "Users can delete their own saved passages"
on public.saved_passages
for delete
using (auth.uid() = user_id);

-- Practice attempts: users can read and create only their own attempts.
-- Attempts are intentionally not updateable from the client.
drop policy if exists "Users can read their own practice attempts" on public.practice_attempts;
create policy "Users can read their own practice attempts"
on public.practice_attempts
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own practice attempts" on public.practice_attempts;
create policy "Users can insert their own practice attempts"
on public.practice_attempts
for insert
with check (auth.uid() = user_id);
