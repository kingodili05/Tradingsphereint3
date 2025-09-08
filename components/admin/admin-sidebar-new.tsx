'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase-client';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  MessageSquare,
  Mail,
  BarChart3,
  Lock,
  FileText
} from 'lucide-react';

interface SidebarCounts {
  clients: number;
  expertTraders: number;
  depositRequests: number;
  withdrawalRequests: number;
  demoRequests: number;
  newMessages: number;
  allMessages: number;
  liveTradeOrders: number;
  demoTradeOrders: number;
}

export function AdminSidebar() {
  const [counts, setCounts] = useState<SidebarCounts>({
    clients: 0,
    expertTraders: 0,
    depositRequests: 0,
    withdrawalRequests: 0,
    demoRequests: 0,
    newMessages: 0,
    allMessages: 0,
    liveTradeOrders: 0,
    demoTradeOrders: 0,
  });

  useEffect(() => {
    fetchCounts();
    
    // Set up real-time subscriptions for counts
    if (supabase) {
      const subscription = supabase
        .channel('admin-counts')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchCounts)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'deposits' }, fetchCounts)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawals' }, fetchCounts)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchCounts)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trades' }, fetchCounts)
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const fetchCounts = async () => {
    if (!supabase) return;

    try {
      // Fetch clients count
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, account_type, account_status');

      // Fetch deposit requests
      const { data: deposits } = await supabase
        .from('deposits')
        .select('id')
        .eq('status', 'pending');

      // Fetch withdrawal requests
      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('id')
        .eq('status', 'pending');

      // Fetch messages
      const { data: messages } = await supabase
        .from('messages')
        .select('id, is_read');

      // Fetch trades
      const { data: trades } = await supabase
        .from('trades')
        .select('id, status');

      const clientsCount = profiles?.length || 0;
      const demoRequests = profiles?.filter(p => p.account_type === 'demo' && p.account_status === 'pending').length || 0;
      const liveTradeOrders = trades?.filter(t => t.status === 'open').length || 0;
      const demoTradeOrders = trades?.filter(t => t.status === 'pending').length || 0;

      setCounts({
        clients: clientsCount,
        expertTraders: profiles?.filter(p => p.account_status === 'active').length || 0,
        depositRequests: deposits?.length || 0,
        withdrawalRequests: withdrawals?.length || 0,
        demoRequests,
        newMessages: messages?.filter(m => !m.is_read).length || 0,
        allMessages: messages?.length || 0,
        liveTradeOrders,
        demoTradeOrders,
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', count: null, href: '/admin' },
    { icon: Users, label: 'Clients Tables', count: counts.clients, href: '/admin/users' },
    { icon: TrendingUp, label: 'Expert Traders', count: counts.expertTraders, href: '/admin/traders' },
    { icon: ArrowDownToLine, label: 'Deposit Request', count: counts.depositRequests, href: '/admin/deposits' },
    { icon: ArrowUpFromLine, label: 'Withdrawal Request', count: counts.withdrawalRequests, href: '/admin/withdrawals' },
    { icon: MessageSquare, label: 'Demo Request', count: counts.demoRequests, href: '/admin/demo-requests' },
    { icon: Mail, label: 'New Messages', count: counts.newMessages, href: '/admin/messages?filter=unread' },
    { icon: Mail, label: 'All Messages', count: counts.allMessages, href: '/admin/messages' },
    { icon: BarChart3, label: 'Live Trade Order', count: counts.liveTradeOrders, href: '/admin/trades?filter=live' },
    { icon: BarChart3, label: 'Demo Trade Order', count: counts.demoTradeOrders, href: '/admin/trades?filter=demo' },
    { icon: Lock, label: 'Change Admin Password', count: null, href: '/admin/settings' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold flex items-center">
          <LayoutDashboard className="h-6 w-6 mr-2" />
          Dashboard
        </h1>
      </div>
      
      <div className="px-4 mb-4 flex-shrink-0">
        <h2 className="text-sm text-gray-400 uppercase tracking-wider mb-3">Interface</h2>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
            <FileText className="h-4 w-4 mr-2" />
            Pages
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 max-h-[calc(100vh-200px)]">
        <nav className="space-y-1 pb-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
            >
              <Button
                variant="ghost"
                className="w-full justify-between text-white hover:bg-gray-800 py-3"
              >
                <div className="flex items-center">
                  <item.icon className="h-4 w-4 mr-3" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.count !== null && (
                  <Badge 
                    variant="secondary" 
                    className="bg-gray-700 text-white text-xs"
                  >
                    {item.count}
                  </Badge>
                )}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}