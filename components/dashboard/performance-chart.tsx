'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBalances } from '@/hooks/use-balances';
import { useTrades } from '@/hooks/use-trades';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export function PerformanceChart() {
  const { user } = useAuth();
  const { getTotalBalanceUSD } = useBalances();
  const { trades } = useTrades();

  // Generate performance data from actual user trading history
  const generatePerformanceData = () => {
    const currentValue = getTotalBalanceUSD();
    
    // If no trades or balance, return empty data
    if (trades.length === 0 && currentValue === 0) {
      return [];
    }

    // Create simple performance data based on trades
    const closedTrades = trades
      .filter(trade => trade.status === 'closed' && trade.closed_at)
      .sort((a, b) => new Date(a.closed_at!).getTime() - new Date(b.closed_at!).getTime());

    if (closedTrades.length === 0) {
      // Show current balance only
      return [
        { 
          date: new Date().toISOString().slice(0, 7), 
          value: currentValue 
        }
      ];
    }

    // Build performance timeline from trade history
    let runningBalance = 0;
    const performanceData = [];

    closedTrades.forEach(trade => {
      runningBalance += trade.realized_pnl;
      performanceData.push({
        date: new Date(trade.closed_at!).toISOString().slice(0, 7),
        value: Math.max(0, currentValue - runningBalance)
      });
    });

    // Add current value as the latest point
    performanceData.push({
      date: new Date().toISOString().slice(0, 7),
      value: currentValue
    });

    return performanceData;
  };

  const data = generatePerformanceData();
  const hasData = data.length > 0 && data.some(point => point.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
        <CardDescription>
          Your portfolio value based on trading history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Performance Data</h3>
            <p className="text-muted-foreground mb-4">
              Your portfolio performance will appear here once you start trading
            </p>
            <p className="text-sm text-muted-foreground">
              Make your first trade to begin tracking your portfolio performance
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}