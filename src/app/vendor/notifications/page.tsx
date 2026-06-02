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
  Clock
} from "lucide-react";
import { useState } from "react";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function VendorNotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [notifications] = useState<any[]>([]);

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
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900">Mark all as read</Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-zinc-100 text-zinc-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
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
              {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                    <Bell className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-900">No notifications</h3>
                    <p className="text-xs text-zinc-500 font-medium max-w-xs">You'll be notified about bookings, payouts, and messages here.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((noti) => (
                    <div
                      key={noti.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all relative overflow-hidden",
                        noti.unread ? "bg-white border-zinc-100" : "bg-zinc-50/50 border-zinc-50 opacity-80"
                      )}
                    >
                      {noti.unread && <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />}
                      <div className="flex items-start gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", noti.color)}>{noti.icon}</div>
                        <div className="flex-grow space-y-0.5 text-xs">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-zinc-900">{noti.title}</h3>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3" /> {noti.time}</span>
                          </div>
                          <p className="text-zinc-500 font-medium leading-relaxed max-w-xl">{noti.desc}</p>
                          <div className="pt-3 flex items-center gap-4">
                            <Link href={noti.link}>
                              <Button variant="link" className="p-0 h-auto text-[9px] font-black uppercase tracking-widest text-primary gap-1.5 group">
                                View Activity <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                            {!noti.unread && <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold uppercase tracking-widest"><CheckCircle2 className="w-3.5 h-3.5" /> Read</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
