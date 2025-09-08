'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminTradeManagement } from '@/components/admin/admin-trade-management';

export default function AdminTradesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Trade Management</h1>
          <p className="text-muted-foreground">
            Manage user trades and trading operations
          </p>
        </div>
        
        <AdminTradeManagement />
      </div>
    </AdminLayout>
  );
}