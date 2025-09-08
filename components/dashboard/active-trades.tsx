'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trade } from '@/lib/database.types';
import { useTrades } from '@/hooks/use-trades';
import { TrendingUp, TrendingDown, X, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface ActiveTradesProps {
  trades: Trade[];
  loading: boolean;
  showAll?: boolean;
}

export function ActiveTrades({ trades, loading, showAll = false }: ActiveTradesProps) {
  const { cancelTrade } = useTrades();

  const handleCancelTrade = async (tradeId: string) => {
    await cancelTrade(tradeId);
  };

  const getTradeTypeColor = (type: string) => {
    return type === 'buy' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'closed': return 'bg-blue-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{showAll ? 'All Trades' : 'Active Trades'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayTrades = showAll ? trades : trades.filter(trade => trade.status === 'open');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{showAll ? 'All Trades' : 'Active Trades'}</span>
          <Badge variant="secondary">{displayTrades.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayTrades.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No {showAll ? 'trades' : 'active trades'} found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayTrades.map((trade) => (
              <div key={trade.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${trade.trade_type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {trade.trade_type === 'buy' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="font-medium flex items-center space-x-2">
                        <span>{trade.symbol}</span>
                        {trade.signal_locked && <Lock className="h-4 w-4 text-orange-500" />}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {trade.exchange_type} • {trade.order_type}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(trade.status)}>
                      {trade.status}
                    </Badge>
                    {trade.status === 'open' && !trade.signal_locked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelTrade(trade.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Volume</div>
                    <div className="font-medium">{trade.volume}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Entry Price</div>
                    <div className="font-medium">{formatCurrency(trade.entry_price || trade.unit_worth)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current P&L</div>
                    <div className={`font-medium ${trade.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(trade.unrealized_pnl)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Value</div>
                    <div className="font-medium">{formatCurrency(trade.volume * trade.unit_worth)}</div>
                  </div>
                </div>

                {(trade.take_profit || trade.stop_loss) && (
                  <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
                    {trade.take_profit && (
                      <div>
                        <div className="text-muted-foreground">Take Profit</div>
                        <div className="font-medium text-green-600">{formatCurrency(trade.take_profit)}</div>
                      </div>
                    )}
                    {trade.stop_loss && (
                      <div>
                        <div className="text-muted-foreground">Stop Loss</div>
                        <div className="font-medium text-red-600">{formatCurrency(trade.stop_loss)}</div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(trade.created_at).toLocaleString()}
                  {trade.expire_time && (
                    <span> • Expires: {new Date(trade.expire_time).toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}