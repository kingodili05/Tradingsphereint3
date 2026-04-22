'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Monitor, Smartphone, Code, BarChart3, Zap, Check } from 'lucide-react';
import Link from 'next/link';

const cTraderFeatures = [
  'Level II pricing and market depth',
  'Advanced charting with 70+ indicators',
  'Algorithmic trading with cBots',
  'One-click trading execution',
  'Advanced order management',
  'Risk management tools',
  'Social trading features',
  'Multi-asset trading support',
];

const platformHighlights = [
  {
    icon: BarChart3,
    title: 'Professional Charting',
    description: '70+ indicators, advanced drawing tools, and multiple chart types',
  },
  {
    icon: Code,
    title: 'Algorithmic Trading',
    description: 'Build and deploy automated strategies with cBots and cAlgo',
  },
  {
    icon: Zap,
    title: 'Ultra-Fast Execution',
    description: 'Market-leading execution speeds with no requotes',
  },
  {
    icon: Monitor,
    title: 'Intuitive Interface',
    description: 'User-friendly design with customizable workspace',
  },
];

const cTraderAdvantages = [
  'No dealing desk intervention',
  'Transparent Level II pricing',
  'Advanced risk management',
  'Social trading community',
  'Copy trading functionality',
  'Advanced backtesting',
  'Multi-threading support',
  'Cloud-based synchronization',
];

const downloadOptions = [
  {
    platform: 'cTrader Desktop',
    description: 'Full-featured desktop application',
    icon: Monitor,
    size: '45.2 MB',
    requirements: 'Windows 7 or later',
  },
  {
    platform: 'cTrader Mobile',
    description: 'iOS and Android applications',
    icon: Smartphone,
    size: '38.4 MB',
    requirements: 'iOS 12.0+ / Android 5.0+',
  },
  {
    platform: 'cTrader Web',
    description: 'Browser-based trading platform',
    icon: Monitor,
    size: 'No download',
    requirements: 'Modern web browser',
  },
];

export default function CTraderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-blue-500 text-white px-4 py-2 text-lg">
            Professional Platform
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold">
            cTrader Platform
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience next-generation trading with cTrader's advanced platform. 
            Professional tools, algorithmic trading, and transparent execution.
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

        {/* Features and Advantages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Platform Features</h2>
            <div className="space-y-4">
              {cTraderFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold">cTrader Advantages</h2>
            <div className="space-y-4">
              {cTraderAdvantages.map((advantage, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-300">{advantage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Download cTrader</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {downloadOptions.map((option, index) => (
              <Card key={index} className="bg-gray-700 border-gray-600">
                <CardHeader className="text-center">
                  <option.icon className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <CardTitle className="text-white">{option.platform}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className="text-sm text-gray-400">Size: {option.size}</div>
                    <div className="text-sm text-gray-400">{option.requirements}</div>
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    {option.platform === 'cTrader Web' ? 'Launch Web' : 'Download'}
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
              <div className="text-3xl font-bold text-blue-400 mb-2">70+</div>
              <div className="text-gray-300">Technical Indicators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">26</div>
              <div className="text-gray-300">Timeframes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">∞</div>
              <div className="text-gray-300">Charts per Workspace</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">100+</div>
              <div className="text-gray-300">Drawing Tools</div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Getting Started with cTrader</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-white mb-2">Download Platform</h3>
              <p className="text-gray-300 text-sm">Choose your preferred cTrader platform and download</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-white mb-2">Open Account</h3>
              <p className="text-gray-300 text-sm">Create your cTrader account with competitive conditions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-white mb-2">Start Trading</h3>
              <p className="text-gray-300 text-sm">Fund your account and begin professional trading</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Professional Trading?</h2>
          <p className="text-gray-300 mb-6">
            Experience the power of cTrader with our competitive trading conditions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open cTrader Account
              </Button>
            </Link>
            <Link href="/platforms/ctrader-web">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Try cTrader Web
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}