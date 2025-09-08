'use client';

import { Home, TrendingUp, DollarSign, User, Mail, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const navigation = [
  { name: 'Home', icon: Home, href: '/dashboard', active: true },
  { name: 'Trades', icon: TrendingUp, href: '/trading' },
  { name: 'Finance', icon: DollarSign, href: '/finance' },
  { name: 'Profile', icon: User, href: '/profile' },
  { name: 'Mailbox', icon: Mail, href: '/mailbox', badge: '1' },
  { name: 'Markets', icon: ShoppingCart, href: '/markets' },
];

export function TradingSidebar() {
  return (
    <div className="w-20 bg-gray-800 flex flex-col items-center py-4 space-y-6">
      {/* Logo */}
      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
        <TrendingUp className="h-6 w-6 text-black" />
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col space-y-4">
        {navigation.map((item) => (
          <Link key={item.name} href={item.href}>
            <div className={cn(
              "relative w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
              item.active ? "bg-green-500 text-black" : "text-gray-400 hover:text-white hover:bg-gray-700"
            )}>
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {item.badge}
                </div>
              )}
              <div className="absolute left-16 bg-gray-700 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.name}
              </div>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}