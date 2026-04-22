'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, BarChart3, Globe, DollarSign, Shield } from 'lucide-react';
import Link from 'next/link';

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$189.45', spread: 'Market', volume: '$2.8B', change: '+1.2%', trend: 'up', sector: 'Technology', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '$142.80', spread: 'Market', volume: '$1.9B', change: '-0.5%', trend: 'down', sector: 'Technology', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '$378.85', spread: 'Market', volume: '$2.1B', change: '+0.8%', trend: 'up', sector: 'Technology', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.50', spread: 'Market', volume: '$3.2B', change: '+3.1%', trend: 'up', sector: 'Automotive', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '$145.67', spread: 'Market', volume: '$2.5B', change: '+0.9%', trend: 'up', sector: 'E-commerce', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$456.78', spread: 'Market', volume: '$4.1B', change: '+2.3%', trend: 'up', sector: 'Semiconductors', exchange: 'NASDAQ' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: '$156.89', spread: 'Market', volume: '$1.8B', change: '+0.4%', trend: 'up', sector: 'Banking', exchange: 'NYSE' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: '$167.45', spread: 'Market', volume: '$1.2B', change: '-0.2%', trend: 'down', sector: 'Healthcare', exchange: 'NYSE' },
];

const stockFeatures = [
  {
    icon: Building2,
    title: 'Blue-Chip Stocks',
    description: 'Trade shares of the world\'s largest and most established companies',
  },
  {
    icon: TrendingUp,
    title: 'Growth Potential',
    description: 'Benefit from long-term growth and dividend income from quality companies',
  },
  {
    icon: BarChart3,
    title: 'Sector Diversification',
    description: 'Access stocks across multiple sectors including technology, healthcare, and finance',
  },
  {
    icon: Globe,
    title: 'Global Exchanges',
    description: 'Trade stocks from major exchanges including NYSE, NASDAQ, LSE, and more',
  },
  {
    icon: DollarSign,
    title: 'Fractional Shares',
    description: 'Start trading with smaller amounts through fractional share ownership',
  },
  {
    icon: Shield,
    title: 'Regulated Markets',
    description: 'Trade on regulated exchanges with transparent pricing and market oversight',
  },
];

const stockSectors = [
  { sector: 'Technology', companies: 25, description: 'Apple, Microsoft, Google, Tesla', color: 'text-blue-500' },
  { sector: 'Healthcare', companies: 18, description: 'Johnson & Johnson, Pfizer, Merck', color: 'text-green-500' },
  { sector: 'Financial', companies: 15, description: 'JPMorgan, Bank of America, Wells Fargo', color: 'text-purple-500' },
  { sector: 'Consumer', companies: 12, description: 'Amazon, Walmart, Coca-Cola', color: 'text-orange-500' },
  { sector: 'Energy', companies: 10, description: 'ExxonMobil, Chevron, ConocoPhillips', color: 'text-red-500' },
  { sector: 'Industrial', companies: 20, description: 'Boeing, Caterpillar, General Electric', color: 'text-yellow-500' },
];

export default function StocksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Stock Trading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Invest in the world's leading companies with our comprehensive stock trading platform. 
            Access 100+ blue-chip stocks from major global exchanges.
          </p>
        </div>

        {/* Stock Sectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stockSectors.map((sector, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
              <CardHeader>
                <CardTitle className={`text-white ${sector.color}`}>{sector.sector}</CardTitle>
                <CardDescription className="text-gray-300">
                  {sector.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{sector.companies} Companies</span>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-black">
                    View Stocks
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stock Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stockFeatures.map((feature, index) => (
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

        {/* Live Stock Prices */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Stocks</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Stock</th>
                  <th className="text-left py-4 px-6 text-gray-300">Price</th>
                  <th className="text-left py-4 px-6 text-gray-300">Volume</th>
                  <th className="text-left py-4 px-6 text-gray-300">Sector</th>
                  <th className="text-left py-4 px-6 text-gray-300">24h Change</th>
                  <th className="text-left py-4 px-6 text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-500 font-bold text-sm">{stock.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-white">{stock.symbol}</div>
                          <div className="text-sm text-gray-400">{stock.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-semibold">{stock.price}</td>
                    <td className="py-4 px-6 text-gray-300">{stock.volume}</td>
                    <td className="py-4 px-6">
                      <Badge variant="outline" className="text-xs">{stock.sector}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`${stock.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link href={`/markets/stocks/${stock.symbol}`}>
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
          <h2 className="text-2xl font-bold mb-6">Stock Trading Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Trading Conditions</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Commission</span>
                  <span className="text-green-400">From $2.99 per trade</span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum Leverage</span>
                  <span className="text-white">1:20</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Trade</span>
                  <span className="text-white">1 share</span>
                </div>
                <div className="flex justify-between">
                  <span>Settlement</span>
                  <span className="text-white">T+2</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Market Hours</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <p><strong>NYSE:</strong> 09:30 - 16:00 EST</p>
                <p><strong>NASDAQ:</strong> 09:30 - 16:00 EST</p>
                <p><strong>LSE:</strong> 08:00 - 16:30 GMT</p>
                <p><strong>Pre/After Market:</strong> Extended hours available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Stock Trading</h2>
          <p className="text-gray-300 mb-6">
            Invest in the world's leading companies with our professional stock trading platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Stock Trading Account
              </Button>
            </Link>
            <Link href="/education/advantages-of-stocks">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Learn About Stock Trading
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}