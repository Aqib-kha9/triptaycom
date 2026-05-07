"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronLeft,
  Smartphone,
  ShieldCheck,
  LayoutGrid,
  RefreshCcw,
  Pencil
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRole } from "@/components/role-provider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loginMode, setLoginMode] = useState<"email" | "otp">("email");
  const [step, setStep] = useState<"input" | "verify">("input");
  const [mobileNumber, setMobileNumber] = useState("");
  const { setIsLoggedIn } = useRole();
  const router = useRouter();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMode === "otp" && step === "input") {
      setStep("verify");
      return;
    }
    // Mock login success
    setIsLoggedIn(true);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column: Visual/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200" 
            alt="Travel" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-lg p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-8 shadow-2xl shadow-primary/40">
              <span className="text-3xl font-black italic">T</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-tight mb-6">
              Welcome back to <span className="text-primary">Triptay.</span>
            </h1>
            <p className="text-xl text-zinc-300 font-medium leading-relaxed mb-8">
              "The world is a book and those who do not travel read only one page."
            </p>
            <div className="flex items-center gap-4 text-sm font-bold text-zinc-400">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <span>Join 50k+ explorers</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-24 justify-center relative">
        <Link href="/" className="absolute top-8 left-8 lg:left-24 text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 font-bold text-sm">
          <ChevronLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="max-w-md mx-auto w-full space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
              {step === "verify" ? "Verify OTP" : "Login"}
            </h2>
            <p className="text-zinc-500 font-medium">
              {step === "verify" 
                ? `Enter the code sent to ${mobileNumber}` 
                : "Choose your preferred login method."}
            </p>
          </div>

          {/* Login Tabs (Only show if not in verification step) */}
          {step === "input" && (
            <div className="flex p-1 bg-zinc-100 rounded-2xl">
              <button 
                onClick={() => setLoginMode("email")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                  loginMode === "email" ? "bg-white text-zinc-900 shadow-md" : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button 
                onClick={() => setLoginMode("otp")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                  loginMode === "otp" ? "bg-white text-zinc-900 shadow-md" : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                <Smartphone className="w-4 h-4" />
                OTP
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.form 
              key={loginMode + step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleLoginSubmit}
              className="space-y-6"
            >
              {loginMode === "email" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input required type="email" placeholder="name@example.com" className="h-14 pl-12 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Password</label>
                      <Link href="/forgot-password" title="Forgot Password" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input required type="password" placeholder="••••••••" className="h-14 pl-12 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all" />
                    </div>
                  </div>
                </>
              ) : step === "input" ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input 
                      required 
                      placeholder="+91 98765 43210" 
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="h-14 pl-12 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all" 
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium px-1">We'll send a 6-digit code to this number.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Enter 6-digit OTP</label>
                      <button 
                        type="button"
                        onClick={() => setStep("input")}
                        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit Number
                      </button>
                    </div>
                    <Input 
                      required 
                      autoFocus
                      maxLength={6}
                      placeholder="0 0 0 0 0 0" 
                      className="h-16 text-center text-3xl font-black tracking-[1em] rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all" 
                    />
                  </div>
                  <div className="flex justify-center">
                    <button type="button" className="text-sm font-bold text-zinc-400 hover:text-primary flex items-center gap-2 transition-colors">
                      <RefreshCcw className="w-4 h-4" />
                      Resend Code in 0:45
                    </button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-2 group">
                {loginMode === "email" ? "Login" : step === "input" ? "Send OTP" : "Verify & Continue"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.form>
          </AnimatePresence>

          <p className="text-center text-sm font-medium text-zinc-500 pt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
