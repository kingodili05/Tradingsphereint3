'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSignals } from '@/hooks/use-signals';
import { useAuth } from '@/hooks/use-auth';
import { useBalances } from '@/hooks/use-balances';
import { Signal } from '@/lib/database.types';
import { Target, Clock, TrendingUp, AlertTriangle, DollarSign, Users, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function SignalsPage() {
  const { user } = useAuth();
  const { getBalanceByCurrency } = useBalances();
  const { signals, userSignalUsage, loading, joinSignal, getUserSignalUsage } = useSignals();
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const handleJoinSignal = async () => {
    if (!selectedSignal || !investmentAmount) return;

    const amount = parseFloat(investmentAmount);
    if (amount < 10) {
      toast.error('Minimum investment is $10');
      return;
    }

    const availableBalance = getBalanceByCurrency('USD');
    if (amount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    const result = await joinSignal(selectedSignal.id, amount);
    if (result.success) {
      setShowJoinDialog(false);
      setInvestmentAmount('');
      setSelectedSignal(null);
    }
  };

  const openJoinDialog = (signal: Signal) => {
    setSelectedSignal(signal);
    setShowJoinDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'executed': return 'bg-blue-500';
      case 'expired': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPercentage = (decimal: number) => {
    return `${(decimal * 100).toFixed(1)}%`;
  };

  const calculatePotentialOutcome = (amount: number, signal: Signal) => {
    const profit = amount * signal.profit_target;
    const loss = amount * signal.loss_limit;
    return { profit, loss };
  };

  const activeSignals = signals.filter(signal => signal.status === 'open');
  const availableBalance = getBalanceByCurrency('USD');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Trading Signals</h1>
          <p className="text-muted-foreground">
            Follow expert trading signals and participate in professional strategies
          </p>
        </div>

        {/* How Signals Work */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">How Trading Signals Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">1</div>
              <p><strong>Browse Signals:</strong> View active signals created by our trading experts</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">2</div>
              <p><strong>Join Signal:</strong> Invest any amount from $10 to your available balance</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">3</div>
              <p><strong>Wait for Execution:</strong> Our team executes the signal based on market conditions</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">4</div>
              <p><strong>Get Results:</strong> Receive profits or losses based on signal performance</p>
            </div>
          </div>
        </div>

        {/* Account Balance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">Available Balance</h3>
                  <p className="text-muted-foreground">Ready for signal investments</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${availableBalance.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">USD</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Signals */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Active Signals</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : activeSignals.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Active Signals</h3>
                <p className="text-muted-foreground">
                  Check back later for new trading signals from our experts
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSignals.map((signal) => {
                const userUsage = getUserSignalUsage(signal.id);
                const isJoined = !!userUsage;
                
                return (
                  <Card key={signal.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{signal.name}</CardTitle>
                        <Badge className={getStatusColor(signal.status)}>
                          {signal.status.toUpperCase()}
                        </Badge>
                      </div>
                      {signal.description && (
                        <CardDescription>{signal.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="text-sm text-muted-foreground">Profit Target</div>
                            <div className="font-semibold text-green-600">
                              +{formatPercentage(signal.profit_target)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <div>
                            <div className="text-sm text-muted-foreground">Loss Limit</div>
                            <div className="font-semibold text-red-600">
                              -{formatPercentage(signal.loss_limit)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Expires</div>
                          <div className="font-semibold text-sm">
                            {new Date(signal.expiry).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {isJoined ? (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-blue-900 dark:text-blue-100">Signal Joined</span>
                          </div>
                          <div className="text-sm text-blue-800 dark:text-blue-200">
                            Investment: ${userUsage.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            Waiting for execution...
                          </div>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => openJoinDialog(signal)}
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={availableBalance < 10}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Join Signal
                        </Button>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(signal.created_at).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Signal History */}
        {userSignalUsage.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Signal History</h2>
            <div className="space-y-4">
              {userSignalUsage.map((usage) => {
                const signal = signals.find(s => s.id === usage.signal_id);
                if (!signal) return null;

                return (
                  <Card key={usage.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{signal.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Investment: ${usage.amount.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(usage.status)}>
                            {usage.status.toUpperCase()}
                          </Badge>
                          {usage.result !== null && (
                            <div className={`text-lg font-bold ${usage.result >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {usage.result >= 0 ? '+' : ''}${usage.result.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Joined: {new Date(usage.created_at).toLocaleString()}
                        {usage.settled_at && (
                          <span> • Settled: {new Date(usage.settled_at).toLocaleString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Join Signal Dialog */}
        <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Join Signal: {selectedSignal?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedSignal && (
                <>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Profit Target</div>
                        <div className="font-semibold text-green-600">
                          +{formatPercentage(selectedSignal.profit_target)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Loss Limit</div>
                        <div className="font-semibold text-red-600">
                          -{formatPercentage(selectedSignal.loss_limit)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Investment Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="10"
                      max={availableBalance}
                      step="0.01"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder="Enter amount ($10 minimum)"
                    />
                    <div className="text-sm text-muted-foreground">
                      Available: ${availableBalance.toFixed(2)}
                    </div>
                  </div>

                  {investmentAmount && parseFloat(investmentAmount) >= 10 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Potential Outcomes</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-blue-700 dark:text-blue-300">If Profit Target Hit:</div>
                          <div className="font-bold text-green-600">
                            +${calculatePotentialOutcome(parseFloat(investmentAmount), selectedSignal).profit.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-blue-700 dark:text-blue-300">If Loss Limit Hit:</div>
                          <div className="font-bold text-red-600">
                            -${calculatePotentialOutcome(parseFloat(investmentAmount), selectedSignal).loss.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleJoinSignal}
                      disabled={!investmentAmount || parseFloat(investmentAmount) < 10 || parseFloat(investmentAmount) > availableBalance}
                      className="flex-1"
                    >
                      Join Signal
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowJoinDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}