'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bitcoin, TrendingUp, BarChart3, Coins, Building2, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

const marketCategories = [
  {
    icon: TrendingUp,
    title: 'Forex',
    description: 'Trade 50+ currency pairs with tight spreads',
    assets: '50+ pairs',
    minSpread: '0.0 pips',
    leverage: '1:500',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    popular: true,
  },
  {
    icon: Bitcoin,
    title: 'Digital Currencies',
    description: 'Major cryptocurrencies with competitive spreads',
    assets: '25+ cryptos',
    minSpread: '0.1%',
    leverage: '1:10',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    popular: true,
  },
  {
    icon: Coins,
    title: 'Commodities',
    description: 'Precious metals, energy, and agricultural products',
    assets: '15+ commodities',
    minSpread: '0.3 pips',
    leverage: '1:200',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    popular: false,
  },
  {
    icon: Building2,
    title: 'Indices',
    description: 'Major stock market indices from around the world',
    assets: '20+ indices',
    minSpread: '0.4 pips',
    leverage: '1:200',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    popular: false,
  },
  {
    icon: BarChart3,
    title: 'Stocks',
    description: 'Blue-chip stocks from major exchanges',
    assets: '100+ stocks',
    minSpread: 'Market spread',
    leverage: '1:20',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    popular: false,
  },
  {
    icon: Zap,
    title: 'Futures',
    description: 'Commodity and financial futures contracts',
    assets: '30+ futures',
    minSpread: 'Variable',
    leverage: '1:100',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    popular: false,
  },
];

const marketStats = [
  { label: 'Total Instruments', value: '200+' },
  { label: 'Daily Volume', value: '$2.5B+' },
  { label: 'Average Execution', value: '<30ms' },
  { label: 'Uptime', value: '99.9%' },
];

export default function RangeOfMarketsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Range of Markets
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Access a comprehensive range of financial instruments across multiple asset classes. 
            Trade with confidence on our professional platform with competitive conditions.
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {marketStats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Market Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {marketCategories.map((category, index) => (
            <Card key={index} className={`bg-gray-800 border-gray-700 hover:border-green-500 transition-colors relative ${category.popular ? 'border-green-500' : ''}`}>
              {category.popular && (
                <div className="absolute -top-3 -right-3">
                  <Badge className="bg-green-500 text-black">Popular</Badge>
                </div>
              )}
              <CardHeader>
                <div className={`h-12 w-12 ${category.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                </div>
                <CardTitle className="text-white">{category.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Assets</div>
                    <div className="font-semibold text-white">{category.assets}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Min Spread</div>
                    <div className="font-semibold text-green-400">{category.minSpread}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Max Leverage</div>
                    <div className="font-semibold text-white">{category.leverage}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Execution</div>
                    <div className="font-semibold text-white">Market</div>
                  </div>
                </div>
                
                <Link href={`/markets/${category.title.toLowerCase().replace(' ', '-')}`}>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-black">
                    Explore {category.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trading Advantages */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Trade Multiple Markets?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Diversification</h3>
              <p className="text-gray-300 text-sm">
                Spread risk across different asset classes and geographical regions
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">More Opportunities</h3>
              <p className="text-gray-300 text-sm">
                Access trading opportunities 24/7 across different time zones
              </p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Portfolio Growth</h3>
              <p className="text-gray-300 text-sm">
                Optimize returns by trading various instruments based on market conditions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Trading Multiple Markets</h2>
          <p className="text-gray-300 mb-6">
            Open your account and get access to our full range of trading instruments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Trading Account
              </Button>
            </Link>
            <Link href="/markets">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Explore All Markets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}