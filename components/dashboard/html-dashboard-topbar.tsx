'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useUserActions } from '@/hooks/use-user-actions';
import {
  Menu,
  Bell,
  Maximize,
  Mail,
  User,
  DollarSign,
  ArrowUpFromLine,
  ArrowDownFromLine,
  CheckCircle,
  XCircle,
} from 'lucide-react';

type TopbarProps = {
  profile: any;
  messages: any[] | null;
};

export function DashboardTopbar({ profile, messages }: TopbarProps) {
  const {
    requestEmailVerification,
    requestDemoAccount,
    requestLiveAccount,
    loading: actionLoading,
  } = useUserActions();
  const { user } = useAuth();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const messagesDropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = messages?.filter((m: any) => !m.is_read).length || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        messagesDropdownRef.current &&
        !messagesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMessagesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRequestDemo = async () => {
    if (user) await requestDemoAccount(user.id);
  };
  const handleRequestLive = async () => {
    if (user) await requestLiveAccount(user.id);
  };

  return (
    <nav
      className="border-b border-gray-700 px-4 py-3"
      style={{ backgroundColor: '#1D2330' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button className="text-white hover:text-gray-300">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Demo & Live */}
          <button
            onClick={handleRequestDemo}
            disabled={actionLoading}
            className="px-4 py-2 text-white border border-red-500 rounded text-sm font-bold"
            style={{ backgroundColor: '#460010' }}
          >
            {actionLoading ? 'Processing...' : 'Request Demo Account'}
          </button>
          <button
            onClick={handleRequestLive}
            disabled={actionLoading}
            className="px-4 py-2 text-white border border-green-500 rounded text-sm font-bold"
            style={{ backgroundColor: '#00370c' }}
          >
            {profile?.account_type === 'live'
              ? 'Live Acc Active'
              : 'Request Live Account'}
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
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                <div className="p-4">
                  <h3 className="font-semibold mb-3">
                    {unreadCount} New Message(s)
                  </h3>
                  {messages && messages.length > 0 ? (
                    <div className="space-y-3">
                      {messages.slice(0, 3).map((message: any) => (
                        <div
                          key={message.id}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              A
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">
                                From: Admin
                              </h4>
                              <span className="text-red-500 text-xs">★</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {message.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No messages</p>
                  )}
                  <div className="mt-4 pt-3 border-t">
                    <Link
                      href="/support"
                      className="text-blue-600 text-sm hover:underline"
                    >
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

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 text-white hover:text-gray-300"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-full border-2 border-gray-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {profile?.first_name?.[0] || 'U'}
                </span>
              </div>
              <span className="text-xs">▼</span>
            </button>

            {showProfileDropdown && (
              <div
                className="absolute right-0 top-full mt-2 min-w-[760px] w-[820px] rounded-2xl shadow-2xl border z-50 overflow-hidden"
                style={{
                  backgroundColor: 'rgba(29,35,51,0.97)',
                  border: '2px solid #3a3f51',
                }}
              >
                <div className="p-6">
                  <div className="flex text-white gap-8 items-stretch">
                    {/* LEFT COLUMN */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start gap-5 mb-8">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                            <User className="h-12 w-12 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-extrabold leading-tight mb-1">
                              {profile?.full_name || 'User'}
                            </h2>
                            <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
                              <span>Stock Trading</span>
                            </div>
                            <div className="flex items-center gap-2 text-base font-semibold">
                              <DollarSign className="h-4 w-4 text-green-400" />
                              <span>$0.00</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm opacity-90">
                              <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500" />
                              <span>0 BTC</span>
                            </div>
                          </div>
                        </div>

                        {/* Current Plan */}
                        <div
                          className="mb-6 p-4 border border-dashed border-red-500 rounded-lg text-center font-bold text-lg text-white shadow-inner"
                          style={{ backgroundColor: '#460010' }}
                        >
                          Current Plan:{' '}
                          <span className="ml-1 text-red-200">STARTER</span>
                        </div>

                        {/* Statuses */}
                        <div className="space-y-5 text-base">
                          {[
                            {
                              label: 'Email Status',
                              verified: profile?.is_email_verified,
                            },
                            {
                              label: 'Identity Status',
                              verified: profile?.is_identity_verified,
                            },
                            {
                              label: 'Address Status',
                              verified: profile?.is_residency_verified,
                            },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-[#2a3042] px-4 py-3 rounded-lg shadow-sm"
                            >
                              <span>{item.label}</span>
                              <div className="flex items-center">
                                {item.verified ? (
                                  <>
                                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                    <span className="text-green-400 font-bold">
                                      VERIFIED
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-red-400 mr-2" />
                                    <span className="text-red-400 font-bold">
                                      NOT VERIFIED
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="w-[1.5px] bg-gray-600/70 rounded" />

                    {/* RIGHT COLUMN */}
                    <div className="w-[260px] flex flex-col justify-start">
                      <div className="space-y-4">
                        <Link href="/editprofile">
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold text-lg flex items-center justify-center shadow-md transition">
                            <User className="h-5 w-5 mr-2" />
                            Profile
                          </button>
                        </Link>
                        <Link href="/deposit">
                          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-bold text-lg flex items-center justify-center shadow-md transition">
                            <ArrowUpFromLine className="h-5 w-5 mr-2" />
                            Deposit
                          </button>
                        </Link>
                        <Link href="/withdraw">
                          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-bold text-lg flex items-center justify-center shadow-md transition">
                            <ArrowDownFromLine className="h-5 w-5 mr-2" />
                            Withdraw
                          </button>
                        </Link>

                        {/* Verify buttons */}
                        <div className="pt-2 space-y-3">
                          <button
                            className="w-full border-2 border-green-400 rounded px-4 py-2 text-white hover:bg-green-400 hover:text-black font-bold transition"
                            onClick={() => requestEmailVerification()}
                            disabled={actionLoading}
                          >
                            Verify Now
                          </button>
                          <button
                            className="w-full border-2 border-green-400 rounded px-4 py-2 text-white hover:bg-green-400 hover:text-black font-bold transition"
                            disabled={actionLoading}
                          >
                            Verify Now
                          </button>
                          <button
                            className="w-full border-2 border-green-400 rounded px-4 py-2 text-white hover:bg-green-400 hover:text-black font-bold transition"
                            disabled={actionLoading}
                          >
                            Verify Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-600 px-6 py-3 bg-[#1D2330]">
                  <Link
                    href="/profile"
                    className="block text-center text-white hover:text-gray-300 text-lg font-bold"
                  >
                    More Details
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button className="text-white hover:text-gray-300">
            <Maximize className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
