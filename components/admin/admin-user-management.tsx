'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase-client';
import { Profile, Package as PackageType } from '@/lib/database.types';
import { Search, MoreHorizontal, CheckCircle, XCircle, Lock, LockOpen, Package, Ban, ShieldCheck, ShieldOff, TrendingUp, TrendingDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useAdminActions } from '@/hooks/use-admin-actions';
import { useAuth } from '@/hooks/use-auth';

type AccountStatus = 'active' | 'locked' | 'suspended' | 'pending' | string;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:    { label: 'Active',    color: 'bg-green-500/15 text-green-400 border-green-500/30' },
  locked:    { label: 'Locked',    color: 'bg-red-500/15 text-red-400 border-red-500/30' },
  suspended: { label: 'Suspended', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  pending:   { label: 'Pending',   color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
};

export function AdminUserManagement() {
  const { user: adminUser } = useAuth();
  const {
    approveUser,
    lockAccount,
    unlockAccount,
    suspendAccount,
    toggleVerification,
    upgradeUserPackage,
    adjustUserBalance,
    loading: actionLoading,
  } = useAdminActions();

  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');

  // Package Dialog
  const [packageDialog, setPackageDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState('');

  // Balance Dialog
  const [balanceDialogOpen, setBalanceDialogOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState<number>(0);
  const [balanceCurrency, setBalanceCurrency] = useState<'USD' | 'BTC' | 'ETH'>('USD');
  const [balanceAccountType, setBalanceAccountType] = useState<'demo' | 'live'>('demo');
  const [balanceAdjustmentType, setBalanceAdjustmentType] = useState<'increase' | 'decrease'>('increase');
  const [balanceAdminNotes, setBalanceAdminNotes] = useState('');
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);

  const newBalance = currentBalance !== null
    ? balanceAdjustmentType === 'increase'
      ? currentBalance + balanceAmount
      : currentBalance - balanceAmount
    : 0;

  const { data: packages } = useQuery<PackageType[]>({
    queryKey: ['packages'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('min_balance');
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select(`*, packages (id, name, display_name)`)
      .order('created_at', { ascending: false });
    if (data && !error) setUsers(data);
    setLoading(false);
  };

  const handleStatusAction = async (action: string, userId: string) => {
    let result;
    switch (action) {
      case 'activate':  result = await approveUser(userId); break;
      case 'lock':      result = await lockAccount(userId); break;
      case 'unlock':    result = await unlockAccount(userId); break;
      case 'suspend':   result = await suspendAccount(userId); break;
      default: return;
    }
    if (result.success) await fetchUsers();
  };

  const handleToggleVerification = async (userId: string, field: string, currentValue: boolean) => {
    const result = await toggleVerification(userId, field, currentValue);
    if (result.success) await fetchUsers();
  };

  const openPackageDialog = (user: Profile) => {
    setSelectedUser(user);
    setSelectedPackageId('');
    setPackageDialog(true);
  };

  const handleUpgradePackage = async () => {
    if (!selectedUser || !selectedPackageId) return;
    const result = await upgradeUserPackage(selectedUser.id, selectedPackageId);
    if (result.success) {
      setPackageDialog(false);
      setSelectedUser(null);
      await fetchUsers();
    }
  };

  const openBalanceDialog = async (user: Profile, type: 'increase' | 'decrease') => {
    setSelectedUser(user);
    setBalanceAdjustmentType(type);
    setBalanceAmount(0);
    setBalanceCurrency('USD');
    setBalanceAccountType('demo');
    setBalanceAdminNotes('');
    setBalanceDialogOpen(true);

    if (!supabase) return;
    const { data } = await supabase
      .from('balances')
      .select('balance')
      .eq('user_id', user.id)
      .eq('currency', 'USD')
      .single();
    setCurrentBalance(Number(data?.balance || 0));
  };

  useEffect(() => {
    if (!selectedUser) return;
    const fetchBalance = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from('balances')
        .select('balance')
        .eq('user_id', selectedUser.id)
        .eq('currency', balanceCurrency)
        .single();
      setCurrentBalance(Number(data?.balance || 0));
    };
    fetchBalance();
  }, [balanceCurrency, selectedUser]);

  const handleBalanceAdjustment = async () => {
    if (!selectedUser || !adminUser) return;
    if (!balanceAdminNotes) return toast.error('Admin notes are required.');
    if (balanceAmount <= 0) return toast.error('Amount must be positive.');
    if (balanceAdjustmentType === 'decrease' && balanceAmount > (currentBalance || 0))
      return toast.error('Cannot reduce more than current balance.');

    const result = await adjustUserBalance({
      adminId: adminUser.id,
      userId: selectedUser.id,
      amount: balanceAmount,
      currency: balanceCurrency,
      accountType: balanceAccountType,
      adjustmentType: balanceAdjustmentType,
      adminNotes: balanceAdminNotes,
    });

    if (!result.success) {
      toast.error(result.error || 'Failed to update balance.');
      return;
    }

    toast.success('Balance updated successfully.');
    setBalanceDialogOpen(false);
    await fetchUsers();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (user as any).account_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = users.reduce<Record<string, number>>((acc, u) => {
    const s = (u as any).account_status || 'pending';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  if (loading) return (
    <Card>
      <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
      <CardContent>Loading users...</CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'active', 'pending', 'suspended', 'locked'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              statusFilter === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-transparent border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label ?? s}
            <span className="ml-1.5 opacity-70">
              {s === 'all' ? users.length : (statusCounts[s] || 0)}
            </span>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No users found</div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map(user => {
                const status: AccountStatus = (user as any).account_status || 'pending';
                const statusCfg = STATUS_CONFIG[status] ?? { label: status, color: 'bg-gray-500/15 text-gray-400 border-gray-500/30' };
                const isActive = status === 'active';
                const isLocked = status === 'locked';
                const isSuspended = status === 'suspended';
                const isRestricted = isLocked || isSuspended;

                return (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={user.profile_image_url || '/placeholder-avatar.png'} />
                          <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{user.full_name}</div>
                          <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusCfg.color}`}>
                              {statusCfg.label}
                            </span>
                            {(user as any).is_email_verified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-green-500/10 text-green-600 border-green-500/20">
                                Email ✓
                              </span>
                            )}
                            {(user as any).is_identity_verified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-purple-500/10 text-purple-600 border-purple-500/20">
                                ID ✓
                              </span>
                            )}
                            {(user as any).is_residency_verified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-purple-500/10 text-purple-600 border-purple-500/20">
                                Address ✓
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          {/* Account status actions */}
                          {!isActive && (
                            <DropdownMenuItem onClick={() => handleStatusAction('activate', user.id)}>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Activate Account
                            </DropdownMenuItem>
                          )}
                          {isRestricted && (
                            <DropdownMenuItem onClick={() => handleStatusAction('unlock', user.id)}>
                              <LockOpen className="h-4 w-4 mr-2 text-blue-600" />
                              Unlock Account
                            </DropdownMenuItem>
                          )}
                          {!isLocked && (
                            <DropdownMenuItem onClick={() => handleStatusAction('lock', user.id)}>
                              <Lock className="h-4 w-4 mr-2 text-red-600" />
                              Lock Account
                            </DropdownMenuItem>
                          )}
                          {!isSuspended && (
                            <DropdownMenuItem onClick={() => handleStatusAction('suspend', user.id)}>
                              <Ban className="h-4 w-4 mr-2 text-amber-600" />
                              Suspend Account
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          {/* Verification toggles */}
                          <DropdownMenuItem onClick={() => handleToggleVerification(user.id, 'is_identity_verified', !!(user as any).is_identity_verified)}>
                            {(user as any).is_identity_verified
                              ? <><ShieldOff className="h-4 w-4 mr-2 text-orange-500" /> Revoke ID Verification</>
                              : <><ShieldCheck className="h-4 w-4 mr-2 text-green-600" /> Verify Identity (ID)</>
                            }
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleVerification(user.id, 'is_residency_verified', !!(user as any).is_residency_verified)}>
                            {(user as any).is_residency_verified
                              ? <><ShieldOff className="h-4 w-4 mr-2 text-orange-500" /> Revoke Address Verification</>
                              : <><ShieldCheck className="h-4 w-4 mr-2 text-green-600" /> Verify Address</>
                            }
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {/* Balance & Package */}
                          <DropdownMenuItem onClick={() => openBalanceDialog(user, 'increase')}>
                            <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                            Top Up Balance
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openBalanceDialog(user, 'decrease')}>
                            <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                            Reduce Balance
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openPackageDialog(user)}>
                            <Package className="h-4 w-4 mr-2" />
                            Change Package
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Package Dialog */}
      <Dialog open={packageDialog} onOpenChange={setPackageDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Package</DialogTitle></DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>User</Label>
                <div className="text-sm text-muted-foreground">{selectedUser.full_name}</div>
              </div>
              <div>
                <Label>Current Package</Label>
                <div>{(selectedUser as any)?.packages?.display_name || 'STARTER'}</div>
              </div>
              <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                <SelectTrigger><SelectValue placeholder="Select new package" /></SelectTrigger>
                <SelectContent>
                  {packages?.map(pkg => (
                    <SelectItem key={pkg.id} value={pkg.id}>{pkg.display_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={handleUpgradePackage} disabled={actionLoading || !selectedPackageId}>Update</Button>
                <Button variant="outline" onClick={() => setPackageDialog(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Balance Dialog */}
      <Dialog open={balanceDialogOpen} onOpenChange={setBalanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{balanceAdjustmentType === 'increase' ? 'Top Up Balance' : 'Reduce Balance'}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>User</Label>
                <div className="text-sm text-muted-foreground">{selectedUser.full_name} ({selectedUser.email})</div>
              </div>
              <div>
                <Label>Amount</Label>
                <Input type="number" min={0} value={balanceAmount} onChange={(e) => setBalanceAmount(Number(e.target.value))} />
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={balanceCurrency} onValueChange={(v) => setBalanceCurrency(v as 'USD' | 'BTC' | 'ETH')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Account Type</Label>
                <Select value={balanceAccountType} onValueChange={(v) => setBalanceAccountType(v as 'demo' | 'live')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Admin Notes (required)</Label>
                <Input value={balanceAdminNotes} onChange={(e) => setBalanceAdminNotes(e.target.value)} placeholder="Reason for adjustment" />
              </div>
              {currentBalance !== null && (
                <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
                  <div>Current: <span className="font-medium">{currentBalance.toLocaleString()} {balanceCurrency}</span></div>
                  <div className={newBalance < 0 ? 'text-red-600' : 'text-green-700'}>
                    New: <span className="font-medium">{newBalance.toLocaleString()} {balanceCurrency}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleBalanceAdjustment} disabled={actionLoading || balanceAmount <= 0 || newBalance < 0}>
                  Confirm
                </Button>
                <Button variant="outline" onClick={() => setBalanceDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
