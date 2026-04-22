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
import { signIn, supabase } from '@/lib/supabase-client';
import { TrendingUp } from 'lucide-react';

export default function LoginPage() {
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
      console.log('Attempting login for:', formData.email);
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        toast.error(error.message);
      } else if (data?.user && supabase) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_admin, account_status')
          .eq('id', data.user.id)
          .single();

        const status = profileData?.account_status;
        if (status === 'locked') {
          await supabase.auth.signOut();
          toast.error('Your account has been locked. Please contact support.');
          return;
        }
        if (status === 'suspended') {
          await supabase.auth.signOut();
          toast.error('Your account has been suspended. Please contact support.');
          return;
        }

        toast.success('Login successful!');
        setTimeout(() => {
          router.push(profileData?.is_admin ? '/admin' : '/dashboard');
        }, 100);
      }
    } catch (error) {
      console.error('Login exception:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl">TradingSphereIntl</span>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your trading account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}