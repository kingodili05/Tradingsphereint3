import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // Verify caller is an authenticated admin
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await admin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const { data: caller } = await admin.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!caller?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId, commodity, tradeDirection, investmentAmount, takeProfitPct, stopLossPct, durationMinutes, forcedOutcome } = await req.json();

  if (!userId || !commodity || !investmentAmount || investmentAmount <= 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Check user balance (service role — bypasses RLS)
  const { data: bal } = await admin
    .from('balances')
    .select('balance, available_balance, locked_balance')
    .eq('user_id', userId)
    .eq('currency', 'USD')
    .single();

  if (!bal || (bal.available_balance ?? bal.balance) < investmentAmount) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
  }

  const executionTime = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
  const signalCode = Math.floor(1000000 + Math.random() * 9000000).toString();

  // Create signal
  const { data: signal, error: sigErr } = await admin
    .from('admin_trade_signals')
    .insert({
      signal_name: `Direct Trade — ${commodity}`,
      signal_code: signalCode,
      commodity,
      trade_direction: tradeDirection,
      take_profit_percentage: takeProfitPct,
      stop_loss_percentage: stopLossPct,
      timer_duration_minutes: durationMinutes,
      win_probability: forcedOutcome === 'profit' ? 1.0 : 0.0,
      forced_outcome: forcedOutcome,
      status: 'active',
      timer_start_time: new Date().toISOString(),
      execution_time: executionTime,
      created_by: user.id,
    })
    .select('id')
    .single();

  if (sigErr || !signal) {
    return NextResponse.json({ error: sigErr?.message || 'Failed to create signal' }, { status: 500 });
  }

  // Add participant (service role — bypasses RLS)
  const { error: partErr } = await admin.from('signal_participants').insert({
    signal_id: signal.id,
    user_id: userId,
    investment_amount: investmentAmount,
    entry_balance: bal.balance,
  });

  if (partErr) {
    // Roll back signal
    await admin.from('admin_trade_signals').delete().eq('id', signal.id);
    return NextResponse.json({ error: partErr.message }, { status: 500 });
  }

  // Lock user balance
  const available = (bal.available_balance ?? bal.balance) - investmentAmount;
  const locked = (bal.locked_balance ?? 0) + investmentAmount;
  await admin.from('balances').update({
    available_balance: available,
    locked_balance: locked,
    updated_at: new Date().toISOString(),
  }).eq('user_id', userId).eq('currency', 'USD');

  return NextResponse.json({ success: true, signalId: signal.id });
}
