"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Calendar,
  DollarSign,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Trash2,
  Clock,
  Loader2,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notificationsApi } from "@/lib/api-client";

export default function VendorNotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsApi.getAll({ limit: 100 });
      setNotifications(res.data?.notifications || []);
    } catch (err: any) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id || n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all notifications?")) return;
    try {
      await notificationsApi.deleteAll();
      setNotifications([]);
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
    }
  };

  const getNotificationIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("booking")) return { icon: <Calendar className="w-4 h-4" />, color: "bg-blue-50 text-blue-600" };
    if (t.includes("payout") || t.includes("commission") || t.includes("earnings")) return { icon: <DollarSign className="w-4 h-4" />, color: "bg-emerald-50 text-emerald-600" };
    if (t.includes("message") || t.includes("chat")) return { icon: <MessageSquare className="w-4 h-4" />, color: "bg-purple-50 text-purple-600" };
    return { icon: <Bell className="w-4 h-4" />, color: "bg-amber-50 text-amber-600" };
  };

  const filteredNotifications = notifications.filter((noti) => {
    if (filter === "All") return true;
    const type = noti.type.toLowerCase();
    if (filter === "Bookings") return type.includes("booking");
    if (filter === "Finance") return type.includes("commission") || type.includes("payout") || type.includes("listing") || type.includes("activity");
    if (filter === "Messages") return type.includes("message") || type.includes("chat");
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-6">
            <VendorSidebar />

            <div className="flex-grow space-y-6">

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">Notifications</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Stay updated.</p>
                </div>
                {notifications.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={handleMarkAllAsRead}
                      className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
                    >
                      Mark all as read
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleDeleteAll}
                      className="h-8 w-8 rounded-lg border-zinc-100 text-zinc-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl w-fit">
                {["All", "Bookings", "Finance", "Messages"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      filter === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Feed */}
              {loading ? (
                <div className="bg-white rounded-2xl border border-zinc-100 p-16 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs font-bold text-zinc-400">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                    <Bell className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-900">No notifications</h3>
                    <p className="text-xs text-zinc-500 font-medium max-w-xs">
                      {filter === "All" 
                        ? "You'll be notified about bookings, payouts, and listings here."
                        : `No notifications found under ${filter}.`
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((noti) => {
                    const iconData = getNotificationIcon(noti.type);
                    return (
                      <div
                        key={noti.id || noti._id}
                        className={cn(
                          "p-4 rounded-2xl border transition-all relative overflow-hidden",
                          !noti.isRead ? "bg-white border-zinc-100 shadow-sm shadow-zinc-900/5" : "bg-zinc-50/50 border-zinc-50 opacity-80"
                        )}
                      >
                        {!noti.isRead && <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />}
                        <div className="flex items-start gap-4 pr-6">
                          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", iconData.color)}>
                            {iconData.icon}
                          </div>
                          <div className="flex-grow space-y-0.5 text-xs">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-zinc-900">{noti.title}</h3>
                              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {new Date(noti.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-zinc-500 font-medium leading-relaxed max-w-xl">{noti.description}</p>
                            <div className="pt-3 flex items-center gap-4">
                              {noti.link && (
                                <Link href={noti.link}>
                                  <Button 
                                    variant="link" 
                                    onClick={() => handleMarkAsRead(noti.id || noti._id)}
                                    className="p-0 h-auto text-[9px] font-black uppercase tracking-widest text-primary gap-1.5 group"
                                  >
                                    View Details <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                  </Button>
                                </Link>
                              )}
                              {!noti.isRead && !noti.link && (
                                <Button 
                                  variant="link" 
                                  onClick={() => handleMarkAsRead(noti.id || noti._id)}
                                  className="p-0 h-auto text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
                                >
                                  Mark as read
                                </Button>
                              )}
                              {noti.isRead && (
                                <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold uppercase tracking-widest">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Read
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(noti.id || noti._id)}
                          className="absolute top-4 right-4 text-zinc-300 hover:text-rose-500 p-1 transition-colors"
                          title="Delete notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
