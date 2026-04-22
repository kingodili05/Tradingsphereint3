'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/dashboard/loading-spinner';
import { AdminLayout } from '@/components/layout/admin-layout';
import { VerificationReview } from '@/components/admin/verification-review';

export default function AdminVerificationPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }
      if (!isAdmin) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Verification</h1>
          <p className="text-muted-foreground">
            Manage user identity and document verification
          </p>
        </div>
        
        <VerificationReview />
      </div>
    </AdminLayout>
  );
}