-- ============================================================
--  TradingSphereIntl — Complete Database Setup
--  Paste this entire file into Supabase SQL Editor and run it.
--  After it completes, run the admin setup at the bottom.
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PACKAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  min_balance decimal(15,2) NOT NULL DEFAULT 0,
  max_balance decimal(15,2),
  features jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO packages (name, display_name, min_balance, max_balance, features) VALUES
('starter', 'STARTER', 1000.00, 9999.99, '{"basic_tools": true, "standard_support": true, "mobile_access": true}'),
('bronze',  'BRONZE',  10000.00, 24999.99, '{"advanced_tools": true, "priority_support": true, "analytics": true, "webinars": true}'),
('silver',  'SILVER',  25000.00, 49999.99, '{"premium_analysis": true, "account_manager": true, "vip_support": true, "signals": true}'),
('gold',    'GOLD',    50000.00, 99999.99, '{"personal_coach": true, "advanced_analytics": true, "priority_execution": true, "institutional_tools": true}'),
('diamond', 'DIAMOND', 100000.00, NULL,   '{"white_glove": true, "custom_features": true, "institutional_pricing": true, "dedicated_infrastructure": true}')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 2. PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  full_name text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  profile_image_url text,
  phone_number text,
  country text,
  currency text DEFAULT 'USD',
  account_type text DEFAULT 'demo' CHECK (account_type IN ('demo', 'live')),
  package_id uuid REFERENCES packages(id),
  account_status text DEFAULT 'pending' CHECK (account_status IN ('pending', 'active', 'suspended', 'locked')),
  is_email_verified boolean DEFAULT false,
  is_residency_verified boolean DEFAULT false,
  is_identity_verified boolean DEFAULT false,
  is_demo boolean DEFAULT true,
  is_live boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  referral_bonus decimal(15,2) DEFAULT 0.00,
  total_deposits decimal(15,2) DEFAULT 0.00,
  total_withdrawals decimal(15,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 3. BALANCES
-- ============================================================
CREATE TABLE IF NOT EXISTS balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  currency text NOT NULL DEFAULT 'USD',
  balance decimal(15,8) DEFAULT 0.00000000,
  available_balance decimal(15,8) DEFAULT 0.00000000,
  locked_balance decimal(15,8) DEFAULT 0.00000000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, currency)
);

-- ============================================================
-- 4. TRADES
-- ============================================================
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exchange_type text NOT NULL CHECK (exchange_type IN ('forex', 'crypto', 'stocks', 'commodities', 'indices', 'futures')),
  symbol text NOT NULL,
  trade_type text NOT NULL CHECK (trade_type IN ('buy', 'sell')),
  order_type text NOT NULL DEFAULT 'market' CHECK (order_type IN ('market', 'limit', 'stop', 'stop_limit')),
  volume decimal(15,8) NOT NULL,
  unit_worth decimal(15,2) NOT NULL,
  entry_price decimal(15,8),
  exit_price decimal(15,8),
  current_price decimal(15,8),
  take_profit decimal(15,8),
  stop_loss decimal(15,8),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'open', 'closed', 'cancelled', 'expired')),
  signal_locked boolean DEFAULT false,
  expire_time timestamptz,
  unrealized_pnl decimal(15,2) DEFAULT 0.00,
  realized_pnl decimal(15,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

-- ============================================================
-- 5. MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'notification' CHECK (message_type IN ('notification', 'alert', 'promotion', 'system', 'admin')),
  is_read boolean DEFAULT false,
  is_important boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- ============================================================
-- 6. HISTORICAL PRICES
-- ============================================================
CREATE TABLE IF NOT EXISTS historical_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  exchange_type text NOT NULL CHECK (exchange_type IN ('forex', 'crypto', 'stocks', 'commodities', 'indices', 'futures')),
  open_price decimal(15,8) NOT NULL,
  high_price decimal(15,8) NOT NULL,
  low_price decimal(15,8) NOT NULL,
  close_price decimal(15,8) NOT NULL,
  volume decimal(20,8) DEFAULT 0,
  timeframe text NOT NULL CHECK (timeframe IN ('1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M')),
  timestamp timestamptz NOT NULL,
  UNIQUE(symbol, timeframe, timestamp)
);

