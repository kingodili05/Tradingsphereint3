'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { signOut } from '@/lib/supabase-client';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Wallet,
  Mail,
  Settings,
  HelpCircle,
  Package as PackageIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Target,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Markets', href: '/markets', icon: TrendingUp },
  { name: 'Trading', href: '/trading', icon: BarChart3 },
  { name: 'Signals', href: '/signals', icon: Target },
  { name: 'Portfolio', href: '/portfolio', icon: Wallet },
  { name: 'Finance', href: '/user-finance', icon: Wallet },
  { name: 'Messages', href: '/user-messages', icon: Mail },
  { name: 'Profile', href: '/user-profile', icon: Settings },
  { name: 'Packages', href: '/user-packages', icon: PackageIcon },
  { name: 'Support', href: '/user-support', icon: HelpCircle },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error('Failed to logout: ' + error.message);
      } else {
        toast.success('Logged out successfully');
        router.push('/');
      }
    } catch (error) {
      toast.error('An error occurred during logout');
    }
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-lg">TradingSphere</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed && "px-2"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Button>
              </Link>
            );
          })}
          
          <div className="mt-auto pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
                collapsed && "px-2"
              )}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}