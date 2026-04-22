'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Code, TrendingUp, Zap, Check, Download } from 'lucide-react';
import Link from 'next/link';

const advancedTools = [
  {
    name: 'Advanced Chart Package',
    description: 'Professional charting tools with enhanced indicators',
    features: [
      '50+ additional technical indicators',
      'Advanced drawing tools',
      'Custom chart templates',
      'Multi-timeframe analysis',
    ],
    price: 'Free',
    category: 'Charting',
  },
  {
    name: 'Expert Advisor Studio',
    description: 'Visual EA builder for automated trading strategies',
    features: [
      'Drag-and-drop strategy builder',
      'No programming required',
      'Strategy optimization tools',
      'Backtesting capabilities',
    ],
    price: '$29/month',
    category: 'Automation',
  },
  {
    name: 'Risk Manager Pro',
    description: 'Advanced risk management and position sizing',
    features: [
      'Automatic position sizing',
      'Portfolio risk analysis',
      'Drawdown protection',
      'Risk/reward optimization',
    ],
    price: '$19/month',
    category: 'Risk Management',
  },
  {
    name: 'Market Scanner',
    description: 'Real-time market scanning and alerts',
    features: [
      'Custom market scans',
      'Real-time alerts',
      'Pattern recognition',
      'Opportunity identification',
    ],
    price: '$15/month',
    category: 'Analysis',
  },
];

const toolCategories = [
  {
    icon: BarChart3,
    title: 'Charting Tools',
    description: 'Enhanced charting capabilities with professional indicators',
    count: '15+ tools',
  },
  {
    icon: Code,
    title: 'Automation Tools',
    description: 'Expert Advisors and automated trading solutions',
    count: '10+ tools',
  },
  {
    icon: TrendingUp,
    title: 'Analysis Tools',
    description: 'Market analysis and scanning tools for better decisions',
    count: '8+ tools',
  },
  {
    icon: Zap,
    title: 'Execution Tools',
    description: 'Advanced order management and execution tools',
    count: '12+ tools',
  },
];

export default function MT4AdvancedToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-orange-500 text-black px-4 py-2 text-lg">
            Professional Tools
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold">
            MT4 Advanced Trading Tools
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Enhance your MetaTrader 4 experience with our suite of professional trading tools. 
            Advanced indicators, automated strategies, and risk management solutions.
          </p>
        </div>

        {/* Tool Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {toolCategories.map((category, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-center">
              <CardHeader>
                <category.icon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <CardTitle className="text-white">{category.title}</CardTitle>
                <Badge variant="secondary" className="mt-2">{category.count}</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advanced Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {advancedTools.map((tool, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{tool.name}</CardTitle>
                  <Badge variant={tool.price === 'Free' ? 'default' : 'secondary'}>
                    {tool.price}
                  </Badge>
                </div>
                <CardDescription className="text-gray-300">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {tool.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-black">
                  <Download className="h-4 w-4 mr-2" />
                  {tool.price === 'Free' ? 'Download Free' : 'Get Tool'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Installation Guide */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Installation Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-white mb-2">Download Tools</h3>
              <p className="text-gray-300 text-sm">Select and download your preferred tools</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-white mb-2">Install to MT4</h3>
              <p className="text-gray-300 text-sm">Copy files to your MT4 directory</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-white mb-2">Restart Platform</h3>
              <p className="text-gray-300 text-sm">Restart MT4 to load new tools</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">4</div>
              <h3 className="font-semibold text-white mb-2">Start Using</h3>
              <p className="text-gray-300 text-sm">Access tools from MT4 interface</p>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Tool Support & Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-4">What's Included:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Detailed installation guides</li>
                <li>• Video tutorials for each tool</li>
                <li>• Email support for technical issues</li>
                <li>• Regular updates and improvements</li>
                <li>• Community forum access</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">System Requirements:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• MetaTrader 4 build 1090 or later</li>
                <li>• Windows 7 or later</li>
                <li>• 2GB RAM minimum</li>
                <li>• Stable internet connection</li>
                <li>• Administrator privileges for installation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Enhance Your MT4 Experience</h2>
          <p className="text-gray-300 mb-6">
            Download our advanced tools and take your trading to the next level
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-black">
              <Download className="h-4 w-4 mr-2" />
              Download Tool Package
            </Button>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Get Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}