'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, Zap, Award } from 'lucide-react';
import Link from 'next/link';

const accountTypes = [
  {
    name: 'Raw Spread',
    minDeposit: '$100',
    spread: 'From 0.0 pips',
    commission: '$3.50 per lot',
    leverage: 'Up to 1:500',
    features: [
      'Raw interbank spreads',
      'Professional execution',
      'Advanced trading tools',
      'Priority support',
    ],
    popular: true,
    description: 'Perfect for professional traders who want the tightest spreads',
  },
  {
    name: 'Standard',
    minDeposit: '$50',
    spread: 'From 1.0 pips',
    commission: 'No commission',
    leverage: 'Up to 1:400',
    features: [
      'No commission trading',
      'User-friendly platform',
      'Educational resources',
      'Standard support',
    ],
    popular: false,
    description: 'Ideal for beginners and casual traders',
  },
  {
    name: 'cTrader Raw Spread',
    minDeposit: '$200',
    spread: 'From 0.0 pips',
    commission: '$3.00 per lot',
    leverage: 'Up to 1:500',
    features: [
      'cTrader platform access',
      'Level II pricing',
      'Advanced order types',
      'Algorithmic trading',
    ],
    popular: false,
    description: 'Advanced platform for sophisticated trading strategies',
  },
];

const accountFeatures = [
  {
    icon: TrendingUp,
    title: 'Competitive Spreads',
    description: 'Get access to institutional-grade pricing with spreads starting from 0.0 pips',
  },
  {
    icon: Shield,
    title: 'Regulated & Secure',
    description: 'Your funds are protected by top-tier regulation and segregated accounts',
  },
  {
    icon: Zap,
    title: 'Fast Execution',
    description: 'Lightning-fast order execution with average speeds under 30 milliseconds',
  },
  {
    icon: Award,
    title: 'Award-Winning Service',
    description: 'Industry-recognized customer service and trading technology',
  },
];

export default function AccountsOverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Trading Accounts Overview
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the trading account that best fits your trading style and experience level. 
            All accounts come with professional tools and dedicated support.
          </p>
        </div>

        {/* Account Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {accountTypes.map((account, index) => (
            <Card key={index} className={`bg-gray-800 border-gray-700 ${account.popular ? 'border-green-500 scale-105' : ''} relative`}>
              {account.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-black px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl">{account.name}</CardTitle>
                <CardDescription className="text-gray-300">{account.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Minimum Deposit</span>
                    <span className="font-bold text-green-400">{account.minDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Spread</span>
                    <span className="font-bold text-green-400">{account.spread}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Commission</span>
                    <span className="font-bold text-white">{account.commission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Leverage</span>
                    <span className="font-bold text-white">{account.leverage}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {account.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-gray-300">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href="/auth/signup">
                  <Button 
                    className={`w-full ${account.popular ? 'bg-green-500 hover:bg-green-600 text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                  >
                    Open {account.name} Account
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {accountFeatures.map((feature, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-green-500 mx-auto mb-2" />
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

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-gray-300 mb-6">
            Open your trading account today and join thousands of successful traders
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Live Account
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