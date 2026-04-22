'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { TawkToWidget } from '@/components/chat/tawk-to-widget';

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();

  // Don't show footer on dashboard or admin pages
  const isDashboardPage = pathname?.startsWith('/dashboard') || 
                          pathname?.startsWith('/admin') || 
                          pathname?.includes('/trade-real-account') ||
                          pathname?.includes('/deposit') ||
                          pathname?.includes('/withdraw') ||
                          pathname?.includes('/editprofile') ||
                          pathname?.includes('/markets') ||
                          pathname?.includes('/finance') ||
                          pathname?.includes('/signals') ||
                          pathname?.includes('/support') ||
                          pathname?.includes('/company') ||
                          pathname?.includes('/education') ||
                          pathname?.includes('/help') ||
                          pathname?.includes('/user-finance') ||
                          pathname?.includes('/user-signals') ||
                          pathname?.includes('/user-support') ||
                          pathname?.includes('/user-messages') ||
                          pathname?.includes('/user-trading') ||
                          pathname?.includes('/user-portfolio') ||
                          pathname?.includes('/user-profile') ||
                          pathname?.includes('/user-mailbox') ||
                          pathname?.includes('/user-verification') ||
                          pathname?.includes('/user-deposit') ||
                          pathname?.includes('/user-withdraw') ||
                          pathname?.includes('/user-editprofile') ||
                          pathname?.includes('/user-change-password') ||
                          pathname?.includes('/user-packages') ||
                          pathname?.includes('/trading') ||
                          pathname?.includes('/change-password');


  return (
    <>
      {!isDashboardPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isDashboardPage && <Footer />}
      <TawkToWidget />
    </>
  );
}