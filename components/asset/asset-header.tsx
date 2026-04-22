'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';

interface AssetHeaderProps {
  category: string;
  symbol: string;
}

export function AssetHeader({ category, symbol }: AssetHeaderProps) {
  // Mock data based on symbol
  const assetData = {
    name: symbol === 'BTC' ? 'Bitcoin' : symbol === 'AAPL' ? 'Apple Inc.' : symbol,
    price: symbol === 'BTC' ? '$43,250.00' : symbol === 'AAPL' ? '$189.45' : '$1,234.56',
    change: '+2.5%',
    changeValue: '+$1,056.30',
    volume: '$2.1B',
    marketCap: '$845.2B',
    trend: 'up' as const,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <span className="font-bold text-blue-600 dark:text-blue-400">{symbol.slice(0, 2)}</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">{symbol}</h1>
              <Badge variant="secondary" className="capitalize">{category}</Badge>
            </div>
            <p className="text-muted-foreground">{assetData.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-3xl font-bold">{assetData.price}</div>
            <div className={`flex items-center ${assetData.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {assetData.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {assetData.change} ({assetData.changeValue})
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-1" />
              Watchlist
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
        <div>
          <div className="text-sm text-muted-foreground">24h Volume</div>
          <div className="font-semibold">{assetData.volume}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Market Cap</div>
          <div className="font-semibold">{assetData.marketCap}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">24h High</div>
          <div className="font-semibold">$44,125.80</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">24h Low</div>
          <div className="font-semibold">$42,890.15</div>
        </div>
      </div>
    </div>
  );
}