import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

// Temporary diagnostic endpoint — remove after investigating stuck settlements.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (token !== 'ts-debug-2807') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from('bot_trades')
    .select('id, status, symbol, investment_amount, duration_minutes, created_at, expires_at, settled_at, profit_loss_amount')
    .order('created_at', { ascending: false })
    .limit(10);

  return NextResponse.json({
    serverNow: new Date().toISOString(),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    error: error?.message || null,
    trades: data || [],
  });
}
