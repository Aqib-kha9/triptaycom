"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/components/role-provider";
import { 
  Compass, 
  Home, 
  Sparkles, 
  Heart, 
  User, 
  Calendar, 
  MessageSquare, 
  LayoutDashboard, 
  CalendarCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isLoggedIn, role } = useRole();

  // Hide bottom nav in auth forms to keep screens simple and clear
  const isAuthFlow = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password");
  if (isAuthFlow) return null;

  // 1. Logged Out Nav Items
  const publicLinks = [
    { name: "Explore", href: "/", icon: Compass },
    { name: "Stays", href: "/stays", icon: Home },
    { name: "Activities", href: "/activities", icon: Sparkles },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Login", href: "/login", icon: User },
  ];

  // 2. Logged In User / Guest Nav Items
  const guestLinks = [
    { name: "Explore", href: "/", icon: Compass },
    { name: "Bookings", href: "/bookings", icon: Calendar },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Profile", href: "/dashboard", icon: User },
  ];

  // 3. Vendor Nav Items
  const vendorLinks = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { name: "Stays", href: "/vendor/stays", icon: Home },
    { name: "Bookings", href: "/vendor/bookings", icon: CalendarCheck },
    { name: "Messages", href: "/vendor/messages", icon: MessageSquare },
    { name: "Profile", href: "/vendor/profile", icon: User },
  ];

  // Determine which links to show
  let links = publicLinks;
  if (isLoggedIn) {
    links = role === "vendor" ? vendorLinks : guestLinks;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[120] md:hidden bg-white/90 backdrop-blur-xl border-t border-zinc-100/80 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] px-4 pb-5 pt-3 flex items-center justify-around">
      {links.map((link) => {
        const Icon = link.icon;
        // Match exact or parent path for sub-pages
        const isActive = link.href === "/" 
          ? pathname === "/" 
          : pathname === link.href || pathname.startsWith(link.href + "/");

        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex flex-col items-center justify-center py-1 px-3 relative transition-all rounded-xl cursor-pointer"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              animate={isActive ? { y: -2 } : { y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex flex-col items-center"
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-colors duration-300", 
                  isActive ? "text-primary stroke-[2.5px]" : "text-zinc-400 stroke-[2px]"
                )} 
              />
              <span 
                className={cn(
                  "text-[9px] font-bold mt-1 tracking-wide transition-colors duration-300",
                  isActive ? "text-primary font-black" : "text-zinc-400"
                )}
              >
                {link.name}
              </span>
            </motion.div>

            {isActive && (
              <motion.span
                layoutId="activeDot"
                className="absolute bottom-[-4px] w-1 h-1 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