-- ============================================================
-- 7. DEPOSITS
-- ============================================================
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount decimal(15,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  payment_method text NOT NULL CHECK (payment_method IN ('bank_transfer', 'credit_card', 'crypto', 'wire_transfer')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  transaction_id text,
  external_reference text,
  processed_by uuid REFERENCES profiles(id),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- ============================================================
-- 8. WITHDRAWALS
-- ============================================================
CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount decimal(15,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  withdrawal_method text NOT NULL CHECK (withdrawal_method IN ('bank_transfer', 'crypto', 'wire_transfer')),
  destination_address text,
  bank_details jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  transaction_id text,
  processed_by uuid REFERENCES profiles(id),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- ============================================================
-- 9. SIGNALS
-- ============================================================
CREATE TABLE IF NOT EXISTS signals (
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

CREATE TABLE IF NOT EXISTS signal_usage (
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

-- ============================================================
-- 10. ADMIN TRADE SIGNALS (advanced trading system)
-- ============================================================
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
  win_probability decimal(3,2) DEFAULT 0.60,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  executed_at timestamptz,
  total_participants integer DEFAULT 0,
  total_investment_amount decimal(15,2) DEFAULT 0,
  execution_result text CHECK (execution_result IN ('profit', 'loss', 'break_even'))
);

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
  UNIQUE(signal_id, user_id)
);

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

CREATE TABLE IF NOT EXISTS auto_trade_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_name text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  setting_type text NOT NULL CHECK (setting_type IN ('timer', 'percentage', 'boolean', 'text')),
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO auto_trade_settings (setting_name, setting_value, setting_type) VALUES
('default_timer_duration',    '30',   'timer'),
('default_win_probability',   '0.65', 'percentage'),
('auto_execution_enabled',    'true', 'boolean'),
('max_participants_per_signal','100', 'text')
ON CONFLICT (setting_name) DO NOTHING;

-- ============================================================
-- 11. VERIFICATION DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS verification_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('identity', 'residency', 'profile_picture')),
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 12. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_balances_user_id ON balances(user_id);
CREATE INDEX IF NOT EXISTS idx_balances_user_currency ON balances(user_id, currency);
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals(status);
CREATE INDEX IF NOT EXISTS idx_signals_expiry ON signals(expiry);
CREATE INDEX IF NOT EXISTS idx_signal_usage_signal_id ON signal_usage(signal_id);
CREATE INDEX IF NOT EXISTS idx_signal_usage_user_id ON signal_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_signals_status ON admin_trade_signals(status);
CREATE INDEX IF NOT EXISTS idx_signal_participants_signal ON signal_participants(signal_id);
CREATE INDEX IF NOT EXISTS idx_signal_participants_user ON signal_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_documents_user_id ON verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_historical_prices_symbol ON historical_prices(symbol);
CREATE INDEX IF NOT EXISTS idx_historical_prices_symbol_timeframe ON historical_prices(symbol, timeframe);

-- ============================================================
-- 13. ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_trade_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_trade_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 14. HELPER FUNCTIONS (must come before RLS policies)
-- ============================================================

-- Security-definer function to check admin status (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  admin_status boolean := false;
BEGIN
  SELECT is_admin INTO admin_status
  FROM public.profiles
  WHERE id = auth.uid();
  RETURN COALESCE(admin_status, false);
EXCEPTION
  WHEN OTHERS THEN RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- update_updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Safely add balance for a user (used by deposit approval)
CREATE OR REPLACE FUNCTION public.update_user_balance(
  p_user_id uuid,
  p_currency text,
  p_amount decimal
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.balances (user_id, currency, balance, available_balance, locked_balance)
  VALUES (p_user_id, p_currency, p_amount, p_amount, 0)
  ON CONFLICT (user_id, currency)
  DO UPDATE SET
    balance           = balances.balance + p_amount,
    available_balance = balances.available_balance + p_amount,
    updated_at        = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Assign package based on balance
CREATE OR REPLACE FUNCTION public.assign_package_by_balance(user_uuid uuid, total_balance decimal)
RETURNS void AS $$
DECLARE
  package_record packages%ROWTYPE;
BEGIN
  SELECT * INTO package_record
  FROM packages
  WHERE is_active = true
    AND min_balance <= total_balance
    AND (max_balance IS NULL OR total_balance <= max_balance)
  ORDER BY min_balance DESC
  LIMIT 1;

  IF package_record.id IS NOT NULL THEN
    UPDATE profiles SET package_id = package_record.id, updated_at = now()
    WHERE id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make a user admin by email (run manually after first signup)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET is_admin = true, account_status = 'active', updated_at = now()
  WHERE email = user_email;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute a signal and distribute results
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
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  SELECT * INTO signal_record FROM signals WHERE id = p_signal_id AND status = 'open';
  IF NOT FOUND THEN RAISE EXCEPTION 'Signal not found or not active'; END IF;

  SELECT COUNT(*), COALESCE(SUM(amount), 0) INTO participants_count, total_volume
  FROM signal_usage WHERE signal_id = p_signal_id AND status = 'pending';

  result_multiplier := CASE WHEN random() > 0.4 THEN signal_record.profit_target ELSE -signal_record.loss_limit END;

  FOR usage_record IN SELECT * FROM signal_usage WHERE signal_id = p_signal_id AND status = 'pending' LOOP
    final_result := usage_record.amount * result_multiplier;
    SELECT * INTO current_balance FROM balances WHERE user_id = usage_record.user_id AND currency = 'USD';
    IF FOUND THEN
      UPDATE balances SET
        balance           = balance + final_result,
        available_balance = available_balance + usage_record.amount + final_result,
        locked_balance    = GREATEST(0, locked_balance - usage_record.amount),
        updated_at        = now()
      WHERE user_id = usage_record.user_id AND currency = 'USD';
    END IF;
    UPDATE signal_usage SET result = final_result, status = 'settled', settled_at = now() WHERE id = usage_record.id;
  END LOOP;

  UPDATE signals SET status = 'executed', updated_at = now() WHERE id = p_signal_id;

  RETURN json_build_object(
    'signal_id', p_signal_id, 'participants', participants_count,
    'total_volume', total_volume, 'result_multiplier', result_multiplier,
    'outcome', CASE WHEN result_multiplier > 0 THEN 'profit' ELSE 'loss' END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Process expired signals
CREATE OR REPLACE FUNCTION public.process_expired_signals()
RETURNS json AS $$
DECLARE
  expired_signal_record signals%ROWTYPE;
  usage_record signal_usage%ROWTYPE;
  expired_count integer := 0;
BEGIN
  UPDATE signals SET status = 'expired', updated_at = now()
  WHERE status = 'open' AND expiry <= now();
  GET DIAGNOSTICS expired_count = ROW_COUNT;

  FOR expired_signal_record IN
    SELECT * FROM signals WHERE status = 'expired' AND updated_at >= now() - interval '1 minute'
  LOOP
    FOR usage_record IN
      SELECT * FROM signal_usage WHERE signal_id = expired_signal_record.id AND status = 'pending'
    LOOP
      UPDATE balances SET
        available_balance = available_balance + usage_record.amount,
        locked_balance    = GREATEST(0, locked_balance - usage_record.amount),
        updated_at        = now()
      WHERE user_id = usage_record.user_id AND currency = 'USD';
      UPDATE signal_usage SET status = 'cancelled', settled_at = now() WHERE id = usage_record.id;
    END LOOP;
  END LOOP;

  RETURN json_build_object('expired_count', expired_count, 'processed_at', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Join a trade signal (advanced)
CREATE OR REPLACE FUNCTION public.join_trade_signal(p_signal_id uuid, p_investment_amount decimal)
RETURNS json AS $$
DECLARE
  current_balance decimal;
  signal_record admin_trade_signals%ROWTYPE;
BEGIN
  SELECT * INTO signal_record FROM admin_trade_signals WHERE id = p_signal_id AND status = 'active';
  IF NOT FOUND THEN RAISE EXCEPTION 'Signal not found or not active'; END IF;

  SELECT available_balance INTO current_balance FROM balances WHERE user_id = auth.uid() AND currency = 'USD';
  IF current_balance IS NULL OR current_balance < p_investment_amount THEN
    RAISE EXCEPTION 'Insufficient balance for investment';
  END IF;

  UPDATE balances SET
    available_balance = available_balance - p_investment_amount,
    locked_balance    = locked_balance + p_investment_amount,
    updated_at        = now()
  WHERE user_id = auth.uid() AND currency = 'USD';

  INSERT INTO signal_participants (signal_id, user_id, investment_amount, entry_balance)
  VALUES (p_signal_id, auth.uid(), p_investment_amount, current_balance);

  UPDATE admin_trade_signals SET
    total_participants      = total_participants + 1,
    total_investment_amount = total_investment_amount + p_investment_amount,
    updated_at              = now()
  WHERE id = p_signal_id;

  RETURN json_build_object('success', true, 'message', 'Successfully joined signal', 'investment_amount', p_investment_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute timed signal (advanced)
CREATE OR REPLACE FUNCTION public.execute_timed_signal(p_signal_id uuid, p_force_outcome text DEFAULT NULL)
RETURNS json AS $$
DECLARE
  signal_record admin_trade_signals%ROWTYPE;
  participant_record signal_participants%ROWTYPE;
  outcome text;
  profit_multiplier decimal;
  participants_count integer;
  total_volume decimal;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Access denied. Admin privileges required.'; END IF;

  SELECT * INTO signal_record FROM admin_trade_signals WHERE id = p_signal_id AND status = 'active';
  IF NOT FOUND THEN RAISE EXCEPTION 'Signal not found or not active'; END IF;

  outcome := COALESCE(p_force_outcome,
    CASE WHEN random() < signal_record.win_probability THEN 'profit' ELSE 'loss' END);

  profit_multiplier := CASE WHEN outcome = 'profit'
    THEN signal_record.take_profit_percentage / 100
    ELSE -(signal_record.stop_loss_percentage / 100) END;

  SELECT COUNT(*), COALESCE(SUM(investment_amount), 0) INTO participants_count, total_volume
  FROM signal_participants WHERE signal_id = p_signal_id AND settled_at IS NULL;

  FOR participant_record IN
    SELECT * FROM signal_participants WHERE signal_id = p_signal_id AND settled_at IS NULL
  LOOP
    DECLARE
      profit_loss_amount decimal;
      new_balance decimal;
      cb balances%ROWTYPE;
    BEGIN
      profit_loss_amount := participant_record.investment_amount * profit_multiplier;
      SELECT * INTO cb FROM balances WHERE user_id = participant_record.user_id AND currency = 'USD';
      IF FOUND THEN
        new_balance := cb.balance + participant_record.investment_amount + profit_loss_amount;
        UPDATE signal_participants SET
          final_balance = new_balance, profit_loss_amount = profit_loss_amount,
          profit_loss_percentage = profit_multiplier * 100, settled_at = now()
        WHERE id = participant_record.id;
        UPDATE balances SET
          balance           = new_balance,
          available_balance = cb.available_balance + participant_record.investment_amount + profit_loss_amount,
          locked_balance    = GREATEST(0, cb.locked_balance - participant_record.investment_amount),
          updated_at        = now()
        WHERE user_id = participant_record.user_id AND currency = 'USD';
        INSERT INTO messages (user_id, title, content, message_type, is_important) VALUES (
          participant_record.user_id,
          'Trade Signal Executed: ' || signal_record.signal_name,
          'Your trade signal has been executed with a ' ||
          CASE WHEN profit_loss_amount >= 0 THEN 'profit' ELSE 'loss' END ||
          ' of $' || ABS(profit_loss_amount) || '. Your new balance is $' || new_balance,
          'system', true
        );
      END IF;
    END;
  END LOOP;

  UPDATE admin_trade_signals SET status = 'executed', execution_result = outcome, executed_at = now(), updated_at = now()
  WHERE id = p_signal_id;

  INSERT INTO trade_executions (signal_id, executed_by, execution_type, participants_count, total_volume, outcome, profit_multiplier, execution_details)
  VALUES (p_signal_id, auth.uid(),
    CASE WHEN p_force_outcome IS NOT NULL THEN 'manual' ELSE 'automatic' END,
    participants_count, total_volume, outcome, profit_multiplier,
    json_build_object('signal_name', signal_record.signal_name, 'commodity', signal_record.commodity,
                      'direction', signal_record.trade_direction, 'execution_time', now()));

  RETURN json_build_object('success', true, 'signal_id', p_signal_id, 'outcome', outcome,
    'participants', participants_count, 'total_volume', total_volume, 'profit_multiplier', profit_multiplier);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Start signal timer
CREATE OR REPLACE FUNCTION public.start_signal_timer(p_signal_id uuid, p_duration_minutes integer DEFAULT 30)
RETURNS json AS $$
DECLARE
  signal_record admin_trade_signals%ROWTYPE;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Access denied. Admin privileges required.'; END IF;
  SELECT * INTO signal_record FROM admin_trade_signals WHERE id = p_signal_id AND status = 'created';
  IF NOT FOUND THEN RAISE EXCEPTION 'Signal not found or already started'; END IF;

  UPDATE admin_trade_signals SET
    status = 'active', timer_start_time = now(),
    execution_time = now() + (p_duration_minutes || ' minutes')::interval,
    timer_duration_minutes = p_duration_minutes, updated_at = now()
  WHERE id = p_signal_id;

  RETURN json_build_object('success', true, 'signal_id', p_signal_id,
    'timer_start', now(), 'execution_time', now() + (p_duration_minutes || ' minutes')::interval);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.execute_signal(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_expired_signals() TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_trade_signal(uuid, decimal) TO authenticated;
GRANT EXECUTE ON FUNCTION public.execute_timed_signal(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_signal_timer(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_balance(uuid, text, decimal) TO authenticated;

-- ============================================================
-- 15. TRIGGERS (updated_at)
-- ============================================================
CREATE TRIGGER update_profiles_updated_at         BEFORE UPDATE ON profiles          FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_balances_updated_at          BEFORE UPDATE ON balances           FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trades_updated_at            BEFORE UPDATE ON trades             FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_packages_updated_at          BEFORE UPDATE ON packages           FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_signals_updated_at           BEFORE UPDATE ON signals            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_trade_signals_updated_at BEFORE UPDATE ON admin_trade_signals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_verification_documents_updated_at BEFORE UPDATE ON verification_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 16. HANDLE NEW USER TRIGGER
--     Saves ALL fields from signup form into profiles
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_account_type text;
  v_currency     text;
BEGIN
  v_account_type := COALESCE(new.raw_user_meta_data->>'account_type', 'demo');
  v_currency     := COALESCE(new.raw_user_meta_data->>'currency', 'USD');

  INSERT INTO public.profiles (
    id, email, first_name, last_name,
    phone_number, country, currency, account_type,
    is_demo, is_live, account_status
  )
  VALUES (
    new.id, new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'country',
    v_currency,
    v_account_type,
    v_account_type = 'demo',
    v_account_type = 'live',
    'pending'
  )
  ON CONFLICT (id) DO UPDATE SET
    phone_number = EXCLUDED.phone_number,
    country      = EXCLUDED.country,
    currency     = EXCLUDED.currency,
    account_type = EXCLUDED.account_type,
    is_demo      = EXCLUDED.is_demo,
    is_live      = EXCLUDED.is_live,
    updated_at   = now();

  -- Always create a USD balance row
  INSERT INTO public.balances (user_id, currency, balance, available_balance, locked_balance)
  VALUES (new.id, 'USD', 0, 0, 0)
  ON CONFLICT (user_id, currency) DO NOTHING;

  -- Also create a row for the user's chosen currency if different from USD
  IF v_currency <> 'USD' THEN
    INSERT INTO public.balances (user_id, currency, balance, available_balance, locked_balance)
    VALUES (new.id, v_currency, 0, 0, 0)
    ON CONFLICT (user_id, currency) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 17. RLS POLICIES
-- ============================================================

-- profiles
CREATE POLICY "Users can read own profile"    ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles"  ON profiles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE TO authenticated USING (public.is_admin());

-- packages
CREATE POLICY "All users can read packages"   ON packages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage packages"    ON packages FOR ALL    TO authenticated USING (public.is_admin());

-- balances
CREATE POLICY "Users can read own balances"   ON balances FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own balances" ON balances FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own balances" ON balances FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all balances" ON balances FOR ALL   TO authenticated USING (public.is_admin());

-- trades
CREATE POLICY "Users can read own trades"     ON trades FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own trades"   ON trades FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all trades"  ON trades FOR ALL    TO authenticated USING (public.is_admin());

-- messages
CREATE POLICY "Users can read own messages"   ON messages FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own messages" ON messages FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can read all messages"  ON messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert messages for any user" ON messages FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- historical_prices
CREATE POLICY "All users can read historical prices" ON historical_prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage historical prices"  ON historical_prices FOR ALL    TO authenticated USING (public.is_admin());

-- deposits
CREATE POLICY "Users can read own deposits"   ON deposits FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own deposits" ON deposits FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all deposits" ON deposits FOR ALL   TO authenticated USING (public.is_admin());

-- withdrawals
CREATE POLICY "Users can read own withdrawals"   ON withdrawals FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own withdrawals" ON withdrawals FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all withdrawals" ON withdrawals FOR ALL   TO authenticated USING (public.is_admin());

-- signals
CREATE POLICY "All users can read signals"    ON signals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can create signals"     ON signals FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update signals"     ON signals FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete signals"     ON signals FOR DELETE TO authenticated USING (public.is_admin());

-- signal_usage
CREATE POLICY "Users can read own signal usage"   ON signal_usage FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own signal usage" ON signal_usage FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own signal usage" ON signal_usage FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can read all signal usage"  ON signal_usage FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update all signal usage" ON signal_usage FOR UPDATE TO authenticated USING (public.is_admin());

-- admin_trade_signals
CREATE POLICY "All users can read active signals" ON admin_trade_signals FOR SELECT TO authenticated USING (status IN ('active', 'executed'));
CREATE POLICY "Admins can manage all signals"     ON admin_trade_signals FOR ALL    TO authenticated USING (public.is_admin());

-- signal_participants
CREATE POLICY "Users can read own participation" ON signal_participants FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can join signals"           ON signal_participants FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can read all participants" ON signal_participants FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update all participants" ON signal_participants FOR UPDATE TO authenticated USING (public.is_admin());

-- trade_executions
CREATE POLICY "Admins can read all executions"  ON trade_executions FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can create executions"    ON trade_executions FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- auto_trade_settings
CREATE POLICY "All users can read settings" ON auto_trade_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage settings"  ON auto_trade_settings FOR ALL    TO authenticated USING (public.is_admin());

-- verification_documents
CREATE POLICY "Users can read own verification documents"   ON verification_documents FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own verification documents" ON verification_documents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can read all verification documents"  ON verification_documents FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update all verification documents" ON verification_documents FOR UPDATE TO authenticated USING (public.is_admin());

-- ============================================================
-- 18. SAMPLE PRICE DATA
-- ============================================================
INSERT INTO historical_prices (symbol, exchange_type, open_price, high_price, low_price, close_price, volume, timeframe, timestamp)
SELECT 'BTC/USD','crypto',
  42000+(random()*2000), 42500+(random()*2000), 41500+(random()*2000), 42250+(random()*2000),
  random()*1000000, '1h', now()-(interval '1 hour'*gs)
FROM generate_series(1,168) gs
ON CONFLICT (symbol, timeframe, timestamp) DO NOTHING;

INSERT INTO historical_prices (symbol, exchange_type, open_price, high_price, low_price, close_price, volume, timeframe, timestamp)
SELECT 'EUR/USD','forex',
  1.08+(random()*0.02), 1.085+(random()*0.02), 1.075+(random()*0.02), 1.082+(random()*0.02),
  random()*10000000, '1h', now()-(interval '1 hour'*gs)
FROM generate_series(1,168) gs
ON CONFLICT (symbol, timeframe, timestamp) DO NOTHING;

-- ============================================================
-- DONE!
-- ============================================================
-- After this runs successfully, sign up with your admin email,
-- then run this ONE line to make yourself admin
-- (replace with your actual email):
--
--   SELECT public.make_user_admin('your-admin-email@example.com');
--
-- ============================================================
