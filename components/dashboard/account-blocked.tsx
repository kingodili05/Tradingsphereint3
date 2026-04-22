'use client';

import { Lock, Ban, LogOut, Mail, Phone } from 'lucide-react';
import { signOut } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

interface AccountBlockedProps {
  status: 'locked' | 'suspended' | string;
}

export function AccountBlocked({ status }: AccountBlockedProps) {
  const router = useRouter();

  const isLocked = status === 'locked';

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#0f1117' }}
    >
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className={`mx-auto mb-6 w-20 h-20 rounded-2xl flex items-center justify-center ${
          isLocked ? 'bg-red-500/15 border border-red-500/30' : 'bg-amber-500/15 border border-amber-500/30'
        }`}>
          {isLocked
            ? <Lock className="h-9 w-9 text-red-400" />
            : <Ban className="h-9 w-9 text-amber-400" />}
        </div>

        {/* Heading */}
        <h1 className={`text-2xl font-bold mb-2 ${isLocked ? 'text-red-400' : 'text-amber-400'}`}>
          Account {isLocked ? 'Locked' : 'Suspended'}
        </h1>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          {isLocked
            ? 'Your account has been locked by an administrator. You cannot access your dashboard or perform any transactions until this is resolved.'
            : 'Your account has been temporarily suspended. Please contact support to understand the reason and resolve this.'}
        </p>

        {/* Contact info */}
        <div
          className="rounded-2xl p-5 mb-6 text-left space-y-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Contact Support</p>
          <a
            href={`mailto:support@tradingsphereint.online`}
            className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center group-hover:bg-blue-500/25 transition-colors">
              <Mail className="h-4 w-4 text-blue-400" />
            </div>
            support@tradingsphereint.online
          </a>
          <a
            href="tel:+19132823212"
            className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center group-hover:bg-green-500/25 transition-colors">
              <Phone className="h-4 w-4 text-green-400" />
            </div>
            +1-913-282-3212
          </a>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
