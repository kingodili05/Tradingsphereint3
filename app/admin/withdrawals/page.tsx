'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminFinanceManagement } from '@/components/admin/admin-finance-management';

export default function AdminWithdrawalsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Withdrawal Management</h1>
          <p className="text-muted-foreground">
            Manage user withdrawal requests and transactions
          </p>
        </div>
        
        <AdminFinanceManagement />
      </div>
    </AdminLayout>
  );
}