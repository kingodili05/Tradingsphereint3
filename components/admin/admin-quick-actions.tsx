'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Mail, Settings } from 'lucide-react';
import Link from 'next/link';

export function AdminQuickActions() {
  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Review Trades',
      description: 'Monitor and manage trading activity',
      icon: TrendingUp,
      href: '/admin/trades',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Process Deposits',
      description: 'Approve pending deposit requests',
      icon: ArrowDownToLine,
      href: '/admin/deposits',
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      title: 'Process Withdrawals',
      description: 'Review withdrawal requests',
      icon: ArrowUpFromLine,
      href: '/admin/withdrawals',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      title: 'Send Messages',
      description: 'Communicate with users',
      icon: Mail,
      href: '/admin/messages',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Admin Settings',
      description: 'Configure admin preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className={`w-full h-auto p-4 flex flex-col items-center space-y-2 ${action.color} text-white border-0`}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}