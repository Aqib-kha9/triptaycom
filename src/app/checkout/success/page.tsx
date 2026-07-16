"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { InvoiceModal } from "@/components/InvoiceModal";
import { ShareModal } from "@/components/ShareModal";
import {
  CheckCircle2,
  Download,
  Share2,
  ArrowRight,
  Calendar,
  MapPin,
  Home,
  Zap,
  Star,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { bookingsApi } from "@/lib/api-client";
import type { BookingItem } from "@/types/api";

export default function BookingSuccessPage() {
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Prefer the booking ID from the URL query param (persists across refresh),
    // fall back to sessionStorage for backward compatibility.
    const bookingId = searchParams.get("booking") || sessionStorage.getItem("lastBookingId");
    if (bookingId) {
      bookingsApi
        .getBookingById(bookingId)
        .then((res) => {
          if (res.data?.booking) setBooking(res.data.booking);
        })
        .catch(() => { })
        .finally(() => setLoading(false));
      // Keep the sessionStorage value so a refresh can still recover the booking
      // (it is cleared only when the user navigates away to another page).
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    // Trigger celebration
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const dateRange =
    booking?.checkIn && booking?.checkOut
      ? `${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}`
      : booking?.checkIn
        ? formatDate(booking.checkIn)
        : "";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-8"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>

          {/* Text Content */}
          <div className="max-w-2xl space-y-4 mb-12">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight"
            >
              Booking Confirmed!
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-zinc-500 font-medium"
            >
              {booking ? (
                <>
                  Pack your bags! Your booking for{" "}
                  <span className="text-zinc-900 font-bold">{booking.itemName}</span> is confirmed. We've sent
                  the details to your email.
                </>
              ) : loading ? (
                "Loading your booking details..."
              ) : (
                "Your booking is confirmed. We've sent the details to your email."
              )}
            </motion.p>
          </div>

          {/* Booking Card / Ticket */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-xl bg-white rounded-[40px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 overflow-hidden mb-12"
          >
            <div className="p-8 md:p-12 space-y-10">
              <div className="flex items-start justify-between gap-6">
                <div className="text-left space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Booking ID</p>
                  <p className="text-xl font-black text-zinc-900 tracking-tight">
                    {booking?.bookingId || (loading ? "—" : "N/A")}
                  </p>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  {booking?.status || "Confirmed"}
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-100">
                  {booking?.itemImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={booking.itemImage}
                      alt={booking.itemName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin text-zinc-400" /> : <Home className="w-6 h-6 text-zinc-400" />}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left py-1 space-y-2">
                  <h3 className="font-bold text-zinc-900 text-lg">
                    {booking?.itemName || (loading ? "Loading..." : "Booking")}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {booking?.location || "—"}
                  </div>
                  {dateRange && (
                    <div className="flex items-center gap-2 text-xs text-zinc-900 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {dateRange}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-dashed border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left w-full md:w-auto">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Paid</p>
                  <p className="text-2xl font-black text-zinc-900 italic">
                    {booking ? `₹${booking.totalAmount.toLocaleString("en-IN")}` : "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Button
                    onClick={() => setInvoiceOpen(true)}
                    variant="outline"
                    className="flex-1 md:flex-none rounded-2xl font-bold gap-2 h-12 border-zinc-100 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Invoice
                  </Button>
                  <Button
                    onClick={() => setShareOpen(true)}
                    variant="outline"
                    className="flex-1 md:flex-none rounded-2xl font-bold gap-2 h-12 border-zinc-100 shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-xl"
          >
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-3 group">
                Manage Booking
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/messages" className="flex-1">
              <Button variant="outline" className="w-full h-16 rounded-2xl text-lg font-bold gap-3 border-zinc-200">
                <MessageSquare className="w-5 h-5" />
                Contact Host
              </Button>
            </Link>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 text-left max-w-4xl"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Home className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-zinc-900">Get Ready</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Check your email for the detailed itinerary and house rules.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-zinc-900">Explore Activities</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Book nearby activities and get up to 20% off.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-zinc-900">Write a Review</h4>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Share your experience after your stay and earn rewards.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Invoice & Share Modals */}
      <InvoiceModal open={invoiceOpen} onClose={() => setInvoiceOpen(false)} booking={booking} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} booking={booking} />
    </div>
  );
}
