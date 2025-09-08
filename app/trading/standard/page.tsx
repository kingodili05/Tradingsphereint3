'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, BookOpen, Headphones, Check, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const features = [
  'No commission trading',
  'User-friendly trading platform',
  'Educational resources and webinars',
  'Standard customer support',
  'Mobile trading app',
  'Basic risk management tools',
  'Market analysis and insights',
  'Demo account included',
];

const standardSpreads = [
  { pair: 'EUR/USD', spread: '1.0 pips', volume: 'High' },
  { pair: 'GBP/USD', spread: '1.2 pips', volume: 'High' },
  { pair: 'USD/JPY', spread: '1.1 pips', volume: 'High' },
  { pair: 'AUD/USD', spread: '1.4 pips', volume: 'Medium' },
  { pair: 'USD/CAD', spread: '1.5 pips', volume: 'Medium' },
  { pair: 'NZD/USD', spread: '1.8 pips', volume: 'Medium' },
];

const benefits = [
  {
    icon: Users,
    title: 'Beginner Friendly',
    description: 'Perfect for new traders with simplified interface and educational support',
  },
  {
    icon: Heart,
    title: 'No Commission',
    description: 'Trade without worrying about commission fees - costs are built into spreads',
  },
  {
    icon: BookOpen,
    title: 'Educational Resources',
    description: 'Access comprehensive learning materials and trading guides',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Get help when you need it with our standard customer support',
  },
];

export default function StandardAccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-blue-500 text-white px-4 py-2 text-lg">
            Beginner Friendly
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold">
            Standard Trading Account
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start your trading journey with our Standard account. No commissions, 
            educational support, and everything you need to begin trading successfully.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <benefit.icon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-white">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Account Specifications</CardTitle>
              <CardDescription className="text-gray-300">
                Simple and transparent trading conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">$50</div>
                  <div className="text-sm text-gray-300">Minimum Deposit</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">1:400</div>
                  <div className="text-sm text-gray-300">Maximum Leverage</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">1.0</div>
                  <div className="text-sm text-gray-300">Minimum Spread</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">$0</div>
                  <div className="text-sm text-gray-300">Commission</div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Platform</span>
                  <span className="text-white font-semibold">MetaTrader 4/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Order Execution</span>
                  <span className="text-white font-semibold">Market Execution</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Hedging</span>
                  <span className="text-white font-semibold">Allowed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Scalping</span>
                  <span className="text-white font-semibold">Allowed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Expert Advisors</span>
                  <span className="text-white font-semibold">Supported</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Account Features</h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Perfect For:</h3>
              <div className="space-y-2 text-gray-300">
                <p>• New traders learning the markets</p>
                <p>• Casual traders with smaller account sizes</p>
                <p>• Those who prefer commission-free trading</p>
                <p>• Traders who value educational support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Spreads Table */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Standard Account Spreads</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Currency Pair</th>
                  <th className="text-left py-4 px-6 text-gray-300">Typical Spread</th>
                  <th className="text-left py-4 px-6 text-gray-300">Trading Volume</th>
                </tr>
              </thead>
              <tbody>
                {standardSpreads.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-6 font-semibold text-white">{item.pair}</td>
                    <td className="py-4 px-6 text-green-400 font-semibold">{item.spread}</td>
                    <td className="py-4 px-6 text-gray-300">{item.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Trading Journey</h2>
          <p className="text-gray-300 mb-6">
            Open your Standard account today and begin trading with confidence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Standard Account
              </Button>
            </Link>
            <Link href="/demo-account">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Try Demo Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}