'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useAdminData } from '@/hooks/use-admin-data';
import { AdminSidebar } from './admin-sidebar-new';
import { AdminUserSelector } from './admin-user-selector';
import { AdminUserProfile } from './admin-user-profile';
import { AdminBalanceCards } from './admin-balance-cards';
import { AdminOperationsGrid } from './admin-operations-grid-new';
import { Profile, Balance } from '@/lib/database.types';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

export function AdminDashboardInterface() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { users, loading, error, refetchUsers } = useAdminData();
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [userBalances, setUserBalances] = useState<Balance[]>([]);

  // Set first user as selected by default
  useEffect(() => {
    if (users && users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  // Fetch balances for selected user
  useEffect(() => {
    if (selectedUser) {
      fetchUserBalances(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchUserBalances = async (userId: string) => {
    if (!supabase) return;

    const { data } = await supabase
      .from('balances')
      .select('*')
      .eq('user_id', userId);

    if (data) {
      setUserBalances(data);
    }
  };

  const handleUserUpdate = () => {
    refetchUsers();
    if (selectedUser) {
      // Refresh selected user data
      const updatedUser = users?.find(u => u.id === selectedUser.id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
      fetchUserBalances(selectedUser.id);
    }
  };

  const handleBalanceUpdate = async (currency: string, amount: number) => {
    if (!supabase || !selectedUser) return;

    try {
      const { error } = await supabase
        .from('balances')
        .upsert({
          user_id: selectedUser.id,
          currency,
          balance: amount,
          available_balance: amount,
        });

      if (error) throw error;
      
      toast.success(`${currency} balance updated to ${amount}`);
      await fetchUserBalances(selectedUser.id);
    } catch (error: any) {
      toast.error('Failed to update balance: ' + error.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-900">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
            <p className="text-gray-400">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <AdminUserSelector
              users={users || []}
              selectedUser={selectedUser}
              onUserSelect={setSelectedUser}
            />
          </div>

          {/* Balance Cards */}
          <AdminBalanceCards
            balances={userBalances}
            selectedUser={selectedUser}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile */}
            <div className="lg:col-span-1">
              <AdminUserProfile selectedUser={selectedUser} />
            </div>

            {/* Operations Grid */}
            <div className="lg:col-span-2">
              <AdminOperationsGrid
                selectedUser={selectedUser}
                onUserUpdate={handleUserUpdate}
                onBalanceUpdate={handleBalanceUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}