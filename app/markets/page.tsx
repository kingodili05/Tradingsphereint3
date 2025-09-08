'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MarketOverview } from '@/components/markets/market-overview';
import { AssetsList } from '@/components/markets/assets-list';

export default function MarketsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Markets</h1>
          <p className="text-muted-foreground">
            Explore and trade across multiple asset categories
          </p>
        </div>
        
        <MarketOverview />
        <AssetsList />
      </div>
    </DashboardLayout>
  );
}