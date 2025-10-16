-- Enable Row Level Security
alter table "public"."profiles" enable row level security;

-- Create policy for users to view and edit their own profile
create policy "Users can view and update their own profile"
on "public"."profiles" for all
using ( auth.uid() = id )
with check ( auth.uid() = id );

-- Create policy for site managers to view all profiles
create policy "Site managers can view all profiles"
on "public"."profiles" for select
using ( (select role from profiles where id = auth.uid()) = 'site_manager_privilege' );

-- Function to handle new user creation and assign a short_id
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_short_id text;
  referral_code text;
begin
  -- Generate a unique short_id
  loop
    new_short_id := public.generate_short_id();
    exit when not exists (select 1 from public.profiles where short_id = new_short_id);
  end loop;

  -- Check for referral from auth.users.raw_user_meta_data
  -- This part needs to be adjusted based on how you pass referral code during sign-up
  -- For this example, let's assume it might be in raw_user_meta_data
  -- referral_code := (new.raw_user_meta_data->>'referral_code');

  insert into public.profiles (id, username, short_id)
  values (new.id, new.raw_user_meta_data->>'username', new_short_id);
  
  -- If you were to handle referral_code, you would update the 'referred_by' field here.
  -- if referral_code is not null then
  --   update public.profiles set referred_by = referral_code where id = new.id;
  -- end if;
  
  return new;
end;
$$;

-- Trigger to call the function when a new user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to generate a random short ID
create or replace function public.generate_short_id()
returns text
language plpgsql
as $$
declare
  -- Your character set and length definition
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result text := '';
  i integer := 0;
  char_length integer := 6; -- You can change the length of the ID here
begin
  for i in 1..char_length loop
    result := result || substr(chars, floor(random() * length(chars))::integer + 1, 1);
  end loop;
  return result;
end;
$$;

-- Associate profiles with users table for easier joins
alter table public.profiles add foreign key (id) references auth.users(id) on delete cascade;

-- Optional: Create a relationship for referred_by to short_id for integrity
-- Note: This requires short_id to be unique.
alter table public.profiles add constraint profiles_short_id_key unique (short_id);
alter table public.profiles add foreign key (referred_by) references public.profiles(short_id) on delete set null;
