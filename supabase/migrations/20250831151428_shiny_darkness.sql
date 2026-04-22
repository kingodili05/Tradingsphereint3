/*
  # Trading Platform Database Schema

  This migration creates a complete database schema for an investment/trading platform with the following features:

  ## 1. Tables Created
  - `profiles` - Extended user profiles linked to Supabase Auth
  - `packages` - Trading package plans (STARTER, BRONZE, etc.)
  - `balances` - Multi-currency account balances per user
  - `trades` - Trading orders and transactions
  - `messages` - User notifications and admin messages
  - `historical_prices` - Price data for analytics

  ## 2. Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Admin users can access all data
  - Proper foreign key constraints and indexes

  ## 3. Key Features
  - Multi-currency balance support (USD, BTC, ETH)
  - Demo and Live account types
  - Package-based trading plans
  - Admin verification controls
  - Message system with read/unread status
  - Historical price tracking
*/

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create packages table first (referenced by profiles)
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

-- Insert default packages
INSERT INTO packages (name, display_name, min_balance, max_balance, features) VALUES
('starter', 'STARTER', 1000.00, 9999.99, '{"basic_tools": true, "standard_support": true, "mobile_access": true}'),
('bronze', 'BRONZE', 10000.00, 24999.99, '{"advanced_tools": true, "priority_support": true, "analytics": true, "webinars": true}'),
('silver', 'SILVER', 25000.00, 49999.99, '{"premium_analysis": true, "account_manager": true, "vip_support": true, "signals": true}'),
('gold', 'GOLD', 50000.00, 99999.99, '{"personal_coach": true, "advanced_analytics": true, "priority_execution": true, "institutional_tools": true}'),
('diamond', 'DIAMOND', 100000.00, NULL, '{"white_glove": true, "custom_features": true, "institutional_pricing": true, "dedicated_infrastructure": true}')
ON CONFLICT (name) DO NOTHING;

-- Create profiles table (extends Supabase auth.users)
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
  
  -- Account type and status
  account_type text DEFAULT 'demo' CHECK (account_type IN ('demo', 'live')),
  package_id uuid REFERENCES packages(id),
  account_status text DEFAULT 'pending' CHECK (account_status IN ('pending', 'active', 'suspended', 'locked')),
  
  -- Verification status
  is_email_verified boolean DEFAULT false,
  is_residency_verified boolean DEFAULT false,
  is_identity_verified boolean DEFAULT false,
  
  -- Account flags
  is_demo boolean DEFAULT true,
  is_live boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  
  -- Financial tracking
  referral_bonus decimal(15,2) DEFAULT 0.00,
  total_deposits decimal(15,2) DEFAULT 0.00,
  total_withdrawals decimal(15,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create balances table for multi-currency support
CREATE TABLE IF NOT EXISTS balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  currency text NOT NULL DEFAULT 'USD',
  balance decimal(15,8) DEFAULT 0.00000000,
  available_balance decimal(15,8) DEFAULT 0.00000000,
  locked_balance decimal(15,8) DEFAULT 0.00000000,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one balance record per user per currency
  UNIQUE(user_id, currency)
);

-- Create trades table for trading orders and history
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Trading details
  exchange_type text NOT NULL CHECK (exchange_type IN ('forex', 'crypto', 'stocks', 'commodities', 'indices', 'futures')),
  symbol text NOT NULL,
  trade_type text NOT NULL CHECK (trade_type IN ('buy', 'sell')),
  order_type text NOT NULL DEFAULT 'market' CHECK (order_type IN ('market', 'limit', 'stop', 'stop_limit')),
  
  -- Financial details
  volume decimal(15,8) NOT NULL,
  unit_worth decimal(15,2) NOT NULL,
  entry_price decimal(15,8),
  current_price decimal(15,8),
  take_profit decimal(15,8),
  stop_loss decimal(15,8),
  
  -- Order management
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'open', 'closed', 'cancelled', 'expired')),
  signal_locked boolean DEFAULT false,
  expire_time timestamptz,
  
  -- P&L tracking
  unrealized_pnl decimal(15,2) DEFAULT 0.00,
  realized_pnl decimal(15,2) DEFAULT 0.00,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

-- Create messages table for notifications and admin communication
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id), -- NULL for system messages
  
  -- Message content
  title text NOT NULL,
  content text NOT NULL,
  message_type text DEFAULT 'notification' CHECK (message_type IN ('notification', 'alert', 'promotion', 'system', 'admin')),
  
  -- Message status
  is_read boolean DEFAULT false,
  is_important boolean DEFAULT false,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Create historical_prices table for analytics and charting
CREATE TABLE IF NOT EXISTS historical_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  exchange_type text NOT NULL CHECK (exchange_type IN ('forex', 'crypto', 'stocks', 'commodities', 'indices', 'futures')),
  
  -- Price data
  open_price decimal(15,8) NOT NULL,
  high_price decimal(15,8) NOT NULL,
  low_price decimal(15,8) NOT NULL,
  close_price decimal(15,8) NOT NULL,
  volume decimal(20,8) DEFAULT 0,
  
  -- Time data
  timeframe text NOT NULL CHECK (timeframe IN ('1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M')),
  timestamp timestamptz NOT NULL,
  
  -- Ensure unique price records per symbol/timeframe/timestamp
  UNIQUE(symbol, timeframe, timestamp)
);

