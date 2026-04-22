'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const marketData = [
  { symbol: 'SPXUSD', name: 'S&P 500', price: '6,463.2', change: '-39.2', changePercent: '-0.60%', trend: 'down', volume: '500' },
  { symbol: 'NSXUSD', name: 'Nasdaq 100', price: '23,406.1', change: '-294.8', changePercent: '-1.24%', trend: 'down', volume: '100' },
  { symbol: 'DJI', name: 'Dow 30', price: '45,568.0', change: '-30.9', changePercent: '-0.07%', trend: 'down', volume: '30' },
  { symbol: 'NKY', name: 'Nikkei 225', price: '42,718.47', change: '-110.32', changePercent: '-0.26%', trend: 'down', volume: '225' },
  { symbol: 'DEU30', name: 'DAX Index', price: '23,902.21', change: '-137.71', changePercent: '-0.57%', trend: 'down', volume: '30' },
  { symbol: 'UKXGBP', name: 'UK 100', price: '9,193.7', change: '-32.1', changePercent: '-0.35%', trend: 'down', volume: '100' },
];

const timeframes = ['1D', '1M', '3M', '1Y', '5Y', 'All'];

interface MarketListProps {
  onSymbolSelect: (symbol: string) => void;
}

export function MarketList({ onSymbolSelect }: MarketListProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Indices</h3>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Commodities</Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Bonds</Button>
          </div>
        </div>
        
        <div className="flex space-x-1">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={selectedTimeframe === tf ? "default" : "ghost"}
              size="sm"
              className={cn(
                "text-xs px-2 py-1",
                selectedTimeframe === tf ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              )}
              onClick={() => setSelectedTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {marketData.map((market, index) => (
          <div
            key={market.symbol}
            className="flex items-center justify-between p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
            onClick={() => onSymbolSelect(market.symbol)}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm",
                index === 0 ? "bg-red-600" : 
                index === 1 ? "bg-blue-600" : 
                index === 2 ? "bg-cyan-600" :
                index === 3 ? "bg-purple-600" :
                index === 4 ? "bg-blue-500" : "bg-purple-500"
              )}>
                {market.volume}
              </div>
              <div>
                <div className="text-white font-medium text-sm">{market.symbol}</div>
                <div className="text-gray-400 text-xs">{market.name}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-white font-medium text-sm">{market.price}</div>
              <div className={cn(
                "text-xs",
                market.trend === 'up' ? "text-green-400" : "text-red-400"
              )}>
                {market.change} {market.changePercent}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}