"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Heart, 
  Star,
  Zap,
  Home,
  CreditCard,
  MessageSquare,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";

const UPCOMING_TRIPS = [
  { id: "T-1024", title: "Mountain Whisper Villa", location: "Manali, HP", date: "12-15 Oct", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=300", status: "Confirmed", type: "Stay" },
  { id: "A-502", title: "River Rafting Adventure", location: "Rishikesh, UK", date: "20 Oct", image: "https://images.unsplash.com/photo-1530866495547-084969f682ba?auto=format&fit=crop&q=80&w=300", status: "Paid", type: "Activity" }
];

const NOTIFICATIONS = [
  { title: "Booking Confirmed", desc: "Your stay at Mountain Whisper is confirmed.", time: "2h ago", icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> },
  { title: "New Message", desc: "Host Vikram sent you a message.", time: "5h ago", icon: <MessageSquare className="w-3.5 h-3.5 text-primary" /> },
];

export default function UserDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6">
            <DashboardSidebar />

            <div className="flex-grow space-y-8">
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-zinc-900">12</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Total Bookings</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-zinc-900">24</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Wishlist</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-zinc-900">₹4.5k</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Wallet Balance</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Trips */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Upcoming Trips</h2>
                  <Link href="/bookings" className="text-primary font-bold text-[10px] uppercase">View All</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {UPCOMING_TRIPS.map((trip) => (
                    <div key={trip.id} className="bg-white p-4 rounded-2xl border border-zinc-100 flex gap-4 hover:border-primary/20 transition-all group">
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex-1 space-y-1.5 py-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-zinc-50 text-zinc-500">{trip.type}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">{trip.status}</span>
                        </div>
                        <h3 className="font-bold text-zinc-900 text-sm line-clamp-1">{trip.title}</h3>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                          <MapPin className="w-3 h-3" /> {trip.location}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-900 font-bold">
                          <Calendar className="w-3 h-3 text-primary" /> {trip.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-zinc-900 px-1 uppercase tracking-widest">Recent</h2>
                  <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-50 overflow-hidden">
                    {[
                      { title: "River Rafting", date: "Yesterday", price: "₹1,200", icon: <Zap className="w-4 h-4 text-primary" /> },
                      { title: "Village Walk", date: "2 days ago", price: "₹500", icon: <MapPin className="w-4 h-4 text-emerald-500" /> },
                    ].map((item, i) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">{item.icon}</div>
                          <div>
                            <p className="font-bold text-zinc-900 text-xs">{item.title}</p>
                            <p className="text-[10px] text-zinc-400 font-medium">{item.date}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-zinc-900">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-zinc-900 px-1 uppercase tracking-widest">Alerts</h2>
                  <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-50 overflow-hidden">
                    {NOTIFICATIONS.map((notif, i) => (
                      <div key={i} className="p-4 space-y-1 hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                            {notif.icon} {notif.title}
                          </h4>
                          <span className="text-[9px] text-zinc-400 font-bold uppercase">{notif.time}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
