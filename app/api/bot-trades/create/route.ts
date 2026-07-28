import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.slice(7));
  if (!user) return null;
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  return (profile as any)?.is_admin ? user : null;
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const {
    userId,
    symbol,
    direction,
    amount,
    profitPercentage,
    lossPercentage,
    outcome,
    durationMinutes,
  } = body;

  if (
    !userId || !symbol ||
    !['buy', 'sell'].includes(direction) ||
    typeof amount !== 'number' || amount <= 0 ||
    typeof profitPercentage !== 'number' || profitPercentage <= 0 ||
    typeof lossPercentage !== 'number' || lossPercentage <= 0 || lossPercentage > 100 ||
    !['profit', 'loss'].includes(outcome) ||
    typeof durationMinutes !== 'number' || durationMinutes <= 0
  ) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  // Lock funds: available -> locked
  const { data: balance } = await supabaseAdmin
    .from('balances')
    .select('balance, available_balance, locked_balance')
    .eq('user_id', userId)
    .eq('currency', 'USD')
    .single();

  const available = Number((balance as any)?.available_balance || 0);
  if (available < amount) {
    return NextResponse.json(
      { error: `Insufficient available balance (${available.toFixed(2)} USD)` },
      { status: 400 }
    );
  }

  const { error: lockError } = await supabaseAdmin
    .from('balances')
    .update({
      available_balance: available - amount,
      locked_balance: Number((balance as any).locked_balance || 0) + amount,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('currency', 'USD');

  if (lockError) {
    return NextResponse.json({ error: lockError.message }, { status: 500 });
  }

  const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();

  // Mirror row into trades table so it shows in user's Trading History
  const { data: linkedTrade } = await supabaseAdmin
    .from('trades')
    .insert({
      user_id: userId,
      exchange_type: 'crypto',
      symbol,
      trade_type: direction,
      volume: 1,
      unit_worth: amount,
      entry_price: amount,
      current_price: amount,
      expire_time: expiresAt,
      status: 'open',
    } as any)
    .select('id')
    .single();

  const { data: botTrade, error: insertError } = await supabaseAdmin
    .from('bot_trades')
    .insert({
      user_id: userId,
      created_by: admin.id,
      symbol,
      trade_direction: direction,
      investment_amount: amount,
      profit_percentage: profitPercentage,
      loss_percentage: lossPercentage,
      outcome,
      duration_minutes: durationMinutes,
      expires_at: expiresAt,
      status: 'active',
      linked_trade_id: (linkedTrade as any)?.id || null,
    } as any)
    .select()
    .single();

  if (insertError) {
    // Roll back the lock
    await supabaseAdmin
      .from('balances')
      .update({
        available_balance: available,
        locked_balance: Number((balance as any).locked_balance || 0),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('currency', 'USD');
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, botTrade });
}
