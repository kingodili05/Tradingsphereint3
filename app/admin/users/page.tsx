'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminUserManagement } from '@/components/admin/admin-user-management';

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, verification, and permissions
          </p>
        </div>
        
        <AdminUserManagement />
      </div>
    </AdminLayout>
  );
}