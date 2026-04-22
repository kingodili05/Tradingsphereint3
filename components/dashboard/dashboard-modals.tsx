'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUserActions } from '@/hooks/use-user-actions';
import { useAuth } from '@/hooks/use-auth';
import { useTrades } from '@/hooks/use-trades';
import { useMessages } from '@/hooks/use-messages';
import { 
  X, 
  BarChart3, 
  DollarSign, 
  ArrowUpFromLine, 
  ArrowDownFromLine, 
  RefreshCw,
  TrendingUp,
  User,
  Lock,
  Mail,
  Send,
  ShoppingCart,
  Zap,
  Bot,
  Target
} from 'lucide-react';

interface DashboardModalsProps {
  activeModal: string | null;
  onClose: () => void;
}

export function DashboardModals({ activeModal, onClose }: DashboardModalsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { requestDeposit, requestWithdrawal, updateProfile, loading: userLoading } = useUserActions();
  const { trades, getOpenTrades, getClosedTrades, loading: tradesLoading } = useTrades();
  const { messages, markAsRead, loading: messagesLoading } = useMessages();

  const [depositData, setDepositData] = useState({
    amount: '',
    currency: 'USD',
    payment_method: '',
  });

  const [withdrawData, setWithdrawData] = useState({
    amount: '',
    currency: 'USD',
    withdrawal_method: '',
    destination_address: '',
  });

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
  });

  const handleDeposit = async () => {
    if (!user) return;
    
    const result = await requestDeposit(user.id, {
      amount: parseFloat(depositData.amount),
      currency: depositData.currency,
      payment_method: depositData.payment_method,
    });
    
    if (result.success) {
      setDepositData({ amount: '', currency: 'USD', payment_method: '' });
      onClose();
    }
  };

  const handleWithdraw = async () => {
    if (!user) return;
    
    const result = await requestWithdrawal(user.id, {
      amount: parseFloat(withdrawData.amount),
      currency: withdrawData.currency,
      withdrawal_method: withdrawData.withdrawal_method,
      destination_address: withdrawData.destination_address,
    });
    
    if (result.success) {
      setWithdrawData({ amount: '', currency: 'USD', withdrawal_method: '', destination_address: '' });
      onClose();
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    const result = await updateProfile(user.id, {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      phone_number: profileData.phone,
      country: profileData.country,
    });
    
    if (result.success) {
      onClose();
    }
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case 'trades':
        return (
          <div className="space-y-6">
            {/* Trades Modal Content */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Trade Real Account</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/trade-real-account');
                    onClose();
                  }}
                >
                  Start Trading
                </Button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Trading Signals</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/signals');
                    onClose();
                  }}
                >
                  View Signals
                </Button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Trading History</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/portfolio');
                    onClose();
                  }}
                >
                  View History
                </Button>
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Recent Trades</h4>
              {tradesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
                </div>
              ) : getOpenTrades().length === 0 ? (
                <p className="text-gray-400 text-center py-4">No active trades</p>
              ) : (
                <div className="space-y-2">
                  {getOpenTrades().slice(0, 3).map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between bg-gray-600 rounded p-3">
                      <div>
                        <div className="text-white font-medium">{trade.symbol}</div>
                        <div className="text-gray-300 text-sm">{trade.trade_type.toUpperCase()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white">${trade.unit_worth}</div>
                        <div className={`text-sm ${trade.unrealized_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${trade.unrealized_pnl.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'finance':
        return (
          <div className="space-y-6">
            {/* Finance Modal Content */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ArrowUpFromLine className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Deposit to Account</h3>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={depositData.amount}
                    onChange={(e) => setDepositData({...depositData, amount: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Select value={depositData.payment_method} onValueChange={(value) => setDepositData({...depositData, payment_method: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleDeposit} className="bg-green-600 hover:bg-green-700 text-white w-full">
                    Submit Deposit
                  </Button>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Deposit History</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/user-finance');
                    onClose();
                  }}
                >
                  View History
                </Button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ArrowDownFromLine className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Withdraw funds</h3>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={withdrawData.amount}
                    onChange={(e) => setWithdrawData({...withdrawData, amount: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Select value={withdrawData.withdrawal_method} onValueChange={(value) => setWithdrawData({...withdrawData, withdrawal_method: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Withdrawal Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleWithdraw} className="bg-green-600 hover:bg-green-700 text-white w-full">
                    Submit Withdrawal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'mailbox':
        return (
          <div className="space-y-6">
            {/* Mailbox Modal Content */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Send className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Compose New</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/support');
                    onClose();
                  }}
                >
                  New Message
                </Button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3 relative">
                  <Mail className="h-8 w-8 text-white" />
                  {messages && messages.filter(m => !m.is_read).length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                      {messages.filter(m => !m.is_read).length}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-semibold mb-2">({messages?.filter(m => !m.is_read).length || 0})</h3>
                <h3 className="text-white font-semibold mb-2">Inbox</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/user-messages');
                    onClose();
                  }}
                >
                  View Inbox
                </Button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Send className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Sent Messages</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/user-messages');
                    onClose();
                  }}
                >
                  View Sent
                </Button>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Recent Messages</h4>
              {messagesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
                </div>
              ) : !messages || messages.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No messages</p>
              ) : (
                <div className="space-y-2">
                  {messages.slice(0, 3).map((message) => (
                    <div key={message.id} className="flex items-center justify-between bg-gray-600 rounded p-3">
                      <div className="flex-1">
                        <div className="text-white font-medium">{message.title}</div>
                        <div className="text-gray-300 text-sm truncate">{message.content}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!message.is_read && (
                          <Badge className="bg-red-500 text-white">New</Badge>
                        )}
                        <Button
                          onClick={() => markAsRead(message.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Read
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'markets':
        return (
          <div className="space-y-6">
            {/* Markets Modal Content */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Buy Cryptos</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/markets/digital-currencies');
                    onClose();
                  }}
                >
                  Buy Now
                </Button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Trading Signals</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/signals');
                    onClose();
                  }}
                >
                  View Signals
                </Button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Robotic Softwares</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/platforms/myfxbook-autotrade');
                    onClose();
                  }}
                >
                  Explore Bots
                </Button>
              </div>
            </div>

            {/* Market Overview */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Market Overview</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-600 rounded p-3">
                  <div className="text-gray-300 text-sm">BTC/USD</div>
                  <div className="text-white font-bold">$43,250</div>
                  <div className="text-green-400 text-sm">+2.5%</div>
                </div>
                <div className="bg-gray-600 rounded p-3">
                  <div className="text-gray-300 text-sm">EUR/USD</div>
                  <div className="text-white font-bold">1.0875</div>
                  <div className="text-green-400 text-sm">+0.12%</div>
                </div>
                <div className="bg-gray-600 rounded p-3">
                  <div className="text-gray-300 text-sm">AAPL</div>
                  <div className="text-white font-bold">$189.45</div>
                  <div className="text-green-400 text-sm">+1.2%</div>
                </div>
                <div className="bg-gray-600 rounded p-3">
                  <div className="text-gray-300 text-sm">GOLD</div>
                  <div className="text-white font-bold">$2,045</div>
                  <div className="text-green-400 text-sm">+0.8%</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Modal Content */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Profile Details</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/user-profile');
                    onClose();
                  }}
                >
                  Edit Profile
                </Button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Security Settings</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/user-profile');
                    onClose();
                  }}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        );

      case 'packages':
        return (
          <div className="space-y-6">
            {/* Packages Modal Content */}
            <div className="text-center">
              <h3 className="text-white font-semibold mb-4">Trading Packages</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-green-400 text-lg font-bold mb-2">Current Plan: STARTER</div>
                <p className="text-gray-300 text-sm mb-4">
                  Upgrade your trading plan to unlock advanced features and higher limits.
                </p>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/user-packages');
                    onClose();
                  }}
                >
                  View Packages
                </Button>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            {/* Help Modal Content */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Contact Support</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/user-support');
                    onClose();
                  }}
                >
                  Get Help
                </Button>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Help Centre</h3>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                  onClick={() => {
                    router.push('/user-support');
                    onClose();
                  }}
                >
                  Browse Articles
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-white">
            <p className="mb-4">This feature will be available soon.</p>
            <Button 
              onClick={onClose} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Close
            </Button>
          </div>
        );
    }
  };

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div 
        className="rounded-lg border-2 border-gray-400 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        style={{ 
          backgroundColor: 'rgba(29, 35, 48, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Modal Header */}
        <div className="border-b border-gray-600 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-2xl font-bold capitalize">{activeModal}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 bg-gray-600 hover:bg-gray-700 rounded px-3 py-1 font-bold"
            >
              X
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {renderModalContent()}
        </div>
      </div>
    </div>
  );
}