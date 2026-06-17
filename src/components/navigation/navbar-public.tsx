"use client";

import Link from "next/link";
import { Search, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "@/components/role-provider";
import { usePathname } from "next/navigation";

export function NavbarPublic() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCompactSearch, setShowCompactSearch] = useState(false);
  const { setIsLoggedIn } = useRole();

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

  return (
    <nav className="fixed top-0 z-[110] w-full border-b border-zinc-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <span className="text-2xl font-bold italic">T</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900 hidden sm:block">Triptay</span>
        </Link>

        {/* Public Links & Scroll-sticky Search Pill */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10">
          <AnimatePresence>
            {showCompactSearch && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center bg-white border border-zinc-200 rounded-full p-1 hover:border-zinc-300 transition-all w-[320px] lg:w-[380px] h-10"
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

          <Link href="/explore" className={`text-sm font-bold transition-colors ${pathname.startsWith("/explore") ? "text-primary" : "text-zinc-500 hover:text-primary"}`}>Explore</Link>
          <Link href="/stays" className={`text-sm font-bold transition-colors ${pathname.startsWith("/stays") ? "text-primary" : "text-zinc-500 hover:text-primary"}`}>Stays</Link>
          <Link href="/activities" className={`text-sm font-bold transition-colors ${pathname.startsWith("/activities") ? "text-primary" : "text-zinc-500 hover:text-primary"}`}>Activities</Link>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="hidden md:block">
            <Button variant="ghost" size="icon" className="rounded-full text-zinc-500 hover:text-primary">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button className="rounded-full px-8 h-11 font-bold">
              Login / Sign Up
            </Button>
          </Link>
          {/* Mobile menu button hidden in favor of the new bottom navigation bar */}
          <button className="hidden p-2" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-[80%] bg-white z-[210] p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-bold">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="flex flex-col gap-8">
                <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-bold transition-colors ${pathname.startsWith("/explore") ? "text-primary" : "text-zinc-800"}`}>Explore</Link>
                <Link href="/stays" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-bold transition-colors ${pathname.startsWith("/stays") ? "text-primary" : "text-zinc-800"}`}>Stays</Link>
                <Link href="/activities" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-bold transition-colors ${pathname.startsWith("/activities") ? "text-primary" : "text-zinc-800"}`}>Activities</Link>
                <div className="h-px bg-zinc-100 my-4" />
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-primary text-left">Login / Sign Up</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
