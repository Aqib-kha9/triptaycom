"use client";

import Link from "next/link";
import { LayoutDashboard, ListTree, CalendarCheck, MessageSquare, User, ChevronDown, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRole } from "@/components/role-provider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavbarVendor() {
  const pathname = usePathname();
  const { setRole, setIsLoggedIn } = useRole();

  const vendorLinks = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "My Listings", href: "/vendor/listings", icon: <ListTree className="w-4 h-4" /> },
    { name: "Bookings", href: "/vendor/bookings", icon: <CalendarCheck className="w-4 h-4" /> },
    { name: "List your property", href: "/vendor/listings/new", icon: <Plus className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 z-[110] w-full border-b border-zinc-100 bg-white shadow-sm text-zinc-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo & Role Badge */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="text-xl font-bold italic">T</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">Triptay</span>
          </Link>
          <span className="bg-primary text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm text-white">Vendor Mode</span>
        </div>

        {/* Vendor Links */}
        <div className="hidden md:flex items-center gap-8">
          {vendorLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={cn(
                  "flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all",
                  isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Vendor Actions */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setRole("guest")}
            className="hidden sm:flex border-zinc-200 bg-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest"
          >
            Switch to Guest
          </Button>

          <div className="flex items-center gap-3 border-l border-zinc-100 pl-4">
            <Link href="/wishlist" className="text-zinc-400 hover:text-primary transition-colors hidden md:block">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/messages" className="text-zinc-400 hover:text-primary transition-colors relative">
              <MessageSquare className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            </Link>
            <Link href="/profile">
              <div className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-primary hover:text-white transition-all cursor-pointer">
                <User className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
