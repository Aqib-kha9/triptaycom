"use client";

import Link from "next/link";
import { Heart, User, MessageSquare, Bell, Menu, X, ChevronDown, LayoutDashboard, Calendar, Star, LogOut, Settings, Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "@/components/role-provider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavbarUser() {
  const pathname = usePathname();
  const { role, setRole, setIsLoggedIn, hasVendorAccess } = useRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCompactSearch, setShowCompactSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (pathname === "/" && window.scrollY > 120) {
        setShowCompactSearch(true);
      } else {
        setShowCompactSearch(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const USER_MENU = [
    { name: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, href: "/dashboard" },
    { name: "My Bookings", icon: <Calendar className="w-4 h-4" />, href: "/bookings" },
    { name: "My Reviews", icon: <Star className="w-4 h-4" />, href: "/reviews" },
    { name: "Settings", icon: <Settings className="w-4 h-4" />, href: "/profile" },
  ];

  const HOST_MENU = [
    { name: "Vendor Dashboard", icon: <Building2 className="w-4 h-4" />, href: "/vendor/dashboard" },
    { name: "Host Profile", icon: <User className="w-4 h-4" />, href: "/vendor/profile" },
  ];

  return (
    <nav className="fixed top-0 z-[110] w-full border-b border-zinc-100 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <span className="text-2xl font-bold italic">T</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900 hidden sm:block">Triptay</span>
        </Link>

        {/* Discovery Links & Sticky Search Pill */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <AnimatePresence>
            {showCompactSearch && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center bg-white border border-zinc-200 rounded-full p-1 shadow-md hover:border-zinc-300 transition-all w-[320px] lg:w-[380px] h-10"
              >
                {/* Location */}
                <div className="flex-1 cursor-pointer px-3 border-r border-zinc-100 flex items-center">
                  <input 
                    type="text" 
                    placeholder="Search stays..." 
                    className="bg-transparent border-none outline-none text-[11px] font-bold placeholder:text-zinc-400 w-full text-zinc-700 p-0"
                  />
                </div>

                {/* Date */}
                <div className="w-[80px] cursor-pointer px-2 border-r border-zinc-100 flex items-center justify-center">
                  <p className="text-[11px] font-bold text-zinc-400 truncate">Add dates</p>
                </div>

                {/* Guests */}
                <div className="w-[80px] cursor-pointer px-2 flex items-center justify-center pr-1">
                  <p className="text-[11px] font-bold text-zinc-400 truncate">Add guests</p>
                </div>

                {/* Circular Search Button */}
                <button 
                  className="bg-primary hover:bg-primary/90 text-white w-7 h-7 rounded-full transition-all flex items-center justify-center active:scale-95 shrink-0"
                >
                  <Search className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <Link href="/explore" className={cn("text-xs font-bold uppercase tracking-widest transition-colors", pathname === "/explore" ? "text-primary" : "text-zinc-500 hover:text-zinc-900")}>Explore</Link>
          <Link href="/stays" className={cn("text-xs font-bold uppercase tracking-widest transition-colors", pathname === "/stays" ? "text-primary" : "text-zinc-500 hover:text-zinc-900")}>Stays</Link>
          <Link href="/activities" className={cn("text-xs font-bold uppercase tracking-widest transition-colors", pathname === "/activities" ? "text-primary" : "text-zinc-500 hover:text-zinc-900")}>Activities</Link>
          <div className="h-4 w-px bg-zinc-200" />
          <Link href="/dashboard" className={cn("text-xs font-bold uppercase tracking-widest transition-colors", pathname.startsWith("/dashboard") ? "text-primary" : "text-zinc-500 hover:text-zinc-900")}>Dashboard</Link>
        </div>

        {/* Private Actions */}
        <div className="flex items-center gap-3">
          <Link href="/vendor/onboarding">
            <Button variant="ghost" className="text-xs font-bold rounded-full hidden lg:flex">
              Become a Host
            </Button>
          </Link>
          
          <div className="flex items-center gap-1 border-l border-zinc-100 pl-3 ml-1">
            <Link href="/wishlist" className="hidden md:block">
              <Button variant="ghost" size="icon" className="rounded-full text-zinc-500 hover:text-primary">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className={cn("rounded-full transition-colors", pathname === "/notifications" ? "text-primary bg-primary/5" : "text-zinc-400 hover:text-primary")}>
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* User Dropdown Trigger */}
            <div className="relative ml-2">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-full px-3 py-1.5 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden">
                  <User className="w-4 h-4" />
                </div>
                <ChevronDown className={cn("w-3 h-3 text-zinc-400 transition-transform", isMenuOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setIsMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 p-3 z-10"
                    >
                      <div className="p-4 border-b border-zinc-50 mb-2">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="font-bold text-zinc-900 truncate">aqib@example.com</p>
                      </div>
                      
                      <div className="space-y-1">
                        {USER_MENU.map((item) => (
                          <Link 
                            key={item.name} 
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                          >
                            <div className="text-zinc-400">{item.icon}</div>
                            {item.name}
                          </Link>
                        ))}
                      </div>

                      {hasVendorAccess && (
                        <div className="mt-2 pt-2 border-t border-zinc-50">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-4 mb-2">Hosting</p>
                          {HOST_MENU.map((item) => (
                            <Link 
                              key={item.name} 
                              href={item.href}
                              onClick={() => {
                                setRole("vendor");
                                setIsMenuOpen(false);
                              }}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                            >
                              <div className="text-zinc-400">{item.icon}</div>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-zinc-50">
                        <button 
                          onClick={() => {
                            setIsLoggedIn(false);
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
