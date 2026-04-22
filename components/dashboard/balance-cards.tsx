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
  const formatUsd = (v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatBtc = (v: number) => v.toFixed(6);

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
  const btcBalanceTotal = btcBalance + accountBtcEquivalent;
  const referralBonus = profile?.referral_bonus || 0;
  const referralBtcEquivalent = referralBonus > 0 ? computeBalanceBtc('USD') : 0;

  const cards = [
    {
      title: 'Account Balance',
      value: formatUsd(accountUsdBalance),
      sub: btcPrice && accountBtcEquivalent > 0 ? `≈ ${formatBtc(accountBtcEquivalent)} BTC` : null,
      icon: DollarSign,
      gradient: 'from-blue-500 to-blue-700',
      glow: 'shadow-blue-500/20',
      ring: 'border-blue-500/25',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-300',
      accent: 'bg-blue-500/8',
    },
    {
      title: 'BTC Balance',
      value: formatBtc(btcBalanceTotal),
      sub: btcPrice ? `≈ $${(btcBalanceTotal * btcPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}` : null,
      icon: Bitcoin,
      gradient: 'from-orange-400 to-amber-600',
      glow: 'shadow-orange-500/20',
      ring: 'border-orange-500/25',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-300',
      accent: 'bg-orange-500/8',
    },
    {
      title: "Referral Bonus",
      value: `$${referralBonus.toFixed(2)}`,
      sub: referralBtcEquivalent > 0 ? `≈ ${formatBtc(referralBtcEquivalent)} BTC` : null,
      icon: Gift,
      gradient: 'from-purple-500 to-violet-700',
      glow: 'shadow-purple-500/20',
      ring: 'border-purple-500/25',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-300',
      accent: 'bg-purple-500/8',
    },
    {
      title: 'Package Plan',
      value: (profile as any)?.packages?.display_name || 'STARTER',
      sub: 'Active plan',
      icon: Package,
      gradient: 'from-green-500 to-emerald-700',
      glow: 'shadow-green-500/20',
      ring: 'border-green-500/25',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-300',
      accent: 'bg-green-500/8',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`relative rounded-2xl border ${card.ring} ${card.accent} p-4 md:p-5 overflow-hidden
            hover:-translate-y-1 hover:shadow-xl ${card.glow} transition-all duration-300 cursor-default
            animate-fade-up`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Background gradient orb */}
          <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${card.gradient} opacity-15 blur-xl`} />

          {/* Icon */}
          <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
            <card.icon className={`h-4.5 w-4.5 ${card.iconColor}`} style={{ width: '18px', height: '18px' }} />
          </div>

          {/* Value */}
          <p className="text-white font-bold text-lg md:text-xl leading-none mb-1 truncate">
            {card.value}
          </p>

          {/* Title */}
          <p className="text-gray-400 text-xs font-medium">{card.title}</p>

          {/* Sub value */}
          {card.sub && (
            <p className="text-gray-500 text-[10px] mt-1 truncate">{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
