'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Globe, Clock, DollarSign, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';

const forexPairs = [
  { pair: 'EUR/USD', name: 'Euro / US Dollar', spread: '0.5 pips', volume: '$1.2T', change: '+0.12%', trend: 'up' },
  { pair: 'GBP/USD', name: 'British Pound / US Dollar', spread: '0.7 pips', volume: '$890B', change: '-0.08%', trend: 'down' },
  { pair: 'USD/JPY', name: 'US Dollar / Japanese Yen', spread: '0.6 pips', volume: '$1.1T', change: '+0.25%', trend: 'up' },
  { pair: 'AUD/USD', name: 'Australian Dollar / US Dollar', spread: '0.9 pips', volume: '$456B', change: '+0.18%', trend: 'up' },
  { pair: 'USD/CAD', name: 'US Dollar / Canadian Dollar', spread: '1.0 pips', volume: '$234B', change: '-0.05%', trend: 'down' },
  { pair: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', spread: '1.2 pips', volume: '$189B', change: '+0.33%', trend: 'up' },
  { pair: 'EUR/GBP', name: 'Euro / British Pound', spread: '1.1 pips', volume: '$345B', change: '+0.07%', trend: 'up' },
  { pair: 'GBP/JPY', name: 'British Pound / Japanese Yen', spread: '1.5 pips', volume: '$278B', change: '-0.15%', trend: 'down' },
];

const forexFeatures = [
  {
    icon: Globe,
    title: 'Global Currency Markets',
    description: 'Trade 50+ currency pairs from major, minor, and exotic categories with institutional spreads',
  },
  {
    icon: Clock,
    title: '24/5 Trading',
    description: 'Forex markets are open 24 hours a day, 5 days a week, providing continuous trading opportunities',
  },
  {
    icon: DollarSign,
    title: 'High Liquidity',
    description: 'Access the world\'s most liquid financial market with $7.5 trillion in daily trading volume',
  },
  {
    icon: BarChart3,
    title: 'Leverage Trading',
    description: 'Trade with leverage up to 1:500 to maximize your trading potential and capital efficiency',
  },
  {
    icon: TrendingUp,
    title: 'Tight Spreads',
    description: 'Competitive spreads starting from 0.5 pips on major currency pairs with no hidden markups',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Advanced risk management tools including stop loss, take profit, and trailing stop orders',
  },
];

const tradingConditions = [
  { condition: 'Minimum Spread', value: '0.5 pips (EUR/USD)' },
  { condition: 'Maximum Leverage', value: '1:500' },
  { condition: 'Minimum Trade Size', value: '0.01 lots' },
  { condition: 'Maximum Trade Size', value: '100 lots' },
  { condition: 'Execution Speed', value: '< 30ms average' },
  { condition: 'Trading Hours', value: '24/5 (Sun 22:00 - Fri 22:00 GMT)' },
];

export default function ForexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Forex Trading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trade the world's largest financial market with competitive spreads, 
            advanced tools, and professional execution. Access 50+ currency pairs 24/5.
          </p>
        </div>

        {/* Forex Features */}
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Currency Pair</th>
                  <th className="text-left py-4 px-6 text-gray-300">Spread</th>
                  <th className="text-left py-4 px-6 text-gray-300">Daily Volume</th>
                  <th className="text-left py-4 px-6 text-gray-300">24h Change</th>
                  <th className="text-left py-4 px-6 text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {forexPairs.map((pair, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-white">{pair.pair}</div>
                        <div className="text-sm text-gray-400">{pair.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-green-400 font-semibold">{pair.spread}</td>
                    <td className="py-4 px-6 text-gray-300">{pair.volume}</td>
                    <td className="py-4 px-6">
                      <span className={`${pair.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {pair.change}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link href={`/markets/forex/${pair.pair.replace('/', '')}`}>
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

        {/* Trading Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Forex Trading Conditions</CardTitle>
              <CardDescription className="text-gray-300">
                Professional trading conditions for forex markets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tradingConditions.map((condition, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">{condition.condition}</span>
                  <span className="text-white font-semibold">{condition.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Why Trade Forex?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Highest Liquidity</h3>
                  <p className="text-gray-300">The forex market is the most liquid market in the world with over $7.5 trillion traded daily.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-lg text-white">24/5 Market Hours</h3>
                  <p className="text-gray-300">Trade around the clock from Sunday 5 PM ET to Friday 5 PM ET across global sessions.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Low Transaction Costs</h3>
                  <p className="text-gray-300">Competitive spreads with no hidden fees or commissions on most currency pairs.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Leverage Opportunities</h3>
                  <p className="text-gray-300">Access leverage up to 1:500 to amplify your trading potential and maximize opportunities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Forex Trading Today</h2>
          <p className="text-gray-300 mb-6">
            Open your forex trading account and access the world's most liquid market
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Forex Account
              </Button>
            </Link>
            <Link href="/education/advantages-of-forex">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Learn About Forex
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}