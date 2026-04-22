'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { RealTimeTradingInterface } from '@/components/trading/real-time-trading-interface';
import { OpenOrders } from '@/components/trading/open-orders';
import { TradeHistory } from '@/components/trading/trade-history';

export default function TradingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Trading</h1>
          <p className="text-muted-foreground">
            Execute trades with real-time balance validation
          </p>
        </div>
        
        <RealTimeTradingInterface />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OpenOrders />
          <TradeHistory />
        </div>
      </div>
    </DashboardLayout>
  );
}