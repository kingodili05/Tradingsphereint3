'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, BarChart3, Shield, Globe, Zap } from 'lucide-react';
import Link from 'next/link';

const commodities = [
  { symbol: 'GOLD', name: 'Gold', price: '$2,045.30', spread: '0.35', volume: '$12.5B', change: '+0.8%', trend: 'up', category: 'Precious Metals' },
  { symbol: 'SILVER', name: 'Silver', price: '$24.85', spread: '0.06', volume: '$2.1B', change: '+1.1%', trend: 'up', category: 'Precious Metals' },
  { symbol: 'OIL', name: 'Crude Oil WTI', price: '$78.45', spread: '0.08', volume: '$8.9B', change: '-1.2%', trend: 'down', category: 'Energy' },
  { symbol: 'BRENT', name: 'Brent Crude Oil', price: '$82.15', spread: '0.08', volume: '$7.2B', change: '-0.9%', trend: 'down', category: 'Energy' },
  { symbol: 'NATGAS', name: 'Natural Gas', price: '$2.89', spread: '0.06', volume: '$3.4B', change: '+2.1%', trend: 'up', category: 'Energy' },
  { symbol: 'COPPER', name: 'Copper', price: '$3.89', spread: '0.05', volume: '$1.8B', change: '+0.5%', trend: 'up', category: 'Industrial Metals' },
  { symbol: 'WHEAT', name: 'Wheat', price: '$6.45', spread: '0.12', volume: '$890M', change: '+1.8%', trend: 'up', category: 'Agriculture' },
  { symbol: 'CORN', name: 'Corn', price: '$4.78', spread: '0.10', volume: '$1.2B', change: '-0.3%', trend: 'down', category: 'Agriculture' },
];

const commodityFeatures = [
  {
    icon: Coins,
    title: 'Diverse Asset Classes',
    description: 'Trade precious metals, energy, industrial metals, and agricultural commodities',
  },
  {
    icon: TrendingUp,
    title: 'Inflation Hedge',
    description: 'Commodities often serve as a hedge against inflation and currency devaluation',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Diversification',
    description: 'Add commodities to your portfolio for better risk distribution and returns',
  },
  {
    icon: Shield,
    title: 'Physical Asset Backing',
    description: 'Commodities are backed by real physical assets with intrinsic value',
  },
  {
    icon: Globe,
    title: 'Global Market Access',
    description: 'Access major commodity exchanges worldwide with competitive pricing',
  },
  {
    icon: Zap,
    title: 'High Volatility',
    description: 'Benefit from price volatility and trading opportunities in commodity markets',
  },
];

const commodityCategories = [
  {
    name: 'Precious Metals',
    description: 'Gold, Silver, Platinum, Palladium',
    assets: 4,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  {
    name: 'Energy',
    description: 'Crude Oil, Natural Gas, Heating Oil',
    assets: 6,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    name: 'Industrial Metals',
    description: 'Copper, Aluminum, Zinc, Nickel',
    assets: 5,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    name: 'Agriculture',
    description: 'Wheat, Corn, Soybeans, Coffee',
    assets: 8,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
];

export default function CommoditiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Commodity Trading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trade precious metals, energy, and agricultural commodities with competitive spreads 
            and professional execution. Diversify your portfolio with real asset exposure.
          </p>
        </div>

        {/* Commodity Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {commodityCategories.map((category, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
              <CardHeader>
                <div className={`h-12 w-12 ${category.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Coins className={`h-6 w-6 ${category.color}`} />
                </div>
                <CardTitle className="text-white">{category.name}</CardTitle>
                <CardDescription className="text-gray-300">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{category.assets} Assets Available</span>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-black">
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Commodity Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {commodityFeatures.map((feature, index) => (
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

        {/* Live Commodity Prices */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Live Commodity Prices</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Commodity</th>
                  <th className="text-left py-4 px-6 text-gray-300">Price</th>
                  <th className="text-left py-4 px-6 text-gray-300">Spread</th>
                  <th className="text-left py-4 px-6 text-gray-300">Volume</th>
                  <th className="text-left py-4 px-6 text-gray-300">24h Change</th>
                  <th className="text-left py-4 px-6 text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {commodities.map((commodity, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-white">{commodity.symbol}</div>
                        <div className="text-sm text-gray-400">{commodity.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">{commodity.category}</Badge>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-semibold">{commodity.price}</td>
                    <td className="py-4 px-6 text-green-400">{commodity.spread}</td>
                    <td className="py-4 px-6 text-gray-300">{commodity.volume}</td>
                    <td className="py-4 px-6">
                      <span className={`${commodity.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {commodity.change}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link href={`/markets/commodities/${commodity.symbol}`}>
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

        {/* Why Trade Commodities */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Trade Commodities?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-400">Investment Benefits</h3>
              <div className="space-y-3 text-gray-300">
                <p>• <strong>Inflation Protection:</strong> Commodities often rise with inflation, protecting purchasing power</p>
                <p>• <strong>Portfolio Diversification:</strong> Low correlation with stocks and bonds improves risk distribution</p>
                <p>• <strong>Global Demand:</strong> Essential materials with consistent global demand and consumption</p>
                <p>• <strong>Currency Hedge:</strong> Protection against currency devaluation and economic uncertainty</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-400">Trading Advantages</h3>
              <div className="space-y-3 text-gray-300">
                <p>• <strong>High Volatility:</strong> Significant price movements create trading opportunities</p>
                <p>• <strong>Leverage Available:</strong> Trade with leverage up to 1:200 for increased exposure</p>
                <p>• <strong>Multiple Markets:</strong> Access to global commodity exchanges and pricing</p>
                <p>• <strong>Professional Tools:</strong> Advanced charting and analysis tools for commodity trading</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Commodity Trading</h2>
          <p className="text-gray-300 mb-6">
            Diversify your portfolio with commodity investments and hedge against market volatility
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Trading Account
              </Button>
            </Link>
            <Link href="/education/advantages-of-commodities">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Learn About Commodities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}