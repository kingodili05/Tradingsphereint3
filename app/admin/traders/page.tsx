'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminUserManagement } from '@/components/admin/admin-user-management';

export default function AdminTradersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Expert Traders</h1>
          <p className="text-muted-foreground">
            Manage expert trader accounts and permissions
          </p>
        </div>
        
        <AdminUserManagement />
      </div>
    </AdminLayout>
  );
}