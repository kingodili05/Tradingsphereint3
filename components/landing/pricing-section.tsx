import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'STARTER',
    price: '$1,000 - $9,999',
    description: 'Perfect for new traders',
    features: [
      'Basic trading platform access',
      'Standard market data',
      'Standard support',
      'Mobile app access',
      'Basic educational resources',
    ],
    cta: 'Start Trading',
    popular: false,
  },
  {
    name: 'BRONZE',
    price: '$10,000 - $24,999',
    description: 'For developing traders',
    features: [
      'Advanced trading tools',
      'Enhanced market data',
      'Priority support',
      'Advanced charts',
      'Risk management tools',
      'Portfolio analytics',
      'Educational webinars',
    ],
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
      'Advanced risk management',
      'VIP support',
      'Exclusive trading signals',
    ],
    cta: 'Upgrade to Silver',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Choose Your Trading Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade as you grow. All plans include our core trading features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  {plan.price}
                  {plan.period && <span className="text-lg text-gray-600">{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}