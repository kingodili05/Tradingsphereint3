'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PortfolioOverview } from '@/components/dashboard/portfolio-overview';
import { AssetAllocation } from '@/components/dashboard/asset-allocation';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { ActiveTrades } from '@/components/dashboard/active-trades';
import { useTrades } from '@/hooks/use-trades';

export default function PortfolioPage() {
  const { trades, loading } = useTrades();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Track your investment performance and asset allocation
          </p>
        </div>
        
        <PortfolioOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart />
          <AssetAllocation />
        </div>
        
        <ActiveTrades trades={trades} loading={loading} showAll={true} />
      </div>
    </DashboardLayout>
  );
}