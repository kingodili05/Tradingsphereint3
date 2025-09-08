'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Globe, Zap, Shield, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const webFeatures = [
  'No download required',
  'Cross-platform compatibility',
  'Real-time market data',
  'Advanced charting tools',
  'One-click trading',
  'Portfolio management',
  'Risk management tools',
  'Mobile-responsive design',
];

const browserSupport = [
  { browser: 'Google Chrome', version: '80+', recommended: true },
  { browser: 'Mozilla Firefox', version: '75+', recommended: true },
  { browser: 'Safari', version: '13+', recommended: false },
  { browser: 'Microsoft Edge', version: '80+', recommended: true },
];

const webAdvantages = [
  {
    icon: Globe,
    title: 'Universal Access',
    description: 'Trade from any device with a web browser - no installation needed',
  },
  {
    icon: Zap,
    title: 'Instant Access',
    description: 'Start trading immediately without waiting for downloads or updates',
  },
  {
    icon: Shield,
    title: 'Secure Trading',
    description: 'Bank-grade security with encrypted connections and secure authentication',
  },
  {
    icon: Monitor,
    title: 'Full Functionality',
    description: 'Complete trading features available directly in your browser',
  },
];

export default function CTraderWebPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-green-500 text-black px-4 py-2 text-lg">
            No Download Required
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold">
            cTrader Web
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional trading directly in your browser. Access all cTrader features 
            without downloads, installations, or compatibility issues.
          </p>
        </div>

        {/* Web Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {webAdvantages.map((advantage, index) => (
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

        {/* Features and Browser Support */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Web Platform Features</h2>
            <div className="space-y-4">
              {webFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">System Requirements</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Operating System:</strong> Any OS with modern browser</p>
                <p><strong>RAM:</strong> 4GB minimum, 8GB recommended</p>
                <p><strong>Internet:</strong> Stable broadband connection</p>
                <p><strong>Screen:</strong> 1024x768 minimum resolution</p>
              </div>
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Browser Compatibility</CardTitle>
              <CardDescription className="text-gray-300">
                Supported browsers for optimal performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {browserSupport.map((browser, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{browser.browser}</div>
                      <div className="text-sm text-gray-300">Version {browser.version}</div>
                    </div>
                    <Badge variant={browser.recommended ? 'default' : 'secondary'}>
                      {browser.recommended ? 'Recommended' : 'Supported'}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-400">
                  <strong>Tip:</strong> For the best experience, we recommend using Google Chrome or Firefox 
                  with hardware acceleration enabled.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Comparison */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">cTrader Web vs Desktop</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Feature</th>
                  <th className="text-left py-4 px-6 text-gray-300">cTrader Web</th>
                  <th className="text-left py-4 px-6 text-gray-300">cTrader Desktop</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">Installation Required</td>
                  <td className="py-4 px-6 text-green-400 font-semibold">No</td>
                  <td className="py-4 px-6 text-gray-300">Yes</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">Cross-Platform</td>
                  <td className="py-4 px-6 text-green-400 font-semibold">Yes</td>
                  <td className="py-4 px-6 text-gray-300">Windows Only</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">Automatic Updates</td>
                  <td className="py-4 px-6 text-green-400 font-semibold">Yes</td>
                  <td className="py-4 px-6 text-gray-300">Manual</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">Advanced Features</td>
                  <td className="py-4 px-6 text-blue-400 font-semibold">95%</td>
                  <td className="py-4 px-6 text-green-400 font-semibold">100%</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 px-6 text-white">Performance</td>
                  <td className="py-4 px-6 text-blue-400 font-semibold">Excellent</td>
                  <td className="py-4 px-6 text-green-400 font-semibold">Superior</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-white mb-2">Open Account</h3>
              <p className="text-gray-300 text-sm">Create your cTrader account</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-white mb-2">Launch Web Platform</h3>
              <p className="text-gray-300 text-sm">Click to access cTrader Web</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-white mb-2">Login</h3>
              <p className="text-gray-300 text-sm">Enter your account credentials</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">4</div>
              <h3 className="font-semibold text-white mb-2">Start Trading</h3>
              <p className="text-gray-300 text-sm">Begin trading immediately</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Launch cTrader Web Now</h2>
          <p className="text-gray-300 mb-6">
            Start trading immediately with our browser-based platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
              <ExternalLink className="h-4 w-4 mr-2" />
              Launch cTrader Web
            </Button>
            <Link href="/auth/signup">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Open Account First
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}