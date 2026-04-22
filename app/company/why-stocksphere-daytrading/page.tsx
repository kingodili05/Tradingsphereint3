'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Clock, Award, Users, Globe, BarChart3, Zap } from 'lucide-react';
import Link from 'next/link';

const reasons = [
  {
    icon: TrendingUp,
    title: 'Advanced Technology',
    description: 'State-of-the-art trading infrastructure with lightning-fast execution and real-time data feeds from top liquidity providers.',
  },
  {
    icon: Shield,
    title: 'Regulated & Secure',
    description: 'Fully regulated by top-tier financial authorities with client fund protection, segregated accounts, and comprehensive insurance coverage.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support in multiple languages with dedicated account managers for professional traders.',
  },
  {
    icon: Award,
    title: 'Award-Winning Platform',
    description: 'Industry-recognized trading technology with multiple awards for innovation, execution quality, and customer satisfaction.',
  },
  {
    icon: Users,
    title: 'Trusted by Millions',
    description: 'Over 500,000 active traders trust our platform for their daily trading activities across global markets.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Access to global markets with competitive spreads, deep liquidity pools, and multi-asset trading capabilities.',
  },
  {
    icon: BarChart3,
    title: 'Professional Tools',
    description: 'Advanced charting, technical analysis, risk management tools, and automated trading capabilities.',
  },
  {
    icon: Zap,
    title: 'Ultra-Fast Execution',
    description: 'Lightning-fast order execution with average speeds under 30ms and 99.9% order fill rate.',
  },
];

const competitiveAdvantages = [
  'Spreads from 0.0 pips on major currency pairs',
  'No hidden fees or commission markups',
  'Leverage up to 1:500 for maximum flexibility',
  'Multiple trading platforms (MT4, MT5, cTrader)',
  'Advanced risk management and protection',
  'Comprehensive educational resources',
  'Professional market analysis and insights',
  'Institutional-grade trading infrastructure',
];

const clientTestimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Professional Trader',
    quote: 'StockSphereDaytrading has transformed my trading experience. The execution speed and platform reliability are unmatched.',
  },
  {
    name: 'Michael Chen',
    role: 'Portfolio Manager',
    quote: 'The multi-asset capabilities and professional tools make this platform perfect for institutional trading.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Day Trader',
    quote: 'Excellent spreads, fast execution, and outstanding customer support. Everything a trader needs in one platform.',
  },
];

export default function WhyStockSphereDaytradingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Why Choose StockSphereDaytrading?
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover what makes StockSphereDaytrading the preferred choice for traders worldwide. 
            Our platform combines cutting-edge technology with unmatched reliability and service.
          </p>
        </div>

        {/* Main Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
              <CardHeader>
                <reason.icon className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle className="text-white">{reason.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {reason.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Competitive Advantages */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Competitive Advantages</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">What Sets Us Apart</h3>
              <p className="text-gray-300 leading-relaxed">
                StockSphereDaytrading stands out in the crowded trading industry through our unwavering 
                commitment to transparency, innovation, and client success. We don't just provide a trading 
                platform – we deliver a comprehensive trading ecosystem designed for success.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our technology infrastructure is built on institutional-grade systems that ensure 
                reliability, speed, and security. We continuously invest in platform improvements 
                and new features to stay ahead of market demands.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-green-400">Key Benefits</h3>
              <div className="space-y-3">
                {competitiveAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clientTestimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-green-400">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Regulatory Information */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Regulation & Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Regulatory Oversight</h3>
              <div className="space-y-3 text-gray-300">
                <p>• Licensed and regulated by major financial authorities</p>
                <p>• Compliant with international financial regulations</p>
                <p>• Regular audits and compliance monitoring</p>
                <p>• Segregated client funds for maximum protection</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Client Protection</h3>
              <div className="space-y-3 text-gray-300">
                <p>• Comprehensive insurance coverage</p>
                <p>• Negative balance protection</p>
                <p>• Secure data encryption and storage</p>
                <p>• Regular security audits and updates</p>
              </div>
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
              <div className="font-semibold text-white">Excellence in Execution</div>
              <div className="text-sm text-gray-300">Trading Excellence 2024</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-gray-300 mb-6">
            Join thousands of successful traders who have chosen StockSphereDaytrading
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