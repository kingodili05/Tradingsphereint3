'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/lib/database.types';
import { useAdminActions } from '@/hooks/use-admin-actions';
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
} from 'lucide-react';

interface AdminOperationsGridProps {
  selectedUser: Profile | null;
  onUserUpdate: () => void;
}

export function AdminOperationsGrid({ 
  selectedUser, 
  onUserUpdate
}: AdminOperationsGridProps) {
  const { 
    approveUser,
    lockAccount,
    unlockAccount,
    updateBalance,
    toggleVerification,
    activateDemoAccount,
    activateLiveAccount,
    loading: actionLoading
  } = useAdminActions();

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

  const handleEditBalance = () => {
    if (!selectedUser) return;
    
    const newBalance = prompt('Enter new USD balance:');
    if (newBalance && !isNaN(parseFloat(newBalance))) {
      updateBalance(selectedUser.id, 'USD', parseFloat(newBalance)).then((result) => {
        if (result.success) {
          onUserUpdate();
        }
      });
    }
  };

  const operations = [
    {
      label: 'User ID Approval (NOT)',
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: User,
      action: () => handleUserAction('approve_user'),
      disabled: actionLoading || !selectedUser,
    },
    {
      label: 'Edit Account Balance / Details',
      color: 'bg-green-500 hover:bg-green-600',
      icon: Edit,
      action: handleEditBalance,
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
      action: () => window.open('/admin/messages', '_blank'),
      disabled: false,
    },
    {
      label: 'Activate Demo Request (1)',
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
      action: () => window.open('/admin/trades', '_blank'),
      disabled: false,
    },
    {
      label: 'Pending Demo Trade Order (5)',
      color: 'bg-red-700 hover:bg-red-800',
      icon: BarChart3,
      action: () => window.open('/admin/trades', '_blank'),
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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {operations.map((operation, index) => (
        <Button
          key={index}
          className={`${operation.color} text-white p-4 h-auto flex flex-col items-center justify-center min-h-[80px]`}
          onClick={operation.action}
          disabled={operation.disabled}
        >
          <operation.icon className="h-6 w-6 mb-2" />
          <span className="text-xs text-center leading-tight">
            {operation.label}
          </span>
        </Button>
      ))}
    </div>
  );
}