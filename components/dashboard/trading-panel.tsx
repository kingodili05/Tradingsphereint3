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
      <div className="rounded-lg border border-green-500 bg-[#1D2330] h-[538px] flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">
            <span className="text-green-500 font-bold">BUY</span> / <span className="text-red-500 font-bold">SELL</span>
          </h3>
          <div className="text-white text-lg">
            <span className="text-green-400">Balance</span> = ${getBalanceByCurrency('USD').toFixed(2)}
          </div>
        </div>
      </div>
      
      <form onSubmit={(e) => e.preventDefault()} className="flex-1 flex flex-col">
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* Message Display */}
          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Exchange Type */}
          <div>
            <div className="flex items-stretch rounded">
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-l flex items-center min-w-[100px] font-medium">
                Exchange
              </div>
              <Select 
                value={tradeData.exchangeType} 
                onValueChange={(value) => setTradeData({...tradeData, exchangeType: value, symbol: ''})}
              >
                <SelectTrigger className="bg-gray-700 border-0 text-white rounded-none flex-1 h-12">
                  <SelectValue placeholder="Select Exchange..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOREX">FOREX</SelectItem>
                  <SelectItem value="CRYPTO">CRYPTO</SelectItem>
                  <SelectItem value="STOCKS">STOCKS</SelectItem>
                  <SelectItem value="INDICES">INDICES</SelectItem>
                  <SelectItem value="COMMODITIES">COMMODITIES</SelectItem>
                </SelectContent>
              </Select>
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-r flex items-center min-w-[80px] justify-center font-medium">
                {tradeData.exchangeType || 'NONE'}
              </div>
            </div>
          </div>

          {/* Symbol */}
          <div>
            <div className="flex items-stretch rounded">
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-l flex items-center min-w-[100px] font-medium">
                Symbols
              </div>
              <Select 
                value={tradeData.symbol} 
                onValueChange={(value) => setTradeData({...tradeData, symbol: value})}
                disabled={!tradeData.exchangeType}
              >
                <SelectTrigger className="bg-gray-700 border-0 text-white rounded-none flex-1 h-12">
                  <SelectValue placeholder={tradeData.exchangeType ? "Select Symbol" : "No Exchange Selected"} />
                </SelectTrigger>
                <SelectContent>
                  {symbolOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-r flex items-center min-w-[80px] justify-center font-medium">
                {tradeData.exchangeType || 'NONE'}
              </div>
            </div>
          </div>

          {/* Unit Worth */}
          <div>
            <div className="flex items-stretch rounded">
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-l flex items-center min-w-[100px] font-medium">
                Unit Worth
              </div>
              <Input
                type="number"
                placeholder="Enter Amount"
                value={tradeData.unitWorth}
                onChange={(e) => setTradeData({...tradeData, unitWorth: e.target.value})}
                className="bg-gray-700 border-0 text-white rounded-none flex-1 h-12"
              />
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-r flex items-center min-w-[80px] justify-center font-medium">
                {tradeData.exchangeType || 'NONE'}
              </div>
            </div>
          </div>

          {/* Take Profit */}
          <div>
            <div className="flex items-stretch rounded">
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-l flex items-center min-w-[100px] font-medium">
                Take Profit
              </div>
              <Input
                type="number"
                placeholder="Enter Take Profit"
                value={tradeData.takeProfit}
                onChange={(e) => setTradeData({...tradeData, takeProfit: e.target.value})}
                className="bg-gray-700 border-0 text-white rounded-none flex-1 h-12"
              />
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-r flex items-center min-w-[80px] justify-center font-medium">
                {tradeData.exchangeType || 'NONE'}
              </div>
            </div>
          </div>

          {/* Stop Loss */}
          <div>
            <div className="flex items-stretch rounded">
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-l flex items-center min-w-[100px] font-medium">
                Stop Loss
              </div>
              <Input
                type="number"
                placeholder="Enter Stop Loss"
                value={tradeData.stopLoss}
                onChange={(e) => setTradeData({...tradeData, stopLoss: e.target.value})}
                className="bg-gray-700 border-0 text-white rounded-none flex-1 h-12"
              />
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-r flex items-center min-w-[80px] justify-center font-medium">
                {tradeData.exchangeType || 'NONE'}
              </div>
            </div>
          </div>

          {/* Expire Time */}
          <div>
            <div className="flex items-stretch rounded">
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-l flex items-center min-w-[100px] font-medium">
                Expire Time
              </div>
              <Select 
                value={tradeData.expireTime} 
                onValueChange={(value) => setTradeData({...tradeData, expireTime: value})}
              >
                <SelectTrigger className="bg-gray-700 border-0 text-white rounded-none flex-1 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutes">30 minutes</SelectItem>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="6 hours">6 hours</SelectItem>
                  <SelectItem value="12 hours">12 hours</SelectItem>
                </SelectContent>
              </Select>
              <div className="bg-gray-600 px-4 py-3 text-white text-sm rounded-r flex items-center min-w-[80px] justify-center font-medium">
                Mins/hrs
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 p-4">
          <div className="flex justify-between space-x-4">
            <Button
              type="button"
              onClick={handleSell}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-6 text-lg flex-1 rounded"
              disabled={!isFormValid || isSubmitting}
            >
              <div className="flex flex-col items-center">
                <TrendingDown className="h-5 w-5 mb-1" />
                <span>SELL</span>
              </div>
            </Button>
            
            <Button
              type="button"
              onClick={handleBuy}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-6 text-lg flex-1 rounded"
              disabled={!isFormValid || isSubmitting}
            >
              <div className="flex flex-col items-center">
                <TrendingUp className="h-5 w-5 mb-1" />
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