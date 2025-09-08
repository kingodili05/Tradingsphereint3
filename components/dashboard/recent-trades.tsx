'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrades } from '@/hooks/use-trades';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

export function RecentTrades() {
  const { trades, loading } = useTrades();

  // Get recent trades (last 5 trades)
  const recentTrades = trades
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const tradeDate = new Date(dateString);
    const diffInHours = (now.getTime() - tradeDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const formatAmount = (volume: number, unitWorth: number) => {
    return `$${(volume * unitWorth).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPnL = (pnl: number) => {
    const sign = pnl >= 0 ? '+' : '';
    return `${sign}$${pnl.toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
        <CardDescription>
          Your latest trading activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recentTrades.length > 0 ? (
          <div className="space-y-4">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${trade.trade_type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {trade.trade_type === 'buy' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="font-medium">{trade.symbol}</div>
                    <div className="text-sm text-muted-foreground">{formatTimeAgo(trade.created_at)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatAmount(trade.volume, trade.unit_worth)}</div>
                  <div className={`text-sm ${trade.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPnL(trade.unrealized_pnl)}
                  </div>
                </div>
                <Badge variant={trade.status === 'open' ? 'default' : trade.status === 'closed' ? 'secondary' : 'outline'}>
                  {trade.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Trading History</h3>
            <p className="text-muted-foreground mb-4">
              Your recent trades will appear here once you start trading
            </p>
            <p className="text-sm text-muted-foreground">
              Execute your first trade to begin building your trading history
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}