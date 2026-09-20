"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Calendar, 
  Zap, 
  Star,
  Clock,
  Trash2,
  Settings,
  CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const getTimeAgo = (date: string | Date) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "Just now";
};
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { notificationsApi } from "@/lib/api-client";
import type { NotificationItem } from "@/types/api";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "booking" | "promo" | "system">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationsApi.getAll();
      if (res.data?.notifications) {
        setNotifications(res.data.notifications);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(n => filter === "all" || n.type === filter);

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "booking": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "promo": return <Zap className="w-4 h-4 text-amber-500" />;
      default: return <Star className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-28 lg:pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6">
            
            <DashboardSidebar />

            {/* Notifications Content */}
            <div className="flex-grow space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">Notifications</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Stay updated.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={markAllRead} variant="outline" className="rounded-xl border-zinc-200 font-bold text-[10px] uppercase tracking-widest h-10 px-4">
                    Mark all read
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-zinc-400 hover:bg-zinc-100">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 px-1 overflow-x-auto pb-1 no-scrollbar snap-x">
                {(["all", "booking", "promo", "system"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap snap-start",
                      filter === f ? "bg-zinc-900 text-white shadow-sm" : "bg-white border border-zinc-100 text-zinc-400 hover:border-zinc-200"
                    )}
                  >
                    {f === "all" ? "All Updates" : f}
                  </button>
                ))}
              </div>

              {/* Notification Feed */}
              <div className="space-y-3">
                {loading ? (
                   [1, 2, 3].map(i => (
                     <div key={i} className="h-24 bg-white border border-zinc-100 rounded-2xl animate-pulse" />
                   ))
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((n) => (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          onClick={() => !n.isRead && markAsRead(n.id)}
                          className={cn(
                            "bg-white p-4 sm:p-5 rounded-2xl border transition-all group relative overflow-hidden cursor-pointer",
                            !n.isRead ? "border-primary/20 bg-primary/5" : "border-zinc-100"
                          )}
                        >
                          {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                          
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shrink-0">
                              {getIconForType(n.type)}
                            </div>
                            
                            <div className="flex-grow min-w-0 pr-12 sm:pr-24">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={cn(
                                  "text-sm font-bold truncate",
                                  !n.isRead ? "text-zinc-900" : "text-zinc-700"
                                )}>
                                  {n.title}
                                </h3>
                              </div>
                              <p className={cn(
                                "text-xs line-clamp-2",
                                !n.isRead ? "text-zinc-600 font-medium" : "text-zinc-500"
                              )}>
                                {n.message}
                              </p>
                              <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {getTimeAgo(n.createdAt)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(n.id);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-zinc-300 shadow-sm">
                        <Bell className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900">No notifications found</h3>
                        <p className="text-xs text-zinc-500 mt-1">You're all caught up!</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
