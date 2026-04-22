'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBalances } from '@/hooks/use-balances';
import { useTrades } from '@/hooks/use-trades';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

export function AssetAllocation() {
  const { balances } = useBalances();
  const { trades } = useTrades();

  // Calculate real asset allocation based on user's trades and balances
  const calculateAssetAllocation = () => {
    const assetValues: Record<string, number> = {};
    let totalValue = 0;

    // Calculate value from active trades by exchange type
    const openTrades = trades.filter(trade => trade.status === 'open');
    openTrades.forEach(trade => {
      const value = trade.volume * trade.unit_worth;
      const category = trade.exchange_type === 'forex' ? 'Forex' :
                      trade.exchange_type === 'crypto' ? 'Crypto' :
                      trade.exchange_type === 'stocks' ? 'Stocks' :
                      trade.exchange_type === 'commodities' ? 'Commodities' :
                      trade.exchange_type === 'indices' ? 'Indices' : 'Other';
      
      assetValues[category] = (assetValues[category] || 0) + value;
      totalValue += value;
    });

    // Add cash balances
    const usdBalance = balances?.find(b => b.currency === 'USD')?.balance || 0;
    const btcBalance = balances?.find(b => b.currency === 'BTC')?.balance || 0;
    const ethBalance = balances?.find(b => b.currency === 'ETH')?.balance || 0;

    if (usdBalance > 0) {
      assetValues['Cash'] = usdBalance;
      totalValue += usdBalance;
    }

    if (btcBalance > 0) {
      assetValues['Crypto'] = (assetValues['Crypto'] || 0) + (btcBalance * 43000); // Mock BTC price
      totalValue += (btcBalance * 43000);
    }

    if (ethBalance > 0) {
      assetValues['Crypto'] = (assetValues['Crypto'] || 0) + (ethBalance * 2600); // Mock ETH price
      totalValue += (ethBalance * 2600);
    }

    if (totalValue === 0) {
      return [];
    }

    // Convert to percentages and format for chart
    const colors = {
      'Crypto': '#f59e0b',
      'Stocks': '#3b82f6',
      'Forex': '#10b981',
      'Indices': '#8b5cf6',
      'Commodities': '#ef4444',
      'Cash': '#6b7280',
      'Other': '#94a3b8'
    };

    return Object.entries(assetValues).map(([name, value]) => ({
      name,
      value: Math.round((value / totalValue) * 100),
      color: colors[name as keyof typeof colors] || '#94a3b8'
    })).filter(item => item.value > 0);
  };

  const data = calculateAssetAllocation();
  const hasData = data.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>
          Distribution of your portfolio across asset classes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {data.map((item, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Portfolio Data</h3>
            <p className="text-muted-foreground mb-4">
              Start trading to build your portfolio and see asset allocation
            </p>
            <p className="text-sm text-muted-foreground">
              Your asset allocation will appear here once you have active trades or holdings
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}