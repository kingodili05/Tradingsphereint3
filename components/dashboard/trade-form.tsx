'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTrades } from '@/hooks/use-trades';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function TradeForm() {
  const { createTrade } = useTrades();
  const { isAccountActive } = useAuth();

  const [tradeData, setTradeData] = useState({
    exchange_type: '',
    symbol: '',
    volume: '',
    unit_worth: '',
    take_profit: '',
    stop_loss: '',
    order_type: 'market',
    expire_time: '',
  });

  const handleSubmit = async (tradeType: 'buy' | 'sell') => {
    if (!isAccountActive) {
      alert('Your account is suspended or locked. Trading actions are disabled.');
      return;
    }

    if (!tradeData.exchange_type || !tradeData.symbol || !tradeData.volume || !tradeData.unit_worth) {
      return;
    }

    const expireTime = tradeData.expire_time
      ? new Date(Date.now() + parseInt(tradeData.expire_time) * 60 * 1000).toISOString()
      : undefined;

    await createTrade({
      exchange_type: tradeData.exchange_type,
      symbol: tradeData.symbol,
      trade_type: tradeType,
      order_type: tradeData.order_type,
      volume: parseFloat(tradeData.volume),
      unit_worth: parseFloat(tradeData.unit_worth),
      take_profit: tradeData.take_profit ? parseFloat(tradeData.take_profit) : undefined,
      stop_loss: tradeData.stop_loss ? parseFloat(tradeData.stop_loss) : undefined,
      expire_time: expireTime,
    });

    setTradeData({
      exchange_type: '',
      symbol: '',
      volume: '',
      unit_worth: '',
      take_profit: '',
      stop_loss: '',
      order_type: 'market',
      expire_time: '',
    });
  };

  const getSymbolOptions = (exchangeType: string) => {
    switch (exchangeType) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Green Box Wrapper */}
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 space-y-4">
            {/* Exchange Type */}
            <div className="space-y-2">
              <Label>Exchange Type</Label>
              <Select
                value={tradeData.exchange_type}
                onValueChange={(value) => setTradeData({ ...tradeData, exchange_type: value, symbol: '' })}
                disabled={!isAccountActive}
              >
                <SelectTrigger className={!isAccountActive ? 'opacity-50 cursor-not-allowed' : ''}>
                  <SelectValue placeholder="Select Exchange Type" />
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

            {/* Symbol */}
            <div className="space-y-2">
              <Label>Symbol</Label>
              <Select
                value={tradeData.symbol}
                onValueChange={(value) => setTradeData({ ...tradeData, symbol: value })}
                disabled={!tradeData.exchange_type || !isAccountActive}
              >
                <SelectTrigger className={!isAccountActive ? 'opacity-50 cursor-not-allowed' : ''}>
                  <SelectValue placeholder="Select Symbol" />
                </SelectTrigger>
                <SelectContent>
                  {getSymbolOptions(tradeData.exchange_type).map((symbol) => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Order Type */}
            <div className="space-y-2">
              <Label>Order Type</Label>
              <Select
                value={tradeData.order_type}
                onValueChange={(value) => setTradeData({ ...tradeData, order_type: value })}
                disabled={!isAccountActive}
              >
                <SelectTrigger className={!isAccountActive ? 'opacity-50 cursor-not-allowed' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                  <SelectItem value="stop">Stop Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Volume & Unit Worth */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="whitespace-nowrap">Volume</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={tradeData.volume}
                  onChange={(e) => setTradeData({ ...tradeData, volume: e.target.value })}
                  disabled={!isAccountActive}
                  className={!isAccountActive ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </div>
              <div className="space-y-1">
                <Label className="whitespace-nowrap">Unit Worth ($)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={tradeData.unit_worth}
                  onChange={(e) => setTradeData({ ...tradeData, unit_worth: e.target.value })}
                  disabled={!isAccountActive}
                  className={!isAccountActive ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </div>
            </div>

            {/* Take Profit & Stop Loss */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="whitespace-nowrap">Take Profit ($)</Label>
                <Input
                  type="number"
                  placeholder="Optional"
                  value={tradeData.take_profit}
                  onChange={(e) => setTradeData({ ...tradeData, take_profit: e.target.value })}
                  disabled={!isAccountActive}
                  className={!isAccountActive ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </div>
              <div className="space-y-1">
                <Label className="whitespace-nowrap">Stop Loss ($)</Label>
                <Input
                  type="number"
                  placeholder="Optional"
                  value={tradeData.stop_loss}
                  onChange={(e) => setTradeData({ ...tradeData, stop_loss: e.target.value })}
                  disabled={!isAccountActive}
                  className={!isAccountActive ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </div>
            </div>

            {/* Expire Time */}
            <div className="space-y-1">
              <Label className="whitespace-nowrap">Expiry Time</Label>
              <Select
                value={tradeData.expire_time}
                onValueChange={(value) => setTradeData({ ...tradeData, expire_time: value })}
                disabled={!isAccountActive}
              >
                <SelectTrigger className={!isAccountActive ? 'opacity-50 cursor-not-allowed' : ''}>
                  <SelectValue placeholder="Select expiry time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="1440">1 day</SelectItem>
                  <SelectItem value="10080">1 week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Total */}
            {tradeData.volume && tradeData.unit_worth && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm mt-2">
                <div className="flex justify-between items-center">
                  <span>Estimated Total:</span>
                  <span className="font-semibold">
                    {formatCurrency(parseFloat(tradeData.volume) * parseFloat(tradeData.unit_worth))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Buy/Sell Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              className={`bg-green-600 hover:bg-green-700 text-white h-12 w-full ${
                !isAccountActive ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handleSubmit('buy')}
              disabled={
                !tradeData.exchange_type ||
                !tradeData.symbol ||
                !tradeData.volume ||
                !tradeData.unit_worth ||
                !isAccountActive
              }
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              BUY
            </Button>
            <Button
              className={`bg-red-600 hover:bg-red-700 text-white h-12 w-full ${
                !isAccountActive ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handleSubmit('sell')}
              disabled={
                !tradeData.exchange_type ||
                !tradeData.symbol ||
                !tradeData.volume ||
                !tradeData.unit_worth ||
                !isAccountActive
              }
            >
              <TrendingDown className="h-5 w-5 mr-2" />
              SELL
            </Button>
          </div>

          {/* Warning for inactive accounts */}
          {!isAccountActive && (
            <p className="text-red-600 text-sm mt-2">
              Your account is suspended or locked. Trading is disabled.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}
