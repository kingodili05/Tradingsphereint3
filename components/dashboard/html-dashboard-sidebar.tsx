"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile, Message } from "@/lib/database.types";
import {
  Home,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  HelpCircle,
  LogOut,
  User,
  Mail,
} from "lucide-react";
import { signOut } from "@/lib/supabase-client";
import { toast } from "sonner";

interface DashboardSidebarProps {
  profile: Profile | null;
  messages: Message[] | null;
  onModalOpen: (modal: string) => void;
}

export function DashboardSidebar({
  profile,
  messages,
  onModalOpen,
}: DashboardSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error("Failed to logout: " + error.message);
      } else {
        toast.success("Logged out successfully");
        // Clear any cached data and force refresh
        if (typeof window !== 'undefined') {
          localStorage.removeItem('supabase.auth.token');
          sessionStorage.clear();
        }
        router.push("/");
      }
    } catch (error) {
      toast.error("An error occurred during logout");
      // Force redirect even if error occurs
      router.push("/");
    }
  };

  const sidebarItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: TrendingUp, label: "Trading", href: "/trading" },
    { icon: DollarSign, label: "Finance", href: "/user-finance" },
    { icon: User, label: "Profile", href: "/user-profile" },
    {
      icon: Mail,
      label: "Messages", 
      href: "/user-messages",
      badge: messages?.filter((m) => !m.is_read).length || 0,
    },
    { icon: ShoppingCart, label: "Markets", href: "/markets" },
    { icon: Package, label: "Packages", href: "/user-packages" },
    { icon: HelpCircle, label: "Help", href: "/user-support" },
  ];

  return (
    <>
      <aside
        className="fixed left-0 top-0 h-full flex flex-col border-r border-gray-700 z-40"
        style={{ width: "90px", backgroundColor: "#1D2330", marginTop: "48px" }}
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

      {/* Scrollable Navigation */}
      <ScrollArea className="flex-1 px-2 overflow-y-auto">
        <nav className="space-y-2 pb-4">
          {sidebarItems.map((item, index) =>
            item.href ? (
              <button
                key={index}
                onClick={() => router.push(item.href)}
                className="w-full"
              >
                <div
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors relative ${
                    router ? "hover:bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="h-6 w-6 text-white mb-1" />
                  <span className="text-xs text-white text-center">
                    {item.label}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            ) : null
          )}
        </nav>
      </ScrollArea>

      {/* Logout Button - Fixed at bottom */}
      <div className="px-4 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <LogOut className="h-6 w-6 text-white mb-1" />
          <span className="text-xs text-white text-center">Logout</span>
        </button>
      </div>
      </aside>
    </>
  );
}