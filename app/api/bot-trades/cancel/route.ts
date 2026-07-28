import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.slice(7));
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { data: adminProfile } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  if (!(adminProfile as any)?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { botTradeId } = await req.json();
  if (!botTradeId) {
    return NextResponse.json({ error: 'Missing botTradeId' }, { status: 400 });
  }

  // Claim: only cancel if still active (prevents race with settlement)
  const { data: trade } = await supabaseAdmin
    .from('bot_trades')
    .update({ status: 'cancelled' })
    .eq('id', botTradeId)
    .eq('status', 'active')
    .select('*')
    .single();

  if (!trade) {
    return NextResponse.json({ error: 'Trade not found or already settled' }, { status: 404 });
  }

  const amount = Number((trade as any).investment_amount);

  // Return locked funds to available, no P/L
  const { data: balance } = await supabaseAdmin
    .from('balances')
    .select('available_balance, locked_balance')
    .eq('user_id', (trade as any).user_id)
    .eq('currency', 'USD')
    .single();

  await supabaseAdmin
    .from('balances')
    .update({
      available_balance: Number((balance as any)?.available_balance || 0) + amount,
      locked_balance: Math.max(0, Number((balance as any)?.locked_balance || 0) - amount),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', (trade as any).user_id)
    .eq('currency', 'USD');

  if ((trade as any).linked_trade_id) {
    await supabaseAdmin
      .from('trades')
      .update({ status: 'cancelled', closed_at: new Date().toISOString() })
      .eq('id', (trade as any).linked_trade_id);
  }

  return NextResponse.json({ success: true });
}
