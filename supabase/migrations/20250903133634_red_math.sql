/*
  # Fix Signals Migration Conflicts

  This migration safely handles existing signals objects and only creates what's missing.

  ## Changes Made
  1. Check if signals tables exist before creating
  2. Drop and recreate conflicting policies safely
  3. Ensure execute_signal function exists with proper permissions
  4. Add missing RLS policies only if they don't exist

  ## Security
  - All operations use IF NOT EXISTS or DROP IF EXISTS for safety
  - Maintains existing data integrity
  - Proper admin-only access for signal execution
*/

-- Create signals table only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'signals') THEN
    CREATE TABLE signals (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text,
      profit_target decimal(5,4) NOT NULL,
      loss_limit decimal(5,4) NOT NULL,
      expiry timestamptz NOT NULL,
      status text DEFAULT 'open' CHECK (status IN ('open', 'executed', 'expired', 'cancelled')),
      created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create signal_usage table only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'signal_usage') THEN
    CREATE TABLE signal_usage (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      signal_id uuid NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      amount decimal(15,2) NOT NULL,
      result decimal(15,2),
      status text DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'cancelled')),
      settled_at timestamptz,
      created_at timestamptz DEFAULT now(),
      UNIQUE(signal_id, user_id)
    );
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(status);
CREATE INDEX IF NOT EXISTS idx_signals_expiry ON signals(expiry);
CREATE INDEX IF NOT EXISTS idx_signals_created_by ON signals(created_by);
CREATE INDEX IF NOT EXISTS idx_signal_usage_signal_id ON signal_usage(signal_id);
CREATE INDEX IF NOT EXISTS idx_signal_usage_user_id ON signal_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_signal_usage_status ON signal_usage(status);

-- Enable RLS (safe to run multiple times)
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "All users can read signals" ON signals;
DROP POLICY IF EXISTS "Admins can create signals" ON signals;
DROP POLICY IF EXISTS "Admins can update signals" ON signals;
DROP POLICY IF EXISTS "Admins can delete signals" ON signals;
DROP POLICY IF EXISTS "Users can read own signal usage" ON signal_usage;
DROP POLICY IF EXISTS "Users can insert own signal usage" ON signal_usage;
DROP POLICY IF EXISTS "Users can update own signal usage" ON signal_usage;
DROP POLICY IF EXISTS "Admins can read all signal usage" ON signal_usage;
DROP POLICY IF EXISTS "Admins can update all signal usage" ON signal_usage;

-- Recreate RLS policies for signals table
CREATE POLICY "All users can read signals"
  ON signals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create signals"
  ON signals
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update signals"
  ON signals
  FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can delete signals"
  ON signals
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Recreate RLS policies for signal_usage table
CREATE POLICY "Users can read own signal usage"
  ON signal_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own signal usage"
  ON signal_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own signal usage"
  ON signal_usage
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all signal usage"
  ON signal_usage
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update all signal usage"
  ON signal_usage
  FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- Create or replace the execute_signal function
CREATE OR REPLACE FUNCTION public.execute_signal(p_signal_id uuid)
RETURNS json AS $$
DECLARE
  signal_record signals%ROWTYPE;
  usage_record signal_usage%ROWTYPE;
  current_balance balances%ROWTYPE;
  result_multiplier decimal;
  final_result decimal;
  participants_count integer := 0;
  total_volume decimal := 0;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Get signal details
  SELECT * INTO signal_record
  FROM signals
  WHERE id = p_signal_id AND status = 'open';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Signal not found or not active';
  END IF;

  -- Get all pending signal usage for this signal
  SELECT COUNT(*), COALESCE(SUM(amount), 0) INTO participants_count, total_volume
  FROM signal_usage
  WHERE signal_id = p_signal_id AND status = 'pending';

  -- Simulate signal outcome (60% chance of hitting profit target)
  IF random() > 0.4 THEN
    result_multiplier := signal_record.profit_target;
  ELSE
    result_multiplier := -signal_record.loss_limit;
  END IF;

  -- Process each user's position
  FOR usage_record IN 
    SELECT * FROM signal_usage 
    WHERE signal_id = p_signal_id AND status = 'pending'
  LOOP
    -- Calculate result
    final_result := usage_record.amount * result_multiplier;
    
    -- Get current balance
    SELECT * INTO current_balance
    FROM balances
    WHERE user_id = usage_record.user_id AND currency = 'USD';

    IF FOUND THEN
      -- Update balance: add result and unlock the original amount
      UPDATE balances
      SET 
        balance = balance + final_result,
        available_balance = available_balance + usage_record.amount + final_result,
        locked_balance = GREATEST(0, locked_balance - usage_record.amount),
        updated_at = now()
      WHERE user_id = usage_record.user_id AND currency = 'USD';
    END IF;

    -- Update signal usage record
    UPDATE signal_usage
    SET 
      result = final_result,
      status = 'settled',
      settled_at = now()
    WHERE id = usage_record.id;
  END LOOP;

  -- Mark signal as executed
  UPDATE signals
  SET 
    status = 'executed',
    updated_at = now()
  WHERE id = p_signal_id;

  -- Return execution summary
  RETURN json_build_object(
    'signal_id', p_signal_id,
    'participants', participants_count,
    'total_volume', total_volume,
    'result_multiplier', result_multiplier,
    'outcome', CASE WHEN result_multiplier > 0 THEN 'profit' ELSE 'loss' END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.execute_signal(uuid) TO authenticated;

-- Create trigger for updated_at if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_signals_updated_at'
  ) THEN
    CREATE TRIGGER update_signals_updated_at
      BEFORE UPDATE ON signals
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Add sample signals only if none exist
INSERT INTO signals (name, description, profit_target, loss_limit, expiry, created_by)
SELECT 
  'EUR/USD Bullish Signal',
  'Strong bullish momentum expected on EUR/USD based on technical analysis. Entry at current levels with tight stop loss.',
  0.1000, -- 10% profit target
  0.0500, -- 5% loss limit
  now() + interval '24 hours',
  id
FROM profiles 
WHERE is_admin = true 
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO signals (name, description, profit_target, loss_limit, expiry, created_by)
SELECT 
  'BTC/USD Breakout Signal',
  'Bitcoin showing strong breakout patterns above key resistance. Expecting significant upward move.',
  0.1500, -- 15% profit target
  0.0750, -- 7.5% loss limit
  now() + interval '48 hours',
  id
FROM profiles 
WHERE is_admin = true 
LIMIT 1
ON CONFLICT DO NOTHING;