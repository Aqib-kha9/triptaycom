"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, Mail, User, LifeBuoy, CheckCircle2, AlertTriangle, CreditCard, Hash, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();
  
  const [ticketType, setTicketType] = useState<"SUPPORT" | "DISPUTE" | "BILLING">("SUPPORT");
  const [priority, setPriority] = useState<"LOW" | "NORMAL" | "HIGH" | "URGENT">("NORMAL");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    bookingId: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.name) {
          setFormData(prev => ({
            ...prev,
            name: user.name,
            email: user.email || ""
          }));
        }
      } catch (e) {}
    }
  }, []);

  // When ticket type changes, update priority default
  useEffect(() => {
    if (ticketType === "DISPUTE") setPriority("HIGH");
    if (ticketType === "BILLING") setPriority("HIGH");
    if (ticketType === "SUPPORT") setPriority("NORMAL");
  }, [ticketType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if ((ticketType === "DISPUTE" || ticketType === "BILLING") && !isLoggedIn) {
      setError("Please log in to submit a Dispute or Billing inquiry.");
      setTimeout(() => {
        router.push("/login?redirect=/support");
      }, 2000);
      return;
    }
    
    if ((ticketType === "DISPUTE" || ticketType === "BILLING") && !formData.bookingId.trim()) {
      setError("Booking Reference ID is required for Disputes and Billing inquiries.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const payload = {
        type: ticketType,
        priority: priority,
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        description: formData.message,
        bookingId: formData.bookingId || undefined,
      };

      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (res.ok && data.status === "success") {
        setSuccess(true);
        setFormData(prev => ({ ...prev, subject: "", message: "", bookingId: "" }));
      } else {
        setError(data.message || "Failed to submit request.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-3xl mb-6 text-primary shadow-inner shadow-white"
          >
            <LifeBuoy className="w-10 h-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4"
          >
            Triptay Help Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 max-w-2xl mx-auto"
          >
            We're committed to ensuring your experience is seamless. Select your issue type below, and our dedicated support team will assist you promptly.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 overflow-hidden border border-zinc-100"
        >
          <div className="grid lg:grid-cols-5 h-full">
            {/* Left side info */}
            <div className="lg:col-span-2 bg-zinc-950 text-white p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] -mr-40 -mt-40" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px] -ml-40 -mb-40" />
              
              <div className="relative z-10">
                <div className="mb-16">
                  <h3 className="text-3xl font-black tracking-tight mb-4 text-white">Get in Touch</h3>
                  <p className="text-zinc-400 text-lg">Our arbitration and support teams are available 24/7 to resolve your issues securely.</p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <LifeBuoy className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">General Support</h4>
                      <p className="text-zinc-500 text-sm">For account issues, general questions, and technical help.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Dispute Resolution</h4>
                      <p className="text-zinc-500 text-sm">Strict, fair arbitration for host-guest conflicts. Escalate serious issues.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Billing & Payouts</h4>
                      <p className="text-zinc-500 text-sm">Inquiries regarding refunds, host payouts, and GST ledgers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side form */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner shadow-white"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight">Ticket Created!</h3>
                  <p className="text-zinc-500 mb-10 max-w-md text-lg">
                    Your {ticketType.toLowerCase()} ticket has been securely logged in our system. Our team will review and respond to the provided email address.
                  </p>
                  <Button onClick={() => setSuccess(false)} variant="outline" className="rounded-full h-12 px-8 font-bold border-zinc-200">
                    Submit Another Ticket
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Ticket Type Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-black text-zinc-900 uppercase tracking-widest">What do you need help with?</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setTicketType("SUPPORT")}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${ticketType === "SUPPORT" ? "border-primary bg-primary/5 text-primary" : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200"}`}
                      >
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-xs font-bold">Support</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTicketType("DISPUTE")}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${ticketType === "DISPUTE" ? "border-rose-500 bg-rose-50 text-rose-600" : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200"}`}
                      >
                        <AlertTriangle className="w-6 h-6" />
                        <span className="text-xs font-bold">Dispute</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTicketType("BILLING")}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${ticketType === "BILLING" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200"}`}
                      >
                        <CreditCard className="w-6 h-6" />
                        <span className="text-xs font-bold">Billing</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          readOnly={isLoggedIn && formData.name.length > 0}
                          required
                          className={`pl-12 rounded-xl h-14 border-zinc-200 font-medium ${isLoggedIn ? "bg-zinc-100 text-zinc-600 cursor-not-allowed focus-visible:ring-0" : "bg-zinc-50 focus-visible:bg-white"}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          readOnly={isLoggedIn && formData.email.length > 0}
                          required
                          className={`pl-12 rounded-xl h-14 border-zinc-200 font-medium ${isLoggedIn ? "bg-zinc-100 text-zinc-600 cursor-not-allowed focus-visible:ring-0" : "bg-zinc-50 focus-visible:bg-white"}`}
                        />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {(ticketType === "DISPUTE" || ticketType === "BILLING") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                          Booking Reference ID <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <Input
                            name="bookingId"
                            placeholder="e.g. BKG-12345678"
                            value={formData.bookingId}
                            onChange={handleChange}
                            required={ticketType === "DISPUTE" || ticketType === "BILLING"}
                            className="pl-12 rounded-xl h-14 bg-zinc-50 focus-visible:bg-white border-zinc-200 font-mono font-medium"
                          />
                        </div>
                        <p className="text-xs text-zinc-500 font-medium pl-1">Required for disputes and billing issues.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 flex items-center justify-between">
                      Subject
                      
                      {/* Priority selector inside label row */}
                      <div className="flex items-center gap-2 bg-zinc-100 rounded-lg p-1">
                        <select 
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as any)}
                          className="bg-transparent text-xs font-bold text-zinc-600 border-none outline-none cursor-pointer px-2"
                        >
                          <option value="LOW">Low Priority</option>
                          <option value="NORMAL">Normal Priority</option>
                          <option value="HIGH">High Priority</option>
                          <option value="URGENT">Urgent!</option>
                        </select>
                      </div>
                    </label>
                    <div className="relative">
                      <Flag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        name="subject"
                        placeholder="Briefly state your issue"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="pl-12 rounded-xl h-14 bg-zinc-50 focus-visible:bg-white border-zinc-200 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700">Detailed Description</label>
                    <Textarea
                      name="message"
                      placeholder="Please describe your issue, timeline, and any relevant details..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="rounded-xl min-h-[160px] resize-none bg-zinc-50 focus-visible:bg-white border-zinc-200 p-4 font-medium"
                    />
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold border border-rose-100 flex items-center gap-3"
                    >
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-14 rounded-xl font-black text-base shadow-lg transition-all ${
                      ticketType === "DISPUTE" 
                        ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25" 
                        : ticketType === "BILLING"
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/25"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">Processing <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /></span>
                    ) : (
                      <span className="flex items-center gap-2">Submit {ticketType.charAt(0) + ticketType.slice(1).toLowerCase()} Ticket <Send className="w-4 h-4 ml-1" /></span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
    </div>
  );
}
