"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { LayoutDashboard, ListTree, CalendarCheck, MessageSquare, User, Bell, Plus, ChevronDown, LogOut, Settings, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { useRole } from "@/components/role-provider";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function NavbarVendor() {
  const pathname = usePathname();
  const router = useRouter();
  const { setRole, logout } = useRole();

  const [msgUnread, setMsgUnread] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifUnread, setNotifUnread] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  const vendorLinks = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Bookings", href: "/vendor/bookings", icon: <CalendarCheck className="w-4 h-4" /> },
    { name: "List your property", href: "/vendor/listings/new", icon: <Plus className="w-4 h-4" /> },
  ];

  const fetchUnreadCounts = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [msgRes, notifRes] = await Promise.allSettled([
        fetch(`${API_BASE}/chat/unread`, { headers }),
        fetch(`${API_BASE}/notifications/unread`, { headers }),
      ]);

      if (msgRes.status === "fulfilled" && msgRes.value.ok) {
        const data = await msgRes.value.json();
        setMsgUnread(data?.data?.unreadCount || 0);
      }

      if (notifRes.status === "fulfilled" && notifRes.value.ok) {
        const data = await notifRes.value.json();
        setNotifUnread(data?.data?.unreadCount || 0);
      }
    } catch {
      // Silently fail — badges stay at 0
    }
  }, []);

  // Fetch on mount and every 30 seconds (polling fallback)
  useEffect(() => {
    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCounts]);

  // Socket.IO listener for real-time unread count updates
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    let cancelled = false;

    (async () => {
      try {
        const { io } = await import("socket.io-client");
        if (cancelled) return;

        const socket = io("http://localhost:5000", {
          auth: { token },
          transports: ["websocket", "polling"],
        });
        socketRef.current = socket;

        const refresh = () => {
          if (!cancelled) fetchUnreadCounts();
        };

        socket.on("message:new", refresh);
        socket.on("messages:read", refresh);
      } catch {
        // Socket not available — polling handles it
      }
    })();

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [fetchUnreadCounts]);

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
          <div className="flex items-center gap-3 border-l border-zinc-100 pl-4">
            {/* Notifications Icon */}
            <Link href="/vendor/notifications" className="text-zinc-400 hover:text-primary transition-colors hidden md:block relative">
              <Bell className="w-5 h-5" />
              {notifUnread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
                  {notifUnread > 99 ? "99+" : notifUnread}
                </span>
              )}
            </Link>

            {/* Messages Icon */}
            <Link href="/vendor/messages" className="text-zinc-400 hover:text-primary transition-colors relative">
              <MessageSquare className="w-5 h-5" />
              {msgUnread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
                  {msgUnread > 99 ? "99+" : msgUnread}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 rounded-full border border-zinc-100 bg-zinc-50 px-2 py-1 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <ChevronDown className={cn("w-3 h-3 text-zinc-400 transition-transform", isUserMenuOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setIsUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-zinc-100 shadow-2xl shadow-zinc-200/50 p-2 z-10"
                    >
                      <Link
                        href="/vendor/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                      >
                        <Settings className="w-4 h-4 text-zinc-400" />
                        Profile Settings
                      </Link>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setRole("guest");
                          router.push("/");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                      >
                        <Users className="w-4 h-4 text-zinc-400" />
                        Switch to Guest
                      </button>

                      <div className="my-1 border-t border-zinc-50" />

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
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
