// app/dashboard/page.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HtmlDashboard } from '@/components/dashboard/html-dashboard';
import { LoadingSpinner } from '@/components/dashboard/loading-spinner';
import { AccountBlocked } from '@/components/dashboard/account-blocked';

export default function DashboardPage() {
  const { isAuthenticated, loading, initialLoaded, isBlocked, accountStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialLoaded && !loading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [initialLoaded, isAuthenticated, loading, router]);

  if (!initialLoaded || loading || !isAuthenticated) {
    return <LoadingSpinner />;
  }

  if (isBlocked) {
    return <AccountBlocked status={accountStatus} />;
  }

  return (
    <div className="relative">
      <HtmlDashboard />
    </div>
  );
}
