'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { useLivePrices, formatUsd, formatChangePercent } from '@/hooks/use-live-prices';

interface AssetHeaderProps {
  category: string;
  symbol: string;
}

const SYMBOL_INFO: Record<string, { name: string; price: string }> = {
  BTC: { name: 'Bitcoin', price: '$43,250.00' },
  AAPL: { name: 'Apple Inc.', price: '$189.45' },
  XRP: { name: 'XRP', price: '$0.615' },
  HIMS: { name: 'Hims & Hers Health Inc.', price: '$21.40' },
  SPY: { name: 'SPDR S&P 500 ETF', price: '$459.80' },
  QQQ: { name: 'Invesco QQQ Trust', price: '$389.25' },
  DIA: { name: 'SPDR Dow Jones Industrial Average ETF', price: '$385.15' },
};

export function AssetHeader({ category, symbol }: AssetHeaderProps) {
  const { data: livePrices } = useLivePrices();
  const live = livePrices?.[symbol];

  // Falls back to mock data when there's no live feed for this symbol
  const assetData = {
    name: SYMBOL_INFO[symbol]?.name ?? symbol,
    price: live ? formatUsd(live.price) : SYMBOL_INFO[symbol]?.price ?? '$1,234.56',
    change: live ? formatChangePercent(live.changePercent) : '+2.5%',
    changeValue: live ? formatUsd(Math.abs(live.change)) : '+$1,056.30',
    volume: '$2.1B',
    marketCap: '$845.2B',
    trend: live?.trend ?? ('up' as const),
    isLive: Boolean(live),
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
              {assetData.isLive && <span className="h-1.5 w-1.5 rounded-full bg-green-500" title="Live price" />}
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