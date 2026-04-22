'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useUserActions } from '@/hooks/use-user-actions';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  LogOut,
  CheckCircle,
  XCircle,
  Upload,
  Copy,
  Lock
} from 'lucide-react';
import { signOut } from '@/lib/supabase-client';
import { toast } from 'sonner';
import Link from 'next/link';
import { TradingViewTicker } from '@/components/dashboard/tradingview-ticker';
import { useBalances } from '@/hooks/use-balances';
import { DashboardModals } from '@/components/dashboard/dashboard-modals';
import { DocumentUpload } from '@/components/verification/document-upload';

export default function EditProfilePage() {
  const { user, profile } = useAuth();
  const { balances, getTotalBalanceUSD } = useBalances();
  const { updateProfile, requestEmailVerification, uploadVerificationDocument, loading: actionLoading } = useUserActions();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    country: '',
    walletAddress: '',
  });

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [residencyFile, setResidencyFile] = useState<File | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const messagesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        dateOfBirth: '',
        phoneNumber: profile.phone_number || '',
        country: profile.country || '',
        walletAddress: '',
      });
    }
  }, [profile]);

  // Close dropdowns when clicking outside
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      toast.error('Please enter both first and last name');
      return;
    }
    
    if (!user) return;

    const result = await updateProfile(user.id, {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      phone_number: profileData.phoneNumber,
      country: profileData.country,
    });

    if (result.success) {
      // Profile update success is already handled in useUserActions
      // Force a page refresh to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleVerifyEmail = async () => {
    await requestEmailVerification();
  };

  const copyReferralLink = () => {
    const referralLink = `https://tradingsphereintl.online/auth/signup?ref=${profile?.email?.split('@')[0] || 'user'}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

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
                <div className={`flex flex-col items-center p-2 rounded-lg transition-colors relative ${
                  false ? 'bg-green-600' : 'hover:bg-gray-700'
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
          <nav
            className="border-b border-gray-700 px-4 py-3"
            style={{ backgroundColor: '#1D2330' }}
          >
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center">
                <button className="text-white hover:text-gray-300">
                  <Menu className="h-6 w-6" />
                </button>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Demo Account Button */}
                <button
                  disabled={actionLoading}
                  className="px-4 py-2 text-white border border-red-500 rounded text-sm font-bold"
                  style={{ backgroundColor: '#460010' }}
                >
                  Request Demo Account
                </button>

                {/* Live Account Button */}
                <button
                  disabled={actionLoading}
                  className="px-4 py-2 text-white border border-green-500 rounded text-sm font-bold"
                  style={{ backgroundColor: '#00370c' }}
                >
                  {profile?.account_type === 'live' ? 'Live Acc Active' : 'Request Live Account'}
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 text-white hover:text-gray-300"
                  >
                    <div className="w-10 h-10 bg-gray-600 rounded-full border-2 border-gray-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{profile?.first_name?.[0] || 'U'}</span>
                    </div>
                    <span className="text-xs">▼</span>
                  </button>

                  {showProfileDropdown && (
                    <div
                      className="absolute right-0 top-full mt-2 w-96 rounded-lg shadow-lg border z-50"
                      style={{ backgroundColor: 'rgba(29,35,51,0.95)', border: '2px solid white' }}
                    >
                      <div className="p-6">
                        <div className="flex text-white">
                          {/* User Info */}
                          <div className="flex-1 pr-6">
                            <div className="flex items-start space-x-4 mb-6">
                              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="h-12 w-12 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center mb-2">
                                  <User className="h-4 w-4 text-green-400 mr-2" />
                                  <span className="text-xl font-bold">{profile?.full_name || 'User'}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                  <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                                  <span className="text-lg">Stock Trading</span>
                                </div>
                                <div className="flex items-center mb-2">
                                  <DollarSign className="h-4 w-4 text-green-400 mr-2" />
                                  <span className="text-lg">${getTotalBalanceUSD().toFixed(2)}</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                                  <span className="text-lg">{balances?.find(b => b.currency === 'BTC')?.balance.toFixed(8) || '0'} BTC</span>
                                </div>
                              </div>
                            </div>

                            {/* Trading Plan */}
                            <div
                              className="mb-6 p-3 border-2 border-dashed border-red-500 rounded text-center font-bold text-lg"
                              style={{ backgroundColor: '#460010' }}
                            >
                              Current Trading Plan: STARTER
                            </div>

                            {/* Verification Status */}
                            <div className="space-y-3 text-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-white">Email Status :</span>
                                <div className="flex items-center">
                                  {profile?.is_email_verified ? (
                                    <>
                                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                      <span className="text-green-400 font-bold">VERIFIED</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-5 w-5 text-red-400 mr-2" />
                                      <span className="text-red-400 font-bold">NOT VERIFIED</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-white">Identity Status :</span>
                                <div className="flex items-center">
                                  {profile?.is_identity_verified ? (
                                    <>
                                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                      <span className="text-green-400 font-bold">VERIFIED</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-5 w-5 text-red-400 mr-2" />
                                      <span className="text-red-400 font-bold">NOT VERIFIED</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-white">Address Status :</span>
                                <div className="flex items-center">
                                  {profile?.is_residency_verified ? (
                                    <>
                                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                      <span className="text-green-400 font-bold">VERIFIED</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-5 w-5 text-red-400 mr-2" />
                                      <span className="text-red-400 font-bold">NOT VERIFIED</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="border-l-2 border-red-800 pl-6 flex flex-col justify-center">
                            <div className="space-y-3">
                              <Link href="/editprofile">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded font-bold text-lg flex items-center w-full">
                                  <User className="h-5 w-5 mr-2" />
                                  Profile
                                </button>
                              </Link>
                              <Link href="/deposit">
                                <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded font-bold text-lg flex items-center w-full">
                                  <ArrowUpFromLine className="h-5 w-5 mr-2" />
                                  Deposit
                                </button>
                              </Link>
                              <Link href="/withdraw">
                                <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded font-bold text-lg flex items-center w-full">
                                  <ArrowDownFromLine className="h-5 w-5 mr-2" />
                                  Withdraw
                                </button>
                              </Link>
                              
                              <div className="pt-3 space-y-2">
                                <button 
                                  className="w-full border-2 border-green-400 rounded px-4 py-2 text-white hover:bg-green-400 hover:text-black font-bold"
                                  onClick={handleVerifyEmail}
                                >
                                  Verify Now
                                </button>
                                <button 
                                  className="w-full border-2 border-green-400 rounded px-4 py-2 text-white hover:bg-green-400 hover:text-black font-bold"
                                  onClick={() => toggleSection('identity')}
                                >
                                  Verify Now
                                </button>
                                <button 
                                  className="w-full border-2 border-green-400 rounded px-4 py-2 text-white hover:bg-green-400 hover:text-black font-bold"
                                  onClick={() => toggleSection('residency')}
                                >
                                  Verify Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-600 px-6 py-3">
                        <Link href="/profile" className="block text-center text-white hover:text-gray-300 text-lg font-bold">
                          More Details
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="relative" ref={messagesDropdownRef}>
                  <button
                    onClick={() => setShowMessagesDropdown(!showMessagesDropdown)}
                    className="text-white hover:text-gray-300 relative"
                  >
                    <Mail className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      1
                    </span>
                  </button>

                  {showMessagesDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                      <div className="p-4">
                        <h3 className="font-semibold mb-3">1 New Message(s)</h3>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">From: Admin</h4>
                                <span className="text-red-500 text-xs">★</span>
                              </div>
                              <p className="text-sm text-gray-600">Welcome Message</p>
                              <p className="text-xs text-gray-500">30/08/2025 11:04:06pm</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t">
                          <Link href="/mailbox" className="text-blue-600 text-sm hover:underline">
                            Read Messages
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <button className="text-white hover:text-gray-300 relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    0
                  </span>
                </button>

                {/* Fullscreen */}
                <button className="text-white hover:text-gray-300">
                  <Maximize className="h-6 w-6" />
                </button>
              </div>
            </div>
          </nav>

          {/* Page Content */}
          <div className="p-4">
            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Link href="/profile">
                <Button 
                  className="text-white border border-green-500 hover:bg-black"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </Link>
              <Link href="/mailbox">
                <Button 
                  className="text-white border border-green-500 hover:bg-black"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  MailBox
                </Button>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-6">
              <div 
                className="text-white p-3 mb-5 font-bold"
                style={{ backgroundColor: '#1D2330', fontFamily: 'Georgia, serif' }}
              >
                <span className="pl-2">Profile Details</span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Profile Sidebar */}
              <div className="lg:col-span-1">
                <div 
                  className="rounded-lg border-t-4 border-green-500 p-6 text-white text-center"
                  style={{ backgroundColor: '#1D2330' }}
                >
                  <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{profile?.full_name || 'User'}</h3>
                  <p className="text-gray-300 mb-4">Stock Trading</p>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span className="font-semibold">Account Balance</span>
                      <span>${getTotalBalanceUSD().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span className="font-semibold">BTC Balance</span>
                      <span>{balances?.find(b => b.currency === 'BTC')?.balance.toFixed(8) || '0'} BTC</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span className="font-semibold">Demo Balance</span>
                      <span>$0</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span className="font-semibold">Total Deposit</span>
                      <span>${profile?.total_deposits?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span className="font-semibold">Total Withdrawal</span>
                      <span>${profile?.total_withdrawals?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span className="font-semibold">Referral Bonus</span>
                      <span>${profile?.referral_bonus?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span className="font-semibold">Total Referred</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span className="font-semibold">Email Status</span>
                      <div className="flex items-center">
                        {profile?.is_email_verified ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                            <span className="text-green-400 font-bold">VERIFIED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-400 mr-1" />
                            <span className="text-red-400 font-bold">NOT VERIFIED</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between border-b border-gray-600 pb-2">
                      <span className="font-semibold">ID Status</span>
                      <div className="flex items-center">
                        {profile?.is_identity_verified ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                            <span className="text-green-400 font-bold">VERIFIED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-400 mr-1" />
                            <span className="text-red-400 font-bold">NOT VERIFIED</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Address Status</span>
                      <div className="flex items-center">
                        {profile?.is_residency_verified ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                            <span className="text-green-400 font-bold">VERIFIED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-400 mr-1" />
                            <span className="text-red-400 font-bold">NOT VERIFIED</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div 
                  className="rounded-lg p-6 text-white"
                  style={{ backgroundColor: '#1D2330' }}
                >
                  {/* Accordion Sections */}
                  <div className="space-y-6">
                    {/* Referral System */}
                    <div className="border-2 border-green-500 rounded-lg p-6">
                      <button
                        onClick={() => toggleSection('referral')}
                        className="w-full text-left flex items-center justify-between text-white hover:text-green-400 font-bold text-xl"
                      >
                        <span>Our Referral System</span>
                        <span className="text-3xl">{activeSection === 'referral' ? '-' : '+'}</span>
                      </button>
                      
                      {activeSection === 'referral' && (
                        <div className="mt-6 space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <img 
                                src="https://via.placeholder.com/400x280/22c55e/000000?text=REFERRAL+SYSTEM"
                                alt="Referral System"
                                className="w-full h-64 object-cover rounded border-4 border-green-500"
                              />
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-xl font-bold">Refer People to our platform and Earn</h4>
                              <p>Click on 'Copy Referral Link' below to copy Your Referral Link</p>
                              
                              <div className="flex space-x-2">
                                <Input
                                  value={`https://tradingsphereintl.online/auth/signup?ref=${profile?.email?.split('@')[0] || 'user'}`}
                                  readOnly
                                  className="bg-white text-black"
                                />
                                <Button
                                  onClick={copyReferralLink}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Referral Link
                                </Button>
                              </div>
                              
                              <div className="border-2 border-green-500 border-dashed rounded p-4">
                                <h4 className="font-bold mb-2">Your Referrals</h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-white">
                                    <thead style={{ backgroundColor: '#00370c' }}>
                                      <tr>
                                        <th className="p-2 text-left">First Name</th>
                                        <th className="p-2 text-left">Last Name</th>
                                        <th className="p-2 text-left">Country</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td colSpan={3} className="p-4 text-center text-gray-400">
                                          No record found
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Edit Profile Details */}
                    <div className="border-2 border-green-500 rounded-lg p-6">
                      <button
                        onClick={() => toggleSection('profile')}
                        className="w-full text-left flex items-center justify-between text-white hover:text-green-400 font-bold text-xl"
                      >
                        <span>Edit Your Profile Details</span>
                        <span className="text-3xl">{activeSection === 'profile' ? '-' : '+'}</span>
                      </button>
                      
                      {activeSection === 'profile' && (
                        <div className="mt-6">
                          <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-white">Email Address</Label>
                                <Input
                                  value={profile?.email || ''}
                                  disabled
                                  className="bg-gray-600 text-gray-300"
                                />
                              </div>
                              <div>
                                <Label className="text-white">First Name</Label>
                                <Input
                                  value={profileData.firstName}
                                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                                  className="bg-white text-black"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-white">Last Name</Label>
                                <Input
                                  value={profileData.lastName}
                                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                                  className="bg-white text-black"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Date of Birth</Label>
                                <Input
                                  type="date"
                                  value={profileData.dateOfBirth}
                                  onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                                  className="bg-white text-black"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-white">Phone Number</Label>
                                <Input
                                  value={profileData.phoneNumber}
                                  onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                                  className="bg-white text-black"
                                />
                              </div>
                              <div>
                                <Label className="text-white">Country</Label>
                                <Input
                                  value={profileData.country}
                                  onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                                  className="bg-white text-black"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-white">Wallet Address</Label>
                              <Input
                                value={profileData.walletAddress}
                                onChange={(e) => setProfileData({...profileData, walletAddress: e.target.value})}
                                placeholder="Enter Bitcoin Wallet Address"
                                className="bg-white text-black"
                              />
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={actionLoading}
                            >
                              {actionLoading ? 'Updating Profile...' : 'Update Profile'}
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>

                    {/* Change Profile Picture */}
                    <div className="border-2 border-green-500 rounded-lg p-6">
                      <button
                        onClick={() => toggleSection('picture')}
                        className="w-full text-left flex items-center justify-between text-white hover:text-green-400 font-bold text-xl"
                      >
                        <span>Change Your Profile Picture</span>
                        <span className="text-3xl">{activeSection === 'picture' ? '-' : '+'}</span>
                      </button>
                      
                      {activeSection === 'picture' && (
                        <div className="mt-6">
                          <DocumentUpload
                            documentType="profile_picture"
                            title="Upload Profile Picture"
                            description="Upload a clear photo of yourself"
                            acceptedFormats={['.jpg', '.jpeg', '.png', '.gif']}
                            onUploadComplete={() => window.location.reload()}
                          />
                        </div>
                      )}
                    </div>

                    {/* Email Verification */}
                    <div className="border-2 border-green-500 rounded-lg p-6">
                      <button
                        onClick={() => toggleSection('email')}
                        className="w-full text-left flex items-center justify-between text-white hover:text-green-400 font-bold text-xl"
                      >
                        <span>Email Verification</span>
                        <span className="text-3xl">{activeSection === 'email' ? '-' : '+'}</span>
                      </button>
                      
                      {activeSection === 'email' && (
                        <div className="mt-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <img 
                                src="https://via.placeholder.com/400x260/22c55e/000000?text=EMAIL+VERIFICATION"
                                alt="Email Verification"
                                className="w-full h-64 object-cover rounded"
                              />
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-xl font-bold">Verify Your Email Address</h4>
                              <p>To access all our Trading Privileges, an email verification is Required</p>
                              
                              <div className="space-y-2">
                                <Label className="text-white">Email Address</Label>
                                <Input
                                  value={profile?.email || ''}
                                  disabled
                                  placeholder="Enter Bitcoin Wallet Address (Contact support@tradingsphereint.online for help)"
                                />
                                <p className="text-sm text-gray-300">
                                  This is your registered email address that will be verified.
                                </p>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                  {profile?.is_email_verified ? (
                                    <>
                                      <CheckCircle className="h-5 w-5 text-green-400" />
                                      <span className="text-green-400 font-bold">EMAIL ALREADY VERIFIED</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-5 w-5 text-red-400" />
                                      <span className="text-red-400 font-bold">EMAIL NOT VERIFIED</span>
                                    </>
                                  )}
                                </div>
                                
                                <Button 
                                  onClick={handleVerifyEmail}
                                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                                  disabled={actionLoading || profile?.is_email_verified}
                                >
                                  {actionLoading ? (
                                    <div className="flex items-center space-x-2">
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                      <span>Verifying...</span>
                                    </div>
                                  ) : profile?.is_email_verified ? (
                                    'Email Already Verified'
                                  ) : (
                                    'Verify Email Now'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Identity Verification */}
                    <div className="border-2 border-green-500 rounded-lg p-6">
                      <button
                        onClick={() => toggleSection('identity')}
                        className="w-full text-left flex items-center justify-between text-white hover:text-green-400 font-bold text-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <span>Identity Verification</span>
                          {profile?.is_identity_verified ? (
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-400" />
                          )}
                        </div>
                        <span className="text-3xl">{activeSection === 'identity' ? '-' : '+'}</span>
                      </button>
                      
                      {activeSection === 'identity' && (
                        <div className="mt-6">
                          <div className="mb-4 p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
                            <h4 className="text-lg font-bold text-blue-400 mb-2">Identity Verification Required</h4>
                            <p className="text-gray-300 text-sm">
                              Please provide a copy of an official government issued Photo ID that contains your name, 
                              unique personal number, photo and signature. This could be: Passport, Driver's license 
                              or National ID card. The document must be current and valid.
                            </p>
                          </div>
                          <DocumentUpload
                            documentType="identity"
                            title="Upload Identity Document"
                            description="Select your government-issued ID document for verification"
                            acceptedFormats={['.jpg', '.jpeg', '.png', '.pdf']}
                            onUploadComplete={() => {
                              toast.success('Identity document submitted for review');
                              setTimeout(() => window.location.reload(), 1000);
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Residency Verification */}
                    <div className="border-2 border-green-500 rounded-lg p-6">
                      <button
                        onClick={() => toggleSection('residency')}
                        className="w-full text-left flex items-center justify-between text-white hover:text-green-400 font-bold text-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <span>Residency Verification</span>
                          {profile?.is_residency_verified ? (
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-400" />
                          )}
                        </div>
                        <span className="text-3xl">{activeSection === 'residency' ? '-' : '+'}</span>
                      </button>
                      
                      {activeSection === 'residency' && (
                        <div className="mt-6">
                          <div className="mb-4 p-4 bg-purple-900/20 border border-purple-500 rounded-lg">
                            <h4 className="text-lg font-bold text-purple-400 mb-2">Address Verification Required</h4>
                            <p className="text-gray-300 text-sm">
                              Please provide proof of your permanent residential address. This must contain your name, 
                              address, city and country of residence. Can be: Bank statement, Utility bill, 
                              Tax statement (issued within last 6 months).
                            </p>
                          </div>
                          <DocumentUpload
                            documentType="residency"
                            title="Upload Address Proof"
                            description="Select a document that shows your current address"
                            acceptedFormats={['.jpg', '.jpeg', '.png', '.pdf']}
                            onUploadComplete={() => {
                              toast.success('Address document submitted for review');
                              setTimeout(() => window.location.reload(), 1000);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Modals */}
      <DashboardModals 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />

    </div>
  );
}