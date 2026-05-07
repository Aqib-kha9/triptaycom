"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CreditCard, 
  ChevronLeft, 
  Zap, 
  CheckCircle2, 
  Info, 
  Plus, 
  Tag, 
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  ArrowRight,
  Wallet,
  Building2,
  Smartphone,
  X
} from "lucide-react";
import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ADD_ONS = [
  { id: "breakfast", name: "Organic Breakfast", desc: "Farm-to-table breakfast served daily.", price: 450, icon: "🍳" },
  { id: "transfer", name: "Airport Transfer", desc: "Private pickup and drop from the airport.", price: 1200, icon: "🚗" },
  { id: "guide", name: "Local Guide", desc: "A half-day tour with a professional guide.", price: 1500, icon: "🧭" },
];

const PAYMENT_METHODS = [
  { id: "card", name: "Credit/Debit Card", icon: <CreditCard className="w-5 h-5" />, desc: "Visa, Mastercard, RuPay" },
  { id: "upi", name: "UPI Payment", icon: <Smartphone className="w-5 h-5" />, desc: "Google Pay, PhonePe, Paytm" },
  { id: "wallet", name: "Triptay Wallet", icon: <Wallet className="w-5 h-5" />, desc: "Balance: ₹4,500" },
  { id: "netbanking", name: "Net Banking", icon: <Building2 className="w-5 h-5" />, desc: "All major Indian banks" },
];

export default function CheckoutPage({ params: paramsPromise }: { params: Promise<{ type: string, id: string }> }) {
  const params = use(paramsPromise);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const basePrice = params.type === "activity" ? 2400 : 12000;
  const addonTotal = selectedAddons.reduce((sum, id) => {
    const addon = ADD_ONS.find(a => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);
  const gst = Math.round((basePrice + addonTotal) * 0.12);
  const discount = couponApplied ? 1000 : 0;
  const total = basePrice + addonTotal + gst - discount;

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          
          <div className="mb-10">
            <Link href={`/${params.type}s/${params.id}`} className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 font-bold text-sm mb-4">
              <ChevronLeft className="w-4 h-4" />
              Back to {params.type} details
            </Link>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Confirm and Pay</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Forms */}
            <div className="flex-grow space-y-12">
              
              {/* Guest Details */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">Guest Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                    <Input placeholder="Enter your full name" className="h-14 rounded-2xl border-zinc-100 bg-white shadow-sm focus:border-primary/20 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                    <Input type="email" placeholder="you@example.com" className="h-14 rounded-2xl border-zinc-100 bg-white shadow-sm focus:border-primary/20 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Phone Number</label>
                    <Input placeholder="+91 00000 00000" className="h-14 rounded-2xl border-zinc-100 bg-white shadow-sm focus:border-primary/20 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Special Requests</label>
                    <Input placeholder="Early check-in, dietary needs, etc." className="h-14 rounded-2xl border-zinc-100 bg-white shadow-sm focus:border-primary/20 transition-all" />
                  </div>
                </div>
              </section>

              {/* Add-ons Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">Enhance your stay</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {ADD_ONS.map((addon) => (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={cn(
                        "p-6 rounded-[32px] border text-left transition-all space-y-4 group",
                        selectedAddons.includes(addon.id) 
                          ? "bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-200" 
                          : "bg-white border-zinc-100 hover:border-primary/20 shadow-sm"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{addon.icon}</span>
                        {selectedAddons.includes(addon.id) ? (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <Plus className="w-5 h-5 text-zinc-300 group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold">₹{addon.price}</h4>
                        <p className={cn("text-sm font-bold", selectedAddons.includes(addon.id) ? "text-white" : "text-zinc-900")}>{addon.name}</p>
                        <p className={cn("text-xs mt-1 leading-relaxed", selectedAddons.includes(addon.id) ? "text-white/60" : "text-zinc-400")}>{addon.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Payment Selection */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">Payment Method</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "p-6 rounded-3xl border flex items-center gap-4 transition-all text-left",
                        paymentMethod === method.id 
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                          : "border-zinc-100 bg-white hover:border-zinc-200"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                        paymentMethod === method.id ? "bg-primary text-white" : "bg-zinc-50 text-zinc-400"
                      )}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-zinc-900 text-sm">{method.name}</h4>
                        <p className="text-xs text-zinc-400 font-medium">{method.desc}</p>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        paymentMethod === method.id ? "border-primary bg-primary" : "border-zinc-200"
                      )}>
                        {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:w-[420px] flex-shrink-0">
              <div className="sticky top-28 bg-white rounded-[40px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 overflow-hidden">
                
                {/* Summary Header */}
                <div className="p-8 pb-0 space-y-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=300" alt="Stay" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 py-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">{params.type === 'activity' ? 'River Rafting Adventure' : 'Mountain Whisper Villa'}</p>
                      <h3 className="font-bold text-zinc-900 leading-tight">
                        {params.type === 'activity' ? 'Full Day Rapids • Level 4' : 'Deluxe Suite • Private Balcony'}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
                        <MapPin className="w-3 h-3" />
                        {params.type === 'activity' ? 'Rishikesh, Uttarakhand' : 'Manali, Himachal Pradesh'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-zinc-50">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Dates
                      </p>
                      <p className="text-xs font-bold text-zinc-900">12 Oct - 15 Oct</p>
                    </div>
                    <div className="space-y-1 border-l border-zinc-50 pl-4">
                      <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1">
                        <Users className="w-3 h-3" /> Guests
                      </p>
                      <p className="text-xs font-bold text-zinc-900">2 Adults, 1 Child</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-8 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-zinc-500 font-medium text-sm">
                      <span>Base price ({params.type === 'activity' ? '2 persons' : '3 nights'})</span>
                      <span>₹{basePrice.toLocaleString()}</span>
                    </div>
                    {selectedAddons.map(id => {
                      const addon = ADD_ONS.find(a => a.id === id);
                      return (
                        <div key={id} className="flex justify-between text-zinc-500 font-medium text-sm">
                          <span>{addon?.name}</span>
                          <span>₹{addon?.price}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between text-zinc-500 font-medium text-sm">
                      <span>GST (12%)</span>
                      <span>₹{gst.toLocaleString()}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-emerald-600 font-bold text-sm">
                        <span>Coupon Discount</span>
                        <span>-₹1,000</span>
                      </div>
                    )}
                  </div>

                  {/* Coupon Input */}
                  <div className="pt-4">
                    {!couponApplied ? (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <Input 
                            placeholder="Enter coupon code" 
                            className="h-10 pl-10 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white text-xs font-bold uppercase tracking-wider" 
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={() => setCouponApplied(true)} 
                          className="rounded-xl h-10 px-4 text-xs font-bold"
                          disabled={!coupon}
                        >
                          Apply
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span className="text-xs font-black uppercase tracking-widest">WELCOME1000 Applied!</span>
                        </div>
                        <button onClick={() => setCouponApplied(false)} className="text-emerald-800 hover:scale-110 transition-transform">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="pt-6 border-t border-zinc-100 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Total Amount</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">All inclusive</p>
                    </div>
                    <span className="text-3xl font-black text-primary italic">₹{total.toLocaleString()}</span>
                  </div>

                  <Link href="/checkout/processing">
                    <Button className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/30 mt-6 gap-3 group">
                      Pay & Confirm
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>

                  <p className="text-[10px] text-zinc-400 text-center font-medium mt-4">
                    By clicking Pay & Confirm, you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Cancellation Policy</Link>.
                  </p>
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
