'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase-client';
import { Profile } from '@/lib/database.types';
import { Search, MoreHorizontal, CheckCircle, XCircle, Lock, Unlock } from 'lucide-react';
import { Package } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Package as PackageType } from '@/lib/database.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useAdminActions } from '@/hooks/use-admin-actions';

export function AdminUserManagement() {
  const { 
    approveUser, 
    lockAccount, 
    unlockAccount, 
    toggleVerification,
    upgradeUserPackage,
    loading: actionLoading 
  } = useAdminActions();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [packageDialog, setPackageDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState('');

  // Fetch available packages
  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      if (!supabase) return [];
      
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('min_balance');

      if (error) throw error;
      return data as PackageType[];
    },
  });

  const handleUpgradePackage = async () => {
    if (!selectedUser || !selectedPackageId) return;
    
    const result = await upgradeUserPackage(selectedUser.id, selectedPackageId);
    if (result.success) {
      setPackageDialog(false);
      setSelectedPackageId('');
      setSelectedUser(null);
      await fetchUsers();
    }
  };

  const openPackageDialog = (user: Profile) => {
    setSelectedUser(user);
    setSelectedPackageId('');
    setPackageDialog(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    if (!supabase) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        packages (
          id,
          name,
          display_name
        )
      `)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setUsers(data);
    }

    setLoading(false);
  };

  const updateUserStatus = async (userId: string, status: string) => {
    let result;
    switch (status) {
      case 'active':
        result = await approveUser(userId);
        break;
      case 'locked':
        result = await lockAccount(userId);
        break;
      case 'suspended':
        result = await lockAccount(userId);
        break;
      default:
        return;
    }
    
    if (result.success) {
      await fetchUsers();
    }
  };

  const handleToggleVerification = async (userId: string, field: string, currentValue: boolean) => {
    const result = await toggleVerification(userId, field, currentValue);
    if (result.success) {
      await fetchUsers();
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      case 'locked': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>User Management</span>
          <Badge variant="secondary">{filteredUsers.length} users</Badge>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.profile_image_url || "/placeholder-avatar.png"} />
                    <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(user.account_status)}>
                    {user.account_status}
                  </Badge>
                  <Badge variant="outline">
                    {(user as any).packages?.display_name || 'STARTER'}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'active')}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openPackageDialog(user)}>
                        <Package className="h-4 w-4 mr-2" />
                        Upgrade/Downgrade Package
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'suspended')}>
                        <Lock className="h-4 w-4 mr-2" />
                        Suspend
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'locked')}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Lock
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Account Type</div>
                  <Badge variant={user.account_type === 'live' ? 'default' : 'secondary'}>
                    {user.account_type}
                  </Badge>
                </div>
                <div>
                  <div className="text-muted-foreground">Referral Bonus</div>
                  <div className="font-medium">${user.referral_bonus.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Deposits</div>
                  <div className="font-medium">${user.total_deposits.toFixed(2)}</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span>Email:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleVerification(user.id, 'is_email_verified', user.is_email_verified)}
                    className="h-6 p-1"
                    disabled={actionLoading}
                  >
                    {user.is_email_verified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center space-x-1">
                  <span>Identity:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleVerification(user.id, 'is_identity_verified', user.is_identity_verified)}
                    className="h-6 p-1"
                    disabled={actionLoading}
                  >
                    {user.is_identity_verified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center space-x-1">
                  <span>Residency:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleVerification(user.id, 'is_residency_verified', user.is_residency_verified)}
                    className="h-6 p-1"
                    disabled={actionLoading}
                  >
                    {user.is_residency_verified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Package Upgrade Dialog */}
      <Dialog open={packageDialog} onOpenChange={setPackageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade/Downgrade User Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedUser && (
              <>
                <div className="space-y-2">
                  <Label>User</Label>
                  <div className="p-2 bg-gray-100 rounded">
                    {selectedUser.full_name} ({selectedUser.email})
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Current Package</Label>
                  <div className="p-2 bg-gray-100 rounded">
                    {(selectedUser as any)?.packages?.display_name || 'STARTER'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>New Package</Label>
                  <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new package" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages?.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.display_name} (${pkg.min_balance.toLocaleString()} - {pkg.max_balance ? `$${pkg.max_balance.toLocaleString()}` : 'Unlimited'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleUpgradePackage} disabled={actionLoading || !selectedPackageId} className="flex-1">
                    {actionLoading ? 'Updating...' : 'Update Package'}
                  </Button>
                  <Button variant="outline" onClick={() => setPackageDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}