'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProfileSettings } from '@/components/profile/profile-settings';
import { SecuritySettings } from '@/components/profile/security-settings';
import { SubscriptionSettings } from '@/components/profile/subscription-settings';

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile & Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileSettings />
          <SecuritySettings />
        </div>
        
        <SubscriptionSettings />
      </div>
    </DashboardLayout>
  );
}