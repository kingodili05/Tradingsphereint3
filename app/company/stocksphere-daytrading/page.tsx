'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Globe, Award, Shield, Clock, BarChart3, Zap } from 'lucide-react';
import Link from 'next/link';

const platformFeatures = [
  {
    icon: TrendingUp,
    title: 'Advanced Trading Technology',
    description: 'State-of-the-art trading infrastructure with lightning-fast execution and real-time market data',
  },
  {
    icon: Shield,
    title: 'Regulated & Secure',
    description: 'Fully regulated by top-tier financial authorities with comprehensive client protection',
  },
  {
    icon: Globe,
    title: 'Global Market Access',
    description: 'Trade across multiple asset classes including Forex, Crypto, Stocks, and Commodities',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support with dedicated account managers',
  },
  {
    icon: BarChart3,
    title: 'Professional Analytics',
    description: 'Advanced charting tools, technical indicators, and market analysis',
  },
  {
    icon: Zap,
    title: 'Lightning Execution',
    description: 'Ultra-fast order execution with average speeds under 30 milliseconds',
  },
];

const tradingAdvantages = [
  'Multi-asset trading platform',
  'Competitive spreads and low fees',
  'Advanced risk management tools',
  'Professional trading platforms',
  'Educational resources and support',
  'Regulated and secure environment',
  'Multiple account types available',
  '24/7 customer support',
];

const companyStats = [
  { label: 'Active Traders', value: '500K+' },
  { label: 'Daily Volume', value: '$2.5B+' },
  { label: 'Countries Served', value: '120+' },
  { label: 'Years of Experience', value: '10+' },
];

export default function StockSphereDaytradingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            StockSphereDaytrading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your gateway to global financial markets. Experience professional trading 
            with advanced technology, competitive conditions, and exceptional service.
          </p>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {companyStats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Platform Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
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
        </div>

        {/* What Makes Us Different */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Makes StockSphereDaytrading Different</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">Our Commitment</h3>
              <p className="text-gray-300 leading-relaxed">
                At StockSphereDaytrading, we believe that everyone should have access to professional-grade 
                trading tools and institutional-quality market conditions. Our platform combines cutting-edge 
                technology with transparent pricing to deliver an exceptional trading experience.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We are committed to providing our clients with the tools, education, and support they need 
                to succeed in today's dynamic financial markets. Whether you're a beginner or a professional 
                trader, our platform adapts to your needs.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-green-400">Trading Advantages</h3>
              <div className="space-y-3">
                {tradingAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trading Categories */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Available Markets</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="text-2xl font-bold text-blue-400 mb-2">Forex</div>
              <div className="text-sm text-gray-300">50+ Currency Pairs</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="text-2xl font-bold text-orange-400 mb-2">Crypto</div>
              <div className="text-sm text-gray-300">25+ Digital Assets</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="text-2xl font-bold text-green-400 mb-2">Stocks</div>
              <div className="text-sm text-gray-300">100+ Blue Chips</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="text-2xl font-bold text-yellow-400 mb-2">Commodities</div>
              <div className="text-sm text-gray-300">15+ Raw Materials</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="text-2xl font-bold text-purple-400 mb-2">Indices</div>
              <div className="text-sm text-gray-300">20+ Global Indices</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience StockSphereDaytrading Today</h2>
          <p className="text-gray-300 mb-6">
            Join thousands of traders who trust StockSphereDaytrading for their trading needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Trading Account
              </Button>
            </Link>
            <Link href="/quickstart/why-stocksphere-daytrading">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}