/*
  # Sync profiles.is_email_verified with Supabase Auth confirmation

  The app previously set is_email_verified only when the user landed on
  /auth/verify-email and the welcome-email API ran. If the confirmation
  link redirected anywhere else (e.g. the site root), auth.users was
  confirmed but the profile flag stayed false.

  This trigger syncs the flag the moment Supabase Auth confirms the email,
  regardless of where the browser ends up. Also backfills existing users.
*/

CREATE OR REPLACE FUNCTION public.sync_email_verified()
RETURNS trigger AS $$
BEGIN
  IF new.email_confirmed_at IS NOT NULL AND old.email_confirmed_at IS NULL THEN
    UPDATE public.profiles
    SET is_email_verified = true,
        updated_at = now()
    WHERE id = new.id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_email_verified();

-- Backfill: anyone already confirmed in auth but not flagged in profiles
UPDATE public.profiles p
SET is_email_verified = true, updated_at = now()
FROM auth.users u
WHERE u.id = p.id
  AND u.email_confirmed_at IS NOT NULL
  AND p.is_email_verified = false;
