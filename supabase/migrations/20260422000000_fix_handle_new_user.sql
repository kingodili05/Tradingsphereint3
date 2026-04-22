/*
  # Fix handle_new_user trigger

  The original trigger only saved first_name and last_name from raw_user_meta_data.
  This migration updates it to also save phone_number, country, currency, and
  account_type so that all fields collected during signup are persisted.

  Also creates balances in the user's chosen currency (in addition to USD).
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_account_type text;
  v_currency     text;
BEGIN
  v_account_type := COALESCE(new.raw_user_meta_data->>'account_type', 'demo');
  v_currency     := COALESCE(new.raw_user_meta_data->>'currency', 'USD');

  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    phone_number,
    country,
    currency,
    account_type,
    is_demo,
    is_live,
    account_status
  )
  VALUES (
    new.id,
    new.email,
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
    phone_number   = EXCLUDED.phone_number,
    country        = EXCLUDED.country,
    currency       = EXCLUDED.currency,
    account_type   = EXCLUDED.account_type,
    is_demo        = EXCLUDED.is_demo,
    is_live        = EXCLUDED.is_live,
    updated_at     = now();

  -- Always ensure a USD balance row exists
  INSERT INTO public.balances (user_id, currency, balance, available_balance, locked_balance)
  VALUES (new.id, 'USD', 0.00, 0.00, 0.00)
  ON CONFLICT (user_id, currency) DO NOTHING;

  -- Also create a balance row for the user's chosen currency (if different from USD)
  IF v_currency <> 'USD' THEN
    INSERT INTO public.balances (user_id, currency, balance, available_balance, locked_balance)
    VALUES (new.id, v_currency, 0.00, 0.00, 0.00)
    ON CONFLICT (user_id, currency) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
