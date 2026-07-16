"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  ChevronLeft,
  Download,
  XCircle,
  CheckCircle2,
  MessageSquare,
  User,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Info,
  Phone,
  Mail,
  Zap,
  Star,
  Loader2,
} from "lucide-react";
import { useState, use, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { bookingsApi, chatApi } from "@/lib/api-client";
import type { BookingItem } from "@/types/api";
import { InvoiceModal } from "@/components/InvoiceModal";

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function BookingDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    bookingsApi
      .getBookingById(params.id)
      .then((res) => {
        if (cancelled) return;
        if (res.data?.booking) setBooking(res.data.booking);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load booking.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  // Real-time status sync via Socket
  useEffect(() => {
    if (!booking) return;

    let socket: any = null;
    (async () => {
      try {
        const { io } = await import("socket.io-client");
        const token = localStorage.getItem("token") || "";
        if (!token) return;

        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
        socket = io(socketUrl, {
          auth: { token },
          transports: ["websocket", "polling"]
        });

        socket.on("connect", () => {
          console.log("[Socket Guest Booking] Connected");
        });

        socket.on("booking:status_update", (data: any) => {
          if (data.bookingId === booking.id) {
            console.log("[Socket Guest Booking] Live sync updated booking status:", data);
            setBooking(prev => prev ? { ...prev, status: data.status, paymentStatus: data.paymentStatus } : prev);
          }
        });
      } catch (err) {
        console.error("Socket error on booking details:", err);
      }
    })();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [booking?.id]);

  const handleCancel = async () => {
    if (!booking) return;
    setIsCancelling(true);
    try {
      await bookingsApi.cancelBooking(booking.id);
      setBooking((prev) => (prev ? { ...prev, status: "Cancelled" } : prev));
    } catch {
      /* ignore */
    } finally {
      setIsCancelling(false);
    }
  };

  const handleChatWithHost = async () => {
    if (!booking) return;
    setChatLoading(true);
    try {
      const res = await chatApi.getOrCreateConversation({
        participantId: booking.hostId,
        listingId: booking.itemType === "listing" ? booking.itemId : undefined,
        activityId: booking.itemType === "activity" ? booking.itemId : undefined,
        bookingContext: {
          title: booking.itemName,
          dateRange: booking.itemType === "listing" ? `${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}` : formatDate(booking.activityDate),
          type: booking.itemType === "listing" ? "listing" : "activity"
        }
      });
      if (res.data?.conversation) {
        const conv = res.data.conversation;
        const convId = conv._id || conv.id;
        router.push(`/messages?conversationId=${convId}`);
      }
    } catch (err) {
      console.error("Failed to open chat with host:", err);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
        <Navbar />
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-zinc-400" />
            <p className="text-sm text-zinc-500 font-medium mt-4">Loading booking details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
        <Navbar />
        <main className="flex-grow pt-24 pb-20">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center py-32 text-center">
            <XCircle className="w-12 h-12 text-rose-400" />
            <p className="text-sm text-rose-500 font-medium mt-4">{error || "Booking not found."}</p>
            <Link href="/bookings" className="mt-6">
              <Button variant="outline" className="rounded-xl gap-2">
                <ChevronLeft className="w-4 h-4" /> Back to bookings
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const typeLabel = booking.itemType === "listing" ? "Stay" : "Activity";
  const isCancelled = booking.status === "Cancelled";

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div className="space-y-2">
              <Link href="/bookings" className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 font-bold text-sm mb-4">
                <ChevronLeft className="w-4 h-4" />
                Back to bookings
              </Link>
              <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-3">
                Booking #{booking.bookingId}
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest border",
                    isCancelled
                      ? "bg-rose-50 text-rose-500 border-rose-100"
                      : "bg-emerald-50 text-emerald-500 border-emerald-100"
                  )}
                >
                  {booking.status}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button onClick={() => setInvoiceOpen(true)} variant="outline" className="flex-1 md:flex-none rounded-2xl font-bold border-zinc-100 gap-2 h-12 shadow-sm bg-white">
                <Download className="w-4 h-4" />
                Invoice
              </Button>
              <Button onClick={handleChatWithHost} disabled={chatLoading} className="flex-1 md:flex-none rounded-2xl font-bold gap-2 h-12 px-8 shadow-xl shadow-primary/20 bg-primary text-white hover:bg-primary/95 disabled:bg-zinc-100 disabled:text-zinc-400">
                {chatLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
                Chat with Host
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Trip Summary Card */}
              <div className="bg-white rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden">
                <div className="h-64 relative bg-zinc-100">
                  {booking.itemImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={booking.itemImage} alt={booking.itemName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-zinc-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{typeLabel}</p>
                    <h2 className="text-3xl font-bold">{booking.itemName}</h2>
                  </div>
                </div>

                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Location</p>
                      <div className="flex items-start gap-2 text-zinc-900 font-bold">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        {booking.location || "—"}
                      </div>
                    </div>
                    {booking.itemType === "listing" ? (
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-50">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Check-In</p>
                          <p className="text-sm font-black text-zinc-900">{formatDate(booking.checkIn)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Check-Out</p>
                          <p className="text-sm font-black text-zinc-900">{formatDate(booking.checkOut)}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-50">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Activity Date</p>
                          <p className="text-sm font-black text-zinc-900">{formatDate(booking.activityDate)}</p>
                        </div>
                        {booking.startTime && (
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Start Time</p>
                            <p className="text-sm font-black text-zinc-900">{booking.startTime}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Guests</p>
                      <div className="flex items-center gap-2 text-zinc-900 font-bold">
                        <User className="w-5 h-5 text-primary" />
                        {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Booking Date</p>
                        <p className="text-sm font-black text-zinc-900">{formatDate(booking.createdAt)}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/50">
                <h3 className="text-xl font-bold text-zinc-900 mb-10">Booking Timeline</h3>
                <div className="relative space-y-12 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-100">
                  <div className="relative flex items-start gap-8">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl text-white flex items-center justify-center relative z-10 shadow-lg",
                        isCancelled ? "bg-rose-500 shadow-rose-500/20" : "bg-emerald-500 shadow-emerald-500/20"
                      )}
                    >
                      {isCancelled ? <XCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                    </div>
                    <div className="pt-1">
                      <p className="font-bold text-zinc-900">{isCancelled ? "Booking Cancelled" : "Booking Confirmed"}</p>
                      <p className="text-sm text-zinc-500 font-medium">
                        {isCancelled
                          ? "This booking was cancelled."
                          : `Your booking was created on ${formatDate(booking.createdAt)}.`}
                      </p>
                    </div>
                  </div>
                  {!isCancelled && (
                    <>
                      <div className="relative flex items-start gap-8">
                        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center relative z-10 shadow-lg shadow-primary/20">
                          <Zap className="w-6 h-6" />
                        </div>
                        <div className="pt-1">
                          <p className="font-bold text-zinc-900">Payment Processed</p>
                          <p className="text-sm text-zinc-500 font-medium">
                            {booking.status === "Paid" || booking.status === "Confirmed"
                              ? `Payment of ${formatPrice(booking.totalAmount)} was successfully received.`
                              : "Awaiting payment confirmation."}
                          </p>
                        </div>
                      </div>
                      <div className="relative flex items-start gap-8 opacity-40">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center relative z-10">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div className="pt-1">
                          <p className="font-bold text-zinc-900">
                            {booking.itemType === "listing" ? "Check-In" : "Activity Scheduled"}
                          </p>
                          <p className="text-sm text-zinc-500 font-medium">
                            Scheduled for {booking.itemType === "listing" ? formatDate(booking.checkIn) : formatDate(booking.activityDate)}.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Vendor */}
            <div className="space-y-8">
              {/* Check-In Pass / OTP Card */}
              {(booking.status === "Confirmed" || booking.status === "Paid") && booking.checkInOtp && (
                <div className="bg-gradient-to-br from-rose-500 to-primary text-white p-8 rounded-[40px] shadow-xl shadow-primary/20 space-y-6 relative overflow-hidden">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fcfcfc]" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#fcfcfc]" />
                  
                  <div className="space-y-1 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Your Check-In Pass</p>
                    <h3 className="text-xl font-black">Share with host on arrival</h3>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 text-center space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-75">Check-In OTP</p>
                    <p className="text-4xl font-black tracking-[10px] font-mono select-all pl-[10px] text-white">
                      {booking.checkInOtp}
                    </p>
                  </div>
                  
                  <p className="text-[10px] font-bold text-center opacity-85 leading-relaxed italic">
                    Keep this code secure. Only share it with the host when you arrive at the property or activity meeting point to start your booking.
                  </p>
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/50 space-y-8">
                <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" />
                  Payment Summary
                </h3>
                <div className="space-y-4">
                  <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-zinc-900">Total Paid</span>
                    <span className="text-2xl font-black text-primary">{formatPrice(booking.totalAmount)}</span>
                  </div>
                </div>
                <div
                  className={cn(
                    "p-4 rounded-2xl border flex items-center gap-3",
                    isCancelled ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0",
                      isCancelled ? "bg-rose-500" : "bg-emerald-500"
                    )}
                  >
                    {isCancelled ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className={cn("text-xs font-black uppercase tracking-widest", isCancelled ? "text-rose-600" : "text-emerald-600")}>
                      {isCancelled ? "Payment Refunded" : "Payment Success"}
                    </p>
                    <p className={cn("text-[10px] font-bold uppercase tracking-tight", isCancelled ? "text-rose-800/60" : "text-emerald-800/60")}>
                      Ref: #{booking.bookingId}
                    </p>
                  </div>
                </div>
              </div>


              {/* Cancellation Policy */}
              {!isCancelled && (
                <div className="bg-rose-50 p-8 rounded-[32px] border border-rose-100 space-y-4">
                  <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Cancellation Policy
                  </h4>
                  <p className="text-xs text-rose-800/80 font-medium leading-relaxed">
                    Cancel before check-in for a refund based on the host's cancellation policy. No refund for cancellations within 48 hours of check-in.
                  </p>
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="text-rose-600 font-bold text-xs hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    {isCancelling ? "Cancelling..." : "Request Cancellation"} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <InvoiceModal
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        booking={booking}
      />

      <Footer />
    </div>
  );
}
