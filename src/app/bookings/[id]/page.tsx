"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Clock, 
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
  Star
} from "lucide-react";
import { useState, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BookingDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const [isCancelling, setIsCancelling] = useState(false);

  // Mock data for the booking
  const booking = {
    id: params.id || "TRP-8821",
    status: "Confirmed",
    type: "Stay",
    title: "Mountain Whisper Villa",
    location: "Kanyal Road, Manali, Himachal Pradesh",
    checkIn: "12 Oct, 2024 (12:00 PM)",
    checkOut: "15 Oct, 2024 (11:00 AM)",
    guests: "2 Adults, 1 Child",
    bookedOn: "01 Sep, 2024",
    totalPrice: "₹14,500",
    paymentStatus: "Paid",
    refundStatus: "N/A",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200",
    vendor: {
      name: "Vikram Negi",
      image: "https://i.pravatar.cc/150?u=vikram",
      joined: "Jan 2022",
      rating: 4.8
    }
  };

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
                Booking #{booking.id}
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-500 text-[10px] uppercase font-black tracking-widest border border-emerald-100">
                  {booking.status}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none rounded-2xl font-bold border-zinc-100 gap-2 h-12 shadow-sm">
                <Download className="w-4 h-4" />
                Invoice
              </Button>
              <Link href="/messages">
                <Button className="flex-1 md:flex-none rounded-2xl font-bold gap-2 h-12 px-8 shadow-xl shadow-primary/20">
                  <MessageSquare className="w-4 h-4" />
                  Chat with Host
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Trip Summary Card */}
              <div className="bg-white rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden">
                <div className="h-64 relative">
                  <img src={booking.image} alt={booking.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{booking.type}</p>
                    <h2 className="text-3xl font-bold">{booking.title}</h2>
                  </div>
                </div>
                
                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Location</p>
                      <div className="flex items-start gap-2 text-zinc-900 font-bold">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        {booking.location}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-50">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Check-In</p>
                        <p className="text-sm font-black text-zinc-900">{booking.checkIn}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Check-Out</p>
                        <p className="text-sm font-black text-zinc-900">{booking.checkOut}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Guests</p>
                      <div className="flex items-center gap-2 text-zinc-900 font-bold">
                        <User className="w-5 h-5 text-primary" />
                        {booking.guests}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Booking Date</p>
                        <p className="text-sm font-black text-zinc-900">{booking.bookedOn}</p>
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
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center relative z-10 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="pt-1">
                      <p className="font-bold text-zinc-900">Booking Confirmed</p>
                      <p className="text-sm text-zinc-500 font-medium">Your booking was accepted by the host on 02 Sep.</p>
                    </div>
                  </div>
                  <div className="relative flex items-start gap-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center relative z-10 shadow-lg shadow-primary/20 animate-pulse">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="pt-1">
                      <p className="font-bold text-zinc-900">Payment Processed</p>
                      <p className="text-sm text-zinc-500 font-medium">Full payment of ₹14,500 was successfully received.</p>
                    </div>
                  </div>
                  <div className="relative flex items-start gap-8 opacity-40">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center relative z-10">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="pt-1">
                      <p className="font-bold text-zinc-900">Check-In</p>
                      <p className="text-sm text-zinc-500 font-medium">Scheduled for 12 Oct, 12:00 PM.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Pricing & Vendor */}
            <div className="space-y-8">
              
              {/* Pricing Breakdown */}
              <div className="bg-white p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/50 space-y-8">
                <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" />
                  Payment Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-zinc-500 font-medium">
                    <span>Base Price (3 nights)</span>
                    <span>₹12,000</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 font-medium">
                    <span>GST (12%)</span>
                    <span>₹1,440</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 font-medium">
                    <span>Service Fee</span>
                    <span>₹1,060</span>
                  </div>
                  <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-zinc-900">Total Paid</span>
                    <span className="text-2xl font-black text-primary">₹14,500</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Payment Success</p>
                    <p className="text-[10px] text-emerald-800/60 font-bold uppercase tracking-tight">Ref: #TXN-99021-X</p>
                  </div>
                </div>
              </div>

              {/* Vendor Card */}
              <div className="bg-zinc-900 p-10 rounded-[40px] text-white space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-white/10">
                    <img src={booking.vendor.image} alt={booking.vendor.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{booking.vendor.name}</h4>
                    <p className="text-xs text-white/50 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {booking.vendor.rating} Host
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold h-12 gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                  <Button variant="outline" className="rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold h-12 gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-rose-50 p-8 rounded-[32px] border border-rose-100 space-y-4">
                <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Cancellation Policy
                </h4>
                <p className="text-xs text-rose-800/80 font-medium leading-relaxed">
                  Cancel before 05 Oct for a full refund. After that, 50% refund applies. No refund for cancellations within 48 hours of check-in.
                </p>
                <button className="text-rose-600 font-bold text-xs hover:underline flex items-center gap-1">
                  Request Cancellation <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
