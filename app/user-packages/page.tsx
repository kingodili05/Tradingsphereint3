'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { useBalances } from '@/hooks/use-balances';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { Package } from '@/lib/database.types';
import { Check, Crown, Star, Zap, Package as PackageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function UserPackagesPage() {
  const { user, profile } = useAuth();
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

  const currentPackage = packages?.find(pkg => pkg.id === profile?.package_id) || packages?.[0];
  const currentBalance = getTotalBalanceUSD();

  const getPackageIcon = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case 'diamond': return <Crown className="h-6 w-6 text-purple-600" />;
      case 'gold': return <Star className="h-6 w-6 text-yellow-500" />;
      case 'silver': return <Zap className="h-6 w-6 text-gray-400" />;
      case 'bronze': return <PackageIcon className="h-6 w-6 text-orange-600" />;
      default: return <PackageIcon className="h-6 w-6 text-blue-600" />;
    }
  };

  const getPackageColor = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case 'diamond': return 'from-purple-500 to-purple-600';
      case 'gold': return 'from-yellow-400 to-yellow-500';
      case 'silver': return 'from-gray-400 to-gray-500';
      case 'bronze': return 'from-orange-400 to-orange-500';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const calculateProgress = (currentBalance: number, minBalance: number, maxBalance?: number) => {
    if (!maxBalance) return 100;
    const denominator = maxBalance - minBalance;
    if (denominator <= 0) return 100;
    const progress = ((currentBalance - minBalance) / denominator) * 100;
    const result = Math.max(0, Math.min(100, progress));
    return isNaN(result) || !isFinite(result) ? 0 : result;
  };

  const handleUpgradeRequest = (packageName: string) => {
    toast.info(`Upgrade to ${packageName} requested. Our team will contact you shortly.`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">My Package</h1>
            <p className="text-muted-foreground">Loading package information...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Trading Package</h1>
          <p className="text-muted-foreground">
            Manage your trading package and explore upgrade options
          </p>
        </div>

        {/* Current Package Status */}
        <Card className={`bg-gradient-to-r ${getPackageColor(currentPackage?.name || 'starter')} text-white`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getPackageIcon(currentPackage?.name || 'starter')}
                <div>
                  <h2 className="text-2xl font-bold">{currentPackage?.display_name || 'STARTER'}</h2>
                  <p className="text-sm opacity-90">Current Trading Package</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${currentBalance.toLocaleString()}</div>
                <p className="text-sm opacity-90">Account Balance</p>
              </div>
            </div>

            {currentPackage && currentPackage.max_balance && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to Next Tier</span>
                  <span>${currentPackage.max_balance.toLocaleString()} target</span>
                </div>
                <Progress 
                  value={calculateProgress(currentBalance, currentPackage.min_balance, currentPackage.max_balance)} 
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Packages */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Trading Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages?.map((pkg) => {
              const isCurrent = pkg.id === profile?.package_id || (pkg.name === 'starter' && !profile?.package_id);
              const canUpgrade = currentBalance >= pkg.min_balance && !isCurrent;
              
              return (
                <Card key={pkg.id} className={`${isCurrent ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''} hover:shadow-lg transition-shadow`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPackageIcon(pkg.name)}
                        <CardTitle>{pkg.display_name}</CardTitle>
                      </div>
                      {isCurrent && (
                        <Badge className="bg-green-500">Current</Badge>
                      )}
                    </div>
                    <CardDescription>
                      Balance Range: ${pkg.min_balance.toLocaleString()} - {pkg.max_balance ? `$${pkg.max_balance.toLocaleString()}` : 'Unlimited'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Package Features:</h4>
                      <div className="space-y-2">
                        {Object.entries(pkg.features as any || {}).map(([feature, enabled]) => (
                          enabled && (
                            <div key={feature} className="flex items-center space-x-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm capitalize">{feature.replace('_', ' ')}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      {isCurrent ? (
                        <Button disabled className="w-full bg-green-100 text-green-800">
                          Current Package
                        </Button>
                      ) : canUpgrade ? (
                        <Button 
                          onClick={() => handleUpgradeRequest(pkg.display_name)}
                          className="w-full"
                        >
                          Request Upgrade
                        </Button>
                      ) : (
                        <Button disabled className="w-full">
                          Insufficient Balance
                        </Button>
                      )}
                      
                      {!canUpgrade && !isCurrent && (
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Minimum balance: ${pkg.min_balance.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Package Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Package Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <PackageIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold">STARTER</h4>
                <p className="text-sm text-muted-foreground">Basic trading tools and support</p>
              </div>
              <div className="text-center p-4">
                <PackageIcon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h4 className="font-semibold">BRONZE</h4>
                <p className="text-sm text-muted-foreground">Advanced tools and priority support</p>
              </div>
              <div className="text-center p-4">
                <Zap className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-semibold">SILVER</h4>
                <p className="text-sm text-muted-foreground">VIP support and exclusive signals</p>
              </div>
              <div className="text-center p-4">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-semibold">GOLD+</h4>
                <p className="text-sm text-muted-foreground">Premium features and coaching</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}