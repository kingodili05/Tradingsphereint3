'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bitcoin, TrendingUp, Shield, Zap, Globe, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const cryptocurrencies = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$43,250.00', spread: '0.1%', volume: '$28.5B', change: '+2.5%', trend: 'up', marketCap: '$845.2B' },
  { symbol: 'ETH', name: 'Ethereum', price: '$2,650.00', spread: '0.1%', volume: '$18.9B', change: '+1.8%', trend: 'up', marketCap: '$318.7B' },
  { symbol: 'ADA', name: 'Cardano', price: '$0.485', spread: '0.2%', volume: '$245M', change: '-0.7%', trend: 'down', marketCap: '$17.2B' },
  { symbol: 'SOL', name: 'Solana', price: '$98.45', spread: '0.15%', volume: '$892M', change: '+4.2%', trend: 'up', marketCap: '$43.8B' },
  { symbol: 'DOT', name: 'Polkadot', price: '$7.89', spread: '0.2%', volume: '$156M', change: '+1.5%', trend: 'up', marketCap: '$9.8B' },
  { symbol: 'MATIC', name: 'Polygon', price: '$0.89', spread: '0.25%', volume: '$234M', change: '+3.1%', trend: 'up', marketCap: '$8.2B' },
  { symbol: 'LINK', name: 'Chainlink', price: '$14.56', spread: '0.2%', volume: '$345M', change: '+2.8%', trend: 'up', marketCap: '$8.1B' },
  { symbol: 'UNI', name: 'Uniswap', price: '$6.78', spread: '0.3%', volume: '$189M', change: '-1.2%', trend: 'down', marketCap: '$4.1B' },
];

const cryptoFeatures = [
  {
    icon: Bitcoin,
    title: 'Leading Cryptocurrencies',
    description: 'Trade Bitcoin, Ethereum, and 25+ major cryptocurrencies with competitive spreads',
  },
  {
    icon: TrendingUp,
    title: 'High Volatility',
    description: 'Benefit from significant price movements and trading opportunities in crypto markets',
  },
  {
    icon: Shield,
    title: 'Secure Trading',
    description: 'Trade crypto CFDs without the need to hold actual cryptocurrencies or manage wallets',
  },
  {
    icon: Zap,
    title: 'Fast Execution',
    description: 'Lightning-fast order execution with real-time pricing and instant settlements',
  },
  {
    icon: Globe,
    title: '24/7 Markets',
    description: 'Cryptocurrency markets never close - trade anytime, anywhere, 365 days a year',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Professional charting tools and technical analysis specifically designed for crypto trading',
  },
];

const cryptoCategories = [
  {
    name: 'Major Cryptocurrencies',
    description: 'Bitcoin, Ethereum, and other top-tier digital assets',
    assets: 10,
    minSpread: '0.1%',
  },
  {
    name: 'Altcoins',
    description: 'Alternative cryptocurrencies with high growth potential',
    assets: 15,
    minSpread: '0.15%',
  },
  {
    name: 'DeFi Tokens',
    description: 'Decentralized finance protocol tokens',
    assets: 8,
    minSpread: '0.2%',
  },
  {
    name: 'Stablecoins',
    description: 'Price-stable cryptocurrencies pegged to fiat currencies',
    assets: 5,
    minSpread: '0.05%',
  },
];

export default function DigitalCurrenciesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Digital Currencies
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trade the future of finance with our comprehensive cryptocurrency trading platform. 
            Access Bitcoin, Ethereum, and 25+ digital assets with professional tools and security.
          </p>
        </div>

        {/* Crypto Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {cryptoCategories.map((category, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Bitcoin className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle className="text-white">{category.name}</CardTitle>
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
                    <span className="text-gray-400">Min Spread</span>
                    <span className="text-green-400">{category.minSpread}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-black">
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Crypto Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {cryptoFeatures.map((feature, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-orange-500 mb-2" />
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

        {/* Live Crypto Prices */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Live Cryptocurrency Prices</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Cryptocurrency</th>
                  <th className="text-left py-4 px-6 text-gray-300">Price</th>
                  <th className="text-left py-4 px-6 text-gray-300">Spread</th>
                  <th className="text-left py-4 px-6 text-gray-300">Volume</th>
                  <th className="text-left py-4 px-6 text-gray-300">Market Cap</th>
                  <th className="text-left py-4 px-6 text-gray-300">24h Change</th>
                  <th className="text-left py-4 px-6 text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {cryptocurrencies.map((crypto, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <span className="text-orange-500 font-bold text-sm">{crypto.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-white">{crypto.symbol}</div>
                          <div className="text-sm text-gray-400">{crypto.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-semibold">{crypto.price}</td>
                    <td className="py-4 px-6 text-green-400">{crypto.spread}</td>
                    <td className="py-4 px-6 text-gray-300">{crypto.volume}</td>
                    <td className="py-4 px-6 text-gray-300">{crypto.marketCap}</td>
                    <td className="py-4 px-6">
                      <span className={`${crypto.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.change}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link href={`/markets/crypto/${crypto.symbol}`}>
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
          <h3 className="text-xl font-semibold text-red-400 mb-4">Risk Warning</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Cryptocurrency trading involves substantial risk and may not be suitable for all investors. 
            Digital currencies are highly volatile and can experience significant price fluctuations. 
            Past performance is not indicative of future results. Please ensure you understand the 
            risks involved and seek independent advice if necessary.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Crypto Trading</h2>
          <p className="text-gray-300 mb-6">
            Enter the world of digital currencies with our secure and professional trading platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Crypto Account
              </Button>
            </Link>
            <Link href="/education/advantages-of-crypto">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Learn About Crypto Trading
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}