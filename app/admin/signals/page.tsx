'use client';

import React from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { TradeSignalManagement } from '@/components/admin/trade-signal-management';
import { TradeExecutionDashboard } from '@/components/admin/trade-execution-dashboard';

export default function AdminSignalsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* <div>
          <h1 className="text-3xl font-bold">Signal Management</h1>
          <p className="text-muted-foreground">
            Create and manage automated trading signals with timer execution
          </p>
        </div> */}
        
        <TradeSignalManagement />
        <TradeExecutionDashboard />
      </div>
    </AdminLayout>
  );
}
