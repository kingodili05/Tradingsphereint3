'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminMessaging } from '@/components/admin/admin-messaging';

export default function AdminMessagesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Message Management</h1>
          <p className="text-muted-foreground">
            Send messages to users and manage communications
          </p>
        </div>
        
        <AdminMessaging />
      </div>
    </AdminLayout>
  );
}