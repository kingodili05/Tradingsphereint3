"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error("Failed to logout: " + error.message);
      } else {
        toast.success("Logged out successfully");
        if (typeof window !== "undefined") {
          localStorage.removeItem("supabase.auth.token");
          sessionStorage.clear();
        }
        router.push("/");
      }
    } catch {
      toast.error("An error occurred during logout");
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

  const bottomNavItems = sidebarItems.slice(0, 5);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-full flex-col border-r border-white/8 z-40"
        style={{ width: "90px", backgroundColor: "#151c28", marginTop: "48px" }}
      >
        {/* Logo */}
        <Link href="/dashboard" className="block p-4 group">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl mx-auto flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform duration-200">
            <TrendingUp className="h-6 w-6 text-black" />
          </div>
        </Link>

        {/* User avatar */}
        <div className="px-4 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full mx-auto border-2 border-white/10 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {profile?.first_name?.[0]?.toUpperCase() || profile?.full_name?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 px-2 overflow-y-auto">
          <nav className="space-y-1 pb-4">
            {sidebarItems.map((item, i) => {
              const active = isActive(item.href);
              return (
                <button
                  key={i}
                  onClick={() => router.push(item.href)}
                  className="w-full group"
                >
                  <div
                    className={`relative flex flex-col items-center py-2.5 px-1 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-green-500/15 text-green-400"
                        : "text-white/50 hover:bg-white/6 hover:text-white/90"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-green-500 rounded-r-full" />
                    )}
                    <item.icon className={`h-5 w-5 mb-1 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-105"}`} />
                    <span className="text-[10px] font-medium text-center leading-tight">
                      {item.label}
                    </span>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Logout */}
        <div className="px-2 pb-4">
          <button
            onClick={handleLogout}
            className="w-full flex flex-col items-center py-2.5 px-1 rounded-xl text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 mb-1 group-hover:rotate-12 transition-transform duration-200" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom navigation ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10"
        style={{
          backgroundColor: "rgba(21,28,40,0.97)",
          backdropFilter: "blur(16px)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex items-center justify-around px-1 py-1.5">
          {bottomNavItems.map((item, i) => {
            const active = isActive(item.href);
            return (
              <button
                key={i}
                onClick={() => router.push(item.href)}
                className="flex flex-col items-center flex-1 py-1.5 px-1 relative group active:scale-90 transition-transform duration-150"
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-green-500 rounded-full" />
                )}
                <item.icon
                  className={`h-5 w-5 mb-0.5 transition-all duration-200 ${
                    active ? "text-green-400 scale-110" : "text-white/45"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    active ? "text-green-400" : "text-white/40"
                  }`}
                >
                  {item.label}
                </span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-0.5 right-1 bg-red-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center flex-1 py-1.5 px-1 group active:scale-90 transition-transform duration-150"
          >
            <LogOut className="h-5 w-5 mb-0.5 text-white/45 group-active:text-red-400 transition-colors" />
            <span className="text-[10px] font-medium text-white/40">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
