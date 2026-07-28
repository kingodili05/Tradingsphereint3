'use client';

import { useState } from 'react';
import { AdminSidebar, AdminSidebarNav } from './admin-sidebar';
import { DashboardHeader } from './dashboard-header';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Shield } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />

      {/* Mobile navigation drawer */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-4 overflow-y-auto md:hidden">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-left">
              <Shield className="h-6 w-6 text-red-600" />
              Admin Panel
            </SheetTitle>
          </SheetHeader>
          <AdminSidebarNav onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
