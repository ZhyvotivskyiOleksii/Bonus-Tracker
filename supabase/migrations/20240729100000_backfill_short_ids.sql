
-- This script finds all user profiles where the short_id is not yet set
-- and generates a unique referral ID for each of them.
-- It ensures that all users, including those created before the referral system,
-- get a unique referral code.

UPDATE public.profiles
SET short_id = public.generate_short_id()
WHERE short_id IS NULL;
