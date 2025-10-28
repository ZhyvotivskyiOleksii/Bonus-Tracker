-- NOTE: For easier development, you might want to disable email confirmation.
-- You can do this in your Supabase project settings:
-- Authentication -> Providers -> Email -> "Confirm email" (toggle this off)

-- 1. Create the 'profiles' table
-- This table will store public user data.
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  short_id text unique,
  primary key (id)
);

-- 2. Enable Row Level Security (RLS) for the 'profiles' table
alter table public.profiles enable row level security;

-- 3. Create policies for 'profiles'
-- These policies define who can do what on the 'profiles' table.

-- Policy: Profiles are viewable by everyone.
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- Policy: Users can insert their own profile.
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

-- Policy: Users can update their own profile.
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 4. Create the function to handle new user creation
-- This function will be called by a trigger whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  -- variable to hold the generated short_id
  new_short_id text;
begin
  -- generate a random 8-character string for the short_id
  new_short_id := substr(md5(random()::text), 0, 9);

  -- insert a new row into the public.profiles table
  insert into public.profiles (id, email, short_id)
  values (new.id, new.email, new_short_id);
  return new;
end;
$$ language plpgsql security definer;

-- 5. Create the trigger
-- This trigger calls the handle_new_user function after a new user is created in the auth.users table.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- === Testimonials reactions ================================================
-- Stores per-user reactions (like/heart) for static testimonials on landing
create table if not exists public.testimonial_reactions (
  id uuid primary key default gen_random_uuid(),
  testimonial_key text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  liked boolean not null default false,
  heart boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (testimonial_key, user_id)
);

alter table public.testimonial_reactions enable row level security;

-- Everyone can read reactions (for counts)
create policy if not exists "Reactions readable to all" on public.testimonial_reactions
  for select using (true);

-- Only the authenticated user can insert/update their own reaction rows
create policy if not exists "Insert own reaction" on public.testimonial_reactions
  for insert with check (auth.uid() = user_id);

create policy if not exists "Update own reaction" on public.testimonial_reactions
  for update using (auth.uid() = user_id);

create index if not exists idx_testimonial_reactions_key on public.testimonial_reactions(testimonial_key);
