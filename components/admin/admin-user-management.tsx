'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase-client';
import { Profile, Package as PackageType } from '@/lib/database.types';
import { Search, MoreHorizontal, CheckCircle, XCircle, Lock, Package } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useAdminActions } from '@/hooks/use-admin-actions';
import { useAuth } from '@/hooks/use-auth';

export function AdminUserManagement() {
  const { user: adminUser } = useAuth();
  const {
    approveUser,
    lockAccount,
    toggleVerification,
    upgradeUserPackage,
    adjustUserBalance,
    loading: actionLoading
  } = useAdminActions();

  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const newBalance = currentBalance !== null ?
    (balanceAdjustmentType === 'increase'
      ? currentBalance + balanceAmount
      : currentBalance - balanceAmount)
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
      .select(`
        *,
        packages (
          id,
          name,
          display_name
        )
      `)
      .order('created_at', { ascending: false });
    if (data && !error) setUsers(data);
    setLoading(false);
  };

  const updateUserStatus = async (userId: string, status: string) => {
    let result;
    switch (status) {
      case 'active': result = await approveUser(userId); break;
      case 'locked': result = await lockAccount(userId); break;
      case 'suspended': result = await lockAccount(userId); break;
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

  // --- BALANCE MODAL LOGIC ---
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

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Card><CardHeader><CardTitle>User Management</CardTitle></CardHeader><CardContent>Loading...</CardContent></Card>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.profile_image_url || "/placeholder-avatar.png"} />
                  <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.full_name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'active')}>
                      <CheckCircle className="h-4 w-4 mr-2" /> Activate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openPackageDialog(user)}>
                      <Package className="h-4 w-4 mr-2" /> Upgrade Package
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openBalanceDialog(user, 'increase')}>
                      <CheckCircle className="h-4 w-4 mr-2" /> Top Up Balance
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openBalanceDialog(user, 'decrease')}>
                      <XCircle className="h-4 w-4 mr-2" /> Reduce Balance
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'suspended')}>
                      <Lock className="h-4 w-4 mr-2" /> Suspend
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'locked')}>
                      <XCircle className="h-4 w-4 mr-2" /> Lock
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Package Dialog */}
      <Dialog open={packageDialog} onOpenChange={setPackageDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upgrade/Downgrade Package</DialogTitle></DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
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
              <div className="flex space-x-2">
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
                <div>{selectedUser.full_name} ({selectedUser.email})</div>
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
                <Label>Admin Notes</Label>
                <Input value={balanceAdminNotes} onChange={(e) => setBalanceAdminNotes(e.target.value)} placeholder="Reason for adjustment" />
              </div>
              {currentBalance !== null && (
                <div>
                  <div>Current Balance: {currentBalance.toLocaleString()}</div>
                  <div className={`${newBalance < 0 ? 'text-red-600' : 'text-green-700'}`}>New Balance: {newBalance.toLocaleString()}</div>
                </div>
              )}
              <div className="flex space-x-2">
                <Button onClick={handleBalanceAdjustment} disabled={balanceAmount <= 0 || newBalance < 0}>Confirm</Button>
                <Button variant="outline" onClick={() => setBalanceDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
