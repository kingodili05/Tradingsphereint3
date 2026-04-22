'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useUserActions } from '@/hooks/use-user-actions';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  ArrowUpFromLine,
  ArrowDownFromLine,
  User,
  Mail,
  Bell,
  Maximize,
  Menu,
  Wallet,
  Home,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  HelpCircle,
  LogOut,
  CheckCircle,
  XCircle,
  Lock,
} from 'lucide-react';
import { signOut } from '@/lib/supabase-client';
import Link from 'next/link';
import { TradingViewTicker } from '@/components/dashboard/tradingview-ticker';
import { DashboardModals } from '@/components/dashboard/dashboard-modals';
import { DashboardTopbar } from '@/components/dashboard/html-dashboard-topbar';
import { useMessages } from '@/hooks/use-messages';

export default function ChangePasswordPage() {
  const { user, profile } = useAuth();
  const { messages } = useMessages();
  const { changePassword, requestDemoAccount, requestLiveAccount, loading: actionLoading } = useUserActions();
  const router = useRouter();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [twoFactorAuth, setTwoFactorAuth] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const messagesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (messagesDropdownRef.current && !messagesDropdownRef.current.contains(event.target as Node)) {
        setShowMessagesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) window.alert('Failed to logout: ' + error.message);
      else {
        window.alert('Logged out successfully');
        router.push('/');
      }
    } catch {
      window.alert('An error occurred during logout');
    }
  };

  const handleRequestDemo = async () => { if (user) await requestDemoAccount(user.id); };
  const handleRequestLive = async () => { if (user) await requestLiveAccount(user.id); };

  const handleSuccessOkay = () => {
    setShowSuccessAlert(false);
  };

  const handleErrorOkay = () => {
    setShowErrorAlert(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      window.alert('Passwords do not match'); return;
    }
    if (passwordData.newPassword.length < 6) { window.alert('Password must be at least 6 characters long'); return; }
    if (!passwordData.currentPassword) { window.alert('Please enter your current password'); return; }

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setShowSuccessAlert(true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setErrorMessage('Please input correct password');
        setShowErrorAlert(true);
      }
    } catch {
      setErrorMessage('Please input correct password');
      setShowErrorAlert(true);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorAuth) {
      setErrorMessage('Please select ON or OFF');
      setShowErrorAlert(true);
      return;
    }
    setShowSuccessAlert(true);
    setTwoFactorAuth('');
  };

  const sidebarItems: Array<{ icon: any; label: string; href?: string; modal?: string; active?: boolean; badge?: number; }> = [
  { icon: Home, label: 'Home', href: '/dashboard', active: false },
  { icon: TrendingUp, label: 'Trades', modal: 'trades' },
  { icon: DollarSign, label: 'Finance', modal: 'finance' },
  { icon: User, label: 'Profile', modal: 'profile' },
  { icon: Mail, label: 'Mailbox', modal: 'mailbox', badge: 1 },
  { icon: ShoppingCart, label: 'Markets', modal: 'markets' },
  { icon: Package, label: 'Packages', modal: 'packages' },
  { icon: HelpCircle, label: 'Help', modal: 'help' },
];


  return (
    <div className="min-h-screen bg-black">
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
            {sidebarItems.map((item, index) => (
              item.href ? (
                <Link key={index} href={item.href}>
                  <div className={`flex flex-col items-center p-2 rounded-lg transition-colors relative ${
                    item.active ? 'bg-green-600' : 'hover:bg-gray-700'
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
                  <div className={`flex flex-col items-center p-2 rounded-lg transition-colors relative ${
                    item.active ? 'bg-green-600' : 'hover:bg-gray-700'
                  }`}>
                    <item.icon className="h-6 w-6 text-white mb-1" />
                    <span className="text-xs text-white text-center">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
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
          {/* Topbar */}
          <DashboardTopbar profile={profile} messages={messages || []} />

          {/* Page Content */}
          <div className="p-4">
            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Link href="/editprofile">
                <Button 
                  className="text-white border border-green-500 hover:bg-black"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  Profile Details
                </Button>
              </Link>
              <Link href="/support">
                <Button 
                  className="text-white border border-green-500 hover:bg-black"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  Contact Support
                </Button>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-6">
              <div 
                className="text-white p-3 mb-5 font-bold"
                style={{ backgroundColor: '#1D2330', fontFamily: 'Georgia, serif' }}
              >
                <span className="pl-2">Change Your Password</span>
              </div>

              <div 
                className="text-white p-3 mb-5 font-bold border border-yellow-500 border-dashed"
                style={{ backgroundColor: '#714200' }}
              >
                <Lock className="inline h-5 w-5 mr-2" />
                If you think your password has been compromised, Set a new password now.
              </div>
            </div>

            {/* Password Change Form */}
            <div 
              className="rounded-lg p-6 mb-8"
              style={{ backgroundColor: '#1D2330' }}
            >
              <h2 className="text-green-400 text-2xl font-normal mb-2">Set New Password</h2>
              <h6 className="text-orange-400 text-base font-normal mb-6">It's Best to change your password once every month.</h6>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white">Current Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">New Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Re-Enter Password</Label>
                  <Input
                    type="password"
                    placeholder="Re-enter Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Updating...' : 'Submit'}
                </Button>
              </form>
            </div>

            {/* 2FA Section */}
            <div className="mb-6">
              <div 
                className="text-white p-3 mb-5 font-bold border border-yellow-500 border-dashed"
                style={{ backgroundColor: '#714200' }}
              >
                <Lock className="inline h-5 w-5 mr-2" />
                Set up Two Factor Authentication(2FA) for more stronger security.
              </div>
            </div>

            {/* 2FA Form */}
            <div 
              className="rounded-lg p-6 mb-8"
              style={{ backgroundColor: '#1D2330' }}
            >
              <h2 className="text-green-400 text-2xl font-normal mb-2">Set up 2FA Authentication (2FA = OFF )</h2>
              <h6 className="text-orange-400 text-base font-normal mb-6">Kindly set up 2 factor authentication for stronger account security.</h6>
              
              <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white">Select to TURN ON or TURN OFF</Label>
                  <Select value={twoFactorAuth} onValueChange={setTwoFactorAuth}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="-- Select ON or OFF --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OFF">TURN OFF</SelectItem>
                      <SelectItem value="ON">TURN ON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Updating...' : 'Update'}
                </Button>
              </form>
            </div>

            {/* Crypto Chart */}
            <div 
              className="rounded border border-gray-600 overflow-hidden"
              style={{ 
                height: '560px', 
                backgroundColor: '#1D2330',
                boxShadow: 'inset 0 -20px 0 0 #262B38'
              }}
            >
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
                  <a 
                    href="https://coinlib.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    Coinlib
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert Dialog */}
      <Dialog open={showSuccessAlert} onOpenChange={setShowSuccessAlert}>
        <DialogContent 
          className="max-w-md text-center"
          style={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
        >
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-green-300 flex items-center justify-center bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-gray-800 text-xl font-normal leading-relaxed">
              Password Changed Successfully
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button 
              onClick={handleSuccessOkay}
              className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-2 rounded"
            >
              Okay!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Alert Dialog */}
      <Dialog open={showErrorAlert} onOpenChange={setShowErrorAlert}>
        <DialogContent 
          className="max-w-md text-center"
          style={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
        >
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-red-300 flex items-center justify-center bg-red-50">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <DialogTitle className="text-gray-800 text-xl font-normal leading-relaxed">
              {errorMessage}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button 
              onClick={handleErrorOkay}
              className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-2 rounded"
            >
              Okay!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dashboard Modals */}
      <DashboardModals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}