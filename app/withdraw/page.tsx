'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useUserActions } from '@/hooks/use-user-actions';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowUpFromLine, 
  ArrowDownFromLine, 
  User, 
  Mail, 
  Bell, 
  Maximize, 
  Menu,
  Home,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { signOut } from '@/lib/supabase-client';
import { toast } from 'sonner';
import Link from 'next/link';
import { TradingViewTicker } from '@/components/dashboard/tradingview-ticker';
import { DashboardModals } from '@/components/dashboard/dashboard-modals';
import { DashboardTopbar } from '@/components/dashboard/dashboard-topbar'; // ✅ Import topbar

export default function WithdrawPage() {
  const { user, profile } = useAuth();
  const { requestWithdrawal, requestDemoAccount, requestLiveAccount, loading: actionLoading } = useUserActions();
  const router = useRouter();
  
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<string | null>(null);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    address: '',
    bankDetails: '',
  });
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error('Failed to logout: ' + error.message);
      } else {
        toast.success('Logged out successfully');
        router.push('/');
      }
    } catch {
      toast.error('An error occurred during logout');
    }
  };

  const handleWithdrawalSubmit = async (method: string, currency: string) => {
    if (!user || !withdrawalData.amount) return;

    const withdrawalRequest = {
      amount: parseFloat(withdrawalData.amount),
      currency: currency,
      withdrawal_method: method,
      destination_address: method === 'crypto' ? withdrawalData.address : undefined,
      bank_details: method === 'bank_transfer' ? { details: withdrawalData.bankDetails } : undefined,
    };

    const result = await requestWithdrawal(user.id, withdrawalRequest);

    if (result.success) {
      setSelectedWithdrawal(null);
      setWithdrawalData({ amount: '', address: '', bankDetails: '' });
    }
  };

  const handleRequestDemo = async () => {
    if (!user) return;
    await requestDemoAccount(user.id);
  };

  const handleRequestLive = async () => {
    if (!user) return;
    await requestLiveAccount(user.id);
  };

  const withdrawalMethods = [
    {
      id: 'bitcoin',
      name: 'Bitcoin Method',
      image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
      method: 'crypto',
      currency: 'BTC'
    },
    {
      id: 'ethereum',
      name: 'Ethereum Method', 
      image: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
      method: 'crypto',
      currency: 'ETH'
    },
    {
      id: 'bitcoin_cash',
      name: 'Bitcoin Cash Method',
      image: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg',
      method: 'crypto',
      currency: 'BCH'
    },
    {
      id: 'bank_deposit',
      name: 'Bank Deposit',
      image: 'https://via.placeholder.com/70x70/22c55e/000000?text=BANK',
      method: 'bank_transfer',
      currency: 'USD'
    }
  ];

  const sidebarItems = [
    { icon: Home, label: 'Home', href: '/dashboard', active: true },
    { icon: TrendingUp, label: 'Trades', modal: 'trades' },
    { icon: DollarSign, label: 'Finance', modal: 'finance' },
    { icon: User, label: 'Profile', modal: 'profile' },
    { icon: Mail, label: 'Mailbox', modal: 'mailbox', badge: 1 },
    { icon: ShoppingCart, label: 'Markets', modal: 'markets' },
    { icon: Package, label: 'Packages', modal: 'packages' },
    { icon: HelpCircle, label: 'Help', modal: 'help' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'black' }}>
      {/* TradingView Ticker */}
      {/* <TradingViewTicker /> */}

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className="fixed left-0 top-0 h-full border-r border-gray-700 z-40"
          style={{ width: '90px', backgroundColor: '#1D2330', marginTop: '48px' }}
        >
          {/* Logo */}
          <Link href="/dashboard" className="block p-4">
            <div className="w-12 h-12 bg-green-500 rounded-full mx-auto flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-black" />
            </div>
          </Link>

          {/* User Avatar */}
          <div className="px-4 mb-4">
            <div className="w-12 h-12 bg-gray-600 rounded-full mx-auto border-2 border-gray-600 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-2 space-y-2">
            {sidebarItems.map((item, index) => (
              item.href ? (
                <Link key={index} href={item.href}>
                  <div className={`flex flex-col items-center p-2 rounded-lg transition-colors relative ${
                    item.href === '/dashboard' ? 'bg-green-600' : 'hover:bg-gray-700'
                  }`}>
                    <item.icon className="h-6 w-6 text-white mb-1" />
                    <span className="text-xs text-white text-center">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => setActiveModal(item.modal!)}
                  className="w-full"
                >
                  <div className="flex flex-col items-center p-2 rounded-lg transition-colors hover:bg-gray-700 relative">
                    <item.icon className="h-6 w-6 text-white mb-1" />
                    <span className="text-xs text-white text-center">{item.label}</span>
                  </div>
                </button>
              )
            ))}
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut className="h-6 w-6 text-white mb-1" />
              <span className="text-xs text-white text-center">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1" style={{ marginLeft: '90px' }}>
          {/* ✅ Replaced duplicate topbar with component */}
          <DashboardTopbar 
            profile={profile} 
            onRequestDemo={handleRequestDemo} 
            onRequestLive={handleRequestLive} 
            actionLoading={actionLoading} 
          />

          {/* Page Content */}
          <div className="p-4">
            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Link href="/deposit">
                <Button className="text-white border border-green-500 hover:bg-black"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  Deposit To Account
                </Button>
              </Link>
              <Link href="/finance">
                <Button className="text-white border border-green-500 hover:bg-black"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  Withdrawal History
                </Button>
              </Link>
              <Link href="/markets/digital-currencies">
                <Button className="text-white border border-green-500 hover:bg-black hidden md:block"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  Buy Cryptocurrency
                </Button>
              </Link>
              <Link href="/trading">
                <Button className="text-white border border-green-500 hover:bg-black hidden md:block"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  Trade Account
                </Button>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-6">
              <div 
                className="text-white p-3 mb-5 font-bold"
                style={{ backgroundColor: '#1D2330', fontFamily: 'Georgia, serif' }}
              >
                <span className="pl-2">Select a Withdrawal Method</span>
              </div>

              <div 
                className="text-white p-3 mb-5 font-bold border border-yellow-500 border-dashed"
                style={{ backgroundColor: '#714200' }}
              >
                <ArrowDownFromLine className="inline h-5 w-5 mr-2" />
                Select your desired method of making withdrawal
              </div>
            </div>

            {/* Withdrawal Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {withdrawalMethods.map((method) => (
                <div
                  key={method.id}
                  className="text-center p-6 border-2 border-dashed border-green-500 rounded cursor-pointer transition-all hover:scale-95"
                  style={{ backgroundColor: '#1D2330', minHeight: '150px' }}
                  onClick={() => setSelectedWithdrawal(method.id)}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <img src={method.image} alt={method.name}
                      className="w-16 h-16 mb-4" style={{ filter: 'brightness(1.2)' }} 
                    />
                    <h3 className="text-white font-bold text-lg">{method.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Crypto Chart */}
            <div 
              className="rounded border border-gray-600 overflow-hidden"
              style={{ height: '560px', backgroundColor: '#1D2330', boxShadow: 'inset 0 -20px 0 0 #262B38' }}
            >
              <div className="h-full p-1">
                <iframe 
                  src="https://widget.coinlib.io/widget?type=chart&theme=dark&coin_id=859&pref_coin_id=1505" 
                  width="100%" height="536" scrolling="auto" className="border-0" title="Crypto Chart"
                />
              </div>
              <div className="text-right pr-2 pb-2">
                <span className="text-gray-400 text-xs">
                  powered by{' '}
                  <a href="https://coinlib.io" target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white">
                    Coinlib
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modals */}
      {withdrawalMethods.map((method) => (
        <Dialog 
          key={method.id}
          open={selectedWithdrawal === method.id} 
          onOpenChange={(open) => !open && setSelectedWithdrawal(null)}
        >
          <DialogContent 
            className="max-w-md"
            style={{ backgroundColor: '#1D2330', border: '1px solid white' }}
          >
            <DialogHeader>
              <DialogTitle className="text-white font-bold">{method.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Enter Amount To Withdraw</Label>
                <div className="flex">
                  <Input
                    type="number"
                    placeholder="Enter Amount"
                    value={withdrawalData.amount}
                    onChange={(e) => setWithdrawalData({...withdrawalData, amount: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white rounded-r-none"
                    required
                  />
                  <div className="bg-red-500 text-black font-bold px-3 py-2 rounded-r">
                    {method.currency}
                  </div>
                </div>
              </div>

              {method.method === 'crypto' && (
                <div className="space-y-2">
                  <Label className="text-white">Wallet Address</Label>
                  <Input
                    placeholder="Enter your wallet address"
                    value={withdrawalData.address}
                    onChange={(e) => setWithdrawalData({...withdrawalData, address: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              )}

              {method.method === 'bank_transfer' && (
                <div className="space-y-2">
                  <Label className="text-white">Bank Account Details</Label>
                  <Textarea
                    placeholder="Enter your bank account details (account number, routing number, bank name, etc.)"
                    value={withdrawalData.bankDetails}
                    onChange={(e) => setWithdrawalData({...withdrawalData, bankDetails: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={4}
                    required
                  />
                </div>
              )}

              <Button 
                onClick={() => handleWithdrawalSubmit(method.method, method.currency)}
                disabled={actionLoading || !withdrawalData.amount || (method.method === 'crypto' && !withdrawalData.address) || (method.method === 'bank_transfer' && !withdrawalData.bankDetails)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {actionLoading ? 'Processing...' : 'Submit Withdrawal Request'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ))}

      {/* Dashboard Modals */}
      <DashboardModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
