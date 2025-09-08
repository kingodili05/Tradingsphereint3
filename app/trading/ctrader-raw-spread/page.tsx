'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Zap, BarChart3, Code, Check, Download } from 'lucide-react';
import Link from 'next/link';

const cTraderFeatures = [
  'Level II pricing and market depth',
  'Advanced charting with 70+ indicators',
  'Algorithmic trading with cBots',
  'One-click trading execution',
  'Advanced order management',
  'Risk management tools',
  'Social trading features',
  'Multi-asset trading',
];

const platformHighlights = [
  {
    icon: Monitor,
    title: 'Professional Interface',
    description: 'Intuitive and customizable trading interface designed for professionals',
  },
  {
    icon: Zap,
    title: 'Ultra-Fast Execution',
    description: 'Market-leading execution speeds with no requotes or rejections',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive market analysis tools and real-time data feeds',
  },
  {
    icon: Code,
    title: 'Algorithmic Trading',
    description: 'Build and deploy automated trading strategies with cBots',
  },
];

export default function CTraderRawSpreadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-blue-500 text-white px-4 py-2 text-lg">
            Advanced Platform
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold">
            cTrader Raw Spread Account
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience next-generation trading with cTrader's advanced platform. 
            Raw spreads, professional tools, and algorithmic trading capabilities.
          </p>
        </div>

        {/* Platform Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {platformHighlights.map((highlight, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <highlight.icon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
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

        {/* Account Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Account Specifications</CardTitle>
              <CardDescription className="text-gray-300">
                Professional trading conditions for serious traders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">$200</div>
                  <div className="text-sm text-gray-300">Minimum Deposit</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">1:500</div>
                  <div className="text-sm text-gray-300">Maximum Leverage</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">0.0</div>
                  <div className="text-sm text-gray-300">Minimum Spread</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">$3.00</div>
                  <div className="text-sm text-gray-300">Commission per Lot</div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Platform</span>
                  <span className="text-white font-semibold">cTrader</span>
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
                  <span className="text-white font-semibold">cBots Supported</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Why Choose cTrader?</h2>
            <div className="space-y-4">
              {cTraderFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Platform Downloads</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  cTrader Desktop (Windows)
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  cTrader Mobile (iOS/Android)
                </Button>
                <Link href="/platforms/ctrader-web">
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-gray-700">
                    <Monitor className="h-4 w-4 mr-2" />
                    cTrader Web (Browser)
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Spread Comparison */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Live Spreads & Costs</h2>
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
                    <td className="py-4 px-6 text-blue-400">{item.rawSpread} pips</td>
                    <td className="py-4 px-6 text-gray-300">{item.commission}</td>
                    <td className="py-4 px-6 text-green-400 font-semibold">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Professional Trading?</h2>
          <p className="text-gray-300 mb-6">
            Open your cTrader Raw Spread account and experience institutional-grade trading
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open cTrader Account
              </Button>
            </Link>
            <Link href="/platforms/ctrader">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Learn More About cTrader
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}