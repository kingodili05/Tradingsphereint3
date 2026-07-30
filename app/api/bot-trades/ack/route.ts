import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Marks a settled bot trade as seen by the user so the dashboard result
// popup doesn't show it again. Users can only ack their own trades.
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.slice(7));
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  const { botTradeId } = await req.json();
  if (!botTradeId) {
    return NextResponse.json({ error: 'Missing botTradeId' }, { status: 400 });
  }

  const { data: updated, error } = await supabaseAdmin
    .from('bot_trades')
    .update({ notified_at: new Date().toISOString() })
    .eq('id', botTradeId)
    .eq('user_id', user.id)
    .select('id')
    .single();

  if (error || !updated) {
    return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
