'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Monitor, Smartphone, BarChart3, Code, Shield, Check } from 'lucide-react';
import Link from 'next/link';

const mt4Features = [
  'Advanced charting with 30+ indicators',
  'Expert Advisors (EAs) support',
  'One-click trading execution',
  'Multiple order types',
  'Market depth and Level II quotes',
  'Strategy tester for backtesting',
  'Custom indicators and scripts',
  'Mobile trading apps',
];

const platformHighlights = [
  {
    icon: BarChart3,
    title: 'Advanced Charting',
    description: 'Professional charts with 30+ technical indicators and drawing tools',
  },
  {
    icon: Code,
    title: 'Expert Advisors',
    description: 'Automated trading with custom EAs and algorithmic strategies',
  },
  {
    icon: Shield,
    title: 'Proven Reliability',
    description: 'Industry-standard platform trusted by millions of traders worldwide',
  },
  {
    icon: Smartphone,
    title: 'Mobile Trading',
    description: 'Trade on the go with MT4 mobile apps for iOS and Android',
  },
];

const downloadOptions = [
  {
    platform: 'Windows Desktop',
    description: 'Full-featured desktop application',
    icon: Monitor,
    size: '15.2 MB',
    requirements: 'Windows 7 or later',
  },
  {
    platform: 'iOS Mobile',
    description: 'iPhone and iPad application',
    icon: Smartphone,
    size: '45.8 MB',
    requirements: 'iOS 12.0 or later',
  },
  {
    platform: 'Android Mobile',
    description: 'Android smartphone and tablet app',
    icon: Smartphone,
    size: '28.4 MB',
    requirements: 'Android 5.0 or later',
  },
];

export default function MetaTrader4Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-blue-500 text-white px-4 py-2 text-lg">
            Industry Standard
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold">
            MetaTrader 4
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The world's most popular trading platform. Trusted by millions of traders globally 
            for its reliability, advanced features, and automated trading capabilities.
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

        {/* Features and Downloads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Platform Features</h2>
            <div className="space-y-4">
              {mt4Features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">System Requirements</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Windows:</strong> Windows 7 or later, 1GB RAM, 50MB disk space</p>
                <p><strong>Mobile:</strong> iOS 12.0+ or Android 5.0+</p>
                <p><strong>Internet:</strong> Stable internet connection required</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Download MetaTrader 4</h2>
            <div className="space-y-4">
              {downloadOptions.map((option, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <option.icon className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="font-semibold text-white">{option.platform}</h3>
                          <p className="text-sm text-gray-300">{option.description}</p>
                          <div className="text-xs text-gray-400 mt-1">
                            {option.size} • {option.requirements}
                          </div>
                        </div>
                      </div>
                      <Button className="bg-green-500 hover:bg-green-600 text-black">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Trading Specifications */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">MT4 Trading Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">200+</div>
              <div className="text-gray-300">Trading Instruments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">&lt;30ms</div>
              <div className="text-gray-300">Execution Speed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">1:500</div>
              <div className="text-gray-300">Maximum Leverage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24/5</div>
              <div className="text-gray-300">Trading Hours</div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Getting Started with MT4</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-white mb-2">Download & Install</h3>
              <p className="text-gray-300 text-sm">Download MT4 for your device and complete the installation</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-white mb-2">Open Account</h3>
              <p className="text-gray-300 text-sm">Create your trading account and receive login credentials</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-white mb-2">Start Trading</h3>
              <p className="text-gray-300 text-sm">Fund your account and begin trading with MT4</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Trade with MT4?</h2>
          <p className="text-gray-300 mb-6">
            Join millions of traders using MetaTrader 4 for professional trading
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open MT4 Account
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
              <Download className="h-4 w-4 mr-2" />
              Download MT4
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}