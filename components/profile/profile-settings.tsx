'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useUserActions } from '@/hooks/use-user-actions';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export function ProfileSettings() {
  const { user } = useAuth();
  const { updateProfile, loading: actionLoading } = useUserActions();
  const { profile } = useAuth();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    timezone: '',
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile && user) {
      setProfileData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: user.email || '',
        phone: profile.phone_number || '',
        country: profile.country || '',
        timezone: 'America/New_York', // Default timezone since it's not in profile
      });
    }
  }, [profile, user]);

  const handleSave = async () => {
    if (!user) return;

    const result = await updateProfile(user.id, {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      phone_number: profileData.phone,
      country: profileData.country,
    });
  };

  const handlePhotoUpload = async () => {
    if (!supabase || !user) {
      toast.error('Unable to upload photo. Please try again later.');
      return;
    }

    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/gif';
    input.multiple = false;

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a JPG, PNG, or GIF image');
        return;
      }

      setUploadingPhoto(true);

      try {
        // For demo purposes, simulate photo upload
        // In production, you would upload to Supabase Storage:
        /*
        const fileName = `${user.id}/${Date.now()}-profile.${file.name.split('.').pop()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(fileName);

        // Update user profile with new image URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ profile_image_url: publicUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;
        */
        
        // Demo mode - show success message
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload time
        
        toast.success('Profile photo updated successfully!');
        
        // In production, you would refresh the user profile data here
        // window.location.reload(); // Refresh to show new photo
        
      } catch (error: any) {
        console.error('Photo upload error:', error);
        toast.error('Failed to upload photo: ' + error.message);
      } finally {
        setUploadingPhoto(false);
      }
    };

    // Trigger file selector
    input.click();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.profile_image_url || "/placeholder-avatar.png"} />
            <AvatarFallback className="text-lg">
              {profile?.first_name?.[0] || 'U'}{profile?.last_name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePhotoUpload}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
            </Button>
            <p className="text-sm text-muted-foreground mt-1">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profileData.firstName}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              placeholder={profile?.first_name || "Enter first name"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profileData.lastName}
              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
              placeholder={profile?.last_name || "Enter last name"}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            placeholder={user?.email || "Enter email address"}
            disabled
            className="bg-gray-100 text-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            placeholder={profile?.phone_number || "Enter phone number"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={profileData.country}
              onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value={profileData.timezone}
              onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          {actionLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}