-- Create deposits table for tracking funding
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Deposit details
  amount decimal(15,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  payment_method text NOT NULL CHECK (payment_method IN ('bank_transfer', 'credit_card', 'crypto', 'wire_transfer')),
  
  -- Status tracking
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  transaction_id text,
  external_reference text,
  
  -- Admin fields
  processed_by uuid REFERENCES profiles(id),
  admin_notes text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Create withdrawals table for tracking withdrawals
CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Withdrawal details
  amount decimal(15,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  withdrawal_method text NOT NULL CHECK (withdrawal_method IN ('bank_transfer', 'crypto', 'wire_transfer')),
  destination_address text, -- For crypto withdrawals
  bank_details jsonb, -- For bank transfers
  
  -- Status tracking
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  transaction_id text,
  
  -- Admin fields
  processed_by uuid REFERENCES profiles(id),
  admin_notes text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_profiles_package_id ON profiles(package_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

CREATE INDEX IF NOT EXISTS idx_balances_user_id ON balances(user_id);
CREATE INDEX IF NOT EXISTS idx_balances_currency ON balances(currency);
CREATE INDEX IF NOT EXISTS idx_balances_user_currency ON balances(user_id, currency);

CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trades_exchange_type ON trades(exchange_type);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at);

CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

CREATE INDEX IF NOT EXISTS idx_historical_prices_symbol ON historical_prices(symbol);
CREATE INDEX IF NOT EXISTS idx_historical_prices_timestamp ON historical_prices(timestamp);
CREATE INDEX IF NOT EXISTS idx_historical_prices_symbol_timeframe ON historical_prices(symbol, timeframe);

CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_created_at ON deposits(created_at);

CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(created_at);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for packages table (read-only for all authenticated users)
CREATE POLICY "All users can read packages"
  ON packages
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage packages"
  ON packages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for balances table
CREATE POLICY "Users can read own balances"
  ON balances
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own balances"
  ON balances
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own balances"
  ON balances
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all balances"
  ON balances
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for trades table
CREATE POLICY "Users can read own trades"
  ON trades
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own trades"
  ON trades
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own trades"
  ON trades
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all trades"
  ON trades
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for messages table
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert messages for any user"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for historical_prices table (read-only for all users)
CREATE POLICY "All users can read historical prices"
  ON historical_prices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage historical prices"
  ON historical_prices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for deposits table
CREATE POLICY "Users can read own deposits"
  ON deposits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own deposits"
  ON deposits
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all deposits"
  ON deposits
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for withdrawals table
CREATE POLICY "Users can read own withdrawals"
  ON withdrawals
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own withdrawals"
  ON withdrawals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all withdrawals"
  ON withdrawals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  
  -- Create default USD balance
  INSERT INTO public.balances (user_id, currency, balance, available_balance)
  VALUES (new.id, 'USD', 0.00, 0.00);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile and balance on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_balances_updated_at
  BEFORE UPDATE ON balances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON trades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically assign package based on balance
CREATE OR REPLACE FUNCTION public.assign_package_by_balance(user_uuid uuid, total_balance decimal)
RETURNS void AS $$
DECLARE
  package_record packages%ROWTYPE;
BEGIN
  -- Find appropriate package based on balance
  SELECT * INTO package_record
  FROM packages
  WHERE is_active = true
    AND min_balance <= total_balance
    AND (max_balance IS NULL OR total_balance <= max_balance)
  ORDER BY min_balance DESC
  LIMIT 1;
  
  -- Update user's package if found
  IF package_record.id IS NOT NULL THEN
    UPDATE profiles
    SET package_id = package_record.id,
        updated_at = now()
    WHERE id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's total balance across all currencies (in USD equivalent)
CREATE OR REPLACE FUNCTION public.get_user_total_balance_usd(user_uuid uuid)
RETURNS decimal AS $$
DECLARE
  total_usd decimal := 0;
  balance_record RECORD;
BEGIN
  -- For simplicity, we'll assume 1:1 conversion for now
  -- In production, you'd want to fetch real exchange rates
  FOR balance_record IN 
    SELECT currency, balance FROM balances WHERE user_id = user_uuid
  LOOP
    CASE balance_record.currency
      WHEN 'USD' THEN total_usd := total_usd + balance_record.balance;
      WHEN 'BTC' THEN total_usd := total_usd + (balance_record.balance * 43000); -- Mock BTC price
      WHEN 'ETH' THEN total_usd := total_usd + (balance_record.balance * 2600);  -- Mock ETH price
      ELSE total_usd := total_usd + balance_record.balance; -- Default 1:1
    END CASE;
  END LOOP;
  
  RETURN total_usd;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create some sample data for testing (optional)
-- Note: This will only work after users are created through Supabase Auth

-- Sample historical price data for BTC/USD
INSERT INTO historical_prices (symbol, exchange_type, open_price, high_price, low_price, close_price, volume, timeframe, timestamp)
SELECT 
  'BTC/USD',
  'crypto',
  42000 + (random() * 2000),
  42500 + (random() * 2000),
  41500 + (random() * 2000),
  42250 + (random() * 2000),
  random() * 1000000,
  '1h',
  now() - (interval '1 hour' * generate_series(1, 168)) -- Last 7 days of hourly data
ON CONFLICT (symbol, timeframe, timestamp) DO NOTHING;

-- Sample historical price data for EUR/USD
INSERT INTO historical_prices (symbol, exchange_type, open_price, high_price, low_price, close_price, volume, timeframe, timestamp)
SELECT 
  'EUR/USD',
  'forex',
  1.08 + (random() * 0.02),
  1.085 + (random() * 0.02),
  1.075 + (random() * 0.02),
  1.082 + (random() * 0.02),
  random() * 10000000,
  '1h',
  now() - (interval '1 hour' * generate_series(1, 168)) -- Last 7 days of hourly data
ON CONFLICT (symbol, timeframe, timestamp) DO NOTHING;