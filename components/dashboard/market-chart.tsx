'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Plus, BarChart3, TrendingUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const timeframes = ['1m', '30m', '1h', '4h', '1D', '1W'];
const chartTypes = ['Line', 'Candle', 'Bar'];

interface MarketChartProps {
  symbol: string;
}

export function MarketChart({ symbol }: MarketChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [selectedChartType, setSelectedChartType] = useState('Candle');

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 h-full flex flex-col">
      {/* Chart Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={symbol}
                className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg text-sm w-32"
                readOnly
              />
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
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
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <TrendingUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">€</span>
            </div>
            <span className="text-white font-medium">Euro / U.S. Dollar</span>
          </div>
          
          <div className="text-sm text-gray-400">
            O 1.16856 H 1.16857 L 1.16843 C 1.16847 <span className="text-red-400">-0.00009 (-0.01%)</span>
          </div>
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="flex-1 p-4 relative">
        <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
          {/* Simulated Chart */}
          <div className="w-full h-full relative">
            <svg className="w-full h-full" viewBox="0 0 800 300">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#374151" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Price line */}
              <path
                d="M 50 150 Q 150 120 250 140 T 450 130 T 650 160 T 750 140"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              
              {/* Volume bars */}
              {Array.from({ length: 20 }, (_, i) => (
                <rect
                  key={i}
                  x={50 + i * 35}
                  y={250 - Math.random() * 50}
                  width="8"
                  height={Math.random() * 50 + 10}
                  fill="#4b5563"
                />
              ))}
            </svg>
            
            {/* Price levels */}
            <div className="absolute right-2 top-4 space-y-2 text-xs">
              <div className="text-cyan-400">1.17000</div>
              <div className="text-cyan-400">1.16948</div>
              <div className="text-red-400">1.16847</div>
              <div className="text-cyan-400">1.16809</div>
            </div>
            
            {/* MACD indicator */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400">
              MACD 12 26 close 9 <span className="text-red-400">-0.00010 -0.00004 0.00006</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}