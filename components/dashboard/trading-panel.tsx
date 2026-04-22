'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useBalances } from '@/hooks/use-balances';
import { supabase } from '@/lib/supabase-client';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { toast } from 'sonner';

export function TradingPanel() {
  const { user } = useAuth();
  const { getBalanceByCurrency } = useBalances();
  const router = useRouter();
  const [tradeData, setTradeData] = useState({
    exchangeType: '',
    symbol: '',
    unitWorth: '',
    takeProfit: '',
    stopLoss: '',
    expireTime: '30 minutes',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showInsufficientFundsAlert, setShowInsufficientFundsAlert] = useState(false);

  const checkSufficientBalance = (amount: number) => {
    const usdBalance = getBalanceByCurrency('USD');
    console.log('Checking balance:', { usdBalance, amount, hasBalance: usdBalance >= amount });
    return usdBalance >= amount;
  };

  const handleInsufficientFunds = () => {
    console.log('Showing insufficient funds alert');
    setShowInsufficientFundsAlert(true);
  };

  const handleAlertOkay = () => {
    setShowInsufficientFundsAlert(false);
    // Redirect to trade real account page
    router.push('/trade-real-account');
  };

  const handleBuy = async () => {
    if (!user || !tradeData.exchangeType || !tradeData.symbol || !tradeData.unitWorth) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const tradeAmount = parseFloat(tradeData.unitWorth);
    console.log('Trade amount:', tradeAmount);
    
    // Check if user has sufficient balance
    if (!checkSufficientBalance(tradeAmount)) {
      console.log('Insufficient balance, showing alert');
      handleInsufficientFunds();
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const expireTime = getExpireTime(tradeData.expireTime);

      const { error } = await supabase
        .from('trades')
        .insert({
          user_id: user.id,
          exchange_type: tradeData.exchangeType.toLowerCase(),
          symbol: tradeData.symbol,
          trade_type: 'buy',
          volume: 1,
          unit_worth: parseFloat(tradeData.unitWorth),
          entry_price: parseFloat(tradeData.unitWorth),
          current_price: parseFloat(tradeData.unitWorth),
          take_profit: tradeData.takeProfit ? parseFloat(tradeData.takeProfit) : null,
          stop_loss: tradeData.stopLoss ? parseFloat(tradeData.stopLoss) : null,
          expire_time: expireTime,
          status: 'open',
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'BUY trade executed successfully!' });
      
      // Reset form
      setTradeData({
        exchangeType: '',
        symbol: '',
        unitWorth: '',
        takeProfit: '',
        stopLoss: '',
        expireTime: '30 minutes',
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to execute trade: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSell = async () => {
    if (!user || !tradeData.exchangeType || !tradeData.symbol || !tradeData.unitWorth) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const tradeAmount = parseFloat(tradeData.unitWorth);
    console.log('Trade amount:', tradeAmount);
    
    // Check if user has sufficient balance
    if (!checkSufficientBalance(tradeAmount)) {
      console.log('Insufficient balance, showing alert');
      handleInsufficientFunds();
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const expireTime = getExpireTime(tradeData.expireTime);

      const { error } = await supabase
        .from('trades')
        .insert({
          user_id: user.id,
          exchange_type: tradeData.exchangeType.toLowerCase(),
          symbol: tradeData.symbol,
          trade_type: 'sell',
          volume: 1,
          unit_worth: parseFloat(tradeData.unitWorth),
          entry_price: parseFloat(tradeData.unitWorth),
          current_price: parseFloat(tradeData.unitWorth),
          take_profit: tradeData.takeProfit ? parseFloat(tradeData.takeProfit) : null,
          stop_loss: tradeData.stopLoss ? parseFloat(tradeData.stopLoss) : null,
          expire_time: expireTime,
          status: 'open',
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'SELL trade executed successfully!' });
      
      // Reset form
      setTradeData({
        exchangeType: '',
        symbol: '',
        unitWorth: '',
        takeProfit: '',
        stopLoss: '',
        expireTime: '30 minutes',
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to execute trade: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getExpireTime = (interval: string) => {
    const now = new Date();
    switch (interval) {
      case '30 minutes':
        return new Date(now.getTime() + 30 * 60 * 1000).toISOString();
      case '1 hour':
        return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      case '6 hours':
        return new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString();
      case '12 hours':
        return new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    }
  };

  const getSymbolOptions = () => {
    switch (tradeData.exchangeType) {
      case 'FOREX':
        return [
          { value: 'EURUSD', label: 'EUR/USD (Euro/US Dollar)' },
          { value: 'USDJPY', label: 'USD/JPY (US Dollar/Japanese Yen)' },
          { value: 'GBPUSD', label: 'GBP/USD (British Pound/US Dollar)' },
          { value: 'USDCHF', label: 'USD/CHF (US Dollar/Swiss Franc)' },
          { value: 'AUDUSD', label: 'AUD/USD (Australian Dollar/US Dollar)' },
        ];
      case 'CRYPTO':
        return [
          { value: 'BTCUSD', label: 'BTC/USD (Bitcoin/US Dollar)' },
          { value: 'ETHUSD', label: 'ETH/USD (Ethereum/US Dollar)' },
          { value: 'XRPUSD', label: 'XRP/USD (XRP/US Dollar)' },
          { value: 'LTCUSD', label: 'LTC/USD (Litecoin/US Dollar)' },
          { value: 'ADAUSD', label: 'ADA/USD (Cardano/US Dollar)' },
        ];
      case 'STOCKS':
        return [
          { value: 'AAPL', label: 'AAPL (Apple Inc.)' },
          { value: 'MSFT', label: 'MSFT (Microsoft Corporation)' },
          { value: 'GOOGL', label: 'GOOGL (Alphabet Inc.)' },
          { value: 'TSLA', label: 'TSLA (Tesla Inc.)' },
          { value: 'AMZN', label: 'AMZN (Amazon.com Inc.)' },
        ];
      case 'INDICES':
        return [
          { value: 'SPX', label: 'S&P 500 Index (SPX)' },
          { value: 'DJI', label: 'Dow Jones Industrial Average (DJI)' },
          { value: 'IXIC', label: 'NASDAQ Composite Index (IXIC)' },
          { value: 'FTSE', label: 'FTSE 100 Index (FTSE)' },
          { value: 'DAX', label: 'DAX 30 Index (DAX)' },
        ];
      case 'COMMODITIES':
        return [
          { value: 'GOLD', label: 'Gold' },
          { value: 'SILVER', label: 'Silver' },
          { value: 'OIL', label: 'Crude Oil' },
          { value: 'NATGAS', label: 'Natural Gas' },
          { value: 'COPPER', label: 'Copper' },
        ];
      default:
        return [];
    }
  };

  const symbolOptions = getSymbolOptions();
  const isFormValid = tradeData.exchangeType && tradeData.symbol && tradeData.unitWorth;

  return (
    <div className="w-full">
      <div className="rounded-xl border border-green-500/50 bg-[#1D2330] flex flex-col">
      <div className="px-4 py-3 border-b border-white/8">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-sm">
            <span className="text-green-400">BUY</span>
            <span className="text-white/30 mx-1">/</span>
            <span className="text-red-400">SELL</span>
          </h3>
          <div className="text-right">
            <span className="text-[10px] text-gray-500 uppercase tracking-wide">Balance</span>
            <p className="text-green-400 font-bold text-sm leading-tight">${getBalanceByCurrency('USD').toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="flex-1 flex flex-col">
        <div className="p-4 space-y-3 flex-1">
          {/* Message Display */}
          {message && (
            <div className={`p-3 rounded-xl text-xs font-medium animate-fade-down ${
              message.type === 'success'
                ? 'bg-green-500/15 text-green-300 border border-green-500/25'
                : 'bg-red-500/15 text-red-300 border border-red-500/25'
            }`}>
              {message.text}
            </div>
          )}

          {/* Exchange Type */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Exchange</label>
            <Select
              value={tradeData.exchangeType}
              onValueChange={(value) => setTradeData({...tradeData, exchangeType: value, symbol: ''})}
            >
              <SelectTrigger className="bg-gray-800/80 border border-white/8 text-white rounded-xl h-11 text-sm hover:border-green-500/40 transition-colors">
                <SelectValue placeholder="Select exchange..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FOREX">FOREX</SelectItem>
                <SelectItem value="CRYPTO">CRYPTO</SelectItem>
                <SelectItem value="STOCKS">STOCKS</SelectItem>
                <SelectItem value="INDICES">INDICES</SelectItem>
                <SelectItem value="COMMODITIES">COMMODITIES</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Symbol */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Symbol</label>
            <Select
              value={tradeData.symbol}
              onValueChange={(value) => setTradeData({...tradeData, symbol: value})}
              disabled={!tradeData.exchangeType}
            >
              <SelectTrigger className="bg-gray-800/80 border border-white/8 text-white rounded-xl h-11 text-sm hover:border-green-500/40 transition-colors disabled:opacity-40">
                <SelectValue placeholder={tradeData.exchangeType ? 'Select symbol...' : 'Choose exchange first'} />
              </SelectTrigger>
              <SelectContent>
                {symbolOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount + TP + SL in a responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Amount ($)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={tradeData.unitWorth}
                onChange={(e) => setTradeData({...tradeData, unitWorth: e.target.value})}
                className="bg-gray-800/80 border border-white/8 text-white rounded-xl h-11 text-sm hover:border-green-500/40 focus:border-green-500/60 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Take Profit</label>
              <Input
                type="number"
                placeholder="Optional"
                value={tradeData.takeProfit}
                onChange={(e) => setTradeData({...tradeData, takeProfit: e.target.value})}
                className="bg-gray-800/80 border border-white/8 text-white rounded-xl h-11 text-sm hover:border-green-500/40 focus:border-green-500/60 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Stop Loss</label>
              <Input
                type="number"
                placeholder="Optional"
                value={tradeData.stopLoss}
                onChange={(e) => setTradeData({...tradeData, stopLoss: e.target.value})}
                className="bg-gray-800/80 border border-white/8 text-white rounded-xl h-11 text-sm hover:border-red-500/40 focus:border-red-500/60 transition-colors"
              />
            </div>
          </div>

          {/* Expire Time */}
          <div className="space-y-1">
            <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Expires In</label>
            <Select
              value={tradeData.expireTime}
              onValueChange={(value) => setTradeData({...tradeData, expireTime: value})}
            >
              <SelectTrigger className="bg-gray-800/80 border border-white/8 text-white rounded-xl h-11 text-sm hover:border-green-500/40 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30 minutes">30 minutes</SelectItem>
                <SelectItem value="1 hour">1 hour</SelectItem>
                <SelectItem value="6 hours">6 hours</SelectItem>
                <SelectItem value="12 hours">12 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-white/8 p-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={handleSell}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-5 text-sm rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
              disabled={!isFormValid || isSubmitting}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingDown className="h-4 w-4" />
                <span>SELL</span>
              </div>
            </Button>
            <Button
              type="button"
              onClick={handleBuy}
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-5 text-sm rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
              disabled={!isFormValid || isSubmitting}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>BUY</span>
              </div>
            </Button>
          </div>
        </div>
      </form>
    </div>

      {/* Insufficient Funds Alert Dialog */}
      <Dialog open={showInsufficientFundsAlert} onOpenChange={setShowInsufficientFundsAlert}>
        <DialogContent 
          className="max-w-md text-center"
          style={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
        >
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center">
                <Info className="h-8 w-8 text-gray-500" />
              </div>
            </div>
            <DialogTitle className="text-gray-800 text-xl font-normal leading-relaxed">
              You have no funds to trade with. fund your account and start up trades immediately
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button 
              onClick={handleAlertOkay}
              className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-2 rounded"
            >
              Okay!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}