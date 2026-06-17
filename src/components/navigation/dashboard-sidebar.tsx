"use client";

import Link from "next/link";
import { 
  Home, 
  Calendar, 
  Star, 
  MessageSquare, 
  Heart, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  CreditCard
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRole } from "@/components/role-provider";

const DASHBOARD_LINKS = [
  { name: "Overview", icon: <Home className="w-5 h-5" />, href: "/dashboard" },
  { name: "My Bookings", icon: <Calendar className="w-5 h-5" />, href: "/bookings" },
  { name: "Messages", icon: <MessageSquare className="w-5 h-5" />, href: "/messages" },
  { name: "Reviews", icon: <Star className="w-5 h-5" />, href: "/reviews" },
  { name: "Wishlist", icon: <Heart className="w-5 h-5" />, href: "/wishlist" },
  { name: "Notifications", icon: <Bell className="w-5 h-5" />, href: "/notifications" },
  { name: "Wallet", icon: <CreditCard className="w-5 h-5" />, href: "/wallet" },
  { name: "Profile Settings", icon: <Settings className="w-5 h-5" />, href: "/profile" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useRole();

  return (
    <aside className="hidden lg:block lg:w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-1 bg-white p-4 rounded-2xl border border-zinc-100">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-sm truncate max-w-[120px]">Aqib Ahmed</h3>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Guest Member</p>
          </div>
        </div>

        <nav className="space-y-0.5">
          {DASHBOARD_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-bold text-xs group",
                  isActive 
                    ? "bg-zinc-900 text-white shadow-sm" 
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <div className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-600"
                )}>
                  {link.icon}
                </div>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-xs mt-6"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
