"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  Calendar,
  User,
  MessageSquare,
  Mail,
  Phone,
  Info,
  Inbox,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VendorSidebar } from "@/components/navigation/vendor-sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { bookingsApi, chatApi } from "@/lib/api-client";

export default function VendorBookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  // OTP Verification State
  const [otpInput, setOtpInput] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);

  const handleVerifyOtp = async () => {
    if (!selectedBooking || !otpInput.trim()) return;
    setOtpVerifying(true);
    setOtpError("");
    setOtpSuccess(false);
    try {
      await bookingsApi.verifyBookingOtp(selectedBooking.id, otpInput.trim());
      setOtpSuccess(true);
      setTimeout(async () => {
        setSelectedBooking(null);
        setOtpInput("");
        setOtpSuccess(false);
        await fetchBookings();
      }, 1500);
    } catch (err: any) {
      setOtpError(err.message || "Failed to verify check-in. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingsApi.getMyBookings({ role: "host" });
      if (res.data?.bookings) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error("Failed to fetch host bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAccept = async (bookingId: string) => {
    try {
      await bookingsApi.confirmBooking(bookingId);
      await fetchBookings();
    } catch (err) {
      console.error("Failed to accept booking:", err);
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await bookingsApi.rejectBooking(bookingId, "Rejected by host");
      await fetchBookings();
    } catch (err) {
      console.error("Failed to reject booking:", err);
    }
  };

  const getBookingDates = (b: any) => {
    if (b.itemType === "activity" && b.activityDate) {
      return new Date(b.activityDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }
    if (b.checkIn && b.checkOut) {
      const start = new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      const end = new Date(b.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      return `${start} - ${end}`;
    }
    return b.checkIn ? new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
  };

  const handleOpenChat = async () => {
    if (!selectedBooking) return;
    setChatLoading(true);
    try {
      const res = await chatApi.getOrCreateConversation({
        participantId: selectedBooking.userId,
        listingId: selectedBooking.itemType === "listing" ? selectedBooking.itemId : undefined,
        activityId: selectedBooking.itemType === "activity" ? selectedBooking.itemId : undefined,
        bookingContext: {
          title: selectedBooking.itemName,
          dateRange: getBookingDates(selectedBooking),
          type: selectedBooking.itemType === "listing" ? "listing" : "activity"
        }
      });
      if (res.data?.conversation) {
        const conv = res.data.conversation;
        const convId = conv._id || conv.id;
        router.push(`/vendor/messages?convId=${convId}`);
      }
    } catch (err) {
      console.error("Failed to open chat:", err);
    } finally {
      setChatLoading(false);
    }
  };

  const filtered = bookings.filter(b => b.status === activeTab || activeTab === "All");

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-20 pb-28 lg:pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            <VendorSidebar />

            <div className="flex-grow space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <div>
                  <h1 className="text-xl font-bold text-zinc-900">Reservations</h1>
                  <p className="text-xs text-zinc-500 font-medium italic">Manage incoming bookings.</p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl overflow-x-auto no-scrollbar snap-x snap-mandatory">
                  {["Pending", "Confirmed", "All"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        activeTab === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-20 flex-col gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading bookings...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-100 p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                    <Inbox className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-900">No bookings yet</h3>
                    <p className="text-xs text-zinc-500 font-medium max-w-xs">Reservations will appear here once guests book your listings.</p>
                  </div>
                  <Link href="/vendor/stays">
                    <Button variant="outline" className="rounded-xl h-10 text-xs font-bold border-zinc-100">Manage Listings</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl border border-zinc-100 p-5 sm:p-6 hover:border-primary transition-all">
                      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                        <div className="flex items-start gap-5 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 shrink-0 border border-zinc-100">
                            <User className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-zinc-900">{booking.guestName || booking.guestEmail}</h3>
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                booking.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                              )}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                              <div className="flex items-center gap-1.5 text-zinc-900">
                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                {getBookingDates(booking)}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5" />
                                {booking.itemName}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 xl:pl-6 xl:border-l border-zinc-50">
                          <div className="text-center sm:text-right">
                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Payout</p>
                            <p className="text-lg font-black text-zinc-900 italic">
                              ₹{booking.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {booking.status === "Pending" ? (
                              <>
                                <Button onClick={() => handleAccept(booking.id)} className="h-10 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 gap-1.5">
                                  <Check className="w-3.5 h-3.5" />
                                  Accept
                                </Button>
                                <Button onClick={() => handleReject(booking.id)} variant="outline" className="h-10 px-4 rounded-xl text-xs font-bold border-rose-100 text-rose-500 hover:bg-rose-50 gap-1.5">
                                  <X className="w-3.5 h-3.5" />
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <Button variant="outline" onClick={() => setSelectedBooking(booking)} className="h-10 px-5 rounded-xl text-xs font-bold border-zinc-100 gap-1.5">
                                Manage
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Button>
                            )}
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

      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSelectedBooking(null); setChatLoading(false); }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-lg bg-white rounded-2xl p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-zinc-900">{selectedBooking.bookingRef || selectedBooking.id}</h3>
                <button onClick={() => { setSelectedBooking(null); setChatLoading(false); }} className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-900"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 text-xs">
                  <h4 className="font-black uppercase text-zinc-400 tracking-widest">Guest Info</h4>
                  <div className="space-y-3 p-4 rounded-xl bg-zinc-50 border border-zinc-100 font-bold">
                    <p className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-primary" /> {selectedBooking.guestName || selectedBooking.guestEmail}</p>
                    {selectedBooking.guestEmail && <p className="flex items-center gap-2 text-zinc-500"><Mail className="w-3.5 h-3.5" /> {selectedBooking.guestEmail}</p>}
                    {selectedBooking.guestPhone && <p className="flex items-center gap-2 text-zinc-500"><Phone className="w-3.5 h-3.5" /> {selectedBooking.guestPhone}</p>}
                  </div>
                </div>
                <div className="space-y-4 text-xs">
                  <h4 className="font-black uppercase text-zinc-400 tracking-widest">Details</h4>
                  <div className="space-y-3 p-4 rounded-xl border border-zinc-100 font-bold">
                    <p className="flex justify-between"><span>Guests</span> <span className="text-zinc-900">{selectedBooking.guests} People</span></p>
                    {selectedBooking.specialRequests && <p className="pt-2 border-t border-zinc-50 italic text-zinc-500">"{selectedBooking.specialRequests}"</p>}
                  </div>
                </div>
              </div>

              {/* OTP Verification Section */}
              {(selectedBooking.status === "Confirmed" || selectedBooking.status === "Paid") && (
                <div className="space-y-3 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 font-bold text-xs">
                  <div className="space-y-1">
                    <h4 className="font-black uppercase text-zinc-400 tracking-widest text-[10px]">Guest Check-In</h4>
                    <p className="text-zinc-500 font-medium leading-relaxed">Ask the guest for their Check-In OTP to verify arrival and complete this booking.</p>
                  </div>
                  {otpSuccess ? (
                    <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl p-4 flex items-center justify-center gap-2 font-bold text-center">
                      <Check className="w-4 h-4 shrink-0" />
                      Check-in Verified! Booking Completed.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpInput}
                          onChange={(e) => {
                            setOtpInput(e.target.value.replace(/\D/g, ""));
                            setOtpError("");
                          }}
                          placeholder="Enter 4-digit OTP"
                          className="flex-grow h-10 px-4 rounded-xl border border-zinc-200 text-center font-mono text-lg font-black tracking-wider focus:outline-none focus:border-primary bg-white text-zinc-900"
                        />
                        <Button
                          onClick={handleVerifyOtp}
                          disabled={otpVerifying || otpInput.length < 4}
                          className="h-10 px-6 rounded-xl font-bold bg-zinc-950 text-white hover:bg-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-400 shrink-0"
                        >
                          {otpVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Verify"}
                        </Button>
                      </div>
                      {otpError && <p className="text-rose-500 font-bold text-[10px] uppercase tracking-wider">{otpError}</p>}
                    </div>
                  )}
                </div>
              )}

              <Button onClick={handleOpenChat} disabled={chatLoading} className="w-full h-11 rounded-xl font-bold text-xs gap-2 bg-rose-500 hover:bg-rose-600 text-white">
                {chatLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <MessageSquare className="w-3.5 h-3.5" />
                )}
                Open Chat
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
