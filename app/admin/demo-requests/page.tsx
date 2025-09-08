'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminUserManagement } from '@/components/admin/admin-user-management';

export default function AdminDemoRequestsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Demo Account Requests</h1>
          <p className="text-muted-foreground">
            Manage demo account activation requests
          </p>
        </div>
        
        <AdminUserManagement />
      </div>
    </AdminLayout>
  );
}