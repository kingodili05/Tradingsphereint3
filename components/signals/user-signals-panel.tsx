'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { AdminDashboardStats } from '@/components/admin/admin-dashboard-stats';
import { AdminQuickActions } from '@/components/admin/admin-quick-actions';
import { AdminRecentActivity } from '@/components/admin/admin-recent-activity';
import { LoadingSpinner } from '@/components/dashboard/loading-spinner';

export default function AdminPage() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Admin page - Auth status:', { isAuthenticated, isAdmin, loading });

    // Wait until loading finishes before checking auth
    if (loading) return;

    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      router.push('/auth/login');
    } else if (!isAdmin) {
      console.log('Not admin, redirecting to dashboard');
      router.push('/dashboard');
    } else {
      console.log('Admin authenticated, staying on admin page');
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // Show spinner with timeout protection
  if (loading) {
    console.log('Admin page loading...');
    return <LoadingSpinner />;
  }

  // Add fallback for edge cases
  if (!isAuthenticated) {
    console.log('Admin page - Access denied, not rendering');
    router.push('/auth/login');
    return null;
  }

  if (!isAdmin) {
    console.log('Admin page - Not admin, redirecting to dashboard');
    router.push('/dashboard');
    return null;
  }

  console.log('Admin page - Rendering admin dashboard');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, trades, deposits, and platform operations
          </p>
        </div>
        
        <AdminDashboardStats />
        <AdminQuickActions />
        <AdminRecentActivity />
      </div>
    </AdminLayout>
  );
}