'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DepositWithdrawForm } from '@/components/dashboard/deposit-withdraw-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBalances } from '@/hooks/use-balances';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';
import { useQuery } from '@tanstack/react-query';
import { Deposit, Withdrawal } from '@/lib/database.types';
import { Badge } from '@/components/ui/badge';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export default function FinancePage() {
  const { user } = useAuth();
  const { balances, getTotalBalanceUSD, loading: balancesLoading } = useBalances();

  // Fetch user's deposits
  const { data: deposits, isLoading: depositsLoading } = useQuery({
    queryKey: ['user-deposits', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Deposit[];
    },
    enabled: !!user && !!supabase,
  });

  // Fetch user's withdrawals
  const { data: withdrawals, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['user-withdrawals', user?.id],
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Withdrawal[];
    },
    enabled: !!user && !!supabase,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${amount} ${currency}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Finance</h1>
          <p className="text-muted-foreground">
            Manage your deposits, withdrawals, and account funding
          </p>
        </div>

        {/* Account Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Balance (USD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${getTotalBalanceUSD().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {deposits ? formatCurrency(deposits.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0), 'USD') : '$0.00'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {withdrawals ? formatCurrency(withdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + w.amount, 0), 'USD') : '$0.00'}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Deposit/Withdraw Forms */}
        <DepositWithdrawForm />
        
        {/* Transaction History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deposits History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowDownToLine className="h-5 w-5 text-green-600" />
                <span>Deposit History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {depositsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : deposits && deposits.length > 0 ? (
                <div className="space-y-4">
                  {deposits.slice(0, 5).map((deposit) => (
                    <div key={deposit.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{formatCurrency(deposit.amount, deposit.currency)}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {deposit.payment_method.replace('_', ' ')}
                          </div>
                        </div>
                        <Badge className={getStatusColor(deposit.status)}>
                          {deposit.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(deposit.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No deposits found</p>
              )}
            </CardContent>
          </Card>

          {/* Withdrawals History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowUpFromLine className="h-5 w-5 text-red-600" />
                <span>Withdrawal History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawalsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : withdrawals && withdrawals.length > 0 ? (
                <div className="space-y-4">
                  {withdrawals.slice(0, 5).map((withdrawal) => (
                    <div key={withdrawal.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{formatCurrency(withdrawal.amount, withdrawal.currency)}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {withdrawal.withdrawal_method.replace('_', ' ')}
                          </div>
                        </div>
                        <Badge className={getStatusColor(withdrawal.status)}>
                          {withdrawal.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(withdrawal.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No withdrawals found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}