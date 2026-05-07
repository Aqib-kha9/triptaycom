"use client";

import Link from "next/link";
import { Search, Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "@/components/role-provider";

export function NavbarPublic() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsLoggedIn } = useRole();

  return (
    <nav className="fixed top-0 z-[110] w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <span className="text-2xl font-bold italic">T</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900 hidden sm:block">Triptay</span>
        </Link>

        {/* Public Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/explore" className="text-sm font-bold text-zinc-500 hover:text-primary transition-colors">Explore</Link>
          <Link href="/stays" className="text-sm font-bold text-zinc-500 hover:text-primary transition-colors">Stays</Link>
          <Link href="/activities" className="text-sm font-bold text-zinc-500 hover:text-primary transition-colors">Activities</Link>
          <Link href="/vendor/onboarding" className="text-sm font-bold text-zinc-900 hover:text-primary transition-colors">List your property</Link>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="rounded-full text-zinc-500 hover:text-primary">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login" className="text-sm font-bold text-zinc-900 hover:text-primary transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/login">
            <Button className="rounded-full px-8 h-12 font-bold shadow-xl shadow-primary/20">
              Sign Up
            </Button>
          </Link>
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(true)}>
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
                <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold">Explore</Link>
                <Link href="/stays" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold">Stays</Link>
                <Link href="/activities" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold">Activities</Link>
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
