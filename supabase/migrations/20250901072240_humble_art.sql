/*
  # Fix Infinite Recursion in Profiles RLS Policies

  This migration fixes the infinite recursion error in the profiles table RLS policies
  by properly implementing the security definer function approach.

  ## Changes Made
  1. Drop existing problematic admin policies
  2. Recreate the `is_admin()` security definer function
  3. Create new admin policies using the security definer function
  4. Ensure no recursive dependencies

  ## Security
  - The `is_admin()` function executes with elevated privileges to break recursion
  - Admin policies now use the security definer function instead of direct profile queries
*/

-- Drop existing admin policies that cause recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Recreate the security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  admin_status boolean := false;
BEGIN
  -- Use a direct query with security definer privileges to avoid recursion
  SELECT is_admin INTO admin_status
  FROM public.profiles 
  WHERE id = auth.uid();
  
  RETURN COALESCE(admin_status, false);
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

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

-- Also fix other tables that might have similar issues
-- Update balances table admin policies
DROP POLICY IF EXISTS "Admins can manage all balances" ON balances;
CREATE POLICY "Admins can manage all balances"
  ON balances
  FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Update trades table admin policies  
DROP POLICY IF EXISTS "Admins can manage all trades" ON trades;
CREATE POLICY "Admins can manage all trades"
  ON trades
  FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Update messages table admin policies
DROP POLICY IF EXISTS "Admins can read all messages" ON messages;
DROP POLICY IF EXISTS "Admins can insert messages for any user" ON messages;

CREATE POLICY "Admins can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert messages for any user"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Update deposits table admin policies
DROP POLICY IF EXISTS "Admins can manage all deposits" ON deposits;
CREATE POLICY "Admins can manage all deposits"
  ON deposits
  FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Update withdrawals table admin policies
DROP POLICY IF EXISTS "Admins can manage all withdrawals" ON withdrawals;
CREATE POLICY "Admins can manage all withdrawals"
  ON withdrawals
  FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Update packages table admin policies
DROP POLICY IF EXISTS "Admins can manage packages" ON packages;
CREATE POLICY "Admins can manage packages"
  ON packages
  FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Update historical_prices table admin policies
DROP POLICY IF EXISTS "Admins can manage historical prices" ON historical_prices;
CREATE POLICY "Admins can manage historical prices"
  ON historical_prices
  FOR ALL
  TO authenticated
  USING (public.is_admin());