'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Globe, Clock, DollarSign, BarChart3, Shield, Check } from 'lucide-react';
import Link from 'next/link';

const forexAdvantages = [
  {
    icon: Globe,
    title: 'Largest Financial Market',
    description: 'The forex market is the world\'s largest financial market with over $7.5 trillion in daily trading volume',
    details: [
      'Unmatched liquidity ensures easy entry and exit',
      'Minimal slippage on major currency pairs',
      'Consistent market depth across trading sessions',
    ],
  },
  {
    icon: Clock,
    title: '24/5 Trading Hours',
    description: 'Trade around the clock from Sunday 22:00 GMT to Friday 22:00 GMT',
    details: [
      'Asian session: 22:00 - 08:00 GMT',
      'European session: 07:00 - 16:00 GMT',
      'US session: 13:00 - 22:00 GMT',
    ],
  },
  {
    icon: DollarSign,
    title: 'Low Transaction Costs',
    description: 'Competitive spreads with no hidden fees or commissions on most currency pairs',
    details: [
      'Spreads from 0.5 pips on EUR/USD',
      'No commission on standard accounts',
      'Transparent pricing structure',
    ],
  },
  {
    icon: BarChart3,
    title: 'High Leverage Available',
    description: 'Access leverage up to 1:500 to maximize your trading potential',
    details: [
      'Amplify your trading capital',
      'Trade larger positions with smaller deposits',
      'Flexible leverage options',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Profit from Both Directions',
    description: 'Make money whether currencies go up or down through long and short positions',
    details: [
      'Buy when you expect currency to strengthen',
      'Sell when you expect currency to weaken',
      'No restrictions on short selling',
    ],
  },
  {
    icon: Shield,
    title: 'Regulated Environment',
    description: 'Trade in a regulated and transparent market with proper oversight',
    details: [
      'Regulated by major financial authorities',
      'Transparent pricing and execution',
      'Client fund protection measures',
    ],
  },
];

const tradingSessions = [
  {
    session: 'Asian Session',
    time: '22:00 - 08:00 GMT',
    pairs: ['USD/JPY', 'AUD/USD', 'NZD/USD'],
    characteristics: 'Lower volatility, range-bound trading',
  },
  {
    session: 'European Session',
    time: '07:00 - 16:00 GMT',
    pairs: ['EUR/USD', 'GBP/USD', 'EUR/GBP'],
    characteristics: 'High volatility, trend movements',
  },
  {
    session: 'US Session',
    time: '13:00 - 22:00 GMT',
    pairs: ['EUR/USD', 'GBP/USD', 'USD/CAD'],
    characteristics: 'Highest volatility, major news releases',
  },
];

export default function AdvantagesOfForexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Advantages of Forex Trading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover why forex is the world's most popular trading market. 
            Learn about the unique advantages that make forex trading attractive to millions of traders worldwide.
          </p>
        </div>

        {/* Main Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {forexAdvantages.map((advantage, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <advantage.icon className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle className="text-white">{advantage.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {advantage.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {advantage.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trading Sessions */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Global Trading Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tradingSessions.map((session, index) => (
              <Card key={index} className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">{session.session}</CardTitle>
                  <CardDescription className="text-green-400 font-semibold">
                    {session.time}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Active Pairs:</h4>
                    <div className="flex flex-wrap gap-2">
                      {session.pairs.map((pair, pairIndex) => (
                        <span key={pairIndex} className="bg-gray-600 px-2 py-1 rounded text-sm text-gray-300">
                          {pair}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Characteristics:</h4>
                    <p className="text-gray-300 text-sm">{session.characteristics}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Start with Forex */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Start with Forex?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">Perfect for Beginners</h3>
              <p className="text-gray-300 leading-relaxed">
                Forex trading is an excellent starting point for new traders due to its accessibility, 
                educational resources, and the ability to start with small amounts. The market's 
                liquidity ensures that you can always enter and exit positions easily.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Start with as little as $100</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Demo accounts available for practice</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Comprehensive educational resources</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">24/7 customer support</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">Professional Opportunities</h3>
              <p className="text-gray-300 leading-relaxed">
                For experienced traders, forex offers unparalleled opportunities with its high 
                liquidity, leverage options, and 24/5 trading schedule. The market's size and 
                diversity provide countless trading strategies and opportunities.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Multiple trading strategies possible</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Scalping and high-frequency trading allowed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Advanced analytical tools available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">Institutional-grade execution</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Forex Trading?</h2>
          <p className="text-gray-300 mb-6">
            Take advantage of the world's largest financial market with our professional platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Forex Account
              </Button>
            </Link>
            <Link href="/quickstart/forex-trading">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Learn Forex Trading
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}