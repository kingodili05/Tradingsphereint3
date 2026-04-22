'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from './use-auth';
import { Profile, Balance, Trade, Message, Package } from '@/lib/database.types';
import { getBtcUsdPrice } from '@/lib/coingecko';

export function useDashboardData() {
  const { user, isAuthenticated } = useAuth();

  // --- Profile query (unchanged) ---
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          packages (
            id,
            name,
            display_name,
            features
          )
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Profile & { packages: Package };
    },
    enabled: !!user && !!supabase && isAuthenticated,
  });

  // --- Balances query (unchanged) ---
  const {
    data: balances,
    isLoading: balancesLoading,
    error: balancesError,
  } = useQuery({
    queryKey: ['balances', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];

      const { data, error } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', user.id)
        .order('currency');

      if (error) throw error;
      return data as Balance[];
    },
    enabled: !!user && !!supabase && isAuthenticated,
  });

  // --- Trades query (unchanged) ---
  const {
    data: trades,
    isLoading: tradesLoading,
    error: tradesError,
  } = useQuery({
    queryKey: ['trades', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];

      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Trade[];
    },
    enabled: !!user && !!supabase && isAuthenticated,
  });

  // --- Messages query (unchanged) ---
  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user && !!supabase && isAuthenticated,
  });

  // --- BTC price query (CoinGecko) ---
  const {
    data: btcPrice,
    isLoading: btcPriceLoading,
    error: btcPriceError,
  } = useQuery({
    queryKey: ['btc-price'],
    queryFn: async () => {
      // getBtcUsdPrice has its own 5 minute in-memory cache (safe-guard).
      return await getBtcUsdPrice();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 5 * 60 * 1000,
    enabled: !!isAuthenticated, // only fetch when authenticated
  });

  // --- Derived helpers ---

  // Convert currency balances to USD using the same mock rates you had.
  const exchangeRates: Record<string, number> = {
    USD: 1,
    BTC: 43000,
    ETH: 2600,
  };

  // Return USD total (unchanged)
  const getTotalBalanceUSD = () => {
    if (!balances) return 0;
    return balances.reduce((total, balance) => {
      const rate = exchangeRates[balance.currency as keyof typeof exchangeRates] || 1;
      return total + (balance.balance * rate);
    }, 0);
  };

  // BTC equivalent for total: totalUSD / btcPrice
  const getTotalBalanceBTC = () => {
    if (!balances || !btcPrice || btcPrice === 0) return 0;
    const totalUSD = getTotalBalanceUSD();
    return totalUSD / btcPrice;
  };

  // Get numeric balance for a currency
  const getBalanceByCurrency = (currency: string) => {
    return balances?.find(b => b.currency === currency)?.balance || 0;
  };

  // BTC equivalent for a specific currency balance
const getBalanceBTC = (currency: string) => {
  if (!balances || !btcPrice || btcPrice === 0) return 0;
  const balance = getBalanceByCurrency(currency);
  
  // If the currency is already BTC, just return the balance
  if (currency === 'BTC') return balance;
  
  // For other currencies, convert to USD first, then to BTC
  const usdValue = balance * (exchangeRates[currency as keyof typeof exchangeRates] || 1);
  return usdValue / btcPrice;
};

  const getUnreadMessagesCount = () => {
    return messages?.filter(m => !m.is_read).length || 0;
  };

  const getOpenTradesCount = () => {
    return trades?.filter(t => t.status === 'open').length || 0;
  };

  return {
    profile,
    balances,
    trades,
    messages,
    btcPrice, // number | undefined
    loading: profileLoading || balancesLoading || tradesLoading || messagesLoading || btcPriceLoading,
    error: profileError || balancesError || tradesError || messagesError || btcPriceError,
    getBalanceByCurrency,
    getBalanceBTC,
    getTotalBalanceUSD,
    getTotalBalanceBTC,
    getUnreadMessagesCount,
    getOpenTradesCount,
  };
}
