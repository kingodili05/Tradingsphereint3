'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, BarChart3, Globe, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

const indices = [
  { symbol: 'SPX500', name: 'S&P 500', price: '4,567.89', spread: '0.4 pts', volume: '$45.2B', change: '+0.6%', trend: 'up', country: 'US' },
  { symbol: 'NAS100', name: 'NASDAQ 100', price: '15,234.56', spread: '1.0 pts', volume: '$28.9B', change: '+0.9%', trend: 'up', country: 'US' },
  { symbol: 'US30', name: 'Dow Jones 30', price: '34,567.12', spread: '2.0 pts', volume: '$18.7B', change: '+0.3%', trend: 'up', country: 'US' },
  { symbol: 'UK100', name: 'FTSE 100', price: '7,456.78', spread: '1.5 pts', volume: '$8.9B', change: '-0.2%', trend: 'down', country: 'UK' },
  { symbol: 'GER30', name: 'DAX 30', price: '15,789.45', spread: '1.5 pts', volume: '$12.3B', change: '+0.4%', trend: 'up', country: 'DE' },
  { symbol: 'FRA40', name: 'CAC 40', price: '7,234.56', spread: '1.0 pts', volume: '$6.7B', change: '+0.1%', trend: 'up', country: 'FR' },
  { symbol: 'JPN225', name: 'Nikkei 225', price: '32,456.78', spread: '8.0 pts', volume: '$15.4B', change: '+0.7%', trend: 'up', country: 'JP' },
  { symbol: 'AUS200', name: 'ASX 200', price: '7,123.45', spread: '2.0 pts', volume: '$4.2B', change: '-0.1%', trend: 'down', country: 'AU' },
];

const indexFeatures = [
  {
    icon: Building2,
    title: 'Market Exposure',
    description: 'Gain exposure to entire markets or sectors through single index trades',
  },
  {
    icon: TrendingUp,
    title: 'Diversification',
    description: 'Instant diversification across multiple stocks within a single instrument',
  },
  {
    icon: BarChart3,
    title: 'Lower Risk',
    description: 'Reduced single-stock risk through broad market exposure',
  },
  {
    icon: Globe,
    title: 'Global Markets',
    description: 'Access major stock indices from around the world',
  },
  {
    icon: Clock,
    title: 'Extended Hours',
    description: 'Trade indices during extended market hours for more opportunities',
  },
  {
    icon: Shield,
    title: 'Transparent Pricing',
    description: 'Clear pricing based on underlying index values with tight spreads',
  },
];

const regionalMarkets = [
  {
    region: 'North America',
    indices: ['S&P 500', 'NASDAQ 100', 'Dow Jones 30', 'Russell 2000'],
    description: 'Major US stock market indices',
    flag: '🇺🇸',
  },
  {
    region: 'Europe',
    indices: ['FTSE 100', 'DAX 30', 'CAC 40', 'EURO STOXX 50'],
    description: 'Leading European market indices',
    flag: '🇪🇺',
  },
  {
    region: 'Asia-Pacific',
    indices: ['Nikkei 225', 'Hang Seng', 'ASX 200', 'KOSPI'],
    description: 'Major Asian market indices',
    flag: '🌏',
  },
];

export default function IndicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Index Trading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trade major stock market indices from around the world. Get exposure to entire markets 
            with single trades and benefit from diversification and reduced risk.
          </p>
        </div>

        {/* Index Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {indexFeatures.map((feature, index) => (
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

        {/* Regional Markets */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Global Index Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {regionalMarkets.map((market, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{market.flag}</div>
                    <div>
                      <CardTitle className="text-white">{market.region}</CardTitle>
                      <CardDescription className="text-gray-300">{market.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {market.indices.map((index, indexIndex) => (
                      <div key={indexIndex} className="text-sm text-gray-300">
                        • {index}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-black">
                    Trade {market.region}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Index Prices */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Live Index Prices</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Index</th>
                  <th className="text-left py-4 px-6 text-gray-300">Price</th>
                  <th className="text-left py-4 px-6 text-gray-300">Spread</th>
                  <th className="text-left py-4 px-6 text-gray-300">Volume</th>
                  <th className="text-left py-4 px-6 text-gray-300">24h Change</th>
                  <th className="text-left py-4 px-6 text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {indices.map((index, indexIndex) => (
                  <tr key={indexIndex} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-semibold text-white">{index.symbol}</div>
                          <div className="text-sm text-gray-400">{index.name}</div>
                        </div>
                        <div className="text-lg">{index.country === 'US' ? '🇺🇸' : index.country === 'UK' ? '🇬🇧' : index.country === 'DE' ? '🇩🇪' : index.country === 'FR' ? '🇫🇷' : index.country === 'JP' ? '🇯🇵' : '🇦🇺'}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-semibold">{index.price}</td>
                    <td className="py-4 px-6 text-green-400">{index.spread}</td>
                    <td className="py-4 px-6 text-gray-300">{index.volume}</td>
                    <td className="py-4 px-6">
                      <span className={`${index.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {index.change}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link href={`/markets/indices/${index.symbol}`}>
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

        {/* Trading Information */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Index Trading Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Trading Conditions</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Minimum Spread</span>
                  <span className="text-green-400">0.4 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum Leverage</span>
                  <span className="text-white">1:200</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Trade Size</span>
                  <span className="text-white">0.1 lots</span>
                </div>
                <div className="flex justify-between">
                  <span>Trading Hours</span>
                  <span className="text-white">24/5</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Market Sessions</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <p><strong>Asian Session:</strong> 23:00 - 08:00 GMT</p>
                <p><strong>European Session:</strong> 07:00 - 16:00 GMT</p>
                <p><strong>US Session:</strong> 13:30 - 20:00 GMT</p>
                <p><strong>Extended Hours:</strong> Available for major indices</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Index Trading</h2>
          <p className="text-gray-300 mb-6">
            Get exposure to global markets with our comprehensive index trading platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Trading Account
              </Button>
            </Link>
            <Link href="/education/advantages-of-indices">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Learn About Index Trading
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}