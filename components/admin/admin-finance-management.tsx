'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase-client';
import { Deposit, Withdrawal, Profile } from '@/lib/database.types';
import { CheckCircle, XCircle, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminActions } from '@/hooks/use-admin-actions';

export function AdminFinanceManagement() {
  const { 
    approveDeposit, 
    rejectDeposit, 
    approveWithdrawal, 
    rejectWithdrawal,
    loading: actionLoading 
  } = useAdminActions();
  const [deposits, setDeposits] = useState<(Deposit & { profiles: Profile })[]>([]);
  const [withdrawals, setWithdrawals] = useState<(Withdrawal & { profiles: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    if (!supabase) return;

    setLoading(true);

    // Fetch deposits
    const { data: depositsData } = await supabase
      .from('deposits')
      .select(`
        *,
        profiles!deposits_user_id_fkey (
          id,
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    // Fetch withdrawals
    const { data: withdrawalsData } = await supabase
      .from('withdrawals')
      .select(`
        *,
        profiles!withdrawals_user_id_fkey (
          id,
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (depositsData) setDeposits(depositsData as any);
    if (withdrawalsData) setWithdrawals(withdrawalsData as any);

    setLoading(false);
  };

  const updateDepositStatus = async (depositId: string, status: string) => {
    let result;
    if (status === 'completed') {
      result = await approveDeposit(depositId);
    } else if (status === 'failed') {
      result = await rejectDeposit(depositId);
    }
    
    if (result?.success) {
      await fetchFinanceData();
    }
  };

  const updateWithdrawalStatus = async (withdrawalId: string, status: string) => {
    let result;
    if (status === 'completed') {
      result = await approveWithdrawal(withdrawalId);
    } else if (status === 'failed') {
      result = await rejectWithdrawal(withdrawalId);
    }
    
    if (result?.success) {
      await fetchFinanceData();
    }
  };

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

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Tabs defaultValue="deposits" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="deposits">Deposits</TabsTrigger>
        <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
      </TabsList>

      <TabsContent value="deposits">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowDownToLine className="h-5 w-5 text-green-600" />
              <span>Deposit Management</span>
              <Badge variant="secondary">{deposits.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deposits.map((deposit) => (
                <div key={deposit.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{(deposit.profiles as any)?.full_name}</div>
                      <div className="text-sm text-muted-foreground">{(deposit.profiles as any)?.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {formatCurrency(deposit.amount, deposit.currency)}
                      </div>
                      <Badge className={getStatusColor(deposit.status)}>
                        {deposit.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Method</div>
                      <div className="font-medium capitalize">{deposit.payment_method.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Transaction ID</div>
                      <div className="font-medium">{deposit.transaction_id || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Created</div>
                      <div className="font-medium">{new Date(deposit.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Processed</div>
                      <div className="font-medium">
                        {deposit.processed_at ? new Date(deposit.processed_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {deposit.status === 'pending' && (
                    <div className="flex space-x-2 pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => updateDepositStatus(deposit.id, 'completed')}
                       disabled={actionLoading}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateDepositStatus(deposit.id, 'failed')}
                       disabled={actionLoading}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="withdrawals">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowUpFromLine className="h-5 w-5 text-red-600" />
              <span>Withdrawal Management</span>
              <Badge variant="secondary">{withdrawals.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{(withdrawal.profiles as any)?.full_name}</div>
                      <div className="text-sm text-muted-foreground">{(withdrawal.profiles as any)?.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">
                        {formatCurrency(withdrawal.amount, withdrawal.currency)}
                      </div>
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {withdrawal.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Method</div>
                      <div className="font-medium capitalize">{withdrawal.withdrawal_method.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Destination</div>
                      <div className="font-medium truncate">
                        {withdrawal.destination_address || 'Bank Account'}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Created</div>
                      <div className="font-medium">{new Date(withdrawal.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Processed</div>
                      <div className="font-medium">
                        {withdrawal.processed_at ? new Date(withdrawal.processed_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {withdrawal.status === 'pending' && (
                    <div className="flex space-x-2 pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => updateWithdrawalStatus(withdrawal.id, 'completed')}
                       disabled={actionLoading}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateWithdrawalStatus(withdrawal.id, 'failed')}
                       disabled={actionLoading}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}