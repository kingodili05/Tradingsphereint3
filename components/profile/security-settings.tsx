'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useUserActions } from '@/hooks/use-user-actions';

export function SecuritySettings() {
  const { changePassword, loading: actionLoading } = useUserActions();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    emailNotifications: true,
    loginAlerts: false,
  });

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword.trim()) {
      toast.error('Please enter your current password');
      return;
    }
    
    if (!passwordData.newPassword.trim()) {
      toast.error('Please enter a new password');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
        console.error('Password verification failed:', verifyError);
        if (verifyError.message.includes('Invalid login credentials')) {
          toast.error('Current password is incorrect. Please try again.');
        } else {
          toast.error('Unable to verify current password. Please try again.');
        console.error('Password update failed:', updateError);
        }
    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (result.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Change Password</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
            <Button onClick={handlePasswordChange} className="w-full">
              {actionLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t">
          <h3 className="font-semibold">Security Options</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch
                checked={securitySettings.twoFactor}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactor: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive security alerts via email</p>
              </div>
              <Switch
                checked={securitySettings.emailNotifications}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, emailNotifications: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Login Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified of new device logins</p>
              </div>
              <Switch
                checked={securitySettings.loginAlerts}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, loginAlerts: checked })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}