'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { ChatManagement } from '@/components/admin/chat-management';

export default function AdminChatPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Live Chat Management</h1>
          <p className="text-muted-foreground">
            Manage customer conversations and provide real-time support
          </p>
        </div>
        
        <ChatManagement />
      </div>
    </AdminLayout>
  );
}