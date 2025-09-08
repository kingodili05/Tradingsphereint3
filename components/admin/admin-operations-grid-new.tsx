'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/lib/database.types';
import { useAdminActions } from '@/hooks/use-admin-actions';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { Package as PackageType } from '@/lib/database.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  User,
  Edit,
  TrendingUp,
  ArrowDownToLine,
  Lock,
  Unlock,
  CheckCircle,
  Shield,
  Mail,
  MessageSquare,
  BarChart3,
  Eye,
} from 'lucide-react';

interface AdminOperationsGridProps {
  selectedUser: Profile | null;
  onUserUpdate: () => void;
  onBalanceUpdate: (currency: string, amount: number) => void;
}

export function AdminOperationsGrid({ 
  selectedUser, 
  onUserUpdate,
  onBalanceUpdate
}: AdminOperationsGridProps) {
  const { user } = useAuth();
  const { 
    approveUser,
    lockAccount,
    unlockAccount,
    updateBalance,
    toggleVerification,
    activateDemoAccount,
    activateLiveAccount,
    sendMessage,
    upgradeUserPackage,
    loading: actionLoading
  } = useAdminActions();

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
      onUserUpdate();
    }
  };

  const [balanceDialog, setBalanceDialog] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  const [packageDialog, setPackageDialog] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [messageData, setMessageData] = useState({
    title: '',
    content: '',
    type: 'notification',
    important: false,
  });

  const handleUserAction = async (action: string) => {
    if (!selectedUser) return;

    let result;
    switch (action) {
      case 'approve_user':
        result = await approveUser(selectedUser.id);
        break;
      case 'lock_account':
        result = await lockAccount(selectedUser.id);
        break;
      case 'unlock_account':
        result = await unlockAccount(selectedUser.id);
        break;
      case 'verify_email':
        result = await toggleVerification(selectedUser.id, 'is_email_verified', selectedUser.is_email_verified);
        break;
      case 'verify_identity':
        result = await toggleVerification(selectedUser.id, 'is_identity_verified', selectedUser.is_identity_verified);
        break;
      case 'verify_residency':
        result = await toggleVerification(selectedUser.id, 'is_residency_verified', selectedUser.is_residency_verified);
        break;
      case 'activate_demo':
        result = await activateDemoAccount(selectedUser.id);
        break;
      case 'activate_live':
        result = await activateLiveAccount(selectedUser.id);
        break;
      default:
        return;
    }
    
    if (result.success) {
      onUserUpdate();
    }
  };

  const handleEditBalance = async () => {
    if (!selectedUser || !newBalance) return;
    
    const amount = parseFloat(newBalance);
    if (isNaN(amount)) return;

    const result = await updateBalance(selectedUser.id, selectedCurrency, amount);
    if (result.success) {
      onBalanceUpdate(selectedCurrency, amount);
      setBalanceDialog(false);
      setNewBalance('');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !messageData.title || !messageData.content) return;

    const result = await sendMessage({
      recipient_type: 'specific',
      recipient_id: selectedUser.id,
      title: messageData.title,
      content: messageData.content,
      message_type: messageData.type,
      is_important: messageData.important,
    }, [selectedUser], user?.id || 'admin');

    if (result.success) {
      setMessageDialog(false);
      setMessageData({
        title: '',
        content: '',
        type: 'notification',
        important: false,
      });
    }
  };

  const operations = [
    {
      label: `User ID Approval (${selectedUser?.account_status === 'pending' ? 'NOT' : 'DONE'})`,
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: User,
      action: () => handleUserAction('approve_user'),
      disabled: actionLoading || !selectedUser || selectedUser.account_status === 'active',
    },
    {
      label: 'Edit Account Balance / Details',
      color: 'bg-green-500 hover:bg-green-600',
      icon: Edit,
      action: () => setBalanceDialog(true),
      disabled: actionLoading || !selectedUser,
    },
    {
      label: 'Live Account Trade',
      color: 'bg-cyan-500 hover:bg-cyan-600',
      icon: TrendingUp,
      action: () => handleUserAction('activate_live'),
      disabled: actionLoading || !selectedUser,
    },
    {
      label: 'Add/View Deposit History',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      icon: ArrowDownToLine,
      action: () => window.open('/admin/deposits', '_blank'),
      disabled: false,
    },
    {
      label: `General Lock (${selectedUser?.account_status === 'locked' ? 'LOCKED' : 'UNLOCK'})`,
      color: 'bg-red-500 hover:bg-red-600',
      icon: selectedUser?.account_status === 'locked' ? Lock : Unlock,
      action: () => {
        const action = selectedUser?.account_status === 'locked' ? 'unlock_account' : 'lock_account';
        handleUserAction(action);
      },
      disabled: actionLoading || !selectedUser,
    },
    {
      label: `Account Upgrade Lock (${selectedUser?.account_status === 'suspended' ? 'LOCKED' : 'UNLOCK'})`,
      color: 'bg-gray-500 hover:bg-gray-600',
      icon: Lock,
      action: () => {
        const action = selectedUser?.account_status === 'suspended' ? 'unlock_account' : 'lock_account';
        handleUserAction(action);
      },
      disabled: actionLoading || !selectedUser,
    },
    {
      label: 'Upgrade/Downgrade Package',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      icon: Edit,
      action: () => setPackageDialog(true),
      disabled: actionLoading || !selectedUser,
    },
    {
      label: 'Trade Signal Lock (UNLOCK)',
      color: 'bg-gray-700 hover:bg-gray-800',
      icon: Lock,
      action: () => window.open('/admin/trades', '_blank'),
      disabled: false,
    },
    {
      label: 'Approve Deposit Request (0)',
      color: 'bg-green-600 hover:bg-green-700',
      icon: CheckCircle,
      action: () => window.open('/admin/deposits', '_blank'),
      disabled: false,
    },
    {
      label: `Residency Verifications (${selectedUser?.is_residency_verified ? 'Y' : 'N'})`,
      color: 'bg-red-600 hover:bg-red-700',
      icon: Shield,
      action: () => handleUserAction('verify_residency'),
      disabled: actionLoading || !selectedUser,
    },
    {
      label: 'View/Send Email To Inbox',
      color: 'bg-cyan-600 hover:bg-cyan-700',
      icon: Mail,
      action: () => setMessageDialog(true),
      disabled: !selectedUser,
    },
    {
      label: `Activate Demo Request (${selectedUser?.account_type === 'demo' ? 'ACTIVE' : 'INACTIVE'})`,
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: CheckCircle,
      action: () => handleUserAction('activate_demo'),
      disabled: actionLoading || !selectedUser,
    },
    {
      label: 'View Received Messages',
      color: 'bg-yellow-600 hover:bg-yellow-700',
      icon: MessageSquare,
      action: () => window.open('/admin/messages', '_blank'),
      disabled: false,
    },
    {
      label: 'Pending Live Trade Order (5)',
      color: 'bg-green-700 hover:bg-green-800',
      icon: BarChart3,
      action: () => window.open('/admin/trades?filter=live', '_blank'),
      disabled: false,
    },
    {
      label: 'Pending Demo Trade Order (5)',
      color: 'bg-red-700 hover:bg-red-800',
      icon: BarChart3,
      action: () => window.open('/admin/trades?filter=demo', '_blank'),
      disabled: false,
    },
    {
      label: 'Demo Account Trade',
      color: 'bg-gray-600 hover:bg-gray-700',
      icon: TrendingUp,
      action: () => handleUserAction('activate_demo'),
      disabled: actionLoading || !selectedUser,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {operations.map((operation, index) => (
          <Button
            key={index}
            className={`${operation.color} text-white p-4 h-auto flex flex-col items-center justify-center min-h-[80px] text-center`}
            onClick={operation.action}
            disabled={operation.disabled}
          >
            <operation.icon className="h-6 w-6 mb-2" />
            <span className="text-xs leading-tight">
              {operation.label}
            </span>
          </Button>
        ))}
      </div>

      {/* Balance Edit Dialog */}
      <Dialog open={balanceDialog} onOpenChange={setBalanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                  <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>New Balance</Label>
              <Input
                type="number"
                placeholder="Enter new balance"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleEditBalance} disabled={actionLoading} className="flex-1">
                {actionLoading ? 'Updating...' : 'Update Balance'}
              </Button>
              <Button variant="outline" onClick={() => setBalanceDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Package Upgrade Dialog */}
      <Dialog open={packageDialog} onOpenChange={setPackageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade/Downgrade User Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
              <Button onClick={handleUpgradePackage} disabled={actionLoading} className="flex-1">
                {actionLoading ? 'Updating...' : 'Update Package'}
              </Button>
              <Button variant="outline" onClick={() => setPackageDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialog} onOpenChange={setMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message Type</Label>
              <Select value={messageData.type} onValueChange={(value) => setMessageData({...messageData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                  <SelectItem value="admin">Admin Message</SelectItem>
                  <SelectItem value="system">System Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Message title"
                value={messageData.title}
                onChange={(e) => setMessageData({...messageData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={4}
                placeholder="Message content"
                value={messageData.content}
                onChange={(e) => setMessageData({...messageData, content: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="important"
                checked={messageData.important}
                onChange={(e) => setMessageData({...messageData, important: e.target.checked})}
              />
              <Label htmlFor="important">Mark as important</Label>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSendMessage} disabled={actionLoading} className="flex-1">
                {actionLoading ? 'Sending...' : 'Send Message'}
              </Button>
              <Button variant="outline" onClick={() => setMessageDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}