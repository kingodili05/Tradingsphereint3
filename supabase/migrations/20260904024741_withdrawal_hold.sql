-- Lets an admin place a per-account hold on withdrawals with a custom message.
-- While withdrawal_hold_active is true, requestWithdrawal() (hooks/use-user-actions.ts)
-- still inserts the withdrawal row (status 'on_hold') so admins can see the attempt,
-- but shows the admin's message to the user instead of a normal "submitted" toast.
-- Rows with status 'on_hold' are excluded from the admin approve/reject actions
-- (components/admin/admin-finance-management.tsx only shows those buttons for 'pending').

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS withdrawal_hold_active boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS withdrawal_hold_message text;

ALTER TABLE public.withdrawals
  DROP CONSTRAINT IF EXISTS withdrawals_status_check;

ALTER TABLE public.withdrawals
  ADD CONSTRAINT withdrawals_status_check
  CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'on_hold'));
