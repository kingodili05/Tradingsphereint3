'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HtmlDashboard } from '@/components/dashboard/html-dashboard';
import { LoadingSpinner } from '@/components/dashboard/loading-spinner';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

export default function DashboardPage() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while auth is loading
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative">
      {/* Main User Dashboard */}
      <HtmlDashboard />
    </div>
  );
}