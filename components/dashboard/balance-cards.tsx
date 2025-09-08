'use client';

import { Profile, Balance } from '@/lib/database.types';
import { DollarSign, Bitcoin, Gift, Package } from 'lucide-react';

interface BalanceCardsProps {
  balances: Balance[];
  profile: Profile | null;
  btcPrice?: number | null;
  getBalanceBTC?: (currency: string) => number;
}

export function BalanceCards({ balances, profile, btcPrice, getBalanceBTC }: BalanceCardsProps) {
  const getBalanceByCurrency = (currency: string) => balances.find(b => b.currency === currency)?.balance || 0;

  const formatUsd = (v: number) => `$${v.toFixed(2)}`;
  const formatBtc = (v: number) => v.toFixed(8);

  const computeBalanceBtc = (currency: string) => {
    if (typeof getBalanceBTC === 'function') {
      const val = getBalanceBTC(currency);
      return typeof val === 'number' ? val : 0;
    }

    if (!btcPrice || btcPrice === 0) return 0;

    const fallbackRates: Record<string, number> = { USD: 1, BTC: 43000, ETH: 2600 };
    const balance = getBalanceByCurrency(currency);
    const usdValue = balance * (fallbackRates[currency as keyof typeof fallbackRates] || 1);
    return usdValue / btcPrice;
  };

  const accountUsdBalance = getBalanceByCurrency('USD');
  const accountBtcEquivalent = computeBalanceBtc('USD');
  const btcBalance = getBalanceByCurrency('BTC');
  const btcBalanceTotal = btcBalance + accountBtcEquivalent; // BTC + USD equivalent in BTC
  const referralBonus = profile?.referral_bonus || 0;
  const referralBtcEquivalent = referralBonus > 0 ? computeBalanceBtc('USD') : 0;

  const cards = [
    {
      title: 'Account Balance',
      value: formatUsd(accountUsdBalance),
      subValueBtc: accountBtcEquivalent,
      icon: DollarSign,
      bgColor: 'bg-blue-500',
      iconColor: 'text-white',
    },
    {
      title: 'BTC Balance',
      value: formatBtc(btcBalanceTotal),
      subValueBtc: 0, // already shown in main value
      icon: Bitcoin,
      bgColor: 'bg-green-500',
      iconColor: 'text-white',
    },
    {
      title: "Referral's Bonus",
      value: `$${referralBonus.toFixed(2)}`,
      subValueBtc: referralBtcEquivalent,
      icon: Gift,
      bgColor: 'bg-yellow-500',
      iconColor: 'text-white',
    },
    {
      title: 'Package Plan',
      value: (profile as any)?.packages?.display_name || 'STARTER',
      subValueBtc: 0,
      icon: Package,
      bgColor: 'bg-red-500',
      iconColor: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="relative">
          <div className={`${card.bgColor} rounded-lg overflow-hidden`} style={{ backgroundColor: '#1D2330' }}>
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
                <p className="text-white font-bold text-lg">{card.title}</p>

                {card.title !== 'BTC Balance' && btcPrice && card.subValueBtc > 0 && (
                  <p className="text-sm text-gray-300 mt-1">
                    ≈ <span className="font-medium">{formatBtc(card.subValueBtc)}</span> BTC
                  </p>
                )}

                {!btcPrice && card.title !== 'BTC Balance' && (
                  <p className="text-sm text-gray-500 mt-1">BTC price unavailable</p>
                )}
              </div>

              <div className="text-right">
                <card.icon className={`h-16 w-16 ${card.iconColor}`} style={{ fontSize: '65px' }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
