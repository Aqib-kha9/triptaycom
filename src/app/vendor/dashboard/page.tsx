"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  Calendar,
  Plus,
  ArrowUpRight,
  DollarSign,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";

const RECENT_BOOKINGS = [
  { id: "BOK-9921", guest: "Aryan Singh", item: "Mountain Whisper Villa", date: "12-15 Oct", amount: "₹14,500", status: "Confirmed" },
  { id: "BOK-8812", guest: "Meera Kapoor", item: "River Rafting", date: "20 Oct", amount: "₹2,400", status: "Pending" },
  { id: "BOK-7712", guest: "Rahul Verma", item: "The Creek Villa", date: "22-25 Oct", amount: "₹18,200", status: "Confirmed" },
];

// KYC guard is now handled by vendor/layout.tsx — this page only renders for Approved vendors
export default function VendorDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-28 lg:pb-12">
        <div className="container mx-auto px-4">

          <div className="flex flex-col lg:flex-row gap-6">
            <VendorSidebar />

            <div className="flex-grow space-y-6">

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">Dashboard</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Welcome back, Elite Stays.</p>
                </div>
                <Link href="/vendor/stays">
                  <Button className="rounded-xl px-6 h-10 text-xs font-bold gap-2">
                    <Plus className="w-3.5 h-3.5" />
                    New Listing
                  </Button>
                </Link>
              </div>

              {/* Stats Grid */}
              <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-4 pb-2 sm:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3 min-w-[150px] flex-shrink-0 snap-center">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-widest">+12%</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Earnings</p>
                    <h3 className="text-xl font-black text-zinc-900">₹1,84,200</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3 min-w-[150px] flex-shrink-0 snap-center">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-widest">+8 new</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bookings</p>
                    <h3 className="text-xl font-black text-zinc-900">42</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3 min-w-[150px] flex-shrink-0 snap-center">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-widest">4.9/5</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rating</p>
                    <h3 className="text-xl font-black text-zinc-900">Elite</h3>
                  </div>
                </div>
              </div>

              {/* Recent Bookings & Chart Area */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="xl:col-span-2 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Recent Bookings</h2>
                    <Button variant="ghost" className="font-bold text-primary text-[10px] uppercase">View All</Button>
                  </div>
                  <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden divide-y divide-zinc-50">
                    {RECENT_BOOKINGS.map((booking) => (
                      <div key={booking.id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors group">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-900 text-sm">{booking.guest}</h4>
                            <p className="text-[11px] text-zinc-400 font-medium">{booking.item} • {booking.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                          <div className="sm:text-right">
                            <p className="text-sm font-black text-zinc-900">{booking.amount}</p>
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                              booking.status === "Confirmed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                            )}>
                              {booking.status}
                            </span>
                          </div>
                          <button className="p-1 text-zinc-300 hover:text-zinc-900">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-zinc-900 px-1 uppercase tracking-widest">Performance</h2>
                  <div className="bg-zinc-900 rounded-2xl p-6 text-white space-y-6 relative overflow-hidden">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Most Booked</p>
                      <h4 className="text-sm font-bold leading-tight">Mountain Whisper Villa</h4>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                          <span className="text-white/40">Occupancy</span>
                          <span className="text-primary">92%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} className="h-full bg-primary" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                          <span className="text-white/40">Goal</span>
                          <span className="text-emerald-400">80%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "80%" }} className="h-full bg-emerald-400" />
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full rounded-xl h-10 border-white/10 hover:bg-white hover:text-zinc-900 text-xs font-bold transition-all">
                      Full Report
                    </Button>
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
