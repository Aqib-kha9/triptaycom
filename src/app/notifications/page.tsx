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
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";

const NOTIFICATIONS_DATA = [
  { id: 1, category: "booking", title: "Booking Confirmed", desc: "Great news! Your stay at 'Mountain Whisper Villa' has been confirmed.", time: "2h ago", unread: true, icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
  { id: 2, category: "promo", title: "Exclusive 20% Discount", desc: "Use code 'EXPLORE20' for an extra 20% off on all activities.", time: "5h ago", unread: true, icon: <Zap className="w-4 h-4 text-amber-500" /> },
  { id: 3, category: "booking", title: "Review your recent stay", desc: "How was your experience at 'Beachside Shack'? Share your feedback.", time: "1d ago", unread: false, icon: <Star className="w-4 h-4 text-primary" /> },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "booking" | "promo">("all");
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  const filteredNotifications = notifications.filter(n => filter === "all" || n.category === filter);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const deleteNotification = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
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
              <div className="flex items-center gap-2 px-1 overflow-x-auto pb-1 scrollbar-hide">
                {(["all", "booking", "promo"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                      filter === f ? "bg-zinc-900 text-white shadow-sm" : "bg-white border border-zinc-100 text-zinc-400 hover:border-zinc-200"
                    )}
                  >
                    {f === "all" ? "All Updates" : f === "booking" ? "Bookings" : "Promotions"}
                  </button>
                ))}
              </div>

              {/* Notification Feed */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((n) => (
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className={cn(
                          "bg-white p-4 sm:p-5 rounded-2xl border transition-all group relative overflow-hidden",
                          n.unread ? "border-primary/20 bg-primary/5" : "border-zinc-100"
                        )}
                      >
                        {n.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                        
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shrink-0">
                            {n.icon}
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-zinc-900">{n.title}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black uppercase text-zinc-400 flex items-center gap-1 tracking-widest">
                                  <Clock className="w-3 h-3" /> {n.time}
                                </span>
                                <button 
                                  onClick={() => deleteNotification(n.id)}
                                  className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-rose-500 transition-all p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                              {n.desc}
                            </p>
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
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
