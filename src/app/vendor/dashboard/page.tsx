"use client";

import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";
import { authApi, bookingsApi, commissionApi } from "@/lib/api-client";

export default function VendorDashboardPage() {
  const [userName, setUserName] = useState("Partner");
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Profile
        const profileRes = await authApi.getMe();
        if (profileRes.data?.user) {
          setUserName(profileRes.data.user.name);
        }

        // 2. Fetch Bookings as Host
        const bookingsRes = await bookingsApi.getMyBookings({ limit: 5, role: "host" });
        if (bookingsRes.data?.bookings) {
          setBookings(bookingsRes.data.bookings);
          setTotalBookings(bookingsRes.pagination?.total || bookingsRes.data.bookings.length);
        }

        // 3. Fetch Earnings
        const ledgerRes = await commissionApi.getHostLedger({ limit: 1 });
        if (ledgerRes.data?.summary) {
          setTotalEarnings(ledgerRes.data.summary.totalPayout);
        }
      } catch (err) {
        console.error("Failed to load vendor dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute most booked item
  const itemCounts: Record<string, number> = {};
  bookings.forEach((b) => {
    if (b.itemName) {
      itemCounts[b.itemName] = (itemCounts[b.itemName] || 0) + 1;
    }
  });
  let mostBookedItem = "No Listings Booked";
  let maxCount = 0;
  Object.entries(itemCounts).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostBookedItem = name;
    }
  });

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
                  <p className="text-xs text-zinc-500 font-medium italic">
                    {loading ? "Loading account..." : `Welcome back, ${userName}.`}
                  </p>
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
                {/* Earnings Card */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3 min-w-[150px] flex-grow sm:flex-grow-0 snap-center">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-widest">
                      Live
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Earnings</p>
                    <h3 className="text-xl font-black text-zinc-900">
                      {loading ? (
                        <span className="inline-block w-20 h-5 bg-zinc-100 animate-pulse rounded" />
                      ) : (
                        `₹${totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      )}
                    </h3>
                  </div>
                </div>

                {/* Bookings Card */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3 min-w-[150px] flex-grow sm:flex-grow-0 snap-center">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase tracking-widest">
                      Total
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bookings</p>
                    <h3 className="text-xl font-black text-zinc-900">
                      {loading ? (
                        <span className="inline-block w-12 h-5 bg-zinc-100 animate-pulse rounded" />
                      ) : (
                        totalBookings
                      )}
                    </h3>
                  </div>
                </div>

                {/* Rating Card */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3 min-w-[150px] flex-grow sm:flex-grow-0 snap-center">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-widest">
                      Rating
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</p>
                    <h3 className="text-xl font-black text-zinc-900">Elite</h3>
                  </div>
                </div>
              </div>

              {/* Recent Bookings & Performance Area */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Bookings List */}
                <div className="xl:col-span-2 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Recent Bookings</h2>
                    <Link href="/vendor/bookings">
                      <Button variant="ghost" className="font-bold text-primary text-[10px] uppercase">
                        View All
                      </Button>
                    </Link>
                  </div>

                  <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden divide-y divide-zinc-50">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 animate-pulse" />
                            <div className="space-y-2">
                              <div className="w-28 h-4 bg-zinc-100 animate-pulse rounded" />
                              <div className="w-40 h-3 bg-zinc-100 animate-pulse rounded" />
                            </div>
                          </div>
                          <div className="space-y-2 text-right">
                            <div className="w-16 h-4 bg-zinc-100 animate-pulse rounded ml-auto" />
                            <div className="w-12 h-3 bg-zinc-100 animate-pulse rounded ml-auto" />
                          </div>
                        </div>
                      ))
                    ) : bookings.length === 0 ? (
                      <div className="p-8 text-center text-zinc-400 font-bold text-xs">
                        No bookings found. Keep listing your stays to receive bookings!
                      </div>
                    ) : (
                      bookings.map((booking) => {
                        const checkInDate = booking.checkIn
                          ? new Date(booking.checkIn).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })
                          : "";
                        const checkOutDate = booking.checkOut
                          ? new Date(booking.checkOut).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })
                          : "";
                        const dateRange = checkOutDate
                          ? `${checkInDate} - ${checkOutDate}`
                          : checkInDate;

                        return (
                          <div
                            key={booking.id}
                            className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors group"
                          >
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                              <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                <Calendar className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-zinc-900 text-sm">
                                  {booking.guestName || "Guest User"}
                                </h4>
                                <p className="text-[11px] text-zinc-400 font-medium">
                                  {booking.itemName} • {dateRange}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                              <div className="sm:text-right">
                                <p className="text-sm font-black text-zinc-900">
                                  ₹{booking.totalAmount.toLocaleString("en-IN")}
                                </p>
                                <span
                                  className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                    booking.status === "Confirmed" || booking.status === "Paid" || booking.status === "Completed"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : booking.status === "Cancelled"
                                      ? "bg-rose-50 text-rose-600"
                                      : "bg-amber-50 text-amber-600"
                                  )}
                                >
                                  {booking.status}
                                </span>
                              </div>
                              <button className="p-1 text-zinc-300 hover:text-zinc-900">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Performance Card */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-zinc-900 px-1 uppercase tracking-widest">Performance</h2>
                  <div className="bg-zinc-900 rounded-2xl p-6 text-white space-y-6 relative overflow-hidden">
                    {loading ? (
                      <div className="space-y-4 py-4 animate-pulse">
                        <div className="h-3 w-16 bg-white/10 rounded" />
                        <div className="h-5 w-32 bg-white/10 rounded" />
                        <div className="h-2 w-full bg-white/10 rounded" />
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="space-y-4 text-center py-6">
                        <TrendingUp className="w-8 h-8 text-white/30 mx-auto" />
                        <div className="space-y-1 px-2">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Performance Tracking</h4>
                          <p className="text-[11px] text-zinc-400 font-medium">
                            Once your stays receive bookings, occupancy stats and goals will appear here.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Most Booked</p>
                          <h4 className="text-sm font-bold leading-tight">
                            {mostBookedItem}
                          </h4>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                              <span className="text-white/40">Occupancy</span>
                              <span className="text-primary">92%</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "92%" }}
                                className="h-full bg-primary"
                              />
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
                      </>
                    )}

                    <Link href="/vendor/earnings">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl h-10 border-white/10 hover:bg-white hover:text-zinc-900 text-xs font-bold transition-all text-white bg-transparent"
                      >
                        Full Report
                      </Button>
                    </Link>
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
