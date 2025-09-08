'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useUserActions } from '@/hooks/use-user-actions';
import { useRouter } from 'next/navigation';
import { DashboardModals } from '@/components/dashboard/dashboard-modals';
import { DashboardTopbar } from '@/components/dashboard/dashboard-topbar'; // ✅ Import topbar
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  ArrowUpFromLine,
  ArrowDownFromLine,
  User,
  Home,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  HelpCircle,
  LogOut,
  Info
} from 'lucide-react';
import { signOut } from '@/lib/supabase-client';
import { toast } from 'sonner';
import Link from 'next/link';
import { TradingViewTicker } from '@/components/dashboard/tradingview-ticker';

// Define a type for the sidebar items
interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  active?: boolean;
  modal?: string;
  badge?: number;
}

export default function DepositPage() {
  const { user, profile } = useAuth();
  const { requestDeposit, requestDemoAccount, requestLiveAccount, loading: actionLoading } = useUserActions();
  const router = useRouter();

  const [selectedDeposit, setSelectedDeposit] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositAlert, setShowDepositAlert] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
    } catch (error) {
      toast.error('An error occurred during logout');
    }
  };

  const handleDepositSubmit = async (method: string) => {
    if (!user || !depositAmount) return;
    setIsProcessing(true);
    setTimeout(async () => {
      setIsProcessing(false);
      setSelectedDeposit(null);
      setShowDepositAlert(true);
      await requestDeposit(user.id, {
        amount: parseFloat(depositAmount),
        currency: 'USD',
        payment_method: method,
      });
    }, 2500);
  };

  const handleAlertOkay = () => {
    setShowDepositAlert(false);
    setDepositAmount('');
  };

  const handleRequestDemo = async () => {
    if (!user) return;
    await requestDemoAccount(user.id);
  };

  const handleRequestLive = async () => {
    if (!user) return;
    await requestLiveAccount(user.id);
  };

  const depositMethods = [
    { id: 'bitcoin', name: 'Bitcoin Deposit', logo: '₿', logoColor: 'text-orange-500', logoBg: 'bg-orange-100', method: 'crypto' },
    { id: 'ethereum', name: 'Ethereum Deposit', logo: 'Ξ', logoColor: 'text-blue-600', logoBg: 'bg-blue-100', method: 'crypto' },
    { id: 'bitcoin_cash', name: 'Bitcoin Cash Deposit', logo: 'BCH', logoColor: 'text-green-600', logoBg: 'bg-green-100', method: 'crypto' },
    { id: 'tether', name: 'Tether Deposit', logo: '₮', logoColor: 'text-green-700', logoBg: 'bg-green-100', method: 'crypto' },
    { id: 'cardano', name: 'Cardano Deposit', logo: 'ADA', logoColor: 'text-blue-700', logoBg: 'bg-blue-100', method: 'crypto' },
    { id: 'western_union', name: 'Western Union', logo: 'WU', logoColor: 'text-yellow-600', logoBg: 'bg-yellow-100', method: 'wire_transfer' }
  ];

  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: 'Home', href: '/dashboard', active: true },
    { icon: TrendingUp, label: 'Trades', modal: 'trades' },
    { icon: DollarSign, label: 'Finance', modal: 'finance' },
    { icon: User, label: 'Profile', modal: 'profile' },
    { icon: ShoppingCart, label: 'Markets', modal: 'markets' },
    { icon: Package, label: 'Packages', modal: 'packages' },
    { icon: HelpCircle, label: 'Help', modal: 'help' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'black' }}>
      {/* TradingView Ticker */}
      <TradingViewTicker />

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
            {sidebarItems.map((item, index) =>
              item.href ? (
                <Link key={index} href={item.href}>
                  <div className={`flex flex-col items-center p-2 rounded-lg transition-colors relative ${
                    item.active ? 'bg-green-600' : 'hover:bg-gray-700'
                  }`}>
                    <item.icon className="h-6 w-6 text-white mb-1" />
                    <span className="text-xs text-white text-center">{item.label}</span>
                  </div>
                </Link>
              ) : (
                <button key={index} onClick={() => setActiveModal(item.modal!)} className="w-full">
                  <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors relative">
                    <item.icon className="h-6 w-6 text-white mb-1" />
                    <span className="text-xs text-white text-center">{item.label}</span>
                  </div>
                </button>
              )
            )}

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
          {/* ✅ Use shared DashboardTopbar */}
          <DashboardTopbar
            profile={profile}
            onRequestDemo={handleRequestDemo}
            onRequestLive={handleRequestLive}
          />

          {/* Page Content */}
          <div className="p-4">
            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Link href="/finance"><Button className="text-white border border-green-500 hover:bg-black" style={{ backgroundColor: '#1D2330' }}>Deposit History</Button></Link>
              <Link href="/markets/digital-currencies"><Button className="text-white border border-green-500 hover:bg-black" style={{ backgroundColor: '#1D2330' }}>Buy Cryptocurrency</Button></Link>
              <Link href="/finance"><Button className="text-white border border-green-500 hover:bg-black hidden md:block" style={{ backgroundColor: '#1D2330' }}>Withdraw Funds</Button></Link>
              <Link href="/finance"><Button className="text-white border border-green-500 hover:bg-black hidden md:block" style={{ backgroundColor: '#1D2330' }}>Withdrawal History</Button></Link>
            </div>

            {/* Header */}
            <div className="mb-6">
              <div className="text-white p-3 mb-5 font-bold" style={{ backgroundColor: '#1D2330' }}>
                <span className="pl-2">Select a Deposit Method</span>
              </div>
              <div className="text-white p-3 mb-5 font-bold border border-yellow-500 border-dashed" style={{ backgroundColor: '#714200' }}>
                <ArrowUpFromLine className="inline h-5 w-5 mr-2" />
                Select any of our convenient methods of making deposit to your account.
              </div>
            </div>

            {/* Deposit Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {depositMethods.map((method) => (
                <div
                  key={method.id}
                  className="text-center p-6 border-2 border-dashed border-green-500 rounded cursor-pointer hover:scale-95 transition-all"
                  style={{ backgroundColor: '#1D2330', minHeight: '150px' }}
                  onClick={() => setSelectedDeposit(method.id)}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className={`w-16 h-16 ${method.logoBg} rounded-full flex items-center justify-center mb-4 border-2 border-gray-600`}>
                      <span className={`${method.logoColor} font-bold text-xl`}>{method.logo}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg">{method.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Crypto Chart */}
            <div className="rounded border border-gray-600 overflow-hidden" style={{ height: '560px', backgroundColor: '#1D2330', boxShadow: 'inset 0 -20px 0 0 #262B38' }}>
              <div className="h-full p-1">
                <iframe
                  src="https://widget.coinlib.io/widget?type=chart&theme=dark&coin_id=859&pref_coin_id=1505"
                  width="100%"
                  height="536"
                  scrolling="auto"
                  className="border-0"
                  title="Crypto Chart"
                />
              </div>
              <div className="text-right pr-2 pb-2">
                <span className="text-gray-400 text-xs">
                  powered by{' '}
                  <a href="https://coinlib.io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    Coinlib
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modals */}
      {depositMethods.map((method) => (
        <Dialog key={method.id} open={selectedDeposit === method.id} onOpenChange={(open) => !open && setSelectedDeposit(null)}>
          <DialogContent className="max-w-md" style={{ backgroundColor: '#1D2330', border: '1px solid white' }}>
            <DialogHeader>
              <DialogTitle className="text-white font-bold">{method.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Enter Amount To Deposit</Label>
                <div className="flex">
                  <Input
                    type="number"
                    placeholder="Enter Amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white rounded-r-none"
                    required
                  />
                  <div className="bg-red-500 text-black font-bold px-3 py-2 rounded-r">USD</div>
                </div>
              </div>
              <Button
                onClick={() => handleDepositSubmit(method.method)}
                disabled={actionLoading || !depositAmount || isProcessing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? 'Processing...' : actionLoading ? 'Submitting...' : 'Preview'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ))}

      {/* Deposit Alert Dialog */}
      <Dialog open={showDepositAlert} onOpenChange={setShowDepositAlert}>
        <DialogContent className="max-w-md text-center" style={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}>
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center">
                <Info className="h-8 w-8 text-gray-500" />
              </div>
            </div>
            <DialogTitle className="text-gray-800 text-xl font-normal leading-relaxed">
              For Your Deposit of ${depositAmount}, Please contact support or our Live Chat for a secured Bitcoin wallet address
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button onClick={handleAlertOkay} className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-2 rounded">
              Okay!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dashboard Modals */}
      <DashboardModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
