'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bitcoin,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Globe,
} from 'lucide-react';

const features = [
  {
    icon: Bitcoin,
    title: 'Multi-Asset Trading',
    description:
      'Trade Crypto, Forex, ETFs, Stocks, and Commodities all in one platform',
  },
  {
    icon: TrendingUp,
    title: 'Advanced Analytics',
    description:
      'Professional charts, technical indicators, and real-time market data',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description:
      'Your funds and data are protected by industry-leading security measures',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Execution',
    description:
      'Execute trades in milliseconds with our high-performance infrastructure',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Management',
    description:
      'Track performance, analyze risk, and optimize your investment strategy',
  },
  {
    icon: Globe,
    title: 'Global Markets',
    description:
      '24/7 access to markets worldwide with competitive spreads and fees',
  },
];

export function FeaturesSection() {

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Why Choose TradingSphereIntl?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to succeed in today's financial markets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
