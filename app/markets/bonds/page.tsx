'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Shield, Globe, Check } from 'lucide-react';
import Link from 'next/link';

const bondTypes = [
  {
    title: 'Government Bonds',
    description: 'Treasury bonds from major economies',
    instruments: ['US 10-Year Treasury', 'German Bund', 'UK Gilt', 'Japanese Government Bond'],
    yield: '3.5% - 5.2%',
    risk: 'Low',
    color: 'text-blue-500',
  },
  {
    title: 'Corporate Bonds',
    description: 'Investment-grade corporate debt securities',
    instruments: ['Apple Inc. Bonds', 'Microsoft Corp. Bonds', 'Amazon Bonds', 'Google Bonds'],
    yield: '4.2% - 6.8%',
    risk: 'Medium',
    color: 'text-green-500',
  },
  {
    title: 'Municipal Bonds',
    description: 'Local government and municipal securities',
    instruments: ['California Muni Bonds', 'New York City Bonds', 'Texas State Bonds'],
    yield: '3.8% - 5.5%',
    risk: 'Low-Medium',
    color: 'text-purple-500',
  },
];

const bondFeatures = [
  'Fixed income investments',
  'Diversification benefits',
  'Regular interest payments',
  'Capital preservation',
  'Inflation protection options',
  'Tax advantages (municipal bonds)',
  'Professional bond analysis',
  'Secondary market trading',
];

const advantages = [
  {
    icon: Shield,
    title: 'Capital Preservation',
    description: 'Bonds offer more stable returns compared to stocks, helping preserve capital',
  },
  {
    icon: TrendingUp,
    title: 'Regular Income',
    description: 'Receive regular interest payments throughout the life of the bond',
  },
  {
    icon: Globe,
    title: 'Portfolio Diversification',
    description: 'Add stability to your portfolio with fixed-income securities',
  },
  {
    icon: Building2,
    title: 'Professional Management',
    description: 'Access institutional-grade bond trading with professional execution',
  },
];

export default function BondsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Bond Trading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Invest in government and corporate bonds for stable income and portfolio diversification. 
            Access a wide range of fixed-income securities with professional execution.
          </p>
        </div>

        {/* Bond Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {bondTypes.map((bond, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
              <CardHeader>
                <CardTitle className={`text-white ${bond.color}`}>{bond.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {bond.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Typical Yield</div>
                    <div className="font-semibold text-green-400">{bond.yield}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Risk Level</div>
                    <Badge variant={bond.risk === 'Low' ? 'default' : bond.risk === 'Medium' ? 'secondary' : 'destructive'}>
                      {bond.risk}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Available Instruments:</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    {bond.instruments.map((instrument, instIndex) => (
                      <li key={instIndex}>• {instrument}</li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full bg-green-500 hover:bg-green-600 text-black">
                  Trade {bond.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {advantages.map((advantage, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <advantage.icon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-white">{advantage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {advantage.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bond Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Why Trade Bonds?</h2>
            <div className="space-y-4">
              {bondFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Bond Trading Conditions</CardTitle>
              <CardDescription className="text-gray-300">
                Professional bond trading with institutional access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Minimum Investment</span>
                  <span className="text-white font-semibold">$1,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Settlement Period</span>
                  <span className="text-white font-semibold">T+1 to T+3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Interest Payments</span>
                  <span className="text-white font-semibold">Semi-annual</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Trading Hours</span>
                  <span className="text-white font-semibold">24/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Commission</span>
                  <span className="text-white font-semibold">0.1% - 0.25%</span>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-white mb-2">Bond Ratings Available:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400">AAA</Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400">AA</Badge>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">A</Badge>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">BBB</Badge>
                  <Badge variant="outline" className="text-orange-400 border-orange-400">BB</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Disclosure */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Bond Trading Risks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Interest Rate Risk</h3>
              <p>Bond prices move inversely to interest rates. Rising rates can decrease bond values.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Credit Risk</h3>
              <p>Risk that the bond issuer may default on interest payments or principal repayment.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Inflation Risk</h3>
              <p>Inflation can erode the purchasing power of fixed interest payments over time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Liquidity Risk</h3>
              <p>Some bonds may be difficult to sell quickly without affecting the price.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Bond Trading</h2>
          <p className="text-gray-300 mb-6">
            Add stability to your portfolio with our comprehensive bond trading platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Trading Account
              </Button>
            </Link>
            <Link href="/education/advantages-of-bonds">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Learn About Bonds
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}