"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Filter,
  Download,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";

const BOOKINGS_DATA = {
  upcoming: [
    { id: "TRP-8821", title: "Mountain Whisper Villa", location: "Manali, HP", date: "12 Oct - 15 Oct, 2024", price: "₹14,500", status: "Confirmed", type: "Stay", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=300" },
    { id: "TRP-9021", title: "River Rafting Adventure", location: "Rishikesh, UK", date: "20 Oct, 2024", price: "₹2,400", status: "Paid", type: "Activity", image: "https://images.unsplash.com/photo-1530866495547-084969f682ba?auto=format&fit=crop&q=80&w=300" },
  ],
  completed: [
    { id: "TRP-4421", title: "Beachside Shack", location: "Goa, India", date: "05 Sep - 08 Sep, 2024", price: "₹9,200", status: "Completed", type: "Stay", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300" },
  ],
  cancelled: [
    { id: "TRP-1102", title: "Desert Safari", location: "Jaisalmer, RJ", date: "15 Aug, 2024", price: "₹3,500", status: "Cancelled", type: "Activity", image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&q=80&w=300" },
  ]
};

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6">
            
            <DashboardSidebar />

            {/* Bookings Content */}
            <div className="flex-grow space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">My Bookings</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Manage your trips.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="rounded-xl gap-1.5 border-zinc-200 font-bold text-[10px] uppercase tracking-widest h-10 px-4">
                    <Filter className="w-3.5 h-3.5" /> Filter
                  </Button>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center p-1 bg-zinc-100 rounded-xl w-fit overflow-x-auto max-w-full">
                {(["upcoming", "completed", "cancelled"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize shrink-0",
                      activeTab === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                    )}
                  >
                    {tab}
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded",
                      activeTab === tab ? "bg-primary/10 text-primary" : "bg-zinc-200 text-zinc-400"
                    )}>
                      {BOOKINGS_DATA[tab].length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bookings List */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {BOOKINGS_DATA[activeTab].length > 0 ? (
                    BOOKINGS_DATA[activeTab].map((booking) => (
                      <div key={booking.id} className="bg-white rounded-2xl border border-zinc-100 p-4 sm:p-5 flex flex-col md:flex-row gap-5 group hover:border-primary/20 transition-all">
                        <div className="w-full md:w-40 h-32 rounded-xl overflow-hidden shrink-0">
                          <img src={booking.image} alt={booking.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{booking.id}</span>
                                <span className={cn(
                                  "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                  booking.type === "Stay" ? "bg-indigo-50 text-indigo-600" : "bg-primary/10 text-primary"
                                )}>
                                  {booking.type}
                                </span>
                              </div>
                              <div className={cn(
                                "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest",
                                booking.status === "Cancelled" ? "text-rose-500" : "text-emerald-500"
                              )}>
                                {booking.status === "Cancelled" ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                {booking.status}
                              </div>
                            </div>
                            
                            <h3 className="text-sm font-bold text-zinc-900 leading-tight">{booking.title}</h3>
                            
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                                <MapPin className="w-3 h-3 text-zinc-400" /> {booking.location}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-zinc-900 font-bold">
                                <Calendar className="w-3 h-3 text-primary" /> {booking.date}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-3 border-t border-zinc-50">
                            <div className="text-sm font-black text-zinc-900">
                              {booking.price}
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              {activeTab === "upcoming" && (
                                <Button variant="outline" className="flex-1 sm:flex-none rounded-xl font-bold border-rose-100 text-rose-500 hover:bg-rose-50 h-9 px-4 text-xs">
                                  Cancel
                                </Button>
                              )}
                              {activeTab === "completed" && (
                                <Button variant="outline" className="flex-1 sm:flex-none rounded-xl font-bold border-zinc-100 gap-1.5 h-9 px-4 text-xs">
                                  <Download className="w-3.5 h-3.5" /> Invoice
                                </Button>
                              )}
                              <Link href={`/bookings/${booking.id}`} className="flex-1 sm:flex-none">
                                <Button className="w-full rounded-xl font-bold px-6 h-9 text-xs">
                                  Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-zinc-300 shadow-sm">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900">No {activeTab} bookings</h3>
                        <p className="text-xs text-zinc-500 mt-1">You haven't made any bookings in this category.</p>
                      </div>
                      <Link href="/explore">
                        <Button className="rounded-xl px-6 h-10 font-bold text-xs mt-2">Explore</Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
