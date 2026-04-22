/*
  # Fix RLS Infinite Recursion

  This migration fixes the infinite recursion error in the profiles table RLS policies.

  ## Changes Made
  1. Create `is_admin()` security definer function to check admin status
  2. Update admin RLS policies to use the new function
  3. Remove recursive policy dependencies

  ## Security
  - The `is_admin()` function executes with elevated privileges to break recursion
  - Admin policies now use the security definer function instead of querying profiles directly
*/

-- Create security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing admin policies that cause recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create new admin policies using the security definer function
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin());