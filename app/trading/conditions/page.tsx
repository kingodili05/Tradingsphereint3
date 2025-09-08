'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, Shield, Zap, Check } from 'lucide-react';

const tradingConditions = [
  {
    account: 'Raw Spread',
    minDeposit: '$100',
    spread: 'From 0.0 pips',
    commission: '$3.50 per lot',
    leverage: 'Up to 1:500',
    execution: 'Market',
    platform: 'MT4/MT5',
    popular: true,
  },
  {
    account: 'Standard',
    minDeposit: '$50',
    spread: 'From 1.0 pips',
    commission: 'No commission',
    leverage: 'Up to 1:400',
    execution: 'Market',
    platform: 'MT4/MT5',
    popular: false,
  },
  {
    account: 'cTrader Raw',
    minDeposit: '$200',
    spread: 'From 0.0 pips',
    commission: '$3.00 per lot',
    leverage: 'Up to 1:500',
    execution: 'Market',
    platform: 'cTrader',
    popular: false,
  },
];

const generalConditions = [
  { condition: 'Minimum Trade Size', value: '0.01 lots (1,000 units)' },
  { condition: 'Maximum Trade Size', value: '100 lots per order' },
  { condition: 'Maximum Open Positions', value: '500 positions' },
  { condition: 'Hedging', value: 'Allowed' },
  { condition: 'Scalping', value: 'Allowed' },
  { condition: 'Expert Advisors', value: 'Allowed' },
  { condition: 'Stop Out Level', value: '20%' },
  { condition: 'Margin Call Level', value: '50%' },
];

const highlights = [
  {
    icon: TrendingUp,
    title: 'Competitive Spreads',
    description: 'Industry-leading spreads starting from 0.0 pips on major currency pairs',
  },
  {
    icon: Clock,
    title: 'Fast Execution',
    description: 'Average execution speed under 30ms with 99.9% order fill rate',
  },
  {
    icon: Shield,
    title: 'No Restrictions',
    description: 'Trade freely with no restrictions on scalping, hedging, or EAs',
  },
  {
    icon: Zap,
    title: 'High Leverage',
    description: 'Access leverage up to 1:500 to maximize your trading potential',
  },
];

export default function TradingConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Trading Conditions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transparent and competitive trading conditions across all account types. 
            No hidden fees, no surprises - just professional trading conditions.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {highlights.map((highlight, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <highlight.icon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-white">{highlight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {highlight.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Account Comparison */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Account Types Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Account Type</th>
                  <th className="text-left py-4 px-6 text-gray-300">Min Deposit</th>
                  <th className="text-left py-4 px-6 text-gray-300">Spread</th>
                  <th className="text-left py-4 px-6 text-gray-300">Commission</th>
                  <th className="text-left py-4 px-6 text-gray-300">Leverage</th>
                  <th className="text-left py-4 px-6 text-gray-300">Platform</th>
                </tr>
              </thead>
              <tbody>
                {tradingConditions.map((condition, index) => (
                  <tr key={index} className={`border-b border-gray-700 hover:bg-gray-700/50 ${condition.popular ? 'bg-green-900/20' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{condition.account}</span>
                        {condition.popular && <Badge className="bg-green-500 text-black text-xs">Popular</Badge>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-green-400 font-semibold">{condition.minDeposit}</td>
                    <td className="py-4 px-6 text-green-400 font-semibold">{condition.spread}</td>
                    <td className="py-4 px-6 text-gray-300">{condition.commission}</td>
                    <td className="py-4 px-6 text-white">{condition.leverage}</td>
                    <td className="py-4 px-6 text-white">{condition.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* General Trading Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-8">General Trading Conditions</h2>
            <div className="space-y-4">
              {generalConditions.map((condition, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-300">{condition.condition}</span>
                  <span className="text-white font-semibold">{condition.value}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Risk Management</CardTitle>
              <CardDescription className="text-gray-300">
                Advanced tools to protect your capital
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Stop Loss & Take Profit orders</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Trailing stops</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Negative balance protection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Margin call alerts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Position size calculator</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Our Conditions?</h2>
          <p className="text-gray-300 mb-6">
            Open your trading account and start benefiting from our competitive conditions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Trading Account
              </Button>
            </Link>
            <Link href="/trading/spreads">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                View Live Spreads
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}