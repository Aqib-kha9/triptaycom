"use client";

import Link from "next/link";
import { Heart, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <span className="text-xl font-bold">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">Triptay</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors">Explore</Link>
          <Link href="/stays" className="text-sm font-medium hover:text-primary transition-colors">Stays</Link>
          <Link href="/activities" className="text-sm font-medium hover:text-primary transition-colors">Activities</Link>
          <Link href="/destinations" className="text-sm font-medium hover:text-primary transition-colors">Destinations</Link>
          <Link href="/offers" className="text-sm font-medium hover:text-primary transition-colors">Offers</Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden text-sm font-medium lg:inline-flex">
            Become a Host
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm" className="hidden items-center gap-2 rounded-full md:inline-flex px-3 py-5">
            <User className="h-5 w-5" />
            <span className="font-semibold px-1">Sign In</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
