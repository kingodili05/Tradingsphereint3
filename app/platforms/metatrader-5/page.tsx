'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Monitor, Smartphone, BarChart3, Code, TrendingUp, Check } from 'lucide-react';
import Link from 'next/link';

const mt5Features = [
  'Advanced charting with 80+ indicators',
  'Multi-asset trading platform',
  'Market depth and Level II quotes',
  'Economic calendar integration',
  'Advanced order management',
  'Strategy tester with optimization',
  'MQL5 programming language',
  'Copy trading functionality',
];

const platformHighlights = [
  {
    icon: BarChart3,
    title: 'Enhanced Charting',
    description: '80+ technical indicators and advanced analytical tools',
  },
  {
    icon: TrendingUp,
    title: 'Multi-Asset Trading',
    description: 'Trade Forex, Stocks, Commodities, and Indices on one platform',
  },
  {
    icon: Code,
    title: 'Advanced Programming',
    description: 'MQL5 language for sophisticated trading algorithms',
  },
  {
    icon: Monitor,
    title: 'Professional Interface',
    description: 'Intuitive and customizable trading environment',
  },
];

const mt5Advantages = [
  'More timeframes (21 vs 9 in MT4)',
  'Enhanced strategy tester',
  'Better order management system',
  'Improved mobile applications',
  'Economic calendar built-in',
  'Market depth display',
  'Copy trading features',
  'Multi-asset support',
];

const downloadOptions = [
  {
    platform: 'Windows Desktop',
    description: 'Full-featured desktop application',
    icon: Monitor,
    size: '18.5 MB',
    requirements: 'Windows 7 or later',
  },
  {
    platform: 'iOS Mobile',
    description: 'iPhone and iPad application',
    icon: Smartphone,
    size: '52.3 MB',
    requirements: 'iOS 12.0 or later',
  },
  {
    platform: 'Android Mobile',
    description: 'Android smartphone and tablet app',
    icon: Smartphone,
    size: '31.7 MB',
    requirements: 'Android 5.0 or later',
  },
];

export default function MetaTrader5Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-purple-500 text-white px-4 py-2 text-lg">
            Next Generation
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold">
            MetaTrader 5
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The next generation of the world's most popular trading platform. 
            Enhanced features, multi-asset trading, and advanced analytical tools.
          </p>
        </div>

        {/* Platform Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {platformHighlights.map((highlight, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <highlight.icon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
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

        {/* Features and Advantages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Platform Features</h2>
            <div className="space-y-4">
              {mt5Features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">MT5 vs MT4 Advantages</h2>
            <div className="space-y-4">
              {mt5Advantages.map((advantage, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span className="text-gray-300">{advantage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Download MetaTrader 5</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {downloadOptions.map((option, index) => (
              <Card key={index} className="bg-gray-700 border-gray-600">
                <CardHeader className="text-center">
                  <option.icon className="h-12 w-12 text-purple-500 mx-auto mb-2" />
                  <CardTitle className="text-white">{option.platform}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className="text-sm text-gray-400">File Size: {option.size}</div>
                    <div className="text-sm text-gray-400">{option.requirements}</div>
                  </div>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">21</div>
              <div className="text-gray-300">Timeframes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">80+</div>
              <div className="text-gray-300">Technical Indicators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">6</div>
              <div className="text-gray-300">Order Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">∞</div>
              <div className="text-gray-300">Charts per Window</div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">MT4 vs MT5 Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Feature</th>
                  <th className="text-left py-4 px-6 text-gray-300">MetaTrader 4</th>
                  <th className="text-left py-4 px-6 text-gray-300">MetaTrader 5</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">Timeframes</td>
                  <td className="py-4 px-6 text-gray-300">9</td>
                  <td className="py-4 px-6 text-purple-400 font-semibold">21</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">Technical Indicators</td>
                  <td className="py-4 px-6 text-gray-300">30+</td>
                  <td className="py-4 px-6 text-purple-400 font-semibold">80+</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">Order Types</td>
                  <td className="py-4 px-6 text-gray-300">4</td>
                  <td className="py-4 px-6 text-purple-400 font-semibold">6</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">Multi-Asset Trading</td>
                  <td className="py-4 px-6 text-gray-300">Limited</td>
                  <td className="py-4 px-6 text-purple-400 font-semibold">Full Support</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">Economic Calendar</td>
                  <td className="py-4 px-6 text-gray-300">External</td>
                  <td className="py-4 px-6 text-purple-400 font-semibold">Built-in</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the Future of Trading</h2>
          <p className="text-gray-300 mb-6">
            Open your MetaTrader 5 account and access next-generation trading technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open MT5 Account
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
              <Download className="h-4 w-4 mr-2" />
              Download MT5
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}