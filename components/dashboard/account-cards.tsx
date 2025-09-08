'use client';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { DollarSign, Bitcoin, Gift, Package } from 'lucide-react';

export function AccountCards() {
  const {
    profile,
    balances,
    btcPrice,
    getBalanceByCurrency,
    getBalanceBTC,
    loading,
  } = useDashboardData();

  const formatUsd = (v: number) => `$${v.toFixed(2)}`;
  const formatBtc = (v: number) => v.toFixed(8);

  if (loading) {
    return <p className="text-white">Loading balances...</p>;
  }

  const usdBalance = getBalanceByCurrency('USD');
  const btcBalance = getBalanceByCurrency('BTC');
  const referralBonus = profile?.referral_bonus || 0;
  const packagePlan = profile?.packages?.display_name || 'STARTER';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Account Balance */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm">Account Balance</h3>
            <p className="text-2xl font-bold text-white">{formatUsd(usdBalance)}</p>
            {btcPrice ? (
              <p className="text-sm text-gray-300 mt-1">
                ≈ {formatBtc(getBalanceBTC('USD'))} BTC
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">BTC price unavailable</p>
            )}
          </div>
          <DollarSign className="h-12 w-12 text-green-500" />
        </div>
      </div>

      {/* BTC Balance */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm">BTC Balance</h3>
            <p className="text-2xl font-bold text-white">{formatBtc(btcBalance)}</p>
            {btcPrice ? (
              <p className="text-sm text-gray-300 mt-1">
                ≈ {formatUsd(btcBalance * btcPrice)}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">USD equivalent unavailable</p>
            )}
          </div>
          <Bitcoin className="h-12 w-12 text-orange-500" />
        </div>
      </div>

      {/* Referral's Bonus */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm">Referral's Bonus</h3>
            <p className="text-2xl font-bold text-white">{formatUsd(referralBonus)}</p>
            {btcPrice ? (
              <p className="text-sm text-gray-300 mt-1">
                ≈ {formatBtc(referralBonus / btcPrice)} BTC
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">BTC price unavailable</p>
            )}
          </div>
          <Gift className="h-12 w-12 text-blue-500" />
        </div>
      </div>

      {/* Package Plan */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm">Package Plan</h3>
            <p className="text-2xl font-bold text-white">{packagePlan}</p>
          </div>
          <Package className="h-12 w-12 text-purple-500" />
        </div>
      </div>
    </div>
  );
}
