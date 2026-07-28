import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, botTradeResultEmailHtml } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

// Settles every bot trade whose timer has elapsed. Idempotent: each trade is
// atomically claimed (active -> settled) before funds move, so concurrent
// callers cannot double-settle. Safe to call unauthenticated (cron, dashboard
// pings) - it only processes due trades with admin-predetermined outcomes.
async function settleDueTrades() {
  const nowIso = new Date().toISOString();

  const { data: dueTrades, error } = await supabaseAdmin
    .from('bot_trades')
    .select('*')
    .eq('status', 'active')
    .lte('expires_at', nowIso);

  if (error) return { settled: 0, error: error.message };
  if (!dueTrades || dueTrades.length === 0) return { settled: 0 };

  let settledCount = 0;

  for (const trade of dueTrades as any[]) {
    // Claim the trade: only proceed if we are the caller that flips it
    const { data: claimed } = await supabaseAdmin
      .from('bot_trades')
      .update({ status: 'settled', settled_at: new Date().toISOString() })
      .eq('id', trade.id)
      .eq('status', 'active')
      .select('id')
      .single();

    if (!claimed) continue; // another caller got it first

    const amount = Number(trade.investment_amount);
    const isProfit = trade.outcome === 'profit';
    const pct = isProfit ? Number(trade.profit_percentage) : Number(trade.loss_percentage);
    const profitLoss = isProfit ? amount * (pct / 100) : -amount * (pct / 100);

    // Release locked funds and apply result
    const { data: balance } = await supabaseAdmin
      .from('balances')
      .select('balance, available_balance, locked_balance')
      .eq('user_id', trade.user_id)
      .eq('currency', 'USD')
      .single();

    const newLocked = Math.max(0, Number((balance as any)?.locked_balance || 0) - amount);
    const newAvailable = Math.max(0, Number((balance as any)?.available_balance || 0) + amount + profitLoss);
    const newBalance = Math.max(0, Number((balance as any)?.balance || 0) + profitLoss);

    await supabaseAdmin
      .from('balances')
      .update({
        balance: newBalance,
        available_balance: newAvailable,
        locked_balance: newLocked,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', trade.user_id)
      .eq('currency', 'USD');

    await supabaseAdmin
      .from('bot_trades')
      .update({ profit_loss_amount: profitLoss, final_balance: newBalance })
      .eq('id', trade.id);

    // Close the mirrored trade in user's Trading History
    if (trade.linked_trade_id) {
      await supabaseAdmin
        .from('trades')
        .update({
          status: 'closed',
          realized_pnl: profitLoss,
          closed_at: new Date().toISOString(),
        } as any)
        .eq('id', trade.linked_trade_id);
    }

    // Email the user immediately
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name, email')
      .eq('id', trade.user_id)
      .single();

    const email = (profile as any)?.email;
    if (email) {
      const won = profitLoss >= 0;
      const fmtAmount = `$${Math.abs(profitLoss).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      const result = await sendEmail({
        to: email,
        subject: won
          ? `Trade Won 🎉 — +${fmtAmount} on ${trade.symbol}`
          : `Trade Closed — ${trade.symbol} position result`,
        html: botTradeResultEmailHtml({
          name: (profile as any)?.full_name || 'Valued Customer',
          symbol: trade.symbol,
          direction: trade.trade_direction,
          investment: amount,
          profitLoss,
          newBalance,
          durationMinutes: trade.duration_minutes,
        }),
      });

      if (result.success) {
        await supabaseAdmin
          .from('bot_trades')
          .update({ email_sent: true })
          .eq('id', trade.id);
      }
    }

    settledCount++;
  }

  return { settled: settledCount };
}

export async function POST() {
  const result = await settleDueTrades();
  return NextResponse.json(result);
}

export async function GET() {
  const result = await settleDueTrades();
  return NextResponse.json(result);
}
