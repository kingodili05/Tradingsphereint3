'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Globe, Award, Shield, Clock } from 'lucide-react';
import Link from 'next/link';

const companyStats = [
  { label: 'Founded', value: '2015' },
  { label: 'Active Traders', value: '500K+' },
  { label: 'Countries Served', value: '120+' },
  { label: 'Daily Volume', value: '$2.5B+' },
];

const milestones = [
  {
    year: '2015',
    title: 'Company Founded',
    description: 'TradingSphereIntl was established with a vision to democratize global trading',
  },
  {
    year: '2017',
    title: 'Regulatory Approval',
    description: 'Obtained licenses from major financial regulators worldwide',
  },
  {
    year: '2019',
    title: '100K Traders',
    description: 'Reached milestone of 100,000 active traders on our platform',
  },
  {
    year: '2021',
    title: 'Multi-Asset Platform',
    description: 'Expanded to offer crypto, stocks, and commodities trading',
  },
  {
    year: '2023',
    title: 'Global Expansion',
    description: 'Launched services in 120+ countries with local support',
  },
  {
    year: '2025',
    title: 'Industry Leader',
    description: 'Recognized as a leading global trading platform with 500K+ traders',
  },
];

const values = [
  {
    icon: Shield,
    title: 'Security First',
    description: 'We prioritize the security of our clients\' funds and personal information above all else.',
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description: 'Continuously improving our platform with cutting-edge technology and features.',
  },
  {
    icon: Users,
    title: 'Client Success',
    description: 'Our success is measured by the success of our traders and their achievements.',
  },
  {
    icon: Globe,
    title: 'Global Accessibility',
    description: 'Making professional trading accessible to traders worldwide, regardless of location.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            About TradingSphereIntl
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We are a leading global trading platform committed to providing professional traders 
            and institutions with advanced technology, competitive conditions, and exceptional service.
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

        {/* Mission Statement */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            To empower traders worldwide with professional-grade trading technology, 
            transparent pricing, and exceptional service. We believe that everyone should have 
            access to the same institutional-quality tools and conditions used by professional traders.
          </p>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 text-center">
                <CardHeader>
                  <value.icon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <CardTitle className="text-white">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Timeline */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                  <p className="text-gray-300">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">John Smith</h3>
              <p className="text-green-400 text-sm mb-2">Chief Executive Officer</p>
              <p className="text-gray-300 text-sm">
                20+ years in financial services and fintech innovation
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Sarah Johnson</h3>
              <p className="text-green-400 text-sm mb-2">Chief Technology Officer</p>
              <p className="text-gray-300 text-sm">
                Former Goldman Sachs technology executive with expertise in trading systems
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Michael Chen</h3>
              <p className="text-green-400 text-sm mb-2">Chief Risk Officer</p>
              <p className="text-gray-300 text-sm">
                Risk management expert with 15+ years at major investment banks
              </p>
            </div>
          </div>
        </div>

        {/* Awards and Recognition */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Awards & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="font-semibold text-white">Best Trading Platform</div>
              <div className="text-sm text-gray-300">FinTech Awards 2024</div>
            </div>
            <div className="text-center p-4">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="font-semibold text-white">Most Innovative Broker</div>
              <div className="text-sm text-gray-300">Trading Awards 2023</div>
            </div>
            <div className="text-center p-4">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="font-semibold text-white">Best Customer Service</div>
              <div className="text-sm text-gray-300">Broker Choice 2023</div>
            </div>
            <div className="text-center p-4">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="font-semibold text-white">Top Security Standards</div>
              <div className="text-sm text-gray-300">Security Excellence 2024</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-gray-300 mb-6">
            Become part of our global trading community and experience the TradingSphereIntl difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open Trading Account
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}