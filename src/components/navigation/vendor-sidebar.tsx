"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  Home, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  Settings, 
  LogOut,
  Building2,
  Plus,
  Compass,
  ListTree,
  CalendarCheck
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRole } from "@/components/role-provider";

const VENDOR_LINKS = [
  { name: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, href: "/vendor/dashboard" },
  { name: "All Listings", icon: <ListTree className="w-5 h-5" />, href: "/vendor/listings" },
  { name: "My Stays", icon: <Home className="w-5 h-5" />, href: "/vendor/stays" },
  { name: "My Activities", icon: <Compass className="w-5 h-5" />, href: "/vendor/activities" },
  { name: "Availability", icon: <Calendar className="w-5 h-5" />, href: "/vendor/calendar" },
  { name: "Bookings", icon: <CalendarCheck className="w-5 h-5" />, href: "/vendor/bookings" },
  { name: "Earnings", icon: <DollarSign className="w-5 h-5" />, href: "/vendor/earnings" },
  { name: "Messages", icon: <MessageSquare className="w-5 h-5" />, href: "/vendor/messages" },
  { name: "Profile Settings", icon: <Settings className="w-5 h-5" />, href: "/vendor/profile" },
];

export function VendorSidebar() {
  const pathname = usePathname();
  const { setRole } = useRole();

  return (
    <aside className="hidden lg:block lg:w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-1 bg-white p-4 rounded-2xl border border-zinc-100">
        
        {/* Vendor Brand */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-sm">Elite Stays</h3>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Verified Vendor</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-0.5">
          {VENDOR_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-bold text-xs",
                  isActive 
                    ? "bg-zinc-50 text-zinc-900" 
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <div className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "text-zinc-400"
                )}>
                  {link.icon}
                </div>
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <button 
          onClick={() => setRole("guest")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-xs mt-6"
        >
          <LogOut className="w-4 h-4" />
          Switch to Guest
        </button>
      </div>
    </aside>
  );
}
