// app/dashboard/page.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HtmlDashboard } from '@/components/dashboard/html-dashboard';
import { LoadingSpinner } from '@/components/dashboard/loading-spinner';
import { ClientOnlyWrapper } from '@/components/auth/client-only-wrapper';

export default function DashboardPage() {
  const { isAuthenticated, isAdmin, loading, initialLoaded } = useAuth();
  const router = useRouter();

  // Only redirect once we completed the initial session check.
  useEffect(() => {
    if (initialLoaded && !loading && !isAuthenticated) {
      // replace (not push) to avoid additional history entries and reduce flicker
      router.replace('/auth/login');
    }
  }, [initialLoaded, isAuthenticated, loading, router]);

  // Show loading until initial check is finished or user is authenticated
  if (!initialLoaded || loading || !isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative">
      <HtmlDashboard />
    </div>
  );
  
}
