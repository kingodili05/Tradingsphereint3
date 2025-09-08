'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AssetHeader } from '@/components/asset/asset-header';
import { AssetChart } from '@/components/asset/asset-chart';
import { TradingPanel } from '@/components/asset/trading-panel';
import { AssetInfo } from '@/components/asset/asset-info';
import { OrderBook } from '@/components/asset/order-book';

interface AssetPageProps {
  params: {
    category: string;
    symbol: string;
  };
}

export default function AssetPage({ params }: AssetPageProps) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AssetHeader category={params.category} symbol={params.symbol} />
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <AssetChart symbol={params.symbol} />
          </div>
          <div>
            <TradingPanel symbol={params.symbol} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AssetInfo symbol={params.symbol} />
          <OrderBook symbol={params.symbol} />
        </div>
      </div>
    </DashboardLayout>
  );
}