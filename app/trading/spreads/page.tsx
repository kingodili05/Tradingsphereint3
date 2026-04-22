'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const forexSpreads = [
  { pair: 'EUR/USD', rawSpread: '0.0-0.2', standardSpread: '1.0', volume: 'Very High' },
  { pair: 'GBP/USD', rawSpread: '0.1-0.3', standardSpread: '1.2', volume: 'Very High' },
  { pair: 'USD/JPY', rawSpread: '0.0-0.2', standardSpread: '1.1', volume: 'Very High' },
  { pair: 'AUD/USD', rawSpread: '0.1-0.4', standardSpread: '1.4', volume: 'High' },
  { pair: 'USD/CAD', rawSpread: '0.2-0.5', standardSpread: '1.5', volume: 'High' },
  { pair: 'NZD/USD', rawSpread: '0.3-0.6', standardSpread: '1.8', volume: 'Medium' },
  { pair: 'EUR/GBP', rawSpread: '0.4-0.7', standardSpread: '1.9', volume: 'Medium' },
  { pair: 'GBP/JPY', rawSpread: '0.5-1.0', standardSpread: '2.1', volume: 'Medium' },
];

const commoditySpreads = [
  { asset: 'Gold (XAU/USD)', rawSpread: '0.12-0.25', standardSpread: '0.35', unit: 'USD per oz' },
  { asset: 'Silver (XAG/USD)', rawSpread: '0.02-0.04', standardSpread: '0.06', unit: 'USD per oz' },
  { asset: 'Crude Oil (WTI)', rawSpread: '0.03-0.05', standardSpread: '0.08', unit: 'USD per barrel' },
  { asset: 'Natural Gas', rawSpread: '0.02-0.04', standardSpread: '0.06', unit: 'USD per MMBtu' },
];

const indicesSpreads = [
  { index: 'US30 (Dow Jones)', rawSpread: '1.0-2.0', standardSpread: '2.5', unit: 'Points' },
  { index: 'SPX500 (S&P 500)', rawSpread: '0.4-0.8', standardSpread: '1.2', unit: 'Points' },
  { index: 'NAS100 (NASDAQ)', rawSpread: '1.0-2.0', standardSpread: '2.5', unit: 'Points' },
  { index: 'UK100 (FTSE)', rawSpread: '1.0-1.5', standardSpread: '2.0', unit: 'Points' },
  { index: 'GER30 (DAX)', rawSpread: '1.0-1.5', standardSpread: '2.0', unit: 'Points' },
];

export default function SpreadsPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  const handleRefresh = () => {
    setLastUpdated(new Date().toLocaleTimeString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Live Trading Spreads
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time spreads across all major asset classes. Our competitive pricing 
            ensures you get the best possible trading conditions.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-green-500 text-black">Live Data</Badge>
            <span className="text-sm text-gray-400">Last updated: {lastUpdated}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-green-400 hover:text-green-300"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="forex" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 mb-8">
            <TabsTrigger value="forex" className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black">
              Forex
            </TabsTrigger>
            <TabsTrigger value="commodities" className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black">
              Commodities
            </TabsTrigger>
            <TabsTrigger value="indices" className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black">
              Indices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forex">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Forex Spreads</CardTitle>
                <CardDescription className="text-gray-300">
                  Live spreads for major, minor, and exotic currency pairs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-4 px-6 text-gray-300">Currency Pair</th>
                        <th className="text-left py-4 px-6 text-gray-300">Raw Spread</th>
                        <th className="text-left py-4 px-6 text-gray-300">Standard Spread</th>
                        <th className="text-left py-4 px-6 text-gray-300">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forexSpreads.map((item, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-4 px-6 font-semibold text-white">{item.pair}</td>
                          <td className="py-4 px-6 text-green-400 font-semibold">{item.rawSpread} pips</td>
                          <td className="py-4 px-6 text-blue-400 font-semibold">{item.standardSpread} pips</td>
                          <td className="py-4 px-6 text-gray-300">{item.volume}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commodities">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Commodity Spreads</CardTitle>
                <CardDescription className="text-gray-300">
                  Competitive spreads on precious metals, energy, and agricultural products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-4 px-6 text-gray-300">Commodity</th>
                        <th className="text-left py-4 px-6 text-gray-300">Raw Spread</th>
                        <th className="text-left py-4 px-6 text-gray-300">Standard Spread</th>
                        <th className="text-left py-4 px-6 text-gray-300">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commoditySpreads.map((item, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-4 px-6 font-semibold text-white">{item.asset}</td>
                          <td className="py-4 px-6 text-green-400 font-semibold">{item.rawSpread}</td>
                          <td className="py-4 px-6 text-blue-400 font-semibold">{item.standardSpread}</td>
                          <td className="py-4 px-6 text-gray-300">{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="indices">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Index Spreads</CardTitle>
                <CardDescription className="text-gray-300">
                  Trade major stock market indices with competitive spreads
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-4 px-6 text-gray-300">Index</th>
                        <th className="text-left py-4 px-6 text-gray-300">Raw Spread</th>
                        <th className="text-left py-4 px-6 text-gray-300">Standard Spread</th>
                        <th className="text-left py-4 px-6 text-gray-300">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indicesSpreads.map((item, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-4 px-6 font-semibold text-white">{item.index}</td>
                          <td className="py-4 px-6 text-green-400 font-semibold">{item.rawSpread}</td>
                          <td className="py-4 px-6 text-blue-400 font-semibold">{item.standardSpread}</td>
                          <td className="py-4 px-6 text-gray-300">{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Important Notes */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Important Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Spread Information</h3>
              <ul className="space-y-1">
                <li>• Spreads are variable and may widen during news events</li>
                <li>• Raw spreads shown are typical during normal market conditions</li>
                <li>• Commission applies to Raw Spread accounts only</li>
                <li>• All times are in GMT</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Market Hours</h3>
              <ul className="space-y-1">
                <li>• Forex: Sunday 22:00 - Friday 22:00 GMT</li>
                <li>• Commodities: Monday 01:00 - Friday 22:00 GMT</li>
                <li>• Indices: Monday 01:00 - Friday 22:00 GMT</li>
                <li>• Spreads may vary outside normal trading hours</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Trading with Competitive Spreads</h2>
          <p className="text-gray-300 mb-6">
            Open your account today and benefit from our industry-leading spreads
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
              Open Trading Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}