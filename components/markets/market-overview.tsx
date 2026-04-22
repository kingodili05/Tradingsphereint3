'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const marketStats = [
  {
    category: 'Crypto',
    value: '$1.67T',
    change: '+3.2%',
    trend: 'up',
    description: 'Market Cap',
  },
  {
    category: 'Forex',
    value: '$7.5T',
    change: '+0.8%',
    trend: 'up',
    description: 'Daily Volume',
  },
  {
    category: 'Stocks',
    value: '$45.2T',
    change: '-0.5%',
    trend: 'down',
    description: 'Market Cap',
  },
  {
    category: 'Commodities',
    value: '$2.1T',
    change: '+1.7%',
    trend: 'up',
    description: 'Market Size',
  },
];

export function MarketOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {marketStats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.category}
            </CardTitle>
            {stat.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {stat.change} {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}