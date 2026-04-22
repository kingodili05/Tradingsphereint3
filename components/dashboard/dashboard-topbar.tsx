'use client';

import { useState, useEffect, useRef } from 'react';
import { Profile, Message } from '@/lib/database.types';
import {
  Bell, Maximize, Mail, User,
  ArrowUpFromLine, ArrowDownToLine, CheckCircle, XCircle,
  TrendingUp, Menu, X,
} from 'lucide-react';
import { useUserActions } from '@/hooks/use-user-actions';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { toast } from 'sonner';
import { Drawer } from 'vaul';

interface DashboardTopbarProps {
  profile: Profile | null;
  messages: Message[] | null;
}

export function DashboardTopbar({ profile, messages }: DashboardTopbarProps) {
  const { requestEmailVerification, requestDemoAccount, requestLiveAccount, loading: actionLoading } = useUserActions();
  const { user } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const messagesDropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = messages?.filter(m => !m.is_read).length || 0;
  const initials = profile?.first_name?.[0]?.toUpperCase() || profile?.full_name?.[0]?.toUpperCase() || 'U';
  const planName = (profile as any)?.packages?.display_name || 'Starter';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (messagesDropdownRef.current && !messagesDropdownRef.current.contains(e.target as Node)) {
        setShowMessagesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVerifyEmail = async () => { setShowProfileDropdown(false); await requestEmailVerification(); };
  const handleVerifyIdentity = () => { setShowProfileDropdown(false); toast.info('Identity verification coming soon'); };
  const handleVerifyAddress = () => { setShowProfileDropdown(false); toast.info('Address verification coming soon'); };
  const handleRequestDemo = async () => { if (user) { setShowProfileDropdown(false); await requestDemoAccount(user.id); } };
  const handleRequestLive = async () => { if (user) { setShowProfileDropdown(false); await requestLiveAccount(user.id); } };

  const verifications = [
    { label: 'Email', verified: profile?.is_email_verified, action: handleVerifyEmail },
    { label: 'Identity', verified: profile?.is_identity_verified, action: handleVerifyIdentity },
    { label: 'Address', verified: profile?.is_residency_verified, action: handleVerifyAddress },
  ];

  /* ── Shared profile panel (used in both drawer and dropdown) ── */
  const ProfilePanel = ({ onClose }: { onClose: () => void }) => (
    <div className="flex flex-col text-white">
      {/* User header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/8">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-blue-600 flex items-center justify-center ring-2 ring-green-500/40 ring-offset-2 ring-offset-[#1D2330] animate-glow-pulse">
              <span className="text-white font-bold text-xl">{initials}</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#1D2330] rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base leading-tight truncate">{profile?.full_name || 'User'}</p>
            <p className="text-gray-400 text-xs truncate mt-0.5">{profile?.email}</p>
            <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25 uppercase tracking-wide">
              <TrendingUp className="h-2.5 w-2.5" />
              {planName}
            </span>
          </div>
        </div>
      </div>

      {/* Account type toggles */}
      <div className="px-5 py-3 border-b border-white/8 grid grid-cols-2 gap-2">
        <button
          onClick={handleRequestDemo}
          disabled={actionLoading}
          className="py-2.5 rounded-xl border border-red-500/40 bg-red-500/10 text-xs font-bold hover:bg-red-500/20 transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          {actionLoading ? '…' : 'Demo Account'}
        </button>
        <button
          onClick={handleRequestLive}
          disabled={actionLoading}
          className="py-2.5 rounded-xl border border-green-500/40 bg-green-500/10 text-xs font-bold hover:bg-green-500/20 transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          {profile?.account_type === 'live' ? '✓ Live Active' : 'Live Account'}
        </button>
      </div>

      {/* Verification status */}
      <div className="px-5 py-4 border-b border-white/8">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-3">Verification</p>
        <div className="grid grid-cols-3 gap-2">
          {verifications.map(({ label, verified }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all ${
                verified
                  ? 'border-green-500/30 bg-green-500/8 text-green-400'
                  : 'border-white/8 bg-white/3 text-gray-500'
              }`}
            >
              {verified
                ? <CheckCircle className="h-4 w-4 text-green-400" />
                : <XCircle className="h-4 w-4 text-red-400" />}
              <span className="text-[11px]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 py-4 border-b border-white/8">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-3">Quick Actions</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Profile', icon: User, href: '/editprofile', color: 'blue' },
            { label: 'Deposit', icon: ArrowUpFromLine, href: '/deposit', color: 'green' },
            { label: 'Withdraw', icon: ArrowDownToLine, href: '/withdraw', color: 'red' },
          ].map(({ label, icon: Icon, href, color }) => (
            <button
              key={label}
              onClick={() => { window.location.href = href; onClose(); }}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all duration-200 active:scale-95 ${
                color === 'blue' ? 'border-blue-500/25 bg-blue-500/8 hover:bg-blue-500/15' :
                color === 'green' ? 'border-green-500/25 bg-green-500/8 hover:bg-green-500/15' :
                'border-red-500/25 bg-red-500/8 hover:bg-red-500/15'
              }`}
            >
              <Icon className={`h-4 w-4 ${color === 'blue' ? 'text-blue-400' : color === 'green' ? 'text-green-400' : 'text-red-400'}`} />
              <span className="text-[11px] text-gray-300">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Get verified */}
      <div className="px-5 py-4 pb-6">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-3">Get Verified</p>
        <div className="grid grid-cols-3 gap-2">
          {verifications.map(({ label, action, verified }) => (
            <button
              key={label}
              onClick={action}
              disabled={actionLoading || !!verified}
              className={`px-2 py-2 text-[11px] rounded-xl border transition-all duration-200 active:scale-95 disabled:opacity-40 ${
                verified
                  ? 'border-green-500/30 text-green-400 bg-green-500/8'
                  : 'border-green-500/40 text-green-300 hover:bg-green-500/10'
              }`}
            >
              {verified ? `✓ ${label}` : `Verify ${label}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Topbar ── */}
      <nav
        className="border-b border-white/8 px-3 md:px-5 py-2.5 sticky top-0 z-30"
        style={{ backgroundColor: 'rgba(29,35,48,0.97)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center justify-between">
          {/* Left */}
          <button className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/6 transition-all active:scale-95">
            <Menu className="h-5 w-5" />
          </button>

          {/* Right */}
          <div className="flex items-center gap-1 md:gap-2.5">
            {/* Demo / Live — desktop only */}
            <button onClick={handleRequestDemo} disabled={actionLoading}
              className="hidden md:block px-3 py-1.5 text-xs font-bold text-white/80 border border-red-500/50 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all active:scale-95">
              Demo
            </button>
            <button onClick={handleRequestLive} disabled={actionLoading}
              className="hidden md:block px-3 py-1.5 text-xs font-bold text-white/80 border border-green-500/50 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-all active:scale-95">
              {profile?.account_type === 'live' ? '✓ Live' : 'Live'}
            </button>

            {/* Messages */}
            <div className="relative" ref={messagesDropdownRef}>
              <button
                onClick={() => setShowMessagesDropdown(v => !v)}
                className="relative p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/6 transition-all active:scale-95"
              >
                <Mail className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showMessagesDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden animate-scale-in"
                  style={{ backgroundColor: 'rgba(24,30,42,0.98)', backdropFilter: 'blur(20px)' }}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white text-sm">{unreadCount} New Message{unreadCount !== 1 ? 's' : ''}</h3>
                      <button onClick={() => setShowMessagesDropdown(false)} className="text-gray-500 hover:text-white transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {messages && messages.length > 0 ? (
                      <div className="space-y-1">
                        {messages.slice(0, 4).map(msg => (
                          <div key={msg.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shrink-0">
                              <span className="text-white font-bold text-xs">A</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs text-white/90">Admin</p>
                              <p className="text-xs text-gray-400 truncate">{msg.title}</p>
                              <p className="text-[10px] text-gray-600 mt-0.5">{new Date(msg.created_at).toLocaleDateString()}</p>
                            </div>
                            {!msg.is_read && <span className="w-2 h-2 bg-green-500 rounded-full shrink-0 mt-1" />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No messages yet</p>
                    )}
                    <div className="mt-3 pt-3 border-t border-white/8">
                      <Link href="/user-messages" onClick={() => setShowMessagesDropdown(false)}
                        className="text-green-400 text-xs hover:text-green-300 transition-colors font-medium">
                        View all messages →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bell */}
            <button className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/6 transition-all active:scale-95">
              <Bell className="h-5 w-5" />
            </button>

            {/* Avatar */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(v => !v)}
                className="flex items-center gap-2 px-1.5 py-1 rounded-xl hover:bg-white/6 transition-all active:scale-95 group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center ring-1 ring-green-500/30 group-hover:ring-green-500/60 transition-all">
                  <span className="text-white font-bold text-xs">{initials}</span>
                </div>
                <span className="hidden md:block text-white/50 text-xs group-hover:text-white/80 transition-colors">▾</span>
              </button>

              {/* Desktop dropdown */}
              {showProfileDropdown && !isMobile && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden animate-scale-in"
                  style={{ backgroundColor: 'rgba(24,30,42,0.98)', backdropFilter: 'blur(20px)' }}
                >
                  <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">My Account</span>
                    <button onClick={() => setShowProfileDropdown(false)} className="text-gray-500 hover:text-white transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <ProfilePanel onClose={() => setShowProfileDropdown(false)} />
                </div>
              )}
            </div>

            {/* Fullscreen — desktop only */}
            <button
              onClick={() => document.documentElement.requestFullscreen?.()}
              className="hidden md:block p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/6 transition-all active:scale-95"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile profile drawer ── */}
      <Drawer.Root open={showProfileDropdown && isMobile} onOpenChange={setShowProfileDropdown}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/60 z-40" style={{ backdropFilter: 'blur(4px)' }} />
          <Drawer.Content
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-white/10 overflow-hidden"
            style={{ backgroundColor: '#151c28', maxHeight: '88vh' }}
          >
            <div className="overflow-y-auto overscroll-contain">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
                <span className="text-sm font-bold text-white">My Account</span>
                <button onClick={() => setShowProfileDropdown(false)} className="text-gray-500 hover:text-white transition-colors p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Drawer.Title className="sr-only">Account Panel</Drawer.Title>
              <ProfilePanel onClose={() => setShowProfileDropdown(false)} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
