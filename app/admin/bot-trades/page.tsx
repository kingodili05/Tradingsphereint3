'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { BotTradingManagement } from '@/components/admin/bot-trading-management';

export default function AdminBotTradesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Bot Trading</h1>
          <p className="text-muted-foreground">
            Start automated trades on behalf of users and control the outcome
          </p>
        </div>

        <BotTradingManagement />
      </div>
    </AdminLayout>
  );
}
