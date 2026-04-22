/*
  # Create Signals Tables and Functions

  This migration creates the signals functionality for the trading platform.

  ## 1. New Tables
  - `signals` - Trading signals created by admins
  - `signal_usage` - User participation in signals

  ## 2. Functions
  - `execute_signal` - Execute a signal and distribute results
  - `process_expired_signals` - Handle expired signals

  ## 3. Security
  - Enable RLS on all tables
  - Users can read signals and manage their own usage
  - Admins can create and execute signals
*/

-- Create signals table
CREATE TABLE IF NOT EXISTS signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  profit_target decimal(5,4) NOT NULL, -- e.g., 0.1000 for 10%
  loss_limit decimal(5,4) NOT NULL,    -- e.g., 0.0500 for 5%
  expiry timestamptz NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'executed', 'expired', 'cancelled')),
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create signal_usage table
CREATE TABLE IF NOT EXISTS signal_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount decimal(15,2) NOT NULL,
  result decimal(15,2), -- Profit/loss amount
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'cancelled')),
  settled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure user can only join a signal once
  UNIQUE(signal_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(status);
CREATE INDEX IF NOT EXISTS idx_signals_expiry ON signals(expiry);
CREATE INDEX IF NOT EXISTS idx_signals_created_by ON signals(created_by);

CREATE INDEX IF NOT EXISTS idx_signal_usage_signal_id ON signal_usage(signal_id);
CREATE INDEX IF NOT EXISTS idx_signal_usage_user_id ON signal_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_signal_usage_status ON signal_usage(status);

-- Enable RLS
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for signals table
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

-- RLS Policies for signal_usage table
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

-- Create function to execute a signal
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
  -- In production, this would be based on actual market data
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

-- Create function to process expired signals
CREATE OR REPLACE FUNCTION public.process_expired_signals()
RETURNS json AS $$
DECLARE
  expired_signal_record signals%ROWTYPE;
  usage_record signal_usage%ROWTYPE;
  current_balance balances%ROWTYPE;
  expired_count integer := 0;
BEGIN
  -- Mark expired signals
  UPDATE signals
  SET status = 'expired', updated_at = now()
  WHERE status = 'open' AND expiry <= now();

  GET DIAGNOSTICS expired_count = ROW_COUNT;

  -- Process each expired signal to return funds
  FOR expired_signal_record IN 
    SELECT * FROM signals 
    WHERE status = 'expired' AND updated_at >= now() - interval '1 minute'
  LOOP
    -- Return funds for all pending usage of this signal
    FOR usage_record IN 
      SELECT * FROM signal_usage 
      WHERE signal_id = expired_signal_record.id AND status = 'pending'
    LOOP
      -- Get current balance
      SELECT * INTO current_balance
      FROM balances
      WHERE user_id = usage_record.user_id AND currency = 'USD';

      IF FOUND THEN
        -- Return locked funds to available balance
        UPDATE balances
        SET 
          available_balance = available_balance + usage_record.amount,
          locked_balance = GREATEST(0, locked_balance - usage_record.amount),
          updated_at = now()
        WHERE user_id = usage_record.user_id AND currency = 'USD';
      END IF;

      -- Mark signal usage as cancelled
      UPDATE signal_usage
      SET 
        status = 'cancelled',
        settled_at = now()
      WHERE id = usage_record.id;
    END LOOP;
  END LOOP;

  RETURN json_build_object(
    'expired_count', expired_count,
    'processed_at', now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.execute_signal(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_expired_signals() TO authenticated;

-- Create trigger to automatically update updated_at for signals
CREATE TRIGGER update_signals_updated_at
  BEFORE UPDATE ON signals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add some sample signals for testing
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

INSERT INTO signals (name, description, profit_target, loss_limit, expiry, created_by)
SELECT 
  'Gold Hedge Signal',
  'Safe haven demand increasing due to market uncertainty. Conservative play on precious metals.',
  0.0800, -- 8% profit target
  0.0400, -- 4% loss limit
  now() + interval '72 hours',
  id
FROM profiles 
WHERE is_admin = true 
LIMIT 1
ON CONFLICT DO NOTHING;