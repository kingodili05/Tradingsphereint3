'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBalances } from '@/hooks/use-balances';
import { useTrades } from '@/hooks/use-trades';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

export function PortfolioOverview() {
  const { getTotalBalanceUSD } = useBalances();
  const { trades } = useTrades();

  // Calculate real portfolio statistics from user data
  const totalValue = getTotalBalanceUSD();
  const totalTrades = trades.length;
  const closedTrades = trades.filter(trade => trade.status === 'closed');
  const profitableTrades = closedTrades.filter(trade => trade.realized_pnl > 0);
  const successRate = closedTrades.length > 0 ? (profitableTrades.length / closedTrades.length) * 100 : 0;
  const totalPnL = closedTrades.reduce((sum, trade) => sum + trade.realized_pnl, 0);

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: totalValue > 0 ? '+0.0%' : '0.0%',
      trend: totalValue > 0 ? 'up' : 'neutral',
      icon: DollarSign,
    },
    {
      title: 'Total P&L',
      value: `$${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: totalPnL >= 0 ? `+${totalPnL.toFixed(2)}` : totalPnL.toFixed(2),
      trend: totalPnL >= 0 ? 'up' : 'down',
      icon: TrendingUp,
    },
    {
      title: 'Total Trades',
      value: totalTrades.toString(),
      change: totalTrades > 0 ? `${totalTrades} trades` : 'No trades',
      trend: totalTrades > 0 ? 'up' : 'neutral',
      icon: Activity,
    },
    {
      title: 'Success Rate',
      value: successRate > 0 ? `${successRate.toFixed(1)}%` : '0.0%',
      change: closedTrades.length > 0 ? `${closedTrades.length} completed` : 'No completed trades',
      trend: successRate >= 50 ? 'up' : successRate > 0 ? 'down' : 'neutral',
      icon: TrendingDown,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${
              stat.trend === 'up' ? 'text-green-600' : 
              stat.trend === 'down' ? 'text-red-600' : 
              'text-gray-500'
            } flex items-center`}>
              {stat.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : stat.trend === 'down' ? (
                <TrendingDown className="h-3 w-3 mr-1" />
              ) : (
                <Activity className="h-3 w-3 mr-1" />
              )}
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}