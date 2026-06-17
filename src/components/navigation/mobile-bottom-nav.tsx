"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  CalendarCheck,
  Star,
  Bell,
  CreditCard,
  DollarSign,
  Building2,
  Users,
  Settings,
  LogOut,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, role, setIsLoggedIn, setRole } = useRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hide bottom nav in auth forms to keep screens simple and clear
  const isAuthFlow = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password");
  if (isAuthFlow) return null;

  // Fixed Bottom Nav Items (always visible)
  const bottomNavLinks = [
    { name: "Explore", href: "/", icon: Compass },
    { name: "Stays", href: "/stays", icon: Home },
    { name: "Activities", href: "/activities", icon: Sparkles },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
  ];

  // Drawer Items for Guest
  const guestDrawerLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Bookings", href: "/bookings", icon: Calendar },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Reviews", href: "/reviews", icon: Star },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Wallet", href: "/wallet", icon: CreditCard },
    { name: "Profile Settings", href: "/profile", icon: Settings },
  ];

  // Drawer Items for Vendor
  const vendorDrawerLinks = [
    { name: "Overview", href: "/vendor/dashboard", icon: LayoutDashboard },
    { name: "My Stays", href: "/vendor/stays", icon: Home },
    { name: "My Activities", href: "/vendor/activities", icon: Sparkles },
    { name: "Availability", href: "/vendor/calendar", icon: Calendar },
    { name: "Bookings", href: "/vendor/bookings", icon: CalendarCheck },
    { name: "Earnings", href: "/vendor/earnings", icon: DollarSign },
    { name: "Messages", href: "/vendor/messages", icon: MessageSquare },
    { name: "Profile Settings", href: "/vendor/profile", icon: Settings },
  ];

  const drawerLinks = role === "vendor" ? vendorDrawerLinks : guestDrawerLinks;

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
    setIsLoggedIn(false);
    setRole("guest");
    setIsDrawerOpen(false);
    router.push("/");
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[120] md:hidden bg-white/90 backdrop-blur-xl border-t border-zinc-100/80 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] px-4 pb-5 pt-3 flex items-center justify-around">
        {/* Render standard navigation links */}
        {bottomNavLinks.map((link) => {
          const Icon = link.icon;
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
                    isActive ? "text-primary stroke-[2.5px]" : "text-zinc-500 stroke-[2px]"
                  )} 
                />
                <span 
                  className={cn(
                    "text-[9px] font-bold mt-1 tracking-wide transition-colors duration-300",
                    isActive ? "text-primary font-black" : "text-zinc-500"
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

        {/* Profile Button (Login link if logged out, Drawer trigger if logged in) */}
        {isLoggedIn ? (
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 relative transition-all rounded-xl cursor-pointer"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              animate={isDrawerOpen ? { y: -2 } : { y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex flex-col items-center"
            >
              <User 
                className={cn(
                  "w-5 h-5 transition-colors duration-300", 
                  isDrawerOpen ? "text-primary stroke-[2.5px]" : "text-zinc-500 stroke-[2px]"
                )} 
              />
              <span 
                className={cn(
                  "text-[9px] font-bold mt-1 tracking-wide transition-colors duration-300",
                  isDrawerOpen ? "text-primary font-black" : "text-zinc-500"
                )}
              >
                Profile
              </span>
            </motion.div>
              {isDrawerOpen && (
                <motion.span
                  layoutId="activeDot"
                  className="absolute bottom-[-4px] w-1 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
          </button>
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center justify-center py-1 px-3 relative transition-all rounded-xl cursor-pointer"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <User className={cn(
                "w-5 h-5 transition-colors duration-300",
                pathname === "/login" ? "text-primary stroke-[2.5px]" : "text-zinc-500 stroke-[2px]"
              )} />
              <span className={cn(
                "text-[9px] font-bold mt-1 tracking-wide transition-colors duration-300",
                pathname === "/login" ? "text-primary font-black" : "text-zinc-500"
              )}>
                Login
              </span>
            </motion.div>
          </Link>
        )}
      </div>

      {/* Drawer Overlay & Content */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-[130] backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[140] rounded-t-3xl shadow-2xl md:hidden overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-100">
                <div>
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">Your Account</h3>
                  <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">{role === "vendor" ? "Host Panel" : "Traveler Panel"}</p>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto no-scrollbar space-y-2">
                {drawerLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all group",
                        isActive 
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                          : "bg-white hover:bg-zinc-50 active:bg-zinc-100 border-transparent hover:border-zinc-100"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                        isActive 
                          ? "bg-white/10 text-white"
                          : "bg-zinc-50 border border-zinc-100 text-zinc-500 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/10"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={cn(
                        "text-sm font-bold",
                        isActive ? "text-white" : "text-zinc-700 group-hover:text-zinc-900"
                      )}>{link.name}</span>
                    </Link>
                  );
                })}

                <div className="h-px bg-zinc-100 my-4" />

                {role === "vendor" && (
                  <button
                    onClick={() => {
                      setRole("guest");
                      setIsDrawerOpen(false);
                      router.push("/");
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-white hover:bg-zinc-50 active:bg-zinc-100 border border-transparent hover:border-zinc-100 transition-all group mb-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-100 transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-zinc-600">Switch to Guest</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-white hover:bg-rose-50 active:bg-rose-100 border border-transparent hover:border-rose-100 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 group-hover:bg-rose-100 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-rose-600">Log Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
