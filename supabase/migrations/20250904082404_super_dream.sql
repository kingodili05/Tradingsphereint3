/*
  # Advanced Trading System Implementation

  This migration creates the complete trading signal and automated execution system.

  ## 1. New Tables
  - `admin_trade_signals` - Admin-created trade signals with timer execution
  - `trade_executions` - Audit trail of all trade executions
  - `signal_participants` - Users participating in signals
  - `auto_trade_settings` - Timer and automation configurations

  ## 2. Functions
  - `execute_timed_signal` - Timer-based signal execution
  - `calculate_trade_outcome` - Profit/loss calculation
  - `update_participant_balances` - Balance updates after execution

  ## 3. Security
  - Enable RLS on all new tables
  - Admin-only signal creation and execution
  - User participation tracking
*/

-- Create admin trade signals table
CREATE TABLE IF NOT EXISTS admin_trade_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_name text NOT NULL,
  commodity text NOT NULL,
  trade_direction text NOT NULL CHECK (trade_direction IN ('buy', 'sell')),
  take_profit_percentage decimal(5,2) NOT NULL,
  stop_loss_percentage decimal(5,2) NOT NULL,
  timer_duration_minutes integer NOT NULL DEFAULT 30,
  timer_start_time timestamptz,
  execution_time timestamptz,
  status text DEFAULT 'created' CHECK (status IN ('created', 'active', 'executed', 'cancelled', 'expired')),
  win_probability decimal(3,2) DEFAULT 0.60, -- 60% default win rate
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  executed_at timestamptz,
  total_participants integer DEFAULT 0,
  total_investment_amount decimal(15,2) DEFAULT 0,
  execution_result text CHECK (execution_result IN ('profit', 'loss', 'break_even'))
);

-- Create signal participants table
CREATE TABLE IF NOT EXISTS signal_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES admin_trade_signals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  investment_amount decimal(15,2) NOT NULL,
  entry_balance decimal(15,2) NOT NULL,
  final_balance decimal(15,2),
  profit_loss_amount decimal(15,2),
  profit_loss_percentage decimal(5,2),
  participated_at timestamptz DEFAULT now(),
  settled_at timestamptz,
  
  -- Unique constraint to prevent duplicate participation
  UNIQUE(signal_id, user_id)
);

-- Create trade executions audit table
CREATE TABLE IF NOT EXISTS trade_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES admin_trade_signals(id) ON DELETE CASCADE,
  executed_by uuid NOT NULL REFERENCES profiles(id),
  execution_type text NOT NULL CHECK (execution_type IN ('manual', 'automatic', 'timer')),
  participants_count integer NOT NULL,
  total_volume decimal(15,2) NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('profit', 'loss', 'break_even')),
  profit_multiplier decimal(5,4) NOT NULL,
  execution_details jsonb,
  executed_at timestamptz DEFAULT now()
);

-- Create auto trade settings table
CREATE TABLE IF NOT EXISTS auto_trade_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_name text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  setting_type text NOT NULL CHECK (setting_type IN ('timer', 'percentage', 'boolean', 'text')),
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz DEFAULT now()
);

