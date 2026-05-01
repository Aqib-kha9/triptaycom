"use client";

import Link from "next/link";
import { Heart, User, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Explore", href: "/explore" },
    { name: "Stays", href: "/stays" },
    { name: "Activities", href: "/activities" },
    { name: "Nearby", href: "/nearby" },
    { name: "Destinations", href: "/destinations" },
    { name: "Offers", href: "/offers" },
  ];

  return (
    <>
    <nav className="fixed top-0 z-[110] w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-2 text-zinc-900"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <span className="text-xl font-bold italic">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">Triptay</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" className="hidden text-sm font-bold lg:inline-flex rounded-full">
            Become a Host
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-zinc-500 hover:text-primary">
            <Heart className="h-5 w-5" />
          </Button>
          <Link href="/auth/login">
            <Button variant="outline" size="sm" className="hidden items-center gap-2 rounded-full md:inline-flex px-4 py-5 border-zinc-200">
              <User className="h-4 w-4" />
              <span className="font-bold text-xs">Sign In</span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden rounded-full">
              <User className="h-5 w-5 text-zinc-500" />
            </Button>
          </Link>
        </div>
      </div>

    </nav>

    {/* Mobile Menu Overlay - Moved outside <nav> for solid background */}
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
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[210] shadow-[25px_0_50px_-12px_rgba(0,0,0,0.5)] p-0 overflow-hidden"
          >
            <div className="h-full w-full bg-white flex flex-col">
              {/* Solid Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-white">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                    <span className="text-xl font-bold italic">T</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-zinc-900">Triptay</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center active:scale-90 transition-all"
                >
                  <X className="w-5 h-5 text-zinc-900" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-bold text-zinc-900 hover:text-primary transition-colors flex items-center justify-between"
                    >
                      {link.name}
                      <Menu className="w-4 h-4 text-zinc-300" />
                    </Link>
                  ))}
                  <div className="h-px bg-zinc-100 my-2" />
                  <Link href="/host" className="text-lg font-bold text-primary">
                    Become a Host
                  </Link>
                  <Link href="/auth/login" className="flex items-center gap-3 text-lg font-bold text-zinc-900">
                    <User className="w-5 h-5" />
                    Sign In
                  </Link>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 border-t border-zinc-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Support</p>
                <p className="text-sm font-bold text-zinc-900">help@triptay.com</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
