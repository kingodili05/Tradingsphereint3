-- Tracks whether the user has been shown the in-dashboard result popup for a
-- settled bot trade, independent of email delivery (email_sent). Lets the
-- popup survive across sessions/devices: it queries for notified_at IS NULL
-- rather than a recent-time window, so a user who was offline when their
-- trade settled still sees it the next time they log in.

ALTER TABLE public.bot_trades
  ADD COLUMN IF NOT EXISTS notified_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_bot_trades_pending_notice
  ON public.bot_trades (user_id, status, notified_at);
