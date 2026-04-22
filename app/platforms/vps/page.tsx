'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, Zap, Shield, Clock, Check, Globe } from 'lucide-react';
import Link from 'next/link';

const vpsPlans = [
  {
    name: 'Basic VPS',
    price: '$19',
    period: '/month',
    description: 'Perfect for basic EA trading',
    specs: {
      cpu: '1 vCPU',
      ram: '1GB RAM',
      storage: '20GB SSD',
      bandwidth: '1TB',
    },
    features: [
      'Windows Server 2019',
      'MetaTrader 4/5 pre-installed',
      '99.9% uptime guarantee',
      'Basic support',
    ],
    popular: false,
  },
  {
    name: 'Professional VPS',
    price: '$39',
    period: '/month',
    description: 'Ideal for multiple EAs',
    specs: {
      cpu: '2 vCPU',
      ram: '4GB RAM',
      storage: '40GB SSD',
      bandwidth: '2TB',
    },
    features: [
      'Windows Server 2019',
      'MetaTrader 4/5 pre-installed',
      '99.9% uptime guarantee',
      'Priority support',
      'Multiple EA support',
      'Enhanced security',
    ],
    popular: true,
  },
  {
    name: 'Enterprise VPS',
    price: '$79',
    period: '/month',
    description: 'For high-frequency trading',
    specs: {
      cpu: '4 vCPU',
      ram: '8GB RAM',
      storage: '80GB SSD',
      bandwidth: '5TB',
    },
    features: [
      'Windows Server 2019',
      'MetaTrader 4/5 pre-installed',
      '99.99% uptime guarantee',
      'Dedicated support',
      'Ultra-low latency',
      'Custom configurations',
    ],
    popular: false,
  },
];

const vpsAdvantages = [
  {
    icon: Clock,
    title: '24/7 Operation',
    description: 'Your EAs run continuously without interruption, even when your computer is off',
  },
  {
    icon: Zap,
    title: 'Ultra-Low Latency',
    description: 'VPS located near trading servers for fastest possible execution speeds',
  },
  {
    icon: Shield,
    title: 'Enhanced Security',
    description: 'Secure environment with regular backups and enterprise-grade protection',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Access your trading environment from anywhere in the world',
  },
];

export default function VPSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-purple-500 text-white px-4 py-2 text-lg">
            Professional Hosting
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold">
            Virtual Private Server
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Host your Expert Advisors and trading platforms on our high-performance VPS. 
            Ensure 24/7 operation with ultra-low latency and maximum reliability.
          </p>
        </div>

        {/* VPS Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {vpsAdvantages.map((advantage, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <advantage.icon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
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

        {/* VPS Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {vpsPlans.map((plan, index) => (
            <Card key={index} className={`bg-gray-800 border-gray-700 ${plan.popular ? 'border-purple-500 scale-105' : ''} relative`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                <div className="text-4xl font-bold text-white mt-4">
                  {plan.price}
                  <span className="text-lg text-gray-400">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Server Specifications:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-300">CPU: {plan.specs.cpu}</div>
                    <div className="text-gray-300">RAM: {plan.specs.ram}</div>
                    <div className="text-gray-300">Storage: {plan.specs.storage}</div>
                    <div className="text-gray-300">Bandwidth: {plan.specs.bandwidth}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Included Features:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
                >
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* VPS Locations */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">VPS Server Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-purple-400 mb-2">New York</div>
              <div className="text-sm text-gray-300">Ultra-low latency to US markets</div>
              <div className="text-xs text-green-400 mt-1">&lt; 1ms to NYSE</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-purple-400 mb-2">London</div>
              <div className="text-sm text-gray-300">Optimal for European trading</div>
              <div className="text-xs text-green-400 mt-1">&lt; 2ms to LSE</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-purple-400 mb-2">Tokyo</div>
              <div className="text-sm text-gray-300">Perfect for Asian markets</div>
              <div className="text-xs text-green-400 mt-1">&lt; 1ms to TSE</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-purple-400 mb-2">Singapore</div>
              <div className="text-sm text-gray-300">Gateway to Asian markets</div>
              <div className="text-xs text-green-400 mt-1">&lt; 2ms to SGX</div>
            </div>
          </div>
        </div>

        {/* Setup Process */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">VPS Setup Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-white mb-2">Choose Plan</h3>
              <p className="text-gray-300 text-sm">Select the VPS plan that fits your needs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-white mb-2">Instant Setup</h3>
              <p className="text-gray-300 text-sm">Your VPS is configured automatically</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-white mb-2">Install EAs</h3>
              <p className="text-gray-300 text-sm">Upload and configure your Expert Advisors</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
              <h3 className="font-semibold text-white mb-2">24/7 Trading</h3>
              <p className="text-gray-300 text-sm">Your EAs run continuously</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Your Trading VPS Today</h2>
          <p className="text-gray-300 mb-6">
            Ensure your Expert Advisors run 24/7 with our professional VPS hosting
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Order VPS Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}