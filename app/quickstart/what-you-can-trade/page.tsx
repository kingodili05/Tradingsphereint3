'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bitcoin, TrendingUp, BarChart3, Coins, Building2, Zap } from 'lucide-react';
import Link from 'next/link';

const tradingCategories = [
  {
    icon: Bitcoin,
    title: 'Digital Currencies',
    description: 'Trade Bitcoin, Ethereum, and 50+ cryptocurrencies',
    assets: ['Bitcoin (BTC)', 'Ethereum (ETH)', 'Cardano (ADA)', 'Solana (SOL)', 'Polygon (MATIC)'],
    color: 'text-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Forex',
    description: 'Major, minor, and exotic currency pairs',
    assets: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
    color: 'text-blue-500',
  },
  {
    icon: BarChart3,
    title: 'Stocks',
    description: 'Blue-chip stocks from major exchanges',
    assets: ['Apple (AAPL)', 'Microsoft (MSFT)', 'Google (GOOGL)', 'Tesla (TSLA)', 'Amazon (AMZN)'],
    color: 'text-green-500',
  },
  {
    icon: Coins,
    title: 'Commodities',
    description: 'Precious metals, energy, and agricultural products',
    assets: ['Gold', 'Silver', 'Crude Oil', 'Natural Gas', 'Wheat'],
    color: 'text-yellow-500',
  },
  {
    icon: Building2,
    title: 'Indices',
    description: 'Major stock market indices worldwide',
    assets: ['S&P 500', 'NASDAQ 100', 'FTSE 100', 'DAX 30', 'Nikkei 225'],
    color: 'text-purple-500',
  },
  {
    icon: Zap,
    title: 'Futures',
    description: 'Commodity and financial futures contracts',
    assets: ['E-mini S&P 500', 'Gold Futures', 'Oil Futures', 'Euro FX', 'Treasury Bonds'],
    color: 'text-red-500',
  },
];

export default function WhatYouCanTradePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            What You Can Trade
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Access a diverse range of financial instruments across multiple asset classes. 
            Trade with confidence on our professional platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tradingCategories.map((category, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
              <CardHeader>
                <category.icon className={`h-8 w-8 ${category.color} mb-2`} />
                <CardTitle className="text-white">{category.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-200">Popular Assets:</h4>
                  <ul className="space-y-1">
                    {category.assets.map((asset, assetIndex) => (
                      <li key={assetIndex} className="text-sm text-gray-400">
                        • {asset}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/markets">
                  <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-black">
                    Explore {category.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Trading Today</h2>
          <p className="text-gray-300 mb-6">
            Open your account and get access to all these markets and more
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
              Open Trading Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}