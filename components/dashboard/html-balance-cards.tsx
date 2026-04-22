'use client';

import { Profile, Balance } from '@/lib/database.types';
import { DollarSign, Bitcoin, Gift, Package } from 'lucide-react';

interface BalanceCardsProps {
  balances: Balance[];
  profile: Profile | null;
}

export function BalanceCards({ balances, profile }: BalanceCardsProps) {
  const getBalanceByCurrency = (currency: string) => {
    return balances.find(b => b.currency === currency)?.balance || 0;
  };

  const cards = [
    {
      title: 'Account Balance',
      value: `$${getBalanceByCurrency('USD').toFixed(2)}`,
      icon: DollarSign,
      bgColor: 'bg-blue-500',
      iconColor: 'text-white',
      borderColor: 'border-green-500',
    },
    {
      title: 'BTC Balance',
      value: getBalanceByCurrency('BTC').toFixed(8),
      icon: Bitcoin,
      bgColor: 'bg-green-500',
      iconColor: 'text-white',
      borderColor: 'border-green-500',
    },
    {
      title: "Referral's Bonus",
      value: `$${profile?.referral_bonus?.toFixed(2) || '0.00'}`,
      icon: Gift,
      bgColor: 'bg-yellow-500',
      iconColor: 'text-white',
      borderColor: 'border-green-500',
    },
    {
      title: 'Package Plan',
      value: (profile as any)?.packages?.display_name || 'STARTER',
      icon: Package,
      bgColor: 'bg-red-500',
      iconColor: 'text-white',
      borderColor: 'border-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="relative">
          <div 
            className={`${card.bgColor} rounded-lg overflow-hidden`}
            style={{ backgroundColor: '#1D2330', border: '1px solid green' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {card.value}
                  </h3>
                  <p className="text-white font-bold text-lg">
                    {card.title}
                  </p>
                </div>
                <div className="text-right">
                  <card.icon className={`h-16 w-16 ${card.iconColor}`} style={{ fontSize: '65px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}