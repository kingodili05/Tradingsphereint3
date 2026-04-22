/*
  # Create Admin User

  This migration creates an admin user and provides instructions for accessing the admin dashboard.

  ## Changes Made
  1. Create function to make existing user an admin
  2. Provide instructions for admin access
*/

-- Function to make a user admin by email
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET is_admin = true,
      account_status = 'active',
      updated_at = now()
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example: To make your current user an admin, run this in the Supabase SQL editor:
-- SELECT public.make_user_admin('bing510103@gmail.com');

-- You can also manually update the profiles table:
-- UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';