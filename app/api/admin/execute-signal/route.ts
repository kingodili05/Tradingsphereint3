import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
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

  const { signalId, forceOutcome } = await req.json();
  if (!signalId) {
    return NextResponse.json({ error: 'Missing signalId' }, { status: 400 });
  }

  // Fetch signal (service role)
  const { data: signal, error: sigErr } = await admin
    .from('admin_trade_signals')
    .select('*')
    .eq('id', signalId)
    .eq('status', 'active')
    .single();

  if (sigErr || !signal) {
    return NextResponse.json({ error: 'Signal not found or not active' }, { status: 404 });
  }

  // Fetch ALL participants regardless of user (service role bypasses RLS)
  const { data: participants, error: partErr } = await admin
    .from('signal_participants')
    .select('*')
    .eq('signal_id', signalId)
    .is('settled_at', null);

  if (partErr) {
    return NextResponse.json({ error: partErr.message }, { status: 500 });
  }

  const outcome: 'profit' | 'loss' =
    forceOutcome ?? signal.forced_outcome ?? (Math.random() < signal.win_probability ? 'profit' : 'loss');

  const multiplier =
    outcome === 'profit'
      ? signal.take_profit_percentage / 100
      : -(signal.stop_loss_percentage / 100);

  const settled = new Date().toISOString();

  for (const p of participants ?? []) {
    const pnl = p.investment_amount * multiplier;

    // Settle participant
    await admin.from('signal_participants').update({
      profit_loss_amount: pnl,
      profit_loss_percentage: multiplier * 100,
      settled_at: settled,
    }).eq('id', p.id);

    // Update balance — return investment + pnl; unlock locked_balance
    const { data: bal } = await admin
      .from('balances')
      .select('balance, available_balance, locked_balance')
      .eq('user_id', p.user_id)
      .eq('currency', 'USD')
      .single();

    if (bal) {
      const returnAmount = p.investment_amount + pnl; // investment back + profit (or minus loss)
      await admin.from('balances').update({
        balance: bal.balance + pnl,
        available_balance: (bal.available_balance ?? bal.balance) + returnAmount,
        locked_balance: Math.max(0, (bal.locked_balance ?? 0) - p.investment_amount),
        updated_at: settled,
      }).eq('user_id', p.user_id).eq('currency', 'USD');
    }
  }

  // Mark signal executed
  await admin.from('admin_trade_signals').update({
    status: 'executed',
    execution_result: outcome,
    executed_at: settled,
    updated_at: settled,
  }).eq('id', signalId);

  return NextResponse.json({
    success: true,
    outcome,
    participantsSettled: participants?.length ?? 0,
  });
}
