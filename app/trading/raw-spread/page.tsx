'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, BarChart3, Shield, Check } from 'lucide-react';
import Link from 'next/link';

const features = [
  'Raw interbank spreads from 0.0 pips',
  'Professional-grade execution',
  'Advanced trading tools and indicators',
  'Level II market data',
  'Algorithmic trading support',
  'Priority customer support',
  'Risk management tools',
  'Multiple order types',
];

const spreadComparison = [
  { pair: 'EUR/USD', rawSpread: '0.0-0.2', commission: '$3.50', total: '0.35 pips' },
  { pair: 'GBP/USD', rawSpread: '0.1-0.3', commission: '$3.50', total: '0.45 pips' },
  { pair: 'USD/JPY', rawSpread: '0.0-0.2', commission: '$3.50', total: '0.35 pips' },
  { pair: 'AUD/USD', rawSpread: '0.1-0.4', commission: '$3.50', total: '0.55 pips' },
  { pair: 'USD/CAD', rawSpread: '0.2-0.5', commission: '$3.50', total: '0.65 pips' },
];

export default function RawSpreadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-green-500 text-black px-4 py-2 text-lg">
            Most Popular
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold">
            Raw Spread Account
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience institutional-grade trading with raw interbank spreads and transparent commission structure. 
            Perfect for professional traders and scalpers.
          </p>
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-gray-800 border-gray-700 text-center">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-white">Raw Spreads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">From 0.0 pips</div>
              <CardDescription className="text-gray-300">
                Direct market access
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-center">
            <CardHeader>
              <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-white">Execution Speed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">&lt; 30ms</div>
              <CardDescription className="text-gray-300">
                Lightning-fast fills
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-center">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-white">Leverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Up to 1:500</div>
              <CardDescription className="text-gray-300">
                Maximize your potential
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-center">
            <CardHeader>
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-white">Min Deposit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">$100</div>
              <CardDescription className="text-gray-300">
                Low barrier to entry
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-8">Account Features</h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Commission Structure</CardTitle>
              <CardDescription className="text-gray-300">
                Transparent pricing with no hidden fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">$3.50</div>
                  <div className="text-gray-300">per standard lot (round turn)</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Forex pairs</span>
                  <span className="text-white">$3.50 per lot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Gold/Silver</span>
                  <span className="text-white">$3.50 per lot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Indices</span>
                  <span className="text-white">$3.50 per lot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Commodities</span>
                  <span className="text-white">$3.50 per lot</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spread Comparison Table */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Live Spreads</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Currency Pair</th>
                  <th className="text-left py-4 px-6 text-gray-300">Raw Spread</th>
                  <th className="text-left py-4 px-6 text-gray-300">Commission</th>
                  <th className="text-left py-4 px-6 text-gray-300">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {spreadComparison.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-6 font-semibold text-white">{item.pair}</td>
                    <td className="py-4 px-6 text-green-400">{item.rawSpread} pips</td>
                    <td className="py-4 px-6 text-gray-300">{item.commission}</td>
                    <td className="py-4 px-6 text-green-400 font-semibold">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Open Your Raw Spread Account</h2>
          <p className="text-gray-300 mb-6">
            Start trading with institutional-grade spreads and professional execution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Live Account
              </Button>
            </Link>
            <Link href="/demo-account">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Try Demo First
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}