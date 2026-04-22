'use client';

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/lib/database.types';
import { Upload, User, CheckCircle, XCircle } from 'lucide-react';

interface AdminUserProfileProps {
  selectedUser: Profile | null;
}

export function AdminUserProfile({ selectedUser }: AdminUserProfileProps) {
  if (!selectedUser) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No user selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>User Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Account Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white text-center">
          <div className="text-sm opacity-90 mb-1">ACCOUNT BALANCE</div>
          <div className="text-2xl font-bold">$3,768</div>
          <div className="text-sm opacity-90">$</div>
        </div>

        {/* User Info */}
        <div className="text-center space-y-4">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={selectedUser.profile_image_url || "/placeholder-avatar.png"} />
            <AvatarFallback className="text-2xl">
              {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="text-xl font-semibold">{selectedUser.full_name}</h3>
            <p className="text-sm text-muted-foreground">
              Last Login = {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} WAT
            </p>
          </div>

          {/* Account Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Account Status:</span>
              <Badge className={
                selectedUser.account_status === 'active' ? 'bg-green-500' :
                selectedUser.account_status === 'pending' ? 'bg-yellow-500' :
                selectedUser.account_status === 'locked' ? 'bg-red-500' : 'bg-gray-500'
              }>
                {selectedUser.account_status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Account Type:</span>
              <Badge variant={selectedUser.account_type === 'live' ? 'default' : 'secondary'}>
                {selectedUser.account_type.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Verification Status */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Verification Status:</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Email:</span>
                <div className="flex items-center space-x-1">
                  {selectedUser.is_email_verified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={selectedUser.is_email_verified ? 'text-green-600' : 'text-red-600'}>
                    {selectedUser.is_email_verified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Identity:</span>
                <div className="flex items-center space-x-1">
                  {selectedUser.is_identity_verified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={selectedUser.is_identity_verified ? 'text-green-600' : 'text-red-600'}>
                    {selectedUser.is_identity_verified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Residency:</span>
                <div className="flex items-center space-x-1">
                  {selectedUser.is_residency_verified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={selectedUser.is_residency_verified ? 'text-green-600' : 'text-red-600'}>
                    {selectedUser.is_residency_verified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}