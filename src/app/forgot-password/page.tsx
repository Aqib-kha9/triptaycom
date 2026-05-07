"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  ArrowRight, 
  ChevronLeft,
  KeyRound,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#fcfcfc] items-center justify-center p-4">
      <Link href="/login" className="absolute top-8 left-8 text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 font-bold text-sm">
        <ChevronLeft className="w-4 h-4" />
        Back to login
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] p-10 md:p-14 border border-zinc-100 shadow-2xl shadow-zinc-200/50 text-center space-y-10"
      >
        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8">
                  <KeyRound className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Forgot Password?</h1>
                <p className="text-zinc-500 font-medium leading-relaxed">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsSent(true); }}>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input required type="email" placeholder="name@example.com" className="h-16 pl-12 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all" />
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-3 group">
                  Send Reset Link
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Check your email</h1>
                <p className="text-zinc-500 font-medium leading-relaxed">
                  We've sent a password reset link to your email address. Please check your inbox and spam folder.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-100 text-sm font-bold text-zinc-500">
                Didn't receive the email?{" "}
                <button onClick={() => setIsSent(false)} className="text-primary hover:underline">Click to resend</button>
              </div>

              <Link href="/login" className="block">
                <Button variant="ghost" className="rounded-full gap-2 font-bold text-zinc-400 hover:text-zinc-900">
                  <ChevronLeft className="w-4 h-4" />
                  Return to Login
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
