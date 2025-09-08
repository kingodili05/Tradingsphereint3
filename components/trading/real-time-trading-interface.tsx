'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useBalances } from '@/hooks/use-balances';
import { useTrades } from '@/hooks/use-trades';
import { supabase } from '@/lib/supabase-client';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface RealTimeBalance {
  available: number;
  locked: number;
  total: number;
}

export function RealTimeTradingInterface() {
  const { user } = useAuth();
  const { balances, refetch: refetchBalances } = useBalances();
  const { createTrade } = useTrades();
  
  const [realTimeBalance, setRealTimeBalance] = useState<RealTimeBalance>({
    available: 0,
    locked: 0,
    total: 0
  });

  const [tradeData, setTradeData] = useState({
    exchange_type: '',
    symbol: '',
    trade_type: 'buy',
    volume: '',
    unit_worth: '',
    take_profit: '',
    stop_loss: '',
  });

  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Real-time balance updates
  useEffect(() => {
    if (!supabase || !user) return;

    // Initial balance load
    updateRealTimeBalance();

    // Subscribe to balance changes
    const subscription = supabase
      .channel('balance-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'balances',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          updateRealTimeBalance();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, balances]);

  // Validate trade amount against balance
  useEffect(() => {
    validateTradeAmount();
  }, [tradeData.volume, tradeData.unit_worth, realTimeBalance.available]);

  const updateRealTimeBalance = () => {
    const usdBalance = balances?.find(b => b.currency === 'USD');
    if (usdBalance) {
      setRealTimeBalance({
        available: usdBalance.available_balance,
        locked: usdBalance.locked_balance,
        total: usdBalance.balance
      });
    }
  };

  const validateTradeAmount = () => {
    const volume = parseFloat(tradeData.volume || '0');
    const unitWorth = parseFloat(tradeData.unit_worth || '0');
    const totalCost = volume * unitWorth;

    if (totalCost === 0) {
      setBalanceError(null);
      return;
    }

    if (realTimeBalance.available === 0) {
      setBalanceError('You have no available funds. Please deposit to start trading.');
      return;
    }

    if (totalCost > realTimeBalance.available) {
      const deficit = totalCost - realTimeBalance.available;
      setBalanceError(`Insufficient funds. You need $${deficit.toFixed(2)} more to execute this trade.`);
      return;
    }

    setBalanceError(null);
  };

  const handleTradeExecution = async (tradeType: 'buy' | 'sell') => {
    if (balanceError) {
      toast.error(balanceError);
      return;
    }

    if (!tradeData.exchange_type || !tradeData.symbol || !tradeData.volume || !tradeData.unit_worth) {
      toast.error('Please fill in all required fields');
      return;
    }

    const totalCost = parseFloat(tradeData.volume) * parseFloat(tradeData.unit_worth);
    
    if (totalCost > realTimeBalance.available) {
      toast.error('Insufficient balance. Please deposit funds to continue.');
      return;
    }

    setIsExecuting(true);

    try {
      const result = await createTrade({
        exchange_type: tradeData.exchange_type,
        symbol: tradeData.symbol,
        trade_type: tradeType,
        volume: parseFloat(tradeData.volume),
        unit_worth: parseFloat(tradeData.unit_worth),
        take_profit: tradeData.take_profit ? parseFloat(tradeData.take_profit) : undefined,
        stop_loss: tradeData.stop_loss ? parseFloat(tradeData.stop_loss) : undefined,
      });

      if (result.success) {
        setTradeData({
          exchange_type: '',
          symbol: '',
          trade_type: 'buy',
          volume: '',
          unit_worth: '',
          take_profit: '',
          stop_loss: '',
        });
        
        // Refresh balances to show updated amounts
        await refetchBalances();
      }
    } catch (error) {
      toast.error('Failed to execute trade. Please try again.');
    } finally {
      setIsExecuting(false);
    }
  };

  const getSymbolOptions = () => {
    switch (tradeData.exchange_type) {
      case 'forex':
        return ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'];
      case 'crypto':
        return ['BTC/USD', 'ETH/USD', 'ADA/USD', 'SOL/USD', 'DOT/USD'];
      case 'stocks':
        return ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
      case 'commodities':
        return ['GOLD', 'SILVER', 'OIL', 'NATGAS', 'COPPER'];
      case 'indices':
        return ['SPX500', 'NAS100', 'US30', 'UK100', 'GER30'];
      default:
        return [];
    }
  };

  const calculateEstimatedCost = () => {
    const volume = parseFloat(tradeData.volume || '0');
    const unitWorth = parseFloat(tradeData.unit_worth || '0');
    return volume * unitWorth;
  };

  const isTradeValid = !balanceError && 
    tradeData.exchange_type && 
    tradeData.symbol && 
    tradeData.volume && 
    tradeData.unit_worth &&
    calculateEstimatedCost() > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Trading Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Execute Trade</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Real-time Balance Display */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Account Balance (Real-time)</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Available</div>
                  <div className="font-bold text-green-600">${realTimeBalance.available.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Locked</div>
                  <div className="font-bold text-orange-600">${realTimeBalance.locked.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total</div>
                  <div className="font-bold">${realTimeBalance.total.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Balance Error Alert */}
            {balanceError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {balanceError}
                </AlertDescription>
              </Alert>
            )}

            {/* Exchange Type Selection */}
            <div className="space-y-2">
              <Label>Exchange Type</Label>
              <Select 
                value={tradeData.exchange_type} 
                onValueChange={(value) => setTradeData({...tradeData, exchange_type: value, symbol: ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exchange type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="forex">Forex</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="commodities">Commodities</SelectItem>
                  <SelectItem value="indices">Indices</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Symbol Selection */}
            <div className="space-y-2">
              <Label>Trading Symbol</Label>
              <Select 
                value={tradeData.symbol} 
                onValueChange={(value) => setTradeData({...tradeData, symbol: value})}
                disabled={!tradeData.exchange_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder={tradeData.exchange_type ? "Select symbol" : "Select exchange type first"} />
                </SelectTrigger>
                <SelectContent>
                  {getSymbolOptions().map((symbol) => (
                    <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trading Parameters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Volume</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={tradeData.volume}
                  onChange={(e) => setTradeData({...tradeData, volume: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit Worth ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={tradeData.unit_worth}
                  onChange={(e) => setTradeData({...tradeData, unit_worth: e.target.value})}
                />
              </div>
            </div>

            {/* Stop Loss and Take Profit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stop Loss ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  value={tradeData.stop_loss}
                  onChange={(e) => setTradeData({...tradeData, stop_loss: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Take Profit ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  value={tradeData.take_profit}
                  onChange={(e) => setTradeData({...tradeData, take_profit: e.target.value})}
                />
              </div>
            </div>

            {/* Cost Calculation */}
            {calculateEstimatedCost() > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Trade Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Estimated Cost:</span>
                    <span className="font-semibold">${calculateEstimatedCost().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Balance:</span>
                    <span className="font-semibold">${realTimeBalance.available.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining After Trade:</span>
                    <span className={`font-semibold ${
                      realTimeBalance.available - calculateEstimatedCost() >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${(realTimeBalance.available - calculateEstimatedCost()).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Zero Balance Warning */}
            {realTimeBalance.available === 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <Wallet className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <div className="font-semibold mb-2">No Available Balance</div>
                  <p>You need to deposit funds before you can start trading. Visit the Finance section to make a deposit.</p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          {/* Clean footer for buttons */}
          <div className="border-t">
            <div className="p-4 flex space-x-4">
              <Button
                onClick={() => handleTradeExecution('buy')}
                disabled={!isTradeValid || isExecuting || realTimeBalance.available === 0}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isExecuting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Executing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>BUY</span>
                  </div>
                )}
              </Button>
              
              <Button
                onClick={() => handleTradeExecution('sell')}
                disabled={!isTradeValid || isExecuting || realTimeBalance.available === 0}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isExecuting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Executing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-4 w-4" />
                    <span>SELL</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Account Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Account Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="font-bold text-green-600">${realTimeBalance.available.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Locked in Trades</span>
                <span className="font-bold text-orange-600">${realTimeBalance.locked.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-muted-foreground">Total Equity</span>
                <span className="font-bold text-lg">${realTimeBalance.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-2 pt-4 border-t">
              <div className="text-sm font-medium">Account Status</div>
              {realTimeBalance.total === 0 ? (
                <Badge variant="destructive">Unfunded</Badge>
              ) : realTimeBalance.available === 0 ? (
                <Badge variant="secondary">Fully Invested</Badge>
              ) : (
                <Badge className="bg-green-500">Active</Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-4 border-t">
              <div className="text-sm font-medium">Quick Actions</div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full" disabled={realTimeBalance.total === 0}>
                  View Portfolio
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Fund Account
                </Button>
                <Button variant="outline" size="sm" className="w-full" disabled={realTimeBalance.available === 0}>
                  Withdraw Funds
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