-- Insert default auto trade settings
INSERT INTO auto_trade_settings (setting_name, setting_value, setting_type) VALUES
('default_timer_duration', '30', 'timer'),
('default_win_probability', '0.65', 'percentage'),
('auto_execution_enabled', 'true', 'boolean'),
('max_participants_per_signal', '100', 'text')
ON CONFLICT (setting_name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_signals_status ON admin_trade_signals(status);
CREATE INDEX IF NOT EXISTS idx_admin_signals_timer ON admin_trade_signals(timer_start_time, execution_time);
CREATE INDEX IF NOT EXISTS idx_admin_signals_created_by ON admin_trade_signals(created_by);

CREATE INDEX IF NOT EXISTS idx_signal_participants_signal ON signal_participants(signal_id);
CREATE INDEX IF NOT EXISTS idx_signal_participants_user ON signal_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_signal_participants_settled ON signal_participants(settled_at);

CREATE INDEX IF NOT EXISTS idx_trade_executions_signal ON trade_executions(signal_id);
CREATE INDEX IF NOT EXISTS idx_trade_executions_executed_by ON trade_executions(executed_by);
CREATE INDEX IF NOT EXISTS idx_trade_executions_executed_at ON trade_executions(executed_at);

-- Enable RLS
ALTER TABLE admin_trade_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_trade_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_trade_signals
CREATE POLICY "All users can read active signals"
  ON admin_trade_signals
  FOR SELECT
  TO authenticated
  USING (status IN ('active', 'executed'));

CREATE POLICY "Admins can manage all signals"
  ON admin_trade_signals
  FOR ALL
  TO authenticated
  USING (public.is_admin());

-- RLS Policies for signal_participants
CREATE POLICY "Users can read own participation"
  ON signal_participants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can join signals"
  ON signal_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all participants"
  ON signal_participants
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update all participants"
  ON signal_participants
  FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- RLS Policies for trade_executions
CREATE POLICY "Admins can read all executions"
  ON trade_executions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can create executions"
  ON trade_executions
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- RLS Policies for auto_trade_settings
CREATE POLICY "All users can read settings"
  ON auto_trade_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON auto_trade_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Function to join a signal
CREATE OR REPLACE FUNCTION public.join_trade_signal(
  p_signal_id uuid,
  p_investment_amount decimal
)
RETURNS json AS $$
DECLARE
  current_balance decimal;
  signal_record admin_trade_signals%ROWTYPE;
BEGIN
  -- Get signal details
  SELECT * INTO signal_record
  FROM admin_trade_signals
  WHERE id = p_signal_id AND status = 'active';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Signal not found or not active';
  END IF;

  -- Get current user balance
  SELECT available_balance INTO current_balance
  FROM balances
  WHERE user_id = auth.uid() AND currency = 'USD';

  IF current_balance IS NULL OR current_balance < p_investment_amount THEN
    RAISE EXCEPTION 'Insufficient balance for investment';
  END IF;

  -- Lock the investment amount
  UPDATE balances
  SET 
    available_balance = available_balance - p_investment_amount,
    locked_balance = locked_balance + p_investment_amount,
    updated_at = now()
  WHERE user_id = auth.uid() AND currency = 'USD';

  -- Add participant
  INSERT INTO signal_participants (
    signal_id,
    user_id,
    investment_amount,
    entry_balance
  ) VALUES (
    p_signal_id,
    auth.uid(),
    p_investment_amount,
    current_balance
  );

  -- Update signal totals
  UPDATE admin_trade_signals
  SET 
    total_participants = total_participants + 1,
    total_investment_amount = total_investment_amount + p_investment_amount,
    updated_at = now()
  WHERE id = p_signal_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Successfully joined signal',
    'investment_amount', p_investment_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to execute trade signal with timer
CREATE OR REPLACE FUNCTION public.execute_timed_signal(
  p_signal_id uuid,
  p_force_outcome text DEFAULT NULL -- 'profit', 'loss', or NULL for random
)
RETURNS json AS $$
DECLARE
  signal_record admin_trade_signals%ROWTYPE;
  participant_record signal_participants%ROWTYPE;
  outcome text;
  profit_multiplier decimal;
  participants_count integer;
  total_volume decimal;
BEGIN
  -- Check admin privileges
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Get signal details
  SELECT * INTO signal_record
  FROM admin_trade_signals
  WHERE id = p_signal_id AND status = 'active';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Signal not found or not active';
  END IF;

  -- Determine outcome
  IF p_force_outcome IS NOT NULL THEN
    outcome := p_force_outcome;
  ELSE
    -- Use win probability to determine outcome
    IF random() < signal_record.win_probability THEN
      outcome := 'profit';
    ELSE
      outcome := 'loss';
    END IF;
  END IF;

  -- Calculate multiplier based on outcome
  IF outcome = 'profit' THEN
    profit_multiplier := signal_record.take_profit_percentage / 100;
  ELSE
    profit_multiplier := -(signal_record.stop_loss_percentage / 100);
  END IF;

  -- Get participant counts
  SELECT COUNT(*), COALESCE(SUM(investment_amount), 0) 
  INTO participants_count, total_volume
  FROM signal_participants
  WHERE signal_id = p_signal_id AND settled_at IS NULL;

  -- Process each participant
  FOR participant_record IN 
    SELECT * FROM signal_participants 
    WHERE signal_id = p_signal_id AND settled_at IS NULL
  LOOP
    DECLARE
      profit_loss_amount decimal;
      new_balance decimal;
      current_balance balances%ROWTYPE;
    BEGIN
      -- Calculate profit/loss
      profit_loss_amount := participant_record.investment_amount * profit_multiplier;
      
      -- Get current balance
      SELECT * INTO current_balance
      FROM balances
      WHERE user_id = participant_record.user_id AND currency = 'USD';

      IF FOUND THEN
        -- Calculate final balance
        new_balance := current_balance.balance + participant_record.investment_amount + profit_loss_amount;
        
        -- Update participant record
        UPDATE signal_participants
        SET 
          final_balance = new_balance,
          profit_loss_amount = profit_loss_amount,
          profit_loss_percentage = profit_multiplier * 100,
          settled_at = now()
        WHERE id = participant_record.id;

        -- Update user balance
        UPDATE balances
        SET 
          balance = new_balance,
          available_balance = current_balance.available_balance + participant_record.investment_amount + profit_loss_amount,
          locked_balance = GREATEST(0, current_balance.locked_balance - participant_record.investment_amount),
          updated_at = now()
        WHERE user_id = participant_record.user_id AND currency = 'USD';

        -- Send notification to user
        INSERT INTO messages (user_id, title, content, message_type, is_important)
        VALUES (
          participant_record.user_id,
          'Trade Signal Executed: ' || signal_record.signal_name,
          'Your trade signal has been executed with a ' || 
          CASE WHEN profit_loss_amount >= 0 THEN 'profit' ELSE 'loss' END ||
          ' of $' || ABS(profit_loss_amount) || '. Your new balance is $' || new_balance,
          'system',
          true
        );
      END IF;
    END;
  END LOOP;

  -- Mark signal as executed
  UPDATE admin_trade_signals
  SET 
    status = 'executed',
    execution_result = outcome,
    executed_at = now(),
    updated_at = now()
  WHERE id = p_signal_id;

  -- Log execution
  INSERT INTO trade_executions (
    signal_id,
    executed_by,
    execution_type,
    participants_count,
    total_volume,
    outcome,
    profit_multiplier,
    execution_details
  ) VALUES (
    p_signal_id,
    auth.uid(),
    CASE WHEN p_force_outcome IS NOT NULL THEN 'manual' ELSE 'automatic' END,
    participants_count,
    total_volume,
    outcome,
    profit_multiplier,
    json_build_object(
      'signal_name', signal_record.signal_name,
      'commodity', signal_record.commodity,
      'direction', signal_record.trade_direction,
      'execution_time', now()
    )
  );

  RETURN json_build_object(
    'success', true,
    'signal_id', p_signal_id,
    'outcome', outcome,
    'participants', participants_count,
    'total_volume', total_volume,
    'profit_multiplier', profit_multiplier
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start signal timer
CREATE OR REPLACE FUNCTION public.start_signal_timer(
  p_signal_id uuid,
  p_duration_minutes integer DEFAULT 30
)
RETURNS json AS $$
DECLARE
  signal_record admin_trade_signals%ROWTYPE;
BEGIN
  -- Check admin privileges
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Get signal
  SELECT * INTO signal_record
  FROM admin_trade_signals
  WHERE id = p_signal_id AND status = 'created';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Signal not found or already started';
  END IF;

  -- Start timer
  UPDATE admin_trade_signals
  SET 
    status = 'active',
    timer_start_time = now(),
    execution_time = now() + (p_duration_minutes || ' minutes')::interval,
    timer_duration_minutes = p_duration_minutes,
    updated_at = now()
  WHERE id = p_signal_id;

  RETURN json_build_object(
    'success', true,
    'signal_id', p_signal_id,
    'timer_start', now(),
    'execution_time', now() + (p_duration_minutes || ' minutes')::interval
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.join_trade_signal(uuid, decimal) TO authenticated;
GRANT EXECUTE ON FUNCTION public.execute_timed_signal(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_signal_timer(uuid, integer) TO authenticated;

-- Create triggers for updated_at
CREATE TRIGGER update_admin_trade_signals_updated_at
  BEFORE UPDATE ON admin_trade_signals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();