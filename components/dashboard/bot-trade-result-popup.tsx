'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/hooks/use-auth';
import { TrendingDown, X, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BotTradeResult {
  id: string;
  symbol: string;
  trade_direction: string;
  investment_amount: number;
  profit_loss_amount: number;
  final_balance: number | null;
  duration_minutes: number;
}

// Shows the outcome of an admin-initiated bot trade the moment the user is
// back on the dashboard - even if the trade settled while they were offline.
// Unlike the signal-based TradeResultPopup (which only looks at a recent
// time window), this queries bot_trades for notified_at IS NULL, so a queued
// result waits indefinitely until the user has actually seen it.
export function BotTradeResultPopup() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<BotTradeResult[]>([]);
  const ackInFlight = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!supabase || !user) return;

    const fetchPending = async () => {
      const { data } = await supabase!
        .from('bot_trades')
        .select('id, symbol, trade_direction, investment_amount, profit_loss_amount, final_balance, duration_minutes')
        .eq('user_id', user.id)
        .eq('status', 'settled')
        .is('notified_at', null)
        .not('profit_loss_amount', 'is', null)
        .order('updated_at', { ascending: true });

      if (data && data.length > 0) {
        setQueue((data as unknown) as BotTradeResult[]);
      }
    };
    fetchPending();

    const channel = supabase
      .channel(`bot-trade-results-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bot_trades',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as any;
          if (updated.status !== 'settled' || updated.profit_loss_amount === null) return;
          if (updated.notified_at) return;
          setQueue((prev) => (prev.some((t) => t.id === updated.id) ? prev : [...prev, updated]));
        }
      )
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [user]);

  const dismiss = useCallback(async (id: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== id));

    if (!supabase || ackInFlight.current.has(id)) return;
    ackInFlight.current.add(id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await fetch('/api/bot-trades/ack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ botTradeId: id }),
      });
    } catch {
      // Non-fatal: worst case the same result shows again next login.
    }
  }, []);

  const result = queue[0];
  if (!result) return null;

  const isWin = result.profit_loss_amount >= 0;
  const absAmount = Math.abs(result.profit_loss_amount);

  return isWin ? (
    <WinCelebration result={result} absAmount={absAmount} onDismiss={() => dismiss(result.id)} />
  ) : (
    <LossNotice result={result} absAmount={absAmount} onDismiss={() => dismiss(result.id)} />
  );
}

interface PopupProps {
  result: BotTradeResult;
  absAmount: number;
  onDismiss: () => void;
}

function WinCelebration({ result, absAmount, onDismiss }: PopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ background: '#1d2330', border: '1px solid rgba(34,197,94,0.5)', boxShadow: '0 0 60px rgba(34,197,94,0.25)' }}
      >
        {/* Confetti glow header */}
        <div
          className="relative px-6 pt-8 pb-6 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.25),rgba(16,185,129,0.08))' }}
        >
          <span className="absolute top-3 left-6 text-lg animate-bounce">🎉</span>
          <span className="absolute top-5 right-8 text-lg animate-bounce [animation-delay:150ms]">🎊</span>
          <span className="absolute top-2 right-16 text-sm animate-bounce [animation-delay:300ms]">✨</span>

          <div className="mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center bg-green-500/20 animate-pulse">
            <PartyPopper className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-1 text-green-400">Congratulations! You Won! 🎉</h2>
          <p className="text-gray-400 text-sm">
            {result.symbol} {result.trade_direction.toUpperCase()} — bot trade closed in profit
          </p>
        </div>

        <div className="px-6 py-5 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-400 text-sm">Invested</span>
            <span className="text-white font-semibold">${result.investment_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-400 text-sm">Profit</span>
            <span className="font-bold text-lg text-green-400">
              +${absAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {result.final_balance !== null && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 text-sm">New Balance</span>
              <span className="font-semibold text-white">
                ${result.final_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <Button onClick={onDismiss} className="w-full font-semibold bg-green-600 hover:bg-green-700">
            Awesome, thanks!
          </Button>
        </div>

        <button onClick={onDismiss} className="absolute top-4 right-4 text-gray-300/70 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function LossNotice({ result, absAmount, onDismiss }: PopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#1d2330', border: '1px solid rgba(239,68,68,0.4)' }}
      >
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{ background: 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(220,38,38,0.05))' }}
        >
          <div className="mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center bg-red-500/20">
            <TrendingDown className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-1 text-red-400">Trade Closed</h2>
          <p className="text-gray-400 text-sm">
            {result.symbol} {result.trade_direction.toUpperCase()} — bot trade result
          </p>
        </div>

        <div className="px-6 py-5 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-400 text-sm">Invested</span>
            <span className="text-white font-semibold">${result.investment_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-400 text-sm">Loss</span>
            <span className="font-bold text-lg text-red-400">
              -${absAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {result.final_balance !== null && (
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 text-sm">New Balance</span>
              <span className="font-semibold text-white">
                ${result.final_balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <Button onClick={onDismiss} className="w-full font-semibold bg-gray-700 hover:bg-gray-600">
            Got it
          </Button>
        </div>

        <button onClick={onDismiss} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
