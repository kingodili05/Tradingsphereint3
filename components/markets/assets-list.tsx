'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

const assets = {
  crypto: [
    { symbol: 'BTC', name: 'Bitcoin', price: '$43,250.00', change: '+2.5%', trend: 'up', volume: '$2.1B' },
    { symbol: 'ETH', name: 'Ethereum', price: '$2,650.00', change: '+1.8%', trend: 'up', volume: '$1.8B' },
    { symbol: 'ADA', name: 'Cardano', price: '$0.485', change: '-0.7%', trend: 'down', volume: '$245M' },
    { symbol: 'SOL', name: 'Solana', price: '$98.45', change: '+4.2%', trend: 'up', volume: '$892M' },
  ],
  forex: [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: '1.0875', change: '+0.12%', trend: 'up', volume: '$1.2B' },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: '1.2645', change: '-0.08%', trend: 'down', volume: '$890M' },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: '149.85', change: '+0.25%', trend: 'up', volume: '$1.1B' },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', price: '0.6789', change: '+0.18%', trend: 'up', volume: '$456M' },
  ],
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '$189.45', change: '+1.2%', trend: 'up', volume: '$2.8B' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$142.80', change: '-0.5%', trend: 'down', volume: '$1.9B' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$378.85', change: '+0.8%', trend: 'up', volume: '$2.1B' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.50', change: '+3.1%', trend: 'up', volume: '$3.2B' },
  ],
  etfs: [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: '$459.80', change: '+0.6%', trend: 'up', volume: '$8.9B' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: '$389.25', change: '+0.9%', trend: 'up', volume: '$4.2B' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market', price: '$245.60', change: '+0.4%', trend: 'up', volume: '$1.8B' },
    { symbol: 'IWM', name: 'iShares Russell 2000', price: '$198.75', change: '-0.3%', trend: 'down', volume: '$2.1B' },
  ],
  commodities: [
    { symbol: 'GOLD', name: 'Gold', price: '$2,045.30', change: '+0.8%', trend: 'up', volume: '$12.5B' },
    { symbol: 'OIL', name: 'Crude Oil', price: '$78.45', change: '-1.2%', trend: 'down', volume: '$8.9B' },
    { symbol: 'SILVER', name: 'Silver', price: '$24.85', change: '+1.1%', trend: 'up', volume: '$2.1B' },
    { symbol: 'COPPER', name: 'Copper', price: '$3.89', change: '+0.5%', trend: 'up', volume: '$1.8B' },
  ],
};

export function AssetsList() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assets</CardTitle>
        <CardDescription>
          Browse and trade available assets across all categories
        </CardDescription>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="crypto" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="forex">Forex</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="etfs">ETFs</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
          </TabsList>
          
          {Object.entries(assets).map(([category, assetList]) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="space-y-2">
                {assetList
                  .filter(asset => 
                    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-medium">{asset.symbol}</div>
                          <div className="text-sm text-muted-foreground">{asset.name}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">{asset.price}</div>
                          <div className="text-sm text-muted-foreground">Vol: {asset.volume}</div>
                        </div>
                        
                        <div className={`flex items-center ${asset.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {asset.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                          {asset.change}
                        </div>
                        
                        <Link href={`/markets/${category}/${asset.symbol}`}>
                          <Button size="sm">Trade</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}