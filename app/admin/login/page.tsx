'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { signIn } from '@/lib/supabase-client';
import { supabase } from '@/lib/supabase-client';
import type { Database } from '@/lib/database.types';
import { Shield } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔐 Attempting admin login for:', formData.email);

      // Step 1: Sign in the user
      const { data, error } = await signIn(formData.email, formData.password);

      if (error || !data?.user) {
        console.error('❌ Login failed:', error);
        toast.error(error?.message || 'Login failed');
        return;
      }

      // Step 2: Verify admin status from database
      if (!supabase) {
        console.error('❌ Supabase client not initialized');
        toast.error('Authentication service unavailable');
        return;
      }

const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single<{ is_admin: boolean }>();

      if (profileError) {
        console.error('❌ Failed to fetch user profile:', profileError);
        toast.error('Failed to verify admin status');
        return;
      }

      if (!profileData?.is_admin) {
        console.warn('⚠️ User is not an admin:', formData.email);
        toast.error('Access denied. You are not an admin.');
        return;
      }

      // Step 3: Successful admin login
      toast.success('Admin login successful!');
      console.log('🔄 Redirecting to admin dashboard...');
      router.push('/admin');

    } catch (error) {
      console.error('❌ Login exception:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-red-600" />
            <span className="font-bold text-xl text-red-600">Admin Portal</span>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Secure access to administrative functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Admin Access Only</h4>
                <p className="text-sm text-blue-800">
                  Login is restricted to authorized administrator email accounts. Please use your registered admin email to continue.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-red-200 focus:border-red-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-red-200 focus:border-red-500"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-red-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Access Admin Panel'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">
              Need user access?{' '}
              <Link href="/auth/login" className="text-red-600 hover:underline">
                User Login
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
