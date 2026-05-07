"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronLeft,
  Smartphone,
  User,
  Store,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRole } from "@/components/role-provider";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [role, setRoleState] = useState<"guest" | "vendor">("guest");
  const { setIsLoggedIn, setRole } = useRole();
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(role);
    setIsLoggedIn(true);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column: Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200" 
            alt="Adventure" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-indigo-900" />
        </div>
        
        <div className="relative z-10 max-w-lg p-12 text-white space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-primary mb-12 shadow-2xl">
              <span className="text-4xl font-black italic">T</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-tight mb-8">
              Start your <span className="text-white/60">journey</span> with us.
            </h1>
            
            <div className="space-y-6">
              {[
                "Over 500+ handpicked homestays",
                "200+ adrenaline-pumping activities",
                "Trusted by 50k+ global travelers",
                "Instant booking with secure payments"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-lg font-bold">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="pt-12 border-t border-white/10">
            <div className="p-8 rounded-[40px] bg-white/10 backdrop-blur-md border border-white/10 space-y-4">
              <p className="text-sm font-medium italic opacity-80">
                "Triptay helped us find a hidden villa in Coorg that we would have never found elsewhere. The experience was truly authentic!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20" />
                <div>
                  <p className="text-sm font-bold">Aditya Verma</p>
                  <p className="text-[10px] font-medium opacity-60">Verified Traveler</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-20 justify-center relative bg-[#fcfcfc]">
        <Link href="/" className="absolute top-8 left-8 lg:left-20 text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 font-bold text-sm">
          <ChevronLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="max-w-md mx-auto w-full space-y-10">
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Create Account</h2>
            <p className="text-zinc-500 font-medium">Join our community and start exploring.</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 p-1.5 bg-zinc-100 rounded-2xl">
            <button 
              onClick={() => setRoleState("guest")}
              className={cn(
                "flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-bold transition-all",
                role === "guest" ? "bg-white text-zinc-900 shadow-md" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <User className="w-4 h-4" />
              Traveler
            </button>
            <button 
              onClick={() => setRoleState("vendor")}
              className={cn(
                "flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-bold transition-all",
                role === "vendor" ? "bg-white text-zinc-900 shadow-md" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <Store className="w-4 h-4" />
              Host / Vendor
            </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input required placeholder="John Doe" className="h-14 pl-12 rounded-2xl border-zinc-100 bg-white focus:ring-primary transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input required type="email" placeholder="john@example.com" className="h-14 pl-12 rounded-2xl border-zinc-100 bg-white focus:ring-primary transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Mobile Number</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input required placeholder="+91 98765 43210" className="h-14 pl-12 rounded-2xl border-zinc-100 bg-white focus:ring-primary transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input required type="password" placeholder="••••••••" className="h-14 pl-12 rounded-2xl border-zinc-100 bg-white focus:ring-primary transition-all" />
              </div>
            </div>

            <div className="flex items-start gap-3 p-1">
              <input required type="checkbox" className="mt-1 w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary" />
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-primary font-bold hover:underline">Terms & Conditions</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 gap-3 group mt-4">
              {role === "guest" ? "Create Guest Account" : "Register as Vendor"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
