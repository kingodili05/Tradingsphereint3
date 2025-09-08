'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, BarChart3, Clock, DollarSign, Shield } from 'lucide-react';
import Link from 'next/link';

const futures = [
  { symbol: 'ES', name: 'E-mini S&P 500', price: '4,567.50', spread: '0.25 pts', volume: '$125.8B', change: '+0.6%', trend: 'up', category: 'Equity Index', expiry: 'Mar 2024' },
  { symbol: 'NQ', name: 'E-mini NASDAQ 100', price: '15,234.75', spread: '0.50 pts', volume: '$89.2B', change: '+0.9%', trend: 'up', category: 'Equity Index', expiry: 'Mar 2024' },
  { symbol: 'YM', name: 'E-mini Dow Jones', price: '34,567.00', spread: '1.0 pts', volume: '$45.6B', change: '+0.3%', trend: 'up', category: 'Equity Index', expiry: 'Mar 2024' },
  { symbol: 'GC', name: 'Gold Futures', price: '$2,045.30', spread: '$0.10', volume: '$28.9B', change: '+0.8%', trend: 'up', category: 'Precious Metals', expiry: 'Apr 2024' },
  { symbol: 'CL', name: 'Crude Oil Futures', price: '$78.45', spread: '$0.01', volume: '$67.3B', change: '-1.2%', trend: 'down', category: 'Energy', expiry: 'Mar 2024' },
  { symbol: 'NG', name: 'Natural Gas Futures', price: '$2.89', spread: '$0.001', volume: '$23.4B', change: '+2.1%', trend: 'up', category: 'Energy', expiry: 'Mar 2024' },
  { symbol: 'ZW', name: 'Wheat Futures', price: '$645.25', spread: '$0.25', volume: '$8.9B', change: '+1.8%', trend: 'up', category: 'Agriculture', expiry: 'May 2024' },
  { symbol: 'ZC', name: 'Corn Futures', price: '$478.50', spread: '$0.25', volume: '$12.1B', change: '-0.3%', trend: 'down', category: 'Agriculture', expiry: 'May 2024' },
];

const futuresFeatures = [
  {
    icon: Zap,
    title: 'High Leverage',
    description: 'Trade futures with leverage up to 1:100 for maximum capital efficiency',
  },
  {
    icon: TrendingUp,
    title: 'Price Discovery',
    description: 'Futures markets provide transparent price discovery for underlying assets',
  },
  {
    icon: BarChart3,
    title: 'Hedging Tool',
    description: 'Use futures to hedge existing positions and manage portfolio risk',
  },
  {
    icon: Clock,
    title: 'Extended Hours',
    description: 'Trade futures during extended hours for more trading opportunities',
  },
  {
    icon: DollarSign,
    title: 'Capital Efficiency',
    description: 'Control large positions with relatively small margin requirements',
  },
  {
    icon: Shield,
    title: 'Standardized Contracts',
    description: 'Trade standardized contracts with guaranteed settlement and clearing',
  },
];

const futuresCategories = [
  {
    name: 'Equity Index Futures',
    description: 'S&P 500, NASDAQ, Dow Jones futures',
    assets: 8,
    leverage: '1:100',
    color: 'text-blue-500',
  },
  {
    name: 'Commodity Futures',
    description: 'Gold, Oil, Agricultural products',
    assets: 15,
    leverage: '1:50',
    color: 'text-yellow-500',
  },
  {
    name: 'Currency Futures',
    description: 'EUR, GBP, JPY futures contracts',
    assets: 6,
    leverage: '1:100',
    color: 'text-green-500',
  },
  {
    name: 'Interest Rate Futures',
    description: 'Treasury bonds and notes futures',
    assets: 4,
    leverage: '1:50',
    color: 'text-purple-500',
  },
];

export default function FuturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Futures Trading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trade commodity and financial futures with high leverage and professional execution. 
            Access standardized contracts for hedging and speculation across multiple asset classes.
          </p>
        </div>

        {/* Futures Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {futuresCategories.map((category, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
              <CardHeader>
                <CardTitle className={`text-white ${category.color}`}>{category.name}</CardTitle>
                <CardDescription className="text-gray-300">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Assets</span>
                    <span className="text-white">{category.assets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Max Leverage</span>
                    <span className="text-green-400">{category.leverage}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-black">
                  Trade Futures
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Futures Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {futuresFeatures.map((feature, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Futures Prices */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Active Futures Contracts</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Contract</th>
                  <th className="text-left py-4 px-6 text-gray-300">Price</th>
                  <th className="text-left py-4 px-6 text-gray-300">Spread</th>
                  <th className="text-left py-4 px-6 text-gray-300">Volume</th>
                  <th className="text-left py-4 px-6 text-gray-300">Expiry</th>
                  <th className="text-left py-4 px-6 text-gray-300">24h Change</th>
                  <th className="text-left py-4 px-6 text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {futures.map((future, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-white">{future.symbol}</div>
                        <div className="text-sm text-gray-400">{future.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">{future.category}</Badge>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-semibold">{future.price}</td>
                    <td className="py-4 px-6 text-green-400">{future.spread}</td>
                    <td className="py-4 px-6 text-gray-300">{future.volume}</td>
                    <td className="py-4 px-6 text-gray-300">{future.expiry}</td>
                    <td className="py-4 px-6">
                      <span className={`${future.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {future.change}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link href={`/markets/futures/${future.symbol}`}>
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-black">
                          Trade
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-16">
          <h3 className="text-xl font-semibold text-red-400 mb-4">Futures Trading Risk Warning</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Futures trading involves substantial risk and may not be suitable for all investors. 
            The high degree of leverage can work against you as well as for you. Before deciding 
            to trade futures, you should carefully consider your investment objectives, level of 
            experience, and risk appetite. You could lose some or all of your initial investment.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Futures Trading</h2>
          <p className="text-gray-300 mb-6">
            Access professional futures trading with competitive margins and advanced tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Futures Account
              </Button>
            </Link>
            <Link href="/education/advantages-of-futures">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Learn About Futures
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}