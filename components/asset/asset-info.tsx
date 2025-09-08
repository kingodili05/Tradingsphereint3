'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AssetInfoProps {
  symbol: string;
}

export function AssetInfo({ symbol }: AssetInfoProps) {
  // Mock data based on symbol
  const info = {
    description: symbol === 'BTC' 
      ? 'Bitcoin is the world\'s first cryptocurrency, created in 2009 by an unknown person or group using the name Satoshi Nakamoto.'
      : `${symbol} is a tradeable financial instrument available on our platform.`,
    marketCap: '$845.2B',
    volume24h: '$28.5B',
    circulatingSupply: '19.7M',
    maxSupply: '21M',
    rank: '#1',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>About {symbol}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          {info.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Market Cap</div>
            <div className="font-semibold">{info.marketCap}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">24h Volume</div>
            <div className="font-semibold">{info.volume24h}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Circulating Supply</div>
            <div className="font-semibold">{info.circulatingSupply}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Max Supply</div>
            <div className="font-semibold">{info.maxSupply}</div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground">Market Rank</div>
          <div className="font-semibold text-lg">{info.rank}</div>
        </div>
      </CardContent>
    </Card>
  );
}