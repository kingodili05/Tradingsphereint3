'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SupportTickets } from '@/components/support/support-tickets';
import { KnowledgeBase } from '@/components/support/knowledge-base';
import { ContactSupport } from '@/components/support/contact-support';

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-muted-foreground">
            Get help and find answers to common questions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ContactSupport />
          </div>
          <div>
            <SupportTickets />
          </div>
        </div>
        
        <KnowledgeBase />
      </div>
    </DashboardLayout>
  );
}