'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MessagesPanel } from '@/components/dashboard/messages-panel';
import { useMessages } from '@/hooks/use-messages';

export default function UserMessagesPage() {
  const { messages, loading } = useMessages();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Messages</h1>
          <p className="text-muted-foreground">
            View and manage your messages and notifications
          </p>
        </div>
        
        <MessagesPanel messages={messages} loading={loading} />
      </div>
    </DashboardLayout>
  );
}