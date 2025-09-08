'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, DollarSign, Zap, Globe, Shield, Check } from 'lucide-react';
import Link from 'next/link';

const cfdAdvantages = [
  {
    icon: TrendingUp,
    title: 'Trade Both Directions',
    description: 'Profit from both rising and falling markets through long and short positions',
    details: [
      'Go long when you expect prices to rise',
      'Go short when you expect prices to fall',
      'No restrictions on short selling',
      'Flexible position management',
    ],
  },
  {
    icon: BarChart3,
    title: 'Leverage Trading',
    description: 'Control larger positions with smaller capital through leverage',
    details: [
      'Leverage up to 1:500 on forex',
      'Leverage up to 1:200 on commodities',
      'Leverage up to 1:20 on stocks',
      'Flexible margin requirements',
    ],
  },
  {
    icon: DollarSign,
    title: 'No Ownership Required',
    description: 'Trade on price movements without owning the underlying asset',
    details: [
      'No storage or custody costs',
      'No dividend complications',
      'No voting rights concerns',
      'Pure price speculation',
    ],
  },
  {
    icon: Zap,
    title: 'Fast Execution',
    description: 'Instant order execution with real-time pricing and settlements',
    details: [
      'Market orders executed instantly',
      'Real-time price feeds',
      'No delays or requotes',
      'Professional execution quality',
    ],
  },
  {
    icon: Globe,
    title: 'Multi-Asset Access',
    description: 'Trade multiple asset classes from a single platform',
    details: [
      'Forex, stocks, commodities, indices',
      'Unified trading interface',
      'Cross-asset portfolio management',
      'Diversification opportunities',
    ],
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Advanced risk management tools to protect your capital',
    details: [
      'Stop loss and take profit orders',
      'Trailing stops for profit protection',
      'Negative balance protection',
      'Position sizing tools',
    ],
  },
];

const cfdTypes = [
  {
    asset: 'Forex CFDs',
    description: 'Currency pairs with tight spreads',
    leverage: 'Up to 1:500',
    minSpread: '0.5 pips',
    examples: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
  },
  {
    asset: 'Stock CFDs',
    description: 'Individual company shares',
    leverage: 'Up to 1:20',
    minSpread: 'Market spread',
    examples: ['Apple', 'Microsoft', 'Tesla'],
  },
  {
    asset: 'Index CFDs',
    description: 'Stock market indices',
    leverage: 'Up to 1:200',
    minSpread: '0.4 points',
    examples: ['S&P 500', 'NASDAQ', 'FTSE 100'],
  },
  {
    asset: 'Commodity CFDs',
    description: 'Raw materials and precious metals',
    leverage: 'Up to 1:200',
    minSpread: '0.3 pips',
    examples: ['Gold', 'Oil', 'Silver'],
  },
  {
    asset: 'Crypto CFDs',
    description: 'Digital currencies',
    leverage: 'Up to 1:10',
    minSpread: '0.1%',
    examples: ['Bitcoin', 'Ethereum', 'Cardano'],
  },
];

const riskFactors = [
  'Leverage amplifies both profits and losses',
  'CFDs are complex instruments with high risk',
  'Market volatility can lead to significant losses',
  'Overnight financing charges may apply',
  'Past performance does not guarantee future results',
];

export default function AdvantagesOfCFDsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Advantages of CFD Trading
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn about Contract for Difference (CFD) trading and discover why it's become 
            one of the most popular ways to trade financial markets worldwide.
          </p>
        </div>

        {/* Main Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {cfdAdvantages.map((advantage, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <advantage.icon className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle className="text-white">{advantage.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {advantage.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {advantage.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CFD Types */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Types of CFDs Available</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cfdTypes.map((type, index) => (
              <Card key={index} className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">{type.asset}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Max Leverage</span>
                      <span className="text-green-400">{type.leverage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Min Spread</span>
                      <span className="text-green-400">{type.minSpread}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2 text-sm">Examples:</h4>
                    <div className="flex flex-wrap gap-1">
                      {type.examples.map((example, exampleIndex) => (
                        <span key={exampleIndex} className="bg-gray-600 px-2 py-1 rounded text-xs text-gray-300">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How CFDs Work */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How CFD Trading Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-semibold text-white mb-2">Choose Asset</h3>
              <p className="text-gray-300 text-sm">Select from forex, stocks, commodities, or indices</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-semibold text-white mb-2">Decide Direction</h3>
              <p className="text-gray-300 text-sm">Go long (buy) if you think price will rise, or short (sell) if you think it will fall</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-semibold text-white mb-2">Set Position Size</h3>
              <p className="text-gray-300 text-sm">Choose your position size and leverage level</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">4</div>
              <h3 className="font-semibold text-white mb-2">Manage & Close</h3>
              <p className="text-gray-300 text-sm">Monitor your position and close when ready to realize profit/loss</p>
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-16">
          <h3 className="text-xl font-semibold text-red-400 mb-4">Important Risk Warning</h3>
          <div className="space-y-2">
            {riskFactors.map((risk, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">{risk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start CFD Trading Today</h2>
          <p className="text-gray-300 mb-6">
            Experience the advantages of CFD trading with our professional platform and education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                Open CFD Account
              </Button>
            </Link>
            <Link href="/education/overview">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Learn More About Trading
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}