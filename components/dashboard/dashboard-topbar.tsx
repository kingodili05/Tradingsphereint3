'use client';

import { useState, useEffect, useRef } from 'react';
import { Profile, Message } from '@/lib/database.types';
import {
  Menu,
  Bell,
  Maximize,
  Mail,
  User,
  DollarSign,
  BarChart3,
  ArrowUpFromLine,
  ArrowDownToLine,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useUserActions } from '@/hooks/use-user-actions';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { toast } from 'sonner';

interface DashboardTopbarProps {
  profile: Profile | null;
  messages: Message[] | null;
}

export function DashboardTopbar({ profile, messages }: DashboardTopbarProps) {
  const { requestEmailVerification, requestDemoAccount, requestLiveAccount, loading: actionLoading } = useUserActions();
  const { user } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const messagesDropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = messages?.filter(m => !m.is_read).length || 0;

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVerifyEmail = async () => { await requestEmailVerification(); };
  const handleVerifyIdentity = () => toast.info('Identity verification process will be available soon');
  const handleVerifyAddress = () => toast.info('Address verification process will be available soon');
  const handleRequestDemo = async () => user && await requestDemoAccount(user.id);
  const handleRequestLive = async () => user && await requestLiveAccount(user.id);

  return (
    <>
      {/* TradingView Widget */}
      {/* <div className="w-full" style={{ backgroundColor: '#1D2330' }}>
        <iframe
          src="https://s.tradingview.com/embed-widget/ticker-tape/?locale=en#%7B%22symbols%22%3A%5B%7B%22proName%22%3A%22NASDAQ%3AAAPL%22%2C%22title%22%3A%22Apple%22%7D%2C%7B%22proName%22%3A%22NASDAQ%3ATSLA%22%2C%22title%22%3A%22Tesla%22%7D%2C%7B%22proName%22%3A%22NASDAQ%3AMSFT%22%2C%22title%22%3A%22Microsoft%22%7D%2C%7B%22proName%22%3A%22NASDAQ%3ANVDA%22%2C%22title%22%3A%22NVIDIA%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3ABTCUSD%22%2C%22title%22%3A%22BTC%2FUSD%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3AETHUSD%22%2C%22title%22%3A%22ETH%2FUSD%22%7D%5D%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%7D"
          style={{ width: '100%', height: '40px' }}
          frameBorder="0"
          allowTransparency
          scrolling="no"
        />
      </div> */}

      {/* Topbar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3" style={{ backgroundColor: '#1D2330' }}>
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <button className="text-white hover:text-gray-300">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Demo Account */}
            <button
              onClick={handleRequestDemo}
              disabled={actionLoading}
              className="px-4 py-2 text-white border border-red-500 rounded text-sm font-bold bg-red-900/60 hover:bg-red-900"
            >
              {actionLoading ? 'Processing...' : 'Request Demo Account'}
            </button>

            {/* Live Account */}
            <button
              onClick={handleRequestLive}
              disabled={actionLoading}
              className="px-4 py-2 text-white border border-green-500 rounded text-sm font-bold bg-green-900/60 hover:bg-green-900"
            >
              {profile?.account_type === 'live' ? 'Live Acc Active' : 'Request Live Account'}
            </button>

            {/* Messages */}
            <div className="relative" ref={messagesDropdownRef}>
              <button
                onClick={() => setShowMessagesDropdown(!showMessagesDropdown)}
                className="text-white hover:text-gray-300 relative"
              >
                <Mail className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showMessagesDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border z-50">
                  <div className="p-4">
                    <h3 className="font-semibold mb-3">{unreadCount} New Message(s)</h3>
                    {messages && messages.length > 0 ? (
                      <div className="space-y-3">
                        {messages.slice(0, 3).map(message => (
                          <div key={message.id} className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">From: Admin</h4>
                                <span className="text-red-500 text-xs">★</span>
                              </div>
                              <p className="text-sm text-gray-600">{message.title}</p>
                              <p className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No messages</p>
                    )}
                    <div className="mt-4 pt-3 border-t">
                      <Link href="/support" className="text-blue-600 text-sm hover:underline">
                        Read Messages
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="text-white hover:text-gray-300 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  0
                </span>
              </button>
            </div>

            {/* Profile */}
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
                <div className="absolute right-0 top-full mt-2 w-[28rem] bg-gray-900/95 rounded-xl shadow-xl border border-gray-700 z-50">
                  {/* User Header */}
                  <div className="p-5 border-b border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">{profile?.full_name || 'User'}</p>
                        <p className="text-sm text-gray-400">{profile?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Plan + Verification */}
                  <div className="p-5 space-y-4">
                    <div className="p-3 text-center rounded-lg border border-red-500 bg-red-900/40 text-white font-semibold">
                      Current Trading Plan: STARTER
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="flex flex-col items-center bg-gray-800 rounded-lg p-3">
                        {profile?.is_email_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-400 mb-1" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400 mb-1" />
                        )}
                        <span className="text-gray-300">Email</span>
                      </div>
                      <div className="flex flex-col items-center bg-gray-800 rounded-lg p-3">
                        {profile?.is_identity_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-400 mb-1" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400 mb-1" />
                        )}
                        <span className="text-gray-300">Identity</span>
                      </div>
                      <div className="flex flex-col items-center bg-gray-800 rounded-lg p-3">
                        {profile?.is_residency_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-400 mb-1" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400 mb-1" />
                        )}
                        <span className="text-gray-300">Address</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-5 border-t border-gray-700 space-y-3">
                    <div className="flex space-x-3">
                      <button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold flex items-center justify-center"
                        onClick={() => { window.location.href = '/editprofile'; setShowProfileDropdown(false); }}
                      >
                        <User className="h-4 w-4 mr-2" /> Profile
                      </button>
                      <button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold flex items-center justify-center"
                        onClick={() => { window.location.href = '/deposit'; setShowProfileDropdown(false); }}
                      >
                        <ArrowUpFromLine className="h-4 w-4 mr-2" /> Deposit
                      </button>
                      <button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold flex items-center justify-center"
                        onClick={() => { window.location.href = '/withdraw'; setShowProfileDropdown(false); }}
                      >
                        <ArrowDownToLine className="h-4 w-4 mr-2" /> Withdraw
                      </button>
                    </div>

                    {/* Verify buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={handleVerifyEmail}
                        disabled={actionLoading}
                        className="px-2 py-2 text-xs border border-green-400 rounded text-white hover:bg-green-400 hover:text-black disabled:opacity-50"
                      >
                        Verify Email
                      </button>
                      <button
                        onClick={handleVerifyIdentity}
                        disabled={actionLoading}
                        className="px-2 py-2 text-xs border border-green-400 rounded text-white hover:bg-green-400 hover:text-black disabled:opacity-50"
                      >
                        Verify ID
                      </button>
                      <button
                        onClick={handleVerifyAddress}
                        disabled={actionLoading}
                        className="px-2 py-2 text-xs border border-green-400 rounded text-white hover:bg-green-400 hover:text-black disabled:opacity-50"
                      >
                        Verify Addr
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button className="text-white hover:text-gray-300">
              <Maximize className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
