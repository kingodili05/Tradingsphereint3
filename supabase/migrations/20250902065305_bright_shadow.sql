/*
  # Add update_user_balance function

  1. New Functions
    - `update_user_balance` - Safely increments user balance for deposits
  
  2. Security
    - Function uses SECURITY DEFINER for proper permissions
    - Atomic operation to prevent race conditions
*/

-- Create function to safely update user balance (for deposits)
CREATE OR REPLACE FUNCTION public.update_user_balance(
  p_user_id uuid,
  p_currency text,
  p_amount decimal
)
RETURNS void AS $$
BEGIN
  -- Insert or update balance atomically
  INSERT INTO public.balances (user_id, currency, balance, available_balance, locked_balance)
  VALUES (p_user_id, p_currency, p_amount, p_amount, 0)
  ON CONFLICT (user_id, currency)
  DO UPDATE SET
    balance = balances.balance + p_amount,
    available_balance = balances.available_balance + p_amount,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;