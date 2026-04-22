'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/hooks/use-auth';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TradeResult {
  id: string;
  signal_id: string;
  investment_amount: number;
  profit_loss_amount: number;
  profit_loss_percentage: number;
  settled_at: string;
  signal?: {
    signal_name: string;
    commodity: string;
    trade_direction: string;
    execution_result: string;
  };
}

export function TradeResultPopup() {
  const { user } = useAuth();
  const [result, setResult] = useState<TradeResult | null>(null);
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!supabase || !user) return;

    // Load already-seen IDs from sessionStorage so we don't re-show on remount
    const stored = sessionStorage.getItem('seen_trade_results');
    if (stored) {
      JSON.parse(stored).forEach((id: string) => seenIds.current.add(id));
    }

    // Subscribe to signal_participants settled for this user
    const channel = supabase
      .channel(`trade-results-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'signal_participants',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          const updated = payload.new as any;
          if (!updated.settled_at || seenIds.current.has(updated.id)) return;

          // Fetch signal details
          const { data: signal } = await supabase!
            .from('admin_trade_signals')
            .select('signal_name, commodity, trade_direction, execution_result')
            .eq('id', updated.signal_id)
            .single();

          setResult({ ...updated, signal });
        }
      )
      .subscribe();

    // Also check for recently settled trades on mount (within last 10 minutes, not yet seen)
    const checkRecent = async () => {
      const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data } = await supabase!
        .from('signal_participants')
        .select('*, admin_trade_signals(signal_name, commodity, trade_direction, execution_result)')
        .eq('user_id', user.id)
        .not('settled_at', 'is', null)
        .gte('settled_at', since)
        .order('settled_at', { ascending: false })
        .limit(1);

      if (data?.[0] && !seenIds.current.has(data[0].id)) {
        const row = data[0];
        setResult({ ...row, signal: (row as any).admin_trade_signals });
      }
    };
    checkRecent();

    return () => { channel.unsubscribe(); };
  }, [user]);

  const dismiss = () => {
    if (result) {
      seenIds.current.add(result.id);
      const arr = Array.from(seenIds.current);
      sessionStorage.setItem('seen_trade_results', JSON.stringify(arr));
    }
    setResult(null);
  };

  if (!result) return null;

  const isWin = result.profit_loss_amount >= 0;
  const absAmount = Math.abs(result.profit_loss_amount);
  const absPercent = Math.abs(result.profit_loss_percentage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#1d2330', border: isWin ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(239,68,68,0.4)' }}
      >
        {/* Glow header */}
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{ background: isWin ? 'linear-gradient(135deg,rgba(34,197,94,0.15),rgba(16,185,129,0.05))' : 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(220,38,38,0.05))' }}
        >
          <div className={`mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center ${isWin ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {isWin
              ? <TrendingUp className="h-8 w-8 text-green-400" />
              : <TrendingDown className="h-8 w-8 text-red-400" />}
          </div>
          <h2 className={`text-2xl font-bold mb-1 ${isWin ? 'text-green-400' : 'text-red-400'}`}>
            {isWin ? 'Trade Won! 🎉' : 'Trade Closed'}
          </h2>
          <p className="text-gray-400 text-sm">
            {result.signal?.commodity} {result.signal?.trade_direction?.toUpperCase()} — {result.signal?.signal_name}
          </p>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-400 text-sm">Invested</span>
            <span className="text-white font-semibold">${result.investment_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/10">
            <span className="text-gray-400 text-sm">{isWin ? 'Profit' : 'Loss'}</span>
            <span className={`font-bold text-lg ${isWin ? 'text-green-400' : 'text-red-400'}`}>
              {isWin ? '+' : '-'}${absAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 text-sm">Return</span>
            <span className={`font-semibold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
              {isWin ? '+' : '-'}{absPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="px-6 pb-6">
          <Button onClick={dismiss} className={`w-full font-semibold ${isWin ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
            Got it
          </Button>
        </div>

        <button onClick={dismiss} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
