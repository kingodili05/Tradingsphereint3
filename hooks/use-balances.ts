'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Balance } from '@/lib/database.types';
import { useAuth } from './use-auth';

export function useBalances() {
  const { user } = useAuth();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBalances([]);
      setLoading(false);
      return;
    }

    fetchBalances();

    // 🔄 Realtime subscription
    const channel = supabase
      .channel(`balances-user-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'balances',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBalances();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchBalances = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('balances')
      .select('*')
      .eq('user_id', user.id)
      .order('currency');

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setBalances(data || []);
    }

    setLoading(false);
  };

  // 🔑 Helper: update balance (e.g. after trade)
  const updateBalance = async (currency: string, amountDelta: number) => {
    if (!user) return { error: 'No user logged in' };

    const existingBalance = balances.find(b => b.currency === currency);

    if (!existingBalance) {
      return await supabase.from('balances').insert({
        user_id: user.id,
        currency,
        balance: amountDelta,
        available_balance: amountDelta,
        locked_balance: 0,
      });
    }

    const newBalance = existingBalance.balance + amountDelta;
    return await supabase
      .from('balances')
      .update({
        balance: newBalance,
        available_balance: newBalance,
      })
      .eq('user_id', user.id)
      .eq('currency', currency);
  };

  const getTotalBalanceUSD = () => {
    const exchangeRates = { USD: 1, BTC: 43000, ETH: 2600 };
    return balances.reduce((total, b) => {
      const rate = exchangeRates[b.currency as keyof typeof exchangeRates] || 1;
      return total + b.balance * rate;
    }, 0);
  };

  const getBalanceByCurrency = (currency: string) => {
    return balances.find(b => b.currency === currency)?.balance || 0;
  };

  return {
    balances,
    loading,
    error,
    refetch: fetchBalances,
    updateBalance,
    getTotalBalanceUSD,
    getBalanceByCurrency,
  };
}
