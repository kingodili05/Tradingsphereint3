'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'STARTER',
    price: '$1,000 - $9,999',
    description: 'Perfect for new traders',
    features: [
      'Basic trading tools',
      'Standard market data',
      'Educational resources',
      'Email support',
      'Mobile app access',
    ],
    limitations: [
      'Basic features only',
      'Basic charting tools',
      'Standard support response time',
    ],
    cta: 'Start Trading',
    popular: false,
  },
  {
    name: 'BRONZE',
    price: '$10,000 - $24,999',
    description: 'For developing traders',
    features: [
      'Advanced charting tools',
      'Enhanced market data',
      'Priority support',
      'Risk management tools',
      'Portfolio analytics',
      'Educational webinars',
      'Advanced order types',
    ],
    limitations: [],
    cta: 'Upgrade to Bronze',
    popular: true,
  },
  {
    name: 'SILVER',
    price: '$25,000 - $49,999',
    description: 'For experienced traders',
    features: [
      'Everything in Bronze',
      'Dedicated account manager',
      'Premium market analysis',
      'Advanced risk tools',
      'VIP support',
      'Exclusive trading signals',
      'Custom strategies',
    ],
    limitations: [],
    cta: 'Upgrade to Silver',
    popular: false,
  },
  {
    name: 'GOLD',
    price: '$50,000 - $99,999',
    description: 'For professional traders',
    features: [
      'Everything in Silver',
      'Personal trading coach',
      'Advanced analytics',
      'Custom indicators',
      'Priority execution',
      'Institutional tools',
      'Advanced reporting',
    ],
    limitations: [],
    cta: 'Upgrade to Gold',
    popular: false,
  },
  {
    name: 'DIAMOND',
    price: '$100,000+',
    description: 'For elite traders',
    features: [
      'Everything in Gold',
      'White-glove service',
      'Custom platform features',
      'Institutional pricing',
      'Direct market access',
      'Custom integrations',
      'Dedicated infrastructure',
    ],
    limitations: [],
    cta: 'Contact for Diamond',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    description: 'For serious traders',
    features: [
      'Real-time market data',
      'Priority support',
      'API access',
      'Risk management tools',
      'Advanced order types',
      'Portfolio analytics',
    ],
    limitations: [],
    cta: 'Start Trading',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For institutions',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom integrations',
      'White-label solutions',
      'Institutional pricing',
      'Advanced risk controls',
      'Multi-user access',
      'Custom reporting',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

const tradingFees = [
  { asset: 'Forex', spread: 'From 0.5 pips', commission: 'No commission' },
  { asset: 'Crypto', spread: 'From 0.1%', commission: 'No commission' },
  { asset: 'Stocks', spread: 'Market spread', commission: 'From $2.99' },
  { asset: 'Commodities', spread: 'From 0.3 pips', commission: 'No commission' },
  { asset: 'Indices', spread: 'From 0.4 pips', commission: 'No commission' },
];

export default function SimplePricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            No hidden fees, no surprises. Choose the plan that fits your trading needs 
            and start with competitive rates across all asset classes.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
                  <h4 className="font-semibold text-green-400 mb-3">Included Features:</h4>
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
                          <X className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" />
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
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trading Fees */}
        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Trading Fees</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300">Asset Class</th>
                  <th className="text-left py-4 px-6 text-gray-300">Spread</th>
                  <th className="text-left py-4 px-6 text-gray-300">Commission</th>
                </tr>
              </thead>
              <tbody>
                {tradingFees.map((fee, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-4 px-6 font-semibold text-white">{fee.asset}</td>
                    <td className="py-4 px-6 text-green-400">{fee.spread}</td>
                    <td className="py-4 px-6 text-gray-300">{fee.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Pricing?</h2>
          <p className="text-gray-300 mb-6">
            Our team is here to help you choose the right plan for your trading needs
          </p>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black">
              Contact Our Team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}