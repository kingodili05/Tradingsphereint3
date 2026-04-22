'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, BarChart3, Shield, Zap, Globe, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const autotradeFeatures = [
  {
    icon: TrendingUp,
    title: 'Automated Trading',
    description: 'Copy successful traders automatically with real-time signal execution',
  },
  {
    icon: Users,
    title: 'Social Trading',
    description: 'Connect with a community of professional traders and copy their strategies',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Detailed performance tracking and analytics for all copied strategies',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Advanced risk controls and position sizing for automated trading',
  },
  {
    icon: Zap,
    title: 'Real-Time Execution',
    description: 'Lightning-fast signal copying with minimal latency',
  },
  {
    icon: Globe,
    title: 'Global Strategies',
    description: 'Access trading strategies from professional traders worldwide',
  },
];

const topTraders = [
  {
    name: 'Alex Thompson',
    country: '🇺🇸',
    return: '+127.5%',
    followers: '2,847',
    winRate: '78%',
    riskScore: 'Medium',
    strategy: 'Forex Scalping',
  },
  {
    name: 'Maria Rodriguez',
    country: '🇪🇸',
    return: '+89.3%',
    followers: '1,923',
    winRate: '72%',
    riskScore: 'Low',
    strategy: 'Swing Trading',
  },
  {
    name: 'Chen Wei',
    country: '🇸🇬',
    return: '+156.8%',
    followers: '3,456',
    winRate: '81%',
    riskScore: 'High',
    strategy: 'Trend Following',
  },
  {
    name: 'James Wilson',
    country: '🇬🇧',
    return: '+94.7%',
    followers: '2,134',
    winRate: '69%',
    riskScore: 'Medium',
    strategy: 'News Trading',
  },
];

const autotradeAdvantages = [
  'Copy trades from successful professionals',
  'Automated execution with no manual intervention',
  'Diversify across multiple trading strategies',
  'Real-time performance monitoring',
  'Customizable risk management settings',
  'Transparent trader statistics and history',
  'Start with as little as $100',
  '24/7 automated trading operation',
];

const pricingPlans = [
  {
    name: 'Basic AutoTrade',
    price: 'Free',
    description: 'Copy up to 3 traders',
    features: [
      'Copy up to 3 signal providers',
      'Basic performance analytics',
      'Standard execution speed',
      'Email support',
    ],
    limitations: [
      'Limited to 3 copied traders',
      'Basic risk management tools',
    ],
  },
  {
    name: 'Pro AutoTrade',
    price: '$29',
    period: '/month',
    description: 'Unlimited copying with advanced features',
    features: [
      'Unlimited signal providers',
      'Advanced analytics and reporting',
      'Priority execution',
      'Advanced risk management',
      'Portfolio optimization tools',
      'Priority support',
    ],
    limitations: [],
    popular: true,
  },
  {
    name: 'VIP AutoTrade',
    price: '$79',
    period: '/month',
    description: 'Professional features with dedicated support',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom strategy development',
      'Advanced portfolio tools',
      'White-glove onboarding',
      'Phone support',
    ],
    limitations: [],
  },
];

