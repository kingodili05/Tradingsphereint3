'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useTrades } from '@/hooks/use-trades';
import { useMessages } from '@/hooks/use-messages';
import { useBalances } from '@/hooks/use-balances';
import { BalanceCards } from './balance-cards';
import { TradingPanel } from './trading-panel';
import { TradesTable } from './trades-table';
import { MarketWidget } from './market-widget';
import { CurrencyMatrix } from './currency-matrix';
import { CryptoChart } from './crypto-chart';
import { DashboardTopbar } from './dashboard-topbar';
import { DashboardModals } from './dashboard-modals';
import { DashboardSidebar } from './html-dashboard-sidebar';
import { TradingViewTicker } from './tradingview-ticker';
import { getBtcUsdPrice } from '@/lib/coingecko';

export function HtmlDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const { trades, loading: tradesLoading } = useTrades();
  const { messages, loading: messagesLoading } = useMessages();
  const { balances, loading: balancesLoading } = useBalances();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Get BTC price using the existing coingecko utility
  const { data: btcPrice } = useQuery({
    queryKey: ['btc-price'],
    queryFn: async () => {
      try {
        const price = await getBtcUsdPrice();
        return price;
      } catch (error) {
        console.error('Error fetching BTC price:', error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar 
          profile={profile} 
          messages={messages} 
          onModalOpen={setActiveModal} 
        />

        {/* Main Content */}
        <div className="flex-1" style={{ marginLeft: '90px' }}>
          {/* ✅ TradingView Ticker at the very top */}
          <TradingViewTicker />

          {/* Topbar with Profile Dropdown */}
          <DashboardTopbar profile={profile} messages={messages || []} />
          
          {/* Page Content */}
          <div className="p-4 space-y-6">
            {/* Balance Cards */}
            <BalanceCards 
              balances={balances || []} 
              profile={profile} 
              btcPrice={btcPrice}
              getBalanceBTC={(currency: string) => {
                if (!btcPrice) return 0;
                const balance = (balances || []).find(b => b.currency === currency)?.balance || 0;
                if (currency === 'BTC') return balance;
                // For other currencies, convert to USD first, then to BTC
                const usdValue = balance * (currency === 'USD' ? 1 : 0); // Add more currencies as needed
                return usdValue / btcPrice;
              }}
            />

            {/* Main Trading Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Trading Panel */}
              <div className="lg:col-span-4">
                <TradingPanel />
              </div>

              {/* Market Widget */}
              <div className="lg:col-span-8">
                <MarketWidget />
              </div>
            </div>

            {/* Trading History and Currency Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TradesTable trades={trades || []} />
              <CurrencyMatrix />
            </div>

            {/* Crypto Chart */}
            <CryptoChart />
          </div>
        </div>
      </div>

      {/* Dashboard Modals */}
      <DashboardModals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
