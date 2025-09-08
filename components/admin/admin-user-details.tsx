'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/lib/database.types';
import { CheckCircle, XCircle } from 'lucide-react';

interface AdminUserDetailsProps {
  selectedUser: Profile | null;
}

export function AdminUserDetails({ selectedUser }: AdminUserDetailsProps) {
  if (!selectedUser) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No user selected</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'locked': return 'bg-red-500';
      case 'suspended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <p className="text-lg font-semibold">{selectedUser.full_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-lg">{selectedUser.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Account Status</label>
              <Badge className={getStatusColor(selectedUser.account_status)}>
                {selectedUser.account_status.toUpperCase()}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Package</label>
              <p className="text-lg font-semibold">
                {(selectedUser as any).packages?.display_name || 'STARTER'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Verified</label>
              <div className="flex items-center space-x-2">
                {selectedUser.is_email_verified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>{selectedUser.is_email_verified ? 'Verified' : 'Not Verified'}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Identity Verified</label>
              <div className="flex items-center space-x-2">
                {selectedUser.is_identity_verified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>{selectedUser.is_identity_verified ? 'Verified' : 'Not Verified'}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Residency Verified</label>
              <div className="flex items-center space-x-2">
                {selectedUser.is_residency_verified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>{selectedUser.is_residency_verified ? 'Verified' : 'Not Verified'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Total Deposits</label>
              <p className="text-lg font-semibold">${selectedUser.total_deposits.toFixed(2)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Total Withdrawals</label>
              <p className="text-lg font-semibold">${selectedUser.total_withdrawals.toFixed(2)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Account Type</label>
              <Badge variant={selectedUser.account_type === 'live' ? 'default' : 'secondary'}>
                {selectedUser.account_type.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Country</label>
              <p className="text-lg">{selectedUser.country || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <p className="text-lg">{selectedUser.phone_number || 'Not specified'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Created At</label>
              <p className="text-lg">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Updated</label>
              <p className="text-lg">{new Date(selectedUser.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}