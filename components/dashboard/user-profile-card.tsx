'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Profile } from '@/lib/database.types';
import { User, Shield, CheckCircle, XCircle } from 'lucide-react';

interface UserProfileCardProps {
  profile: Profile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      case 'locked': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.profile_image_url || "/placeholder-avatar.png"} />
            <AvatarFallback className="text-lg">
              {profile.first_name[0]}{profile.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{profile.full_name}</h3>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Account Status</span>
            <Badge className={getStatusColor(profile.account_status)}>
              {profile.account_status.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Account Type</span>
            <Badge variant={profile.account_type === 'live' ? 'default' : 'secondary'}>
              {profile.account_type.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Package Plan</span>
            <Badge variant="outline">
              {(profile as any).packages?.display_name || 'STARTER'}
            </Badge>
          </div>

          {profile.is_admin && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Admin Access</span>
              <Shield className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>

        <div className="space-y-2 pt-4 border-t">
          <h4 className="font-medium text-sm">Verification Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Email</span>
              {profile.is_email_verified ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Identity</span>
              {profile.is_identity_verified ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Residency</span>
              {profile.is_residency_verified ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}