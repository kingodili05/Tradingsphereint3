'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Trade } from '@/lib/database.types';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export function useTrades() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTrades();
    } else {
      setTrades([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTrades = async () => {
    if (!supabase || !user) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setTrades(data || []);
    }

    setLoading(false);
  };

  const createTrade = async (tradeData: {
    exchange_type: string;
    symbol: string;
    trade_type: string;
    order_type?: string;
    volume: number;
    unit_worth: number;
    take_profit?: number;
    stop_loss?: number;
    expire_time?: string;
  }) => {
    if (!supabase || !user) {
      toast.error('Not authenticated');
      return { success: false };
    }

    const { data, error } = await supabase
      .from('trades')
      .insert({
        user_id: user.id,
        ...tradeData,
        entry_price: tradeData.unit_worth, // Set entry price to unit worth
        current_price: tradeData.unit_worth,
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create trade: ' + error.message);
      return { success: false, error };
    }

    toast.success('Trade created successfully');
    await fetchTrades(); // Refresh trades list
    return { success: true, data };
  };

  const cancelTrade = async (tradeId: string) => {
    if (!supabase) {
      toast.error('Not authenticated');
      return { success: false };
    }

    const { error } = await supabase
      .from('trades')
      .update({ 
        status: 'cancelled',
        closed_at: new Date().toISOString(),
      })
      .eq('id', tradeId)
      .eq('user_id', user?.id);

    if (error) {
      toast.error('Failed to cancel trade: ' + error.message);
      return { success: false, error };
    }

    toast.success('Trade cancelled successfully');
    await fetchTrades(); // Refresh trades list
    return { success: true };
  };

  const getOpenTrades = () => trades.filter(trade => trade.status === 'open');
  const getClosedTrades = () => trades.filter(trade => ['closed', 'cancelled'].includes(trade.status));

  return {
    trades,
    loading,
    error,
    refetch: fetchTrades,
    createTrade,
    cancelTrade,
    getOpenTrades,
    getClosedTrades,
  };
}