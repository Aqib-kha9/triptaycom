"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  RefreshCcw,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { bookingsApi } from "@/lib/api-client";
import type { BookingItem } from "@/types/api";

export default function BookingFailurePage() {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingItem | null>(null);

  useEffect(() => {
    const bookingId = sessionStorage.getItem("lastBookingId");
    if (bookingId) {
      bookingsApi
        .getBookingById(bookingId)
        .then((res) => {
          if (res.data?.booking) setBooking(res.data.booking);
        })
        .catch(() => { });
      sessionStorage.removeItem("lastBookingId");
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">

          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-8 border border-rose-100"
          >
            <AlertCircle className="w-12 h-12" />
          </motion.div>

          {/* Text Content */}
          <div className="max-w-2xl space-y-4 mb-12">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight"
            >
              Payment Failed
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-zinc-500 font-medium"
            >
              We couldn't process your payment{booking ? <> for <span className="text-zinc-900 font-bold">{booking.itemName}</span></> : null}. Don't worry, no money was deducted from your account.
            </motion.p>
          </div>

          {/* Possible Reasons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-lg bg-white rounded-[32px] border border-zinc-100 p-8 text-left space-y-6 mb-12 shadow-xl shadow-zinc-200/40"
          >
            <h3 className="font-bold text-zinc-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-zinc-400" />
              Why did it fail?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-zinc-500 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                The bank server was unresponsive or timed out.
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-500 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                Incorrect card details or expired payment method.
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-500 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                Insufficient funds in the selected account.
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-lg"
          >
            <Button
              onClick={() => {
                // Navigate to a fresh checkout so the guest can re-book the same item.
                // The previous (expired) booking's dates have already been released.
                if (booking?.itemId && booking?.itemType) {
                  const query = new URLSearchParams();
                  if (booking.guests) query.append("guests", booking.guests.toString());
                  if (booking.couponCode) query.append("coupon", booking.couponCode);
                  if (booking.specialRequests) query.append("specialRequests", booking.specialRequests);
                  if (booking.itemType === "stay") {
                    if (booking.checkIn) query.append("checkIn", booking.checkIn.split("T")[0]);
                    if (booking.checkOut) query.append("checkOut", booking.checkOut.split("T")[0]);
                  } else {
                    if (booking.activityDate) query.append("activityDate", booking.activityDate.split("T")[0]);
                    if (booking.startTime) query.append("startTime", booking.startTime);
                  }
                  router.push(`/checkout/${booking.itemType}/${booking.itemId}?${query.toString()}`);
                } else {
                  router.back();
                }
              }}
              className="flex-1 h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-3 group"
            >
              <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Retry Payment
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-16 rounded-2xl text-lg font-bold gap-3 border-zinc-200"
              onClick={() => router.push("/messages")}
            >
              <MessageSquare className="w-5 h-5" />
              Contact Support
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <button
              onClick={() => router.push("/")}
              className="text-zinc-400 hover:text-zinc-900 font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to home
            </button>
          </motion.div>

          {/* Security Reassurance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-24 pt-12 border-t border-zinc-100 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
          >
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900">Your money is safe</h4>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">If any amount was deducted, it will be automatically refunded within 3-5 business days.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-zinc-900">Encrypted Transactions</h4>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">We use 256-bit SSL encryption to ensure your payment details are always secure.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
