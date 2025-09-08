'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminDashboardStats } from '@/components/admin/admin-dashboard-stats';
import { AdminQuickActions } from '@/components/admin/admin-quick-actions';
import { AdminRecentActivity } from '@/components/admin/admin-recent-activity';
import { LoadingSpinner } from '@/components/dashboard/loading-spinner';
import { ErrorBoundary } from '@/components/error-boundary';

export default function AdminPage() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Simple redirect logic without complex state management
    if (!loading && !isRedirecting) {
      if (!isAuthenticated) {
        console.log('❌ Not authenticated - redirecting to admin login');
        setIsRedirecting(true);
        router.replace('/admin/login');
      } else if (!isAdmin) {
        console.log('⚠️ Not admin - redirecting to admin login for auto-grant');
        setIsRedirecting(true);
        router.replace('/admin/login');
      } else {
        console.log('✅ Admin authenticated - showing dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, loading, router, isRedirecting]);

  // Show loading spinner only once
  if (loading || isRedirecting) {
    if (!isRedirecting) {
      console.log('🔄 Admin dashboard loading...');
    }
    return <LoadingSpinner />;
  }

  // Don't show loading if already redirecting
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  // Show admin dashboard for authenticated admin users
  return (
    <ErrorBoundary>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, trades, deposits, and platform operations
            </p>
          </div>
          
          <ErrorBoundary>
            <AdminDashboardStats />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <AdminQuickActions />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <AdminRecentActivity />
          </ErrorBoundary>
        </div>
      </AdminLayout>
    </ErrorBoundary>
  );
}