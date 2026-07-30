-- ============================================================
--  Trading Bot Feature — Standalone Schema
--  Admin-initiated auto trades executed on behalf of a user.
--
--  Requires: profiles(id), trades(id) tables already existing
--  (see supabase/COMPLETE_SCHEMA.sql if bootstrapping fresh).
-- ============================================================

-- Shared trigger helper (skip if already created elsewhere)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- BOT_TRADES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bot_trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  symbol text NOT NULL,
  trade_direction text NOT NULL CHECK (trade_direction IN ('buy', 'sell')),
  investment_amount decimal(20,2) NOT NULL CHECK (investment_amount > 0),
  profit_percentage decimal(8,2) NOT NULL DEFAULT 10,
  loss_percentage decimal(8,2) NOT NULL DEFAULT 50,
  outcome text NOT NULL DEFAULT 'profit' CHECK (outcome IN ('profit', 'loss')),
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  expires_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'settled', 'cancelled')),
  profit_loss_amount decimal(20,2),
  final_balance decimal(20,2),
  email_sent boolean NOT NULL DEFAULT false,
  notified_at timestamptz,
  linked_trade_id uuid REFERENCES public.trades(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bot_trades_user ON public.bot_trades (user_id);
CREATE INDEX IF NOT EXISTS idx_bot_trades_due  ON public.bot_trades (status, expires_at);
CREATE INDEX IF NOT EXISTS idx_bot_trades_pending_notice ON public.bot_trades (user_id, status, notified_at);

ALTER TABLE public.bot_trades ENABLE ROW LEVEL SECURITY;

-- Users read their own bot trades; admins read all
CREATE POLICY "bot_trades_select" ON public.bot_trades
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Writes only through service role (API routes) — no insert/update/delete policies for anon/authenticated.

-- updated_at trigger
CREATE TRIGGER update_bot_trades_updated_at
  BEFORE UPDATE ON public.bot_trades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime so user dashboard updates live
ALTER PUBLICATION supabase_realtime ADD TABLE public.bot_trades;
