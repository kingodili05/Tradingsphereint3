'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Globe, Clock, DollarSign, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';

const forexFeatures = [
  {
    icon: Globe,
    title: 'Global Currency Markets',
    description: 'Trade 50+ currency pairs from major, minor, and exotic categories',
  },
  {
    icon: Clock,
    title: '24/5 Trading',
    description: 'Forex markets are open 24 hours a day, 5 days a week',
  },
  {
    icon: DollarSign,
    title: 'High Liquidity',
    description: 'Access the world\'s most liquid financial market with $7.5 trillion daily volume',
  },
  {
    icon: BarChart3,
    title: 'Leverage Trading',
    description: 'Trade with leverage up to 1:500 to maximize your trading potential',
  },
  {
    icon: TrendingUp,
    title: 'Tight Spreads',
    description: 'Competitive spreads starting from 0.5 pips on major currency pairs',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Advanced risk management tools including stop loss and take profit orders',
  },
];

const majorPairs = [
  { pair: 'EUR/USD', spread: '0.5 pips', description: 'Euro vs US Dollar' },
  { pair: 'GBP/USD', spread: '0.7 pips', description: 'British Pound vs US Dollar' },
  { pair: 'USD/JPY', spread: '0.6 pips', description: 'US Dollar vs Japanese Yen' },
  { pair: 'USD/CHF', spread: '0.8 pips', description: 'US Dollar vs Swiss Franc' },
  { pair: 'AUD/USD', spread: '0.9 pips', description: 'Australian Dollar vs US Dollar' },
  { pair: 'USD/CAD', spread: '1.0 pips', description: 'US Dollar vs Canadian Dollar' },
];

const tradingFees = [
  { asset: 'Forex', spread: 'From 0.5 pips', commission: 'No commission' },
  { asset: 'Crypto', spread: 'From 0.1%', commission: 'No commission' },
  { asset: 'Stocks', spread: 'Market spread', commission: 'From $2.99' },
  { asset: 'Commodities', spread: 'From 0.3 pips', commission: 'No commission' },
  { asset: 'Indices', spread: 'From 0.4 pips', commission: 'No commission' },
];

export default function ForexTradingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Forex Trading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trade the world's largest financial market with competitive spreads, 
            advanced tools, and professional execution.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {forexFeatures.map((feature, index) => (
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

        {/* Major Currency Pairs */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Major Currency Pairs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorPairs.map((pair, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-white">{pair.pair}</h3>
                  <span className="text-green-400 font-semibold">{pair.spread}</span>
                </div>
                <p className="text-gray-300 text-sm">{pair.description}</p>
                <Link href={`/markets/forex/${pair.pair.replace('/', '')}`}>
                  <Button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-black">
                    Trade Now
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Why Trade Forex */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Why Trade Forex?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-lg">Highest Liquidity</h3>
                  <p className="text-gray-300">The forex market is the most liquid market in the world with over $7.5 trillion traded daily.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-lg">24/5 Market Hours</h3>
                  <p className="text-gray-300">Trade around the clock from Sunday 5 PM ET to Friday 5 PM ET.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-lg">Low Transaction Costs</h3>
                  <p className="text-gray-300">Competitive spreads with no hidden fees or commissions on most pairs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-lg">Leverage Opportunities</h3>
                  <p className="text-gray-300">Access leverage up to 1:500 to amplify your trading potential.</p>
                </div>
              </div>
            </div>
          </div>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Start Forex Trading</CardTitle>
              <CardDescription className="text-gray-300">
                Open your forex trading account today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Minimum Deposit</span>
                  <span className="font-bold text-green-400">$100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Maximum Leverage</span>
                  <span className="font-bold text-green-400">1:500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Minimum Spread</span>
                  <span className="font-bold text-green-400">0.5 pips</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Execution Speed</span>
                  <span className="font-bold text-green-400">&lt; 30ms</span>
                </div>
              </div>
              
              <Link href="/auth/signup">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-black py-3">
                  Open Forex Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Trading Fees Table */}
        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Trading Costs by Asset</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Asset Class</th>
                  <th className="text-left py-4 px-6 text-gray-300">Typical Spread</th>
                  <th className="text-left py-4 px-6 text-gray-300">Commission</th>
                </tr>
              </thead>
              <tbody>
                {tradingFees.map((fee, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-6 font-semibold text-white">{fee.asset}</td>
                    <td className="py-4 px-6 text-green-400">{fee.spread}</td>
                    <td className="py-4 px-6 text-gray-300">{fee.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}