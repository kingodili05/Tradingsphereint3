'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMessages } from '@/hooks/use-messages';
import { DashboardSidebar } from '@/components/dashboard/html-dashboard-sidebar';
import { DashboardTopbar } from '@/components/dashboard/dashboard-topbar';
import { TradingViewTicker } from '@/components/dashboard/tradingview-ticker';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile } = useAuth();
  const { messages } = useMessages();
  const [, setActiveModal] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f1117' }}>
      <div className="flex">
        <DashboardSidebar
          profile={profile}
          messages={messages}
          onModalOpen={setActiveModal}
        />

        <div className="flex-1 md:ml-[90px] pb-16 md:pb-0">
          <TradingViewTicker />
          <DashboardTopbar profile={profile} messages={messages || []} />

          <main className="p-4 md:p-6 text-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
