'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Balance, Profile } from '@/lib/database.types';
import { Bitcoin, DollarSign, Gift } from 'lucide-react';

interface AdminBalanceCardsProps {
  balances: Balance[];
  selectedUser: Profile | null;
}

export function AdminBalanceCards({ balances, selectedUser }: AdminBalanceCardsProps) {
  const getBalanceByCurrency = (currency: string) => {
    return balances.find(b => b.currency === currency)?.balance || 0;
  };

  const cards = [
    {
      title: 'BTC BALANCE',
      value: getBalanceByCurrency('BTC').toFixed(8),
      subtitle: 'BTC',
      icon: Bitcoin,
      gradient: 'from-orange-400 to-orange-500',
      iconColor: 'text-orange-100',
    },
    {
      title: 'DEMO BALANCE',
      value: '$0',
      subtitle: '',
      icon: DollarSign,
      gradient: 'from-green-400 to-green-500',
      iconColor: 'text-green-100',
    },
    {
      title: 'REFERRAL BONUS',
      value: `$${selectedUser?.referral_bonus?.toFixed(2) || '0.00'}`,
      subtitle: '',
      icon: Gift,
      gradient: 'from-yellow-400 to-yellow-500',
      iconColor: 'text-yellow-100',
    },
    {
      title: 'ACCOUNT BALANCE',
      value: `$${getBalanceByCurrency('USD').toFixed(2)}`,
      subtitle: '',
      icon: DollarSign,
      gradient: 'from-blue-400 to-blue-500',
      iconColor: 'text-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className={`bg-gradient-to-r ${card.gradient} text-white border-0`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
                {card.subtitle && (
                  <p className="text-sm opacity-90">{card.subtitle}</p>
                )}
              </div>
              <card.icon className={`h-12 w-12 ${card.iconColor}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}