export default function MyfxbookAutoTradePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-green-500 text-black px-4 py-2 text-lg">
            Automated Trading
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold">
            Myfxbook AutoTrade
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Copy successful traders automatically with our advanced social trading platform. 
            Connect with professional traders and let their expertise work for you 24/7.
          </p>
        </div>

        {/* AutoTrade Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {autotradeFeatures.map((feature, index) => (
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

        {/* Top Traders */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Top Performing Traders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Trader</th>
                  <th className="text-left py-4 px-6 text-gray-300">Return</th>
                  <th className="text-left py-4 px-6 text-gray-300">Followers</th>
                  <th className="text-left py-4 px-6 text-gray-300">Win Rate</th>
                  <th className="text-left py-4 px-6 text-gray-300">Risk</th>
                  <th className="text-left py-4 px-6 text-gray-300">Strategy</th>
                  <th className="text-left py-4 px-6 text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {topTraders.map((trader, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <span className="text-green-500 font-bold text-sm">{trader.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-white">{trader.name}</div>
                          <div className="text-sm text-gray-400">{trader.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-green-400 font-semibold">{trader.return}</td>
                    <td className="py-4 px-6 text-gray-300">{trader.followers}</td>
                    <td className="py-4 px-6 text-white">{trader.winRate}</td>
                    <td className="py-4 px-6">
                      <Badge variant={trader.riskScore === 'Low' ? 'default' : trader.riskScore === 'Medium' ? 'secondary' : 'destructive'}>
                        {trader.riskScore}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{trader.strategy}</td>
                    <td className="py-4 px-6">
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-black">
                        Copy
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How AutoTrade Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-white mb-2">Choose Traders</h3>
              <p className="text-gray-300 text-sm">Browse and select successful traders to copy based on their performance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-white mb-2">Set Parameters</h3>
              <p className="text-gray-300 text-sm">Configure risk settings, position sizes, and copying preferences</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-white mb-2">Auto Execution</h3>
              <p className="text-gray-300 text-sm">Trades are automatically copied to your account in real-time</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">4</div>
              <h3 className="font-semibold text-white mb-2">Monitor & Optimize</h3>
              <p className="text-gray-300 text-sm">Track performance and adjust your copying strategy as needed</p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">AutoTrade Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`bg-gray-800 border-gray-700 ${plan.popular ? 'border-green-500 scale-105' : ''} relative`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-black px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                  <div className="text-4xl font-bold text-white mt-4">
                    {plan.price}
                    {plan.period && <span className="text-lg text-gray-400">{plan.period}</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-400 mb-3">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="flex items-center text-sm">
                            <span className="text-gray-400">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Link href="/auth/signup">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-green-500 hover:bg-green-600 text-black' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advantages */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose AutoTrade?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">Perfect for All Traders</h3>
              <p className="text-gray-300 leading-relaxed">
                Whether you're a beginner looking to learn from professionals or an experienced 
                trader wanting to diversify your strategies, Myfxbook AutoTrade provides the 
                perfect solution for automated social trading.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our platform connects you with verified professional traders, allowing you to 
                automatically copy their trades while maintaining full control over your risk 
                management and capital allocation.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-green-400">Key Benefits</h3>
              <div className="space-y-3">
                {autotradeAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Integration Info */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Platform Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Supported Platforms</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">MetaTrader 4</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">MetaTrader 5</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">cTrader</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-gray-300">TradingSphereIntl WebTrader</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Setup Requirements</h3>
              <div className="space-y-3 text-gray-300">
                <p>• Active trading account with TradingSphereIntl</p>
                <p>• Minimum account balance of $100</p>
                <p>• Myfxbook account verification</p>
                <p>• Platform connection authorization</p>
                <p>• Risk management settings configuration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Getting Started with AutoTrade</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-white mb-2">Connect Account</h3>
              <p className="text-gray-300 text-sm">Link your TradingSphereIntl account with Myfxbook AutoTrade</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-white mb-2">Select Traders</h3>
              <p className="text-gray-300 text-sm">Browse and choose successful traders to copy based on their performance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-white mb-2">Start Copying</h3>
              <p className="text-gray-300 text-sm">Configure your settings and begin automated trade copying</p>
            </div>
          </div>
        </div>

        {/* Risk Disclosure */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-16">
          <h3 className="text-xl font-semibold text-red-400 mb-4">Risk Warning</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Social trading and copy trading involve significant risk. Past performance of signal 
            providers is not indicative of future results. You may lose some or all of your 
            invested capital. Please ensure you understand the risks and only invest money you 
            can afford to lose.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start AutoTrading Today</h2>
          <p className="text-gray-300 mb-6">
            Join thousands of traders using automated social trading to enhance their results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open AutoTrade Account
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Myfxbook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}