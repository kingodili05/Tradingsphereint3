'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useUserActions } from '@/hooks/use-user-actions';

export function DepositWithdrawForm() {
  const { user } = useAuth();
  const { requestDeposit, requestWithdrawal, loading: actionLoading } = useUserActions();
  const [depositData, setDepositData] = useState({
    amount: '',
    currency: 'USD',
    payment_method: '',
  });

  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    currency: 'USD',
    withdrawal_method: '',
    destination_address: '',
    bank_details: '',
  });

  const [loading, setLoading] = useState(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const result = await requestDeposit(user.id, {
      amount: parseFloat(depositData.amount),
      currency: depositData.currency,
      payment_method: depositData.payment_method,
    });
    
    if (result.success) {
      setDepositData({
        amount: '',
        currency: 'USD',
        payment_method: '',
      });
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const bankDetails = withdrawData.withdrawal_method === 'bank_transfer' ? 
      { details: withdrawData.bank_details } : undefined;

    const result = await requestWithdrawal(user.id, {
      amount: parseFloat(withdrawData.amount),
      currency: withdrawData.currency,
      withdrawal_method: withdrawData.withdrawal_method,
      destination_address: withdrawData.destination_address || undefined,
      bank_details: bankDetails,
    });
    
    if (result.success) {
      setWithdrawData({
        amount: '',
        currency: 'USD',
        withdrawal_method: '',
        destination_address: '',
        bank_details: '',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Deposit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowDownToLine className="h-5 w-5 text-green-600" />
            <span>Deposit Funds</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={depositData.amount}
                onChange={(e) => setDepositData({...depositData, amount: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select 
                value={depositData.currency} 
                onValueChange={(value) => setDepositData({...depositData, currency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                  <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select 
                value={depositData.payment_method} 
                onValueChange={(value) => setDepositData({...depositData, payment_method: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Submit Deposit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Withdraw Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowUpFromLine className="h-5 w-5 text-red-600" />
            <span>Withdraw Funds</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={withdrawData.amount}
                onChange={(e) => setWithdrawData({...withdrawData, amount: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select 
                value={withdrawData.currency} 
                onValueChange={(value) => setWithdrawData({...withdrawData, currency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                  <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Withdrawal Method</Label>
              <Select 
                value={withdrawData.withdrawal_method} 
                onValueChange={(value) => setWithdrawData({...withdrawData, withdrawal_method: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select withdrawal method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {withdrawData.withdrawal_method === 'crypto' && (
              <div className="space-y-2">
                <Label>Destination Address</Label>
                <Input
                  placeholder="Enter wallet address"
                  value={withdrawData.destination_address}
                  onChange={(e) => setWithdrawData({...withdrawData, destination_address: e.target.value})}
                  required
                />
              </div>
            )}

            {withdrawData.withdrawal_method === 'bank_transfer' && (
              <div className="space-y-2">
                <Label>Bank Details</Label>
                <Textarea
                  placeholder="Enter bank account details (account number, routing number, etc.)"
                  value={withdrawData.bank_details}
                  onChange={(e) => setWithdrawData({...withdrawData, bank_details: e.target.value})}
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Submit Withdrawal Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}