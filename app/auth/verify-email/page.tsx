'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

type State = 'loading' | 'verified' | 'already_verified' | 'error';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [state, setState] = useState<State>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!supabase) {
      setState('error');
      setErrorMessage('Connection error. Please try again.');
      return;
    }

    // Listen for the auth state change that Supabase triggers after email confirmation.
    // detectSessionInUrl:true in the client config means Supabase automatically
    // processes the tokens in the URL hash and fires SIGNED_IN / USER_UPDATED.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) return;

        const isJustVerified =
          event === 'SIGNED_IN' ||
          event === 'USER_UPDATED' ||
          event === 'TOKEN_REFRESHED';

        if (!isJustVerified) return;

        const emailConfirmedAt = session.user.email_confirmed_at;

        if (emailConfirmedAt) {
          try {
            // Fire the welcome email API (idempotent — skips if already sent)
            const res = await fetch('/api/welcome-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
            });

            const json = await res.json();
            if (json.skipped) {
              setState('already_verified');
            } else {
              setState('verified');
            }
          } catch {
            // Non-fatal — still consider email verified
            setState('verified');
          }

          // Redirect to dashboard after a short delay
          setTimeout(() => router.push('/dashboard'), 3000);
        }
      }
    );

    // Also check current session immediately (handles page refresh after confirmation)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        // No session yet — waiting for user to click email link
        setState('loading');
        return;
      }

      if (session.user.email_confirmed_at) {
        try {
          const res = await fetch('/api/welcome-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          const json = await res.json();
          setState(json.skipped ? 'already_verified' : 'verified');
        } catch {
          setState('verified');
        }
        setTimeout(() => router.push('/dashboard'), 3000);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>

          {state === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-5" />
              <h2 className="text-xl font-bold mb-2">Verifying your email…</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Waiting for email confirmation. If you haven&apos;t clicked the link yet,
                please check your inbox.
              </p>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">Back to Sign In</Button>
              </Link>
            </>
          )}

          {(state === 'verified') && (
            <>
              <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-5" />
              <h2 className="text-2xl font-bold mb-2 text-green-700">Email Verified!</h2>
              <p className="text-muted-foreground text-sm mb-2">
                Your account is now active. A welcome email has been sent to you.
              </p>
              <p className="text-xs text-muted-foreground mb-6">Redirecting to your dashboard…</p>
              <Button className="w-full" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </>
          )}

          {state === 'already_verified' && (
            <>
              <CheckCircle className="h-14 w-14 text-blue-500 mx-auto mb-5" />
              <h2 className="text-2xl font-bold mb-2">Already Verified</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Your email is already verified. Redirecting to your dashboard…
              </p>
              <Button className="w-full" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </>
          )}

          {state === 'error' && (
            <>
              <XCircle className="h-14 w-14 text-red-500 mx-auto mb-5" />
              <h2 className="text-2xl font-bold mb-2 text-red-700">Verification Failed</h2>
              <p className="text-muted-foreground text-sm mb-6">
                {errorMessage || 'The verification link may have expired. Please try again.'}
              </p>
              <div className="space-y-2">
                <Link href="/auth/signup">
                  <Button className="w-full">Create a New Account</Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
