'use client';

import { useState } from 'react';
import { TradingSidebar } from './trading-sidebar';
import { TradingHeader } from './trading-header';
import { AccountCards } from './account-cards';
import { MarketChart } from './market-chart';
import { TradingPanel } from './trading-panel';
import { MarketList } from './market-list';
import { OrderHistory } from './order-history';
import { CurrencyMatrix } from './currency-matrix';
import { UserProfileModal } from './user-profile-modal';

export function TradingDashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <TradingSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Top Row - Account Cards */}
          <AccountCards />
          
          {/* Main Trading Area */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-96">
            {/* Market List */}
            <div className="xl:col-span-1">
              <MarketList onSymbolSelect={setSelectedSymbol} />
            </div>
            
            {/* Chart */}
            <div className="xl:col-span-2">
              <MarketChart symbol={selectedSymbol} />
            </div>
            
            {/* Trading Panel */}
            <div className="xl:col-span-1">
              <TradingPanel symbol={selectedSymbol} />
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <OrderHistory />
            <CurrencyMatrix />
          </div>
        </div>
      </div>
      
      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}