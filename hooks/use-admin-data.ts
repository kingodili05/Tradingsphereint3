'use client';

import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { Profile, Balance, Trade, Message, Deposit, Withdrawal } from '@/lib/database.types';

async function fetchPreview<T>(table: string, select: string, limit = 20) {
  if (!supabase) return [] as T[];
  console.log('🔄 Fetching preview for:', table);
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('❌ Error fetching preview for', table, error);
    throw error;
  }

  console.log('✅ Preview fetched for', table, data?.length || 0);
  return data as T[];
}

async function fetchFull<T>(table: string, select: string) {
  if (!supabase) return [] as T[];
  console.log('🔄 Fetching full dataset for:', table);
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching full dataset for', table, error);
    throw error;
  }

  console.log('✅ Full dataset fetched for', table, data?.length || 0);
  return data as T[];
}

export function useAdminData() {
  const queryClient = useQueryClient();

  // --- Queries with auto-refresh every 15 seconds ---
  const queryOptions = {
    retry: 1,
    staleTime: 10_000, // 10 seconds
    cacheTime: 30_000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchInterval: 15_000, // auto-refresh every 15 seconds
  };

  const { data: users = [], isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users-preview'],
    queryFn: () => fetchPreview<Profile & { packages: any }>('profiles', `*, packages ( id, name, display_name, features )`, 50),
    ...queryOptions,
    initialData: [],
  });

  const { data: balances = [], isLoading: balancesLoading, error: balancesError, refetch: refetchBalances } = useQuery({
    queryKey: ['admin-balances-preview'],
    queryFn: () => fetchPreview<Balance>('balances', '*', 50),
    ...queryOptions,
    initialData: [],
  });

  const { data: trades = [], isLoading: tradesLoading, error: tradesError, refetch: refetchTrades } = useQuery({
    queryKey: ['admin-trades-preview'],
    queryFn: () => fetchPreview<Trade & { profiles: Profile }>('trades', `*, profiles ( id, full_name, email )`, 50),
    ...queryOptions,
    initialData: [],
  });

  const { data: messages = [], isLoading: messagesLoading, error: messagesError, refetch: refetchMessages } = useQuery({
    queryKey: ['admin-messages-preview'],
    queryFn: () => fetchPreview<Message & { profiles: Profile }>('messages', `*, profiles!messages_user_id_fkey ( id, full_name, email )`, 50),
    ...queryOptions,
    initialData: [],
  });

  const { data: deposits = [], isLoading: depositsLoading, error: depositsError, refetch: refetchDeposits } = useQuery({
    queryKey: ['admin-deposits-preview'],
    queryFn: () => fetchPreview<Deposit & { profiles: Profile }>('deposits', `*, profiles!deposits_user_id_fkey ( id, full_name, email )`, 50),
    ...queryOptions,
    initialData: [],
  });

  const { data: withdrawals = [], isLoading: withdrawalsLoading, error: withdrawalsError, refetch: refetchWithdrawals } = useQuery({
    queryKey: ['admin-withdrawals-preview'],
    queryFn: () => fetchPreview<Withdrawal & { profiles: Profile }>('withdrawals', `*, profiles!withdrawals_user_id_fkey ( id, full_name, email )`, 50),
    ...queryOptions,
    initialData: [],
  });

  // --- Prefetch full datasets ---
  useEffect(() => {
    const timer = setTimeout(() => {
      queryClient.prefetchQuery(['admin-users-full'], () => fetchFull<Profile & { packages: any }>('profiles', `*, packages ( id, name, display_name, features )`));
      queryClient.prefetchQuery(['admin-balances-full'], () => fetchFull<Balance>('balances', '*'));
      queryClient.prefetchQuery(['admin-trades-full'], () => fetchFull<Trade & { profiles: Profile }>('trades', `*, profiles ( id, full_name, email )`));
      queryClient.prefetchQuery(['admin-messages-full'], () => fetchFull<Message & { profiles: Profile }>('messages', `*, profiles!messages_user_id_fkey ( id, full_name, email )`));
      queryClient.prefetchQuery(['admin-deposits-full'], () => fetchFull<Deposit & { profiles: Profile }>('deposits', `*, profiles!deposits_user_id_fkey ( id, full_name, email )`));
      queryClient.prefetchQuery(['admin-withdrawals-full'], () => fetchFull<Withdrawal & { profiles: Profile }>('withdrawals', `*, profiles!withdrawals_user_id_fkey ( id, full_name, email )`));
    }, 750);

    return () => clearTimeout(timer);
  }, [queryClient]);

  // --- Supabase real-time subscriptions ---
  useEffect(() => {
    const tables = ['profiles', 'balances', 'trades', 'messages', 'deposits', 'withdrawals'];
    const channels: any[] = [];

    tables.forEach((table) => {
      const channel = supabase
        .channel(`realtime-${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
          console.log(`🔔 Real-time update received for table: ${table}`);
          queryClient.invalidateQueries([`admin-${table}-preview`]);
        })
        .subscribe();
      channels.push(channel);
    });

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [queryClient]);

  // --- Dashboard stats ---
  const dashboardStats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.account_status === 'active').length;
    const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
    const unreadMessages = messages.filter(m => !m.is_read).length;
    const openTrades = trades.filter(t => t.status === 'open').length;
    const demoUsers = users.filter(u => u.account_type === 'demo').length;

    return { totalUsers, activeUsers, pendingDeposits, pendingWithdrawals, unreadMessages, openTrades, demoUsers };
  }, [users, deposits, withdrawals, messages, trades]);

  return {
    users,
    balances,
    trades,
    messages,
    deposits,
    withdrawals,
    loading: usersLoading || balancesLoading || tradesLoading || messagesLoading || depositsLoading || withdrawalsLoading,
    error: usersError || balancesError || tradesError || messagesError || depositsError || withdrawalsError,
    refetchUsers,
    refetchBalances,
    refetchTrades,
    refetchMessages,
    refetchDeposits,
    refetchWithdrawals,
    getDashboardStats: () => dashboardStats,
  };
}
