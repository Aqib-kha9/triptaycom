"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Heart, 
  Home,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  Zap,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "@/components/navigation/dashboard-sidebar";
import { useState, useEffect, useMemo } from "react";
import { authApi, bookingsApi, wishlistApi, notificationsApi } from "@/lib/api-client";
import type { SanitizedUser, BookingItem, NotificationItem } from "@/types/api";

function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatRelativeTime(iso?: string): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatWalletBalance(balance: number): string {
  if (balance >= 1000) {
    return `₹${(balance / 1000).toFixed(1)}k`;
  }
  return `₹${balance}`;
}

export default function UserDashboardPage() {
  const [profile, setProfile] = useState<SanitizedUser | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      authApi.getMe().catch(() => null),
      bookingsApi.getMyBookings({ limit: 100 }).catch(() => null),
      wishlistApi.getAll().catch(() => null),
      notificationsApi.getAll({ limit: 5 }).catch(() => null),
    ])
      .then(([profileRes, bookingsRes, wishlistRes, notificationsRes]) => {
        if (!active) return;
        
        if (profileRes && profileRes.data?.user) {
          setProfile(profileRes.data.user);
        }
        if (bookingsRes && bookingsRes.data?.bookings) {
          setBookings(bookingsRes.data.bookings);
        }
        if (wishlistRes && wishlistRes.data?.wishlist) {
          setWishlistCount(wishlistRes.data.wishlist.length);
        }
        if (notificationsRes && notificationsRes.data?.notifications) {
          setNotifications(notificationsRes.data.notifications);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError("Failed to load dashboard data.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const upcomingTrips = useMemo(() => {
    return bookings
      .filter((b) => b.status === "Confirmed" || b.status === "Paid" || b.status === "Pending")
      .slice(0, 2);
  }, [bookings]);

  const validBookings = useMemo(() => {
    return bookings.filter((b) => b.status !== "Expired" && b.status !== "Rejected");
  }, [bookings]);

  const recentTransactions = useMemo(() => {
    return [...validBookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [validBookings]);

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-28 lg:pb-12">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6">
            <DashboardSidebar />

            <div className="flex-grow space-y-8">
              
              {loading ? (
                // ─── Loading Skeletons ───
                <div className="space-y-8 animate-pulse">
                  {/* Summary Stats Skeletons */}
                  <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-4 pb-2 sm:pb-0">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3 min-w-[140px] flex-1">
                        <div className="w-9 h-9 rounded-xl bg-zinc-100" />
                        <div className="space-y-2">
                          <div className="h-6 w-12 bg-zinc-100 rounded" />
                          <div className="h-3 w-20 bg-zinc-55 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upcoming Trips Skeletons */}
                  <div className="space-y-4">
                    <div className="h-4 w-32 bg-zinc-100 rounded" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="bg-white p-3 sm:p-4 rounded-2xl border border-zinc-100 flex gap-3 sm:gap-4">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-zinc-100 shrink-0" />
                          <div className="flex-1 space-y-2 py-0.5">
                            <div className="h-3 w-10 bg-zinc-100 rounded" />
                            <div className="h-4 w-3/4 bg-zinc-100 rounded" />
                            <div className="h-3 w-1/2 bg-zinc-50 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent & Alerts Skeletons */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="h-4 w-24 bg-zinc-100 rounded" />
                      <div className="bg-white rounded-2xl border border-zinc-100 p-4 space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3 w-full">
                              <div className="w-8 h-8 rounded-lg bg-zinc-100 shrink-0" />
                              <div className="space-y-1.5 w-full">
                                <div className="h-3.5 w-1/2 bg-zinc-100 rounded" />
                                <div className="h-2.5 w-1/4 bg-zinc-50 rounded" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 w-24 bg-zinc-100 rounded" />
                      <div className="bg-white rounded-2xl border border-zinc-100 p-4 space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="space-y-2 py-2">
                            <div className="h-3.5 w-1/3 bg-zinc-100 rounded" />
                            <div className="h-3 w-2/3 bg-zinc-50 rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                // ─── Error State ───
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-rose-200 rounded-2xl bg-rose-50/50">
                  <AlertCircle className="w-10 h-10 text-rose-500" />
                  <p className="text-sm font-bold text-rose-600">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl font-bold text-xs">
                    Retry
                  </Button>
                </div>
              ) : (
                // ─── Main Content ───
                <>
                  {/* Summary Stats */}
                  <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-4 pb-2 sm:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                    {/* Total Bookings */}
                    <div className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3 min-w-[140px] flex-shrink-0 snap-center flex-1">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-zinc-900">{validBookings.length}</p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Total Bookings</p>
                      </div>
                    </div>
                    
                    {/* Wishlist */}
                    <Link href="/wishlist" className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3 min-w-[140px] flex-shrink-0 snap-center flex-1 hover:border-rose-100 transition-all block">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-zinc-900">{wishlistCount}</p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Wishlist</p>
                      </div>
                    </Link>
                    
                    {/* Wallet Balance */}
                    <div className="bg-white p-5 rounded-2xl border border-zinc-100 space-y-3 min-w-[140px] flex-shrink-0 snap-center flex-1">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-zinc-900">{formatWalletBalance(profile?.walletBalance || 0)}</p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Wallet Balance</p>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Trips */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Upcoming Trips</h2>
                      <Link href="/bookings" className="text-primary font-bold text-[10px] uppercase tracking-wider">View All</Link>
                    </div>
                    {upcomingTrips.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingTrips.map((trip) => (
                          <div key={trip.id} className="bg-white p-3 sm:p-4 rounded-2xl border border-zinc-100 flex gap-3 sm:gap-4 hover:border-primary/20 transition-all group">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-50">
                              <img 
                                src={trip.itemImage || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=300"} 
                                alt={trip.itemName} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                              />
                            </div>
                            <div className="flex-1 space-y-1.5 py-0.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-zinc-50 text-zinc-500">
                                  {trip.itemType === "listing" ? "Stay" : "Activity"}
                                </span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">{trip.status}</span>
                              </div>
                              <h3 className="font-bold text-zinc-900 text-sm line-clamp-1">{trip.itemName}</h3>
                              <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                                <MapPin className="w-3 h-3" /> {trip.location}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-zinc-900 font-bold">
                                <Calendar className="w-3 h-3 text-primary" />
                                {trip.itemType === "activity" ? (
                                  <>
                                    {formatDate(trip.activityDate)}
                                    {trip.startTime && ` at ${trip.startTime}`}
                                  </>
                                ) : (
                                  <>
                                    {formatDate(trip.checkIn)}
                                    {trip.checkOut && ` - ${formatDate(trip.checkOut)}`}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-zinc-100 p-8 text-center text-zinc-500 font-medium text-xs">
                        No upcoming trips booked yet.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Bookings */}
                    <div className="space-y-4">
                      <h2 className="text-sm font-bold text-zinc-900 px-1 uppercase tracking-widest">Recent Bookings</h2>
                      {recentTransactions.length > 0 ? (
                        <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-50 overflow-hidden">
                          {recentTransactions.map((item) => (
                            <Link href={`/bookings/${item.id}`} key={item.id} className="p-3 sm:p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors block">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">
                                  {item.itemType === "listing" ? (
                                    <Home className="w-4 h-4 text-primary" />
                                  ) : (
                                    <Zap className="w-4 h-4 text-emerald-500" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-zinc-900 text-xs line-clamp-1">{item.itemName}</p>
                                  <p className="text-[10px] text-zinc-400 font-medium">{formatDate(item.createdAt)}</p>
                                </div>
                              </div>
                              <span className="text-xs font-black text-zinc-900 shrink-0">₹{item.totalAmount.toLocaleString("en-IN")}</span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl border border-zinc-100 p-8 text-center text-zinc-500 font-medium text-xs">
                          No recent bookings.
                        </div>
                      )}
                    </div>

                    {/* Alerts / Notifications */}
                    <div className="space-y-4">
                      <h2 className="text-sm font-bold text-zinc-900 px-1 uppercase tracking-widest">Alerts</h2>
                      {notifications.length > 0 ? (
                        <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-50 overflow-hidden">
                          {notifications.map((notif) => (
                            <div key={notif.id} className="p-3 sm:p-4 space-y-1 hover:bg-zinc-50 transition-colors">
                              <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                                <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                                  {notif.type === "booking" ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                                  )} 
                                  {notif.title}
                                </h4>
                                <span className="text-[9px] text-zinc-400 font-bold uppercase shrink-0">{formatRelativeTime(notif.createdAt)}</span>
                              </div>
                              <p className="text-[10px] text-zinc-500 font-medium ml-5 sm:ml-5">{notif.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl border border-zinc-100 p-8 text-center text-zinc-500 font-medium text-xs">
                          No new notifications.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
