'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useUserActions } from '@/hooks/use-user-actions';
import { useTrades } from '@/hooks/use-trades';
import { useBalances } from '@/hooks/use-balances';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  RefreshCw,
  Printer,
  BarChart3,
  Info
} from 'lucide-react';
import { signOut } from '@/lib/supabase-client';
import { toast } from 'sonner';
import Link from 'next/link';
import { TradingViewTicker } from '@/components/dashboard/tradingview-ticker';

export default function TradeRealAccountPage() {
  const { user, profile } = useAuth();
  const { getBalanceByCurrency } = useBalances();
  const { requestDemoAccount, requestLiveAccount, loading: actionLoading } = useUserActions();
  const { createTrade, trades, loading: tradesLoading } = useTrades();
  const router = useRouter();

  const [tradeData, setTradeData] = useState({
    exchangeType: '',
    symbol: '',
    unitWorth: '',
    takeProfit: '',
    stopLoss: '',
    expireTime: '30mins Interval',
  });

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInsufficientFundsAlert, setShowInsufficientFundsAlert] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const messagesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show alert after page load
    const timer = setTimeout(() => {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5500);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const checkSufficientBalance = (amount: number) => {
    const usdBalance = getBalanceByCurrency('USD');
    console.log('Checking balance:', { usdBalance, amount, hasBalance: usdBalance >= amount });
    return usdBalance >= amount;
  };

  const handleInsufficientFunds = () => {
    console.log('Showing insufficient funds alert');
    setShowInsufficientFundsAlert(true);
  };

  const handleAlertOkay = () => {
    setShowInsufficientFundsAlert(false);
  };

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

  const handleRequestDemo = async () => {
    if (!user) return;
    await requestDemoAccount(user.id);
  };

  const handleRequestLive = async () => {
    if (!user) return;
    await requestLiveAccount(user.id);
  };

  const handleTrade = async (tradeType: 'buy' | 'sell') => {
    if (!user || !tradeData.exchangeType || !tradeData.symbol || !tradeData.unitWorth) {
      toast.error('Please fill in all required fields');
      return;
    }

    const tradeAmount = parseFloat(tradeData.unitWorth);
    console.log('Trade amount:', tradeAmount);
    
    // Check if user has sufficient balance
    if (!checkSufficientBalance(tradeAmount)) {
      console.log('Insufficient balance, showing alert');
      handleInsufficientFunds();
      return;
    }

    // Prevent duplicate submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const expireTime = getExpireTime(tradeData.expireTime);

    try {
      const result = await createTrade({
        exchange_type: tradeData.exchangeType.toLowerCase(),
        symbol: tradeData.symbol,
        trade_type: tradeType,
        volume: 1,
        unit_worth: parseFloat(tradeData.unitWorth),
        take_profit: tradeData.takeProfit ? parseFloat(tradeData.takeProfit) : undefined,
        stop_loss: tradeData.stopLoss ? parseFloat(tradeData.stopLoss) : undefined,
        expire_time: expireTime,
      });

      if (result.success) {
        // Reset form
        setTradeData({
          exchangeType: '',
          symbol: '',
          unitWorth: '',
          takeProfit: '',
          stopLoss: '',
          expireTime: '30mins Interval',
        });
      }
    } catch (error) {
      console.error('Trade execution error:', error);
      toast.error('Failed to execute trade');
    }

    setIsSubmitting(false);
  };

  const getExpireTime = (interval: string) => {
    const now = new Date();
    switch (interval) {
      case '30mins Interval':
        return new Date(now.getTime() + 30 * 60 * 1000).toISOString();
      case '1hr Interval':
        return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      case '6hrs Interval':
        return new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString();
      case '12hrs Interval':
        return new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    }
  };

  const getSymbolOptions = () => {
    switch (tradeData.exchangeType) {
      case 'FOREX':
        return [
          { value: 'EURUSD', label: 'EUR/USD (Euro/US Dollar)' },
          { value: 'USDJPY', label: 'USD/JPY (US Dollar/Japanese Yen)' },
          { value: 'GBPUSD', label: 'GBP/USD (British Pound/US Dollar)' },
          { value: 'USDCHF', label: 'USD/CHF (US Dollar/Swiss Franc)' },
          { value: 'AUDUSD', label: 'AUD/USD (Australian Dollar/US Dollar)' },
          { value: 'USDCAD', label: 'USD/CAD (US Dollar/Canadian Dollar)' },
          { value: 'NZDUSD', label: 'NZD/USD (New Zealand Dollar/US Dollar)' },
          { value: 'EURJPY', label: 'EUR/JPY (Euro/Japanese Yen)' },
          { value: 'GBPJPY', label: 'GBP/JPY (British Pound/Japanese Yen)' },
          { value: 'EURGBP', label: 'EUR/GBP (Euro/British Pound)' },
        ];
      case 'CRYPTO':
        return [
          { value: 'BTCUSD', label: 'BTC/USD (Bitcoin/US Dollar)' },
          { value: 'ETHUSD', label: 'ETH/USD (Ethereum/US Dollar)' },
          { value: 'XRPUSD', label: 'XRP/USD (XRP/US Dollar)' },
          { value: 'LTCUSD', label: 'LTC/USD (Litecoin/US Dollar)' },
          { value: 'BCHUSD', label: 'BCH/USD (Bitcoin Cash/US Dollar)' },
          { value: 'ADAUSD', label: 'ADA/USD (Cardano/US Dollar)' },
          { value: 'SOLUSD', label: 'SOL/USD (Solana/US Dollar)' },
          { value: 'DOTUSD', label: 'DOT/USD (Polkadot/US Dollar)' },
        ];
      case 'STOCKS':
        return [
          { value: 'AAPL', label: 'AAPL (Apple Inc.)' },
          { value: 'MSFT', label: 'MSFT (Microsoft Corporation)' },
          { value: 'GOOGL', label: 'GOOGL (Alphabet Inc.)' },
          { value: 'TSLA', label: 'TSLA (Tesla Inc.)' },
          { value: 'AMZN', label: 'AMZN (Amazon.com Inc.)' },
          { value: 'NVDA', label: 'NVDA (NVIDIA Corporation)' },
          { value: 'META', label: 'META (Meta Platforms Inc.)' },
          { value: 'NFLX', label: 'NFLX (Netflix Inc.)' },
        ];
      case 'INDICES':
        return [
          { value: 'SPX', label: 'S&P 500 Index (SPX)' },
          { value: 'DJI', label: 'Dow Jones Industrial Average (DJI)' },
          { value: 'IXIC', label: 'NASDAQ Composite Index (IXIC)' },
          { value: 'FTSE', label: 'FTSE 100 Index (FTSE)' },
          { value: 'DAX', label: 'DAX 30 Index (DAX)' },
          { value: 'CAC', label: 'CAC 40 Index (CAC)' },
          { value: 'NIKKEI', label: 'NIKKEI 225 Index (NIKKEI)' },
          { value: 'HSI', label: 'Hang Seng Index (HSI)' },
        ];
      case 'OIL_&_GAS':
        return [
          { value: 'CL', label: 'Crude Oil Futures (CL)' },
          { value: 'NG', label: 'Natural Gas Futures (NG)' },
          { value: 'BZ', label: 'Brent Crude Oil Futures (BZ)' },
          { value: 'HO', label: 'Heating Oil Futures (HO)' },
          { value: 'RB', label: 'RBOB Gasoline Futures (RB)' },
        ];
      default:
        return [];
    }
  };

  const symbolOptions = getSymbolOptions();

  const sidebarItems = [
    { icon: Home, label: 'Home', href: '/dashboard', active: true },
    { icon: TrendingUp, label: 'Trades', href: '/trading' },
    { icon: DollarSign, label: 'Finance', href: '/finance' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Mail, label: 'Mailbox', href: '/mailbox', badge: 1 },
    { icon: ShoppingCart, label: 'Markets', href: '/markets' },
    { icon: Package, label: 'Packages', href: '/portfolio' },
    { icon: HelpCircle, label: 'Help', href: '/help/help-centre' },
  ];

  const handlePrint = () => {
    const printContent = document.getElementById('trades-table');
    if (printContent) {
      const newWin = window.open('');
      newWin?.document.write(printContent.outerHTML);
      newWin?.print();
      newWin?.close();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'black' }}>
      {/* Alert Notification */}
      {showAlert && (
        <div className="fixed top-16 right-0 z-50 animate-in slide-in-from-right duration-500"
          style={{
            background: '#ffdb9b',
            padding: '15px 40px',
            maxWidth: '420px',
            borderRadius: '4px',
            borderLeft: '8px solid #ffa502',
            color: 'black'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-orange-600 text-2xl mr-3"></i>
              <span className="text-lg font-medium">Trading Live Account!</span>
            </div>
            <button 
              onClick={() => setShowAlert(false)}
              className="bg-orange-200 hover:bg-orange-300 px-3 py-2 rounded"
            >
              <i className="fas fa-times text-orange-600"></i>
            </button>
          </div>
        </div>
      )}

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
                  onClick={handleRequestDemo}
                  disabled={actionLoading}
                  className="px-4 py-2 text-white border border-red-500 rounded text-sm font-bold"
                  style={{ backgroundColor: '#460010' }}
                >
                  {actionLoading ? 'Processing...' : 'Request Demo Account'}
                </button>

                {/* Live Account Button */}
                <button
                  onClick={handleRequestLive}
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
                                  <span className="text-lg">$0.</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                                  <span className="text-lg">0 BTC</span>
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
                                <button className="w-full border-2 border-green-400 rounded px-4 py-2 text-white hover:bg-green-400 hover:text-black font-bold">
                                  Verify Now
                                </button>
                                <button className="w-full border-2 border-green-400 rounded px-4 py-2 text-white hover:bg-green-400 hover:text-black font-bold">
                                  Verify Now
                                </button>
                                <button className="w-full border-2 border-green-400 rounded px-4 py-2 text-white hover:bg-green-400 hover:text-black font-bold">
                                  Verify Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-600 px-6 py-3">
                        <Link href="/editprofile" className="block text-center text-white hover:text-gray-300 text-lg font-bold">
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
              <Link href="/trading">
                <Button 
                  className="text-white border border-green-500 hover:bg-black"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  Trading History
                </Button>
              </Link>
              <Link href="/deposit">
                <Button 
                  className="text-white border border-green-500 hover:bg-black"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  Deposit To Account
                </Button>
              </Link>
              <Link href="/withdraw">
                <Button 
                  className="text-white border border-green-500 hover:bg-black hidden md:block"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  Withdraw Funds
                </Button>
              </Link>
              <Link href="/markets/digital-currencies">
                <Button 
                  className="text-white border border-green-500 hover:bg-black hidden md:block"
                  style={{ backgroundColor: '#1D2330', fontSize: '17px', fontFamily: 'Georgia, serif' }}
                >
                  Buy Cryptocurrency
                </Button>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-6">
              <div 
                className="text-white p-3 mb-5 font-bold"
                style={{ backgroundColor: '#1D2330', fontFamily: 'Georgia, serif' }}
              >
                <span className="pl-2">Trade Live Account</span>
              </div>

              <div 
                className="text-white p-3 mb-5 font-bold border border-yellow-500 border-dashed"
                style={{ backgroundColor: '#714200' }}
              >
                <BarChart3 className="inline h-5 w-5 mr-2" />
                Place a trade order
              </div>
            </div>

            {/* Main Trading Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
              {/* Trading Panel */}
              <div className="lg:col-span-4">
                <div 
                  className="rounded-lg border border-green-500"
                  style={{ height: '538px', backgroundColor: '#1D2330' }}
                >
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">
                        <span className="text-green-500 font-bold">BUY</span> / <span className="text-red-500 font-bold">SELL</span>
                      </h3>
                      <h5 className="text-white text-lg">
                        <span className="text-green-400">Balance</span> = $0
                      </h5>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {/* Exchange Type */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-l">Exchange</span>
                        <Select 
                          value={tradeData.exchangeType} 
                          onValueChange={(value) => setTradeData({...tradeData, exchangeType: value, symbol: ''})}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white rounded-l-none">
                            <SelectValue placeholder="Select Exchange Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FOREX">FOREX</SelectItem>
                            <SelectItem value="CRYPTO">CRYPTO</SelectItem>
                            <SelectItem value="STOCKS">STOCKS</SelectItem>
                            <SelectItem value="INDICES">INDICES</SelectItem>
                            <SelectItem value="OIL_&_GAS">OIL & GAS</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-r">
                          {tradeData.exchangeType || 'NONE'}
                        </span>
                      </div>
                    </div>

                    {/* Symbol */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-l">Symbols</span>
                        <Select 
                          value={tradeData.symbol} 
                          onValueChange={(value) => setTradeData({...tradeData, symbol: value})}
                          disabled={!tradeData.exchangeType}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white rounded-none">
                            <SelectValue placeholder={tradeData.exchangeType ? "Select Symbol" : "No Exchange Selected"} />
                          </SelectTrigger>
                          <SelectContent>
                            {symbolOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-r">
                          {tradeData.exchangeType || 'NONE'}
                        </span>
                      </div>
                    </div>

                    {/* Unit Worth */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-l">Unit Worth</span>
                        <Input
                          type="number"
                          placeholder="Enter Amount"
                          value={tradeData.unitWorth}
                          onChange={(e) => setTradeData({...tradeData, unitWorth: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white rounded-none"
                        />
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-r">
                          {tradeData.exchangeType || 'NONE'}
                        </span>
                      </div>
                    </div>

                    {/* Take Profit */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-l">Take Profit</span>
                        <Input
                          type="number"
                          placeholder="Enter Take Profit"
                          value={tradeData.takeProfit}
                          onChange={(e) => setTradeData({...tradeData, takeProfit: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white rounded-none"
                        />
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-r">
                          {tradeData.exchangeType || 'NONE'}
                        </span>
                      </div>
                    </div>

                    {/* Stop Loss */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-l">Stop Loss</span>
                        <Input
                          type="number"
                          placeholder="Enter Stop Loss"
                          value={tradeData.stopLoss}
                          onChange={(e) => setTradeData({...tradeData, stopLoss: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white rounded-none"
                        />
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-r">
                          {tradeData.exchangeType || 'NONE'}
                        </span>
                      </div>
                    </div>

                    {/* Expire Time */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-l">Expire Time</span>
                        <Select 
                          value={tradeData.expireTime} 
                          onValueChange={(value) => setTradeData({...tradeData, expireTime: value})}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white rounded-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30mins Interval">30 minutes</SelectItem>
                            <SelectItem value="1hr Interval">1 hour</SelectItem>
                            <SelectItem value="6hrs Interval">6 hours</SelectItem>
                            <SelectItem value="12hrs Interval">12 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="bg-gray-600 px-3 py-2 text-white text-sm rounded-r">Mins/hrs</span>
                      </div>
                    </div>

                    {/* Buy/Sell Buttons */}
                    <div className="flex justify-center space-x-5 pt-4">
                      <Button
                        onClick={() => handleTrade('buy')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-6 text-xl"
                        disabled={!tradeData.exchangeType || !tradeData.symbol || !tradeData.unitWorth || isSubmitting}
                      >
                        <div className="flex flex-col items-center">
                          {isSubmitting ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-1"></div>
                          ) : (
                            <BarChart3 className="h-6 w-6 mb-1 transform rotate-180" />
                          )}
                          <span>BUY</span>
                        </div>
                      </Button>
                      
                      <Button
                        onClick={() => handleTrade('sell')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-6 text-xl"
                        disabled={!tradeData.exchangeType || !tradeData.symbol || !tradeData.unitWorth || isSubmitting}
                      >
                        <div className="flex flex-col items-center">
                          {isSubmitting ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-1"></div>
                          ) : (
                            <BarChart3 className="h-6 w-6 mb-1 transform scale-x-[-1]" />
                          )}
                          <span>SELL</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Order History */}
              <div className="lg:col-span-8">
                <div 
                  className="rounded-lg border border-green-500"
                  style={{ backgroundColor: '#1D2330', height: '538px' }}
                >
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">Live Order History</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRefresh}
                          className="text-white hover:text-gray-300"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refresh
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePrint}
                          className="text-white hover:text-gray-300"
                        >
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4" style={{ height: '460px' }}>
                    <div className="overflow-auto h-full" id="trades-table">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-white border-b border-gray-700">
                            <th className="text-left py-2">S/N</th>
                            <th className="text-left py-2">Trade Time</th>
                            <th className="text-left py-2">Type</th>
                            <th className="text-left py-2">Symbol</th>
                            <th className="text-left py-2">Volume</th>
                            <th className="text-left py-2">S/L</th>
                            <th className="text-left py-2">T/P</th>
                            <th className="text-left py-2">Expire Time</th>
                            <th className="text-left py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-white">
                          {tradesLoading ? (
                            <tr>
                              <td colSpan={9} className="text-center py-8 text-gray-400">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
                                Loading trades...
                              </td>
                            </tr>
                          ) : trades.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="text-center py-8 text-gray-400">
                                No record found
                              </td>
                            </tr>
                          ) : (
                            trades.map((trade, index) => (
                              <tr key={trade.id} className="border-b border-gray-700">
                                <td className="py-2">{index + 1}</td>
                                <td className="py-2">{new Date(trade.created_at).toLocaleString()}</td>
                                <td className="py-2 uppercase">{trade.trade_type}</td>
                                <td className="py-2">{trade.symbol}</td>
                                <td className="py-2">{trade.volume}</td>
                                <td className="py-2">{trade.stop_loss ? `$${trade.stop_loss}` : '-'}</td>
                                <td className="py-2">{trade.take_profit ? `$${trade.take_profit}` : '-'}</td>
                                <td className="py-2">
                                  {trade.expire_time ? new Date(trade.expire_time).toLocaleString() : '-'}
                                </td>
                                <td className="py-2">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    trade.status === 'open' ? 'bg-green-600' :
                                    trade.status === 'closed' ? 'bg-blue-600' :
                                    trade.status === 'cancelled' ? 'bg-gray-600' :
                                    'bg-yellow-600'
                                  }`}>
                                    {trade.status.toUpperCase()}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
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

      {/* Insufficient Funds Alert Dialog */}
      <Dialog open={showInsufficientFundsAlert} onOpenChange={setShowInsufficientFundsAlert}>
        <DialogContent 
          className="max-w-md text-center"
          style={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
        >
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-gray-300 flex items-center justify-center">
                <Info className="h-8 w-8 text-gray-500" />
              </div>
            </div>
            <DialogTitle className="text-gray-800 text-xl font-normal leading-relaxed">
              You have no funds to trade with. fund your account and start up trades immediately
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button 
              onClick={handleAlertOkay}
              className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-2 rounded"
            >
              Okay!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}