'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { useBalances } from '@/hooks/use-balances';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { Package } from '@/lib/database.types';
import { CreditCard, Calendar, Crown, Star, Package as PackageIcon, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export function SubscriptionSettings() {
  const { profile } = useAuth();
  const { getTotalBalanceUSD } = useBalances();

  // Fetch available packages
  const { data: packages, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      if (!supabase) return [];
      
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('min_balance');

      if (error) throw error;
      return data as Package[];
    },
    enabled: !!supabase,
  });

  const currentBalance = getTotalBalanceUSD();
  const currentPackage = packages?.find(pkg => pkg.id === profile?.package_id);
  
  // If no package assigned, determine by balance
  const autoAssignedPackage = packages?.find(pkg => 
    currentBalance >= pkg.min_balance && 
    (pkg.max_balance === null || currentBalance <= pkg.max_balance)
  );
  
  const activePackage = currentPackage || autoAssignedPackage || packages?.[0]; // Default to STARTER

  const calculateProgress = () => {
    if (!activePackage || !activePackage.max_balance) return 0;
    const denominator = activePackage.max_balance - activePackage.min_balance;
    if (denominator <= 0) return 0;
    const progress = ((currentBalance - activePackage.min_balance) / denominator) * 100;
    const result = Math.max(0, Math.min(100, progress));
    return isNaN(result) || !isFinite(result) ? 0 : result;
  };

  const getPackageIcon = (packageName: string) => {
    switch (packageName?.toLowerCase()) {
      case 'diamond': return <Crown className="h-6 w-6 text-purple-600" />;
      case 'gold': return <Star className="h-6 w-6 text-yellow-500" />;
      case 'silver': return <TrendingUp className="h-6 w-6 text-gray-400" />;
      case 'bronze': return <CreditCard className="h-6 w-6 text-orange-600" />;
      default: return <PackageIcon className="h-6 w-6 text-blue-600" />;
    }
  };

  const handleUpgradeRequest = () => {
    toast.info('Package upgrade request submitted. Our team will contact you shortly.');
  };

  const handlePaymentUpdate = () => {
    toast.info('Payment method update will be available soon. Please contact support for assistance.');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription & Billing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show subscription status based on real user data
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription & Billing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activePackage ? (
          <>
            {/* Current Package Display */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {getPackageIcon(activePackage.name)}
                </div>
                <div>
                  <div className="font-semibold">{activePackage.display_name} Plan</div>
                  <div className="text-sm text-muted-foreground">
                    ${activePackage.min_balance.toLocaleString()} - {activePackage.max_balance ? `$${activePackage.max_balance.toLocaleString()}` : 'Unlimited'} • Investment Tier
                  </div>
                </div>
              </div>
              <Badge variant={profile?.package_id ? 'default' : 'secondary'}>
                {profile?.package_id ? 'Active' : 'Auto-Assigned'}
              </Badge>
            </div>

            {/* Balance Progress (only show if package has max_balance) */}
            {activePackage.max_balance && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Balance Progress</span>
                  <span className="text-sm text-muted-foreground">
                    ${currentBalance.toLocaleString()} / ${activePackage.max_balance.toLocaleString()}
                  </span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {activePackage.max_balance && currentBalance >= activePackage.max_balance 
                    ? 'You qualify for the next tier! Contact support to upgrade.'
                    : `Add ${(activePackage.max_balance - currentBalance).toLocaleString()} more to reach the next tier.`
                  }
                </div>
              </div>
            )}

            {/* Package Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Plan Type</div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-medium">Balance-Based Tier</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Your plan is automatically determined by your account balance
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Current Balance</div>
                <div className="font-medium">${currentBalance.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Package Features */}
            {activePackage.features && Object.keys(activePackage.features as any).length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-medium">Package Features</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(activePackage.features as any).map(([feature, enabled]) => (
                    enabled && (
                      <div key={feature} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="capitalize">{feature.replace('_', ' ')}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleUpgradeRequest} className="flex-1">
                Request Package Upgrade
              </Button>
              <Button variant="outline" onClick={handlePaymentUpdate} className="flex-1">
                Contact Support
              </Button>
            </div>
          </>
        ) : (
          /* No Package State */
          <div className="text-center py-8 space-y-4">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <PackageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No Active Package</h3>
              <p className="text-muted-foreground mb-4">
                You don't currently have an active subscription plan. Increase your account balance to automatically unlock trading packages.
              </p>
            </div>
            
            {/* Available Plans Preview */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Available Plans</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>STARTER</span>
                  <span className="text-muted-foreground">$1,000 - $9,999</span>
                </div>
                <div className="flex justify-between">
                  <span>BRONZE</span>
                  <span className="text-muted-foreground">$10,000 - $24,999</span>
                </div>
                <div className="flex justify-between">
                  <span>SILVER</span>
                  <span className="text-muted-foreground">$25,000 - $49,999</span>
                </div>
                <div className="flex justify-between">
                  <span>GOLD</span>
                  <span className="text-muted-foreground">$50,000+</span>
                </div>
              </div>
            </div>

            <Button onClick={() => toast.info('Please fund your account to unlock trading packages')} className="w-full">
              Fund Account to Get Started
